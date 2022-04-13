import Overlay from "../UI/Overlay";
import { Fragment, useState, useEffect } from "react";
import { collection, getFirestore, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import Loader from '../../components/UI/Loader';
import MyFirebase from "../../database/firebase";
import ContactoSelectable from "./ContactoSelectable";
import { Link } from "react-router-dom";
const app = MyFirebase();

const AddGente = props => {
    const [amigos, setAmigos] = useState([]);
    const [isLoading, setIsloading] = useState(true)
    const db = getFirestore(app);
    useEffect(() => {
        const userRef = doc(db, 'users', localStorage.getItem('uid'));
        getDoc(userRef).then((doc) => {
            setAmigos(doc.data().engagedTo)
        }).then(() => setIsloading(false))
    }, [])
    return (
        <Fragment>
            <Overlay onclick={props.onclose}/>
            <div className="add-gente-wrapper">
              {isLoading
               ? <div className="loader-wrapper"><Loader /></div>    
               : <section className="gapper">
                   <h3>{(props.isCreation) ? 'Añadir participantes al Evento' : `Adminisitrar participantes para ${props.evento.title}`}</h3>
                   {(amigos.length > 0) && amigos.map((contacto) => <ContactoSelectable onAdd={props.onAdd} isCreation={props.isCreation} evento={props.evento} key={contacto.userId} contacto={contacto}/>)}
                   {(amigos.length === 0) && <p>Todavía no tienes contactos en tu red. Puedes buscarlos en la sección 'Mis Contactos' desde <Link to={`/profile/${localStorage.getItem('uid')}`}>TU PERFIL</Link></p>}
                 </section>   
              }    
            </div>
        </Fragment>
       
    )
}

export default AddGente;