import Button from '../UI/Button'; 
import { useParams } from "react-router-dom";
import { useState, useEffect, Fragment } from 'react';
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import MyFirebase from "../../database/firebase";
import Loader from '../UI/Loader';

import { GiFishingNet as NetIcon } from "react-icons/gi";
const app = MyFirebase();

const AddContacto = props => {
    const params = useParams();
    const profileId = params.userId;
    const [isContacto, setIsContacto] = useState(false);
    const [amigo, setAmigo] = useState('');
    const [isLoading, setIsloading] = useState(true)
    const db = getFirestore(app);

    useEffect(() => {
        const userRef = doc(db, 'users', localStorage.getItem('uid'));
          getDoc(userRef).then((doc) => {
            return doc.data().engagedTo.filter(
                (engaged) =>
                    engaged.userId === profileId
              );   
          }).then((found) => {
              if (found.length > 0) {
                setIsContacto(true);
                setAmigo(found[0].displayName)
              } else {
                const userRef = doc(db, 'users', profileId);
                getDoc(userRef).then((doc) => {
                    setAmigo(doc.data().displayName)
                  })
              }
          })
          setIsloading(false)
    }, [])

    const addContactoHandler = () => {
        const userRef = doc(db, 'users', localStorage.getItem('uid'));
        getDoc(userRef).then((doc) => {
            const newFriend = {displayName: amigo, userId: profileId}
            const updatedEngagedTo = [...doc.data().engagedTo, newFriend]
            updateDoc(userRef, {engagedTo: updatedEngagedTo})
            return doc.data().displayName
          }).then((myName) => {
              const myFriendRef = doc(db, 'users', profileId);
              getDoc(myFriendRef).then((doc) => {
                const me = {displayName: myName, userId: localStorage.getItem('uid')}
                const updatedEngagedTo = [...doc.data().engagedTo, me]
                updateDoc(myFriendRef, {engagedTo: updatedEngagedTo})
              }).then(() => setIsContacto(true))
          })
    }

    return (
        <div className='marger'>
            {isLoading
            ? <div className="loader-wrapper"><Loader /></div>
            : <Fragment>{isContacto
                ? <div className='es-contacto gapper center'><h2>{amigo} ya está en tu red de contactos.</h2><NetIcon /></div>
                : <Button title='AÑADIR A MIS CONTACTOS' onclick={addContactoHandler}/>
              }</Fragment> 
            }
           
            
        </div>
    )
}

export default AddContacto