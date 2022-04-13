import Overlay from "../UI/Overlay";
import { useState, Fragment, useEffect } from 'react';
import Button from "../UI/Button";
import Clickable from "../UI/Clickable";
import FechasStats from "./FechasStats";
import useUser from "../../hooks/use-user";
import { getFirestore, doc, getDoc, deleteDoc, updateDoc, collection } from "firebase/firestore";
import MyFirebase from "../../database/firebase";
import { useParams } from "react-router-dom";
import AdderForm from "./AdderForm";
const app = MyFirebase();

const EventoRegalo = props => {
    const user = useUser(localStorage.getItem('uid'));
    const params = useParams();
    const eventoId = params.eventoId;
    const db = getFirestore(app);
    const eventosRef = collection(db, 'fullEventos');
    const evento = props.evento;
    const [showRegalos, setShowRegalos] = useState(false);
    const [isStats, setIsStats] = useState(false);
    const [addRegalo, setAddRegalo] = useState(false);
    const [selectedRegalos, setSelectedRegalos] = useState([]);
    const [availableRegalos, setAvailableRegalos] = useState(evento.availableRegalos);
    const showRegaloHandler = () => {
        setShowRegalos(!showRegalos)
    }
    const showStatsHandler = () => {
        setIsStats(!isStats)
    }
    const addRegaloHandler = () => {
        setAddRegalo(!addRegalo)
    }

    useEffect(() => {
        const docRef = doc(eventosRef, eventoId);
        getDoc(docRef).then((doc) => {
            const updatedRegalos = [];
            doc.data().regalosVotes.forEach((vote) => {
                if (vote.users.includes(user.displayName)) {
                    updatedRegalos.push(vote)
                }
            })
            return updatedRegalos
        }).then((updatedRegalos) => {
            setSelectedRegalos(updatedRegalos)
        })
            
    },[evento])

    const manageRegalo = (regalo) => {
        if (!selectedRegalos.includes(regalo)) {
            setSelectedRegalos([...selectedRegalos, regalo])
        } else {
            setSelectedRegalos(selectedRegalos.filter(item => item !== regalo))
        }
    }

    const regalosDoneHandler = () => { 
        //traemos el array de la DB:
        const arrayToUpload = [...evento.regalosVotes];
        //por cada item enviado en la seleccion:
        selectedRegalos.forEach((vote) => {
            //array con 1 item en caso de que este item ya este votada
            const hasBeenVoted = evento.regalosVotes.filter((item) => item.regalo === vote);
            //si estaba votada:
            if (hasBeenVoted.length > 0) {
                //check si ya la habia votado
                const updatedUsers = (hasBeenVoted[0].users.includes(user.displayName))
                //si ya estaba hago un array de users (upadatedUsers) nuevo sin mi:
                 ? hasBeenVoted[0].users.filter((item) => item !== user.displayName)
                 //si la estoy votando de nuevas hago un array nuevo de users (updatedUsers) conmigo
                 : [...hasBeenVoted[0].users, user.displayName];
                
                //elimino de dateVotes el obj de este voto
                const index = arrayToUpload.map(function(e) { return e.regalo; }).indexOf(vote);
                arrayToUpload.splice(index, 1)
                
                //añado a dateVotes el nuevo objeto de este voto actualizado
                const newVote = {regalo: vote, users: updatedUsers};
                arrayToUpload.push(newVote); 
                
            //si no estaba votada:    
            } else {
                const newVote = {regalo: vote, users: [user.displayName]};
                arrayToUpload.push(newVote); 
            }
        })
        const updatedVotes = {regalosVotes: arrayToUpload};
        // console.log(updatedVotes)
        updateDoc(doc(eventosRef, eventoId), updatedVotes);
        setShowRegalos(!showRegalos) 
    }

    const addRegalosHandler = regalos => {
        const regalosListCopy = [...availableRegalos];
        const updatedList = [...regalosListCopy, ...regalos]
        setAvailableRegalos(updatedList);
        const updatedVotes = {availableRegalos: updatedList};
        updateDoc(doc(eventosRef, eventoId), updatedVotes);
        setAddRegalo(false);
    }

    const checkState = (regalo) => {
        const copyVotes = props.evento.regalosVotes.filter((item) => item.regalo === regalo)
        if (copyVotes.length > 0 && copyVotes[0].users.includes(user.displayName)) {
            return true
        }

        if (selectedRegalos.includes(regalo)) {
            return true
        }

        return false
    }

    const regalos = availableRegalos.map((regalo) => <Clickable initial={checkState(regalo)} key={regalo} onclick={() => manageRegalo(regalo)} title={regalo}/>)
    return (
        <div>
             <div className="evento-fechas-action">
                <Button title="ELEGIR REGALOS" onclick={showRegaloHandler}/>
            </div>
            {showRegalos &&
                <Fragment>
                     <Overlay onclick={showRegaloHandler}/>
                     <div className="calendar-wrapper places-wrapper">
                        {regalos}
                        <div className="evento-fechas-action">
                        <Button title="HECHO" onclick={regalosDoneHandler}/>
                    </div>
                     </div>
                     
                </Fragment>
            }
            <div className="evento-fechas-action">
                <Button title="VER SELECCIONES" onclick={showStatsHandler}/>
            </div>
            <div className="evento-fechas-action">
                <Button title="AÑADIR REGALO" onclick={addRegaloHandler}/>
            </div>
            {addRegalo && <AdderForm onAdd={addRegalosHandler} isAdding="regalos" onclose={() => setAddRegalo(false)}/>}
            {(isStats) && <FechasStats
                            evento={evento} 
                            toMeasure={evento.regalosVotes}
                            available={availableRegalos}
                            statsOf="regalos"
                            title="REGALOS"
                            onBack={showStatsHandler}
                            fallbackText="Todavía no se han elegido regalos."
                            />}
        </div>
    )
}

export default EventoRegalo;
