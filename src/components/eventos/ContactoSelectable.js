import { useState, useEffect, Fragment } from 'react';
import { collection, getFirestore, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import MyFirebase from "../../database/firebase";
const app = MyFirebase();

const ContactoSelectable = props => {
    const [isSelected, setIsSelected] = useState(props.evento.users.includes(props.contacto.displayName))
    const db = getFirestore(app);
    const handleSelection = () => {
        const eventoRef = doc(db, 'fullEventos', props.evento.eventoId);
        const teaserRef = doc(db, 'eventos', props.evento.eventoId);
        if (isSelected) {
            setIsSelected(false);

            getDoc(eventoRef).then((doc) => {
                const updatedParticipantes = doc.data().users.filter((user) => user !== props.contacto.displayName) 
                updateDoc(eventoRef, {users: updatedParticipantes})
            })

            getDoc(teaserRef).then((doc) => {
                const updatedParticipantes = doc.data().users.filter((user) => user !== props.contacto.userId) 
                updateDoc(teaserRef, {users: updatedParticipantes})
            })

        } else {
            setIsSelected(true);
           
            getDoc(eventoRef).then((doc) => {
              const updatedParticipantes = [...doc.data().users, props.contacto.displayName]
              updateDoc(eventoRef, {users: updatedParticipantes})
            })
            
            getDoc(teaserRef).then((doc) => {
                const updatedParticipantes = [...doc.data().users, props.contacto.userId]
                updateDoc(teaserRef, {users: updatedParticipantes})
              })    
        }
    }

    const handleSelectionCreation = () => {
        if (isSelected) {
            setIsSelected(false);
            props.onAdd(props.contacto.displayName, false)
        } else {
            setIsSelected(true);
            props.onAdd(props.contacto.displayName, true)
        }
    }

    return (
        <button onClick={(props.isCreation) ? handleSelectionCreation : handleSelection} className={`contacto-card selectable ${!isSelected ? 'unselected' : ''}`} to={`/profile/${props.contacto.userId}`}>
            <div className="profile-avatar medium">
                {(props.contacto.displayName.trim().indexOf(' ') !== -1)  ? props.contacto.displayName.trim().split(" ").map((n)=>n[0]).join("") : props.contacto.displayName.trim().substring(0,2)}
            </div>
            {props.contacto.displayName}
        </button> 
    )
}

export default ContactoSelectable;