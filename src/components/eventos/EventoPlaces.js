import Overlay from "../UI/Overlay";
import { useState, Fragment, useEffect } from 'react';
import Button from "../UI/Button";
import Clickable from "../UI/Clickable";
import FechasStats from "./FechasStats";
import useUser from "../../hooks/use-user";
import { getFirestore, doc, getDoc, updateDoc, collection } from "firebase/firestore";
import MyFirebase from "../../database/firebase";
import { useParams } from "react-router-dom";
import AdderForm from "./AdderForm";

const app = MyFirebase();

const EventoPlaces = props => {
    const user = useUser(localStorage.getItem('uid'));
    const params = useParams();
    const eventoId = params.eventoId;
    const db = getFirestore(app);
    const eventosRef = collection(db, 'fullEventos');
    const evento = props.evento;
    const [showPlaces, setShowPlaces] = useState(false);
    const [isStats, setIsStats] = useState(false);
    const [addPlace, setAddPlace] = useState(false);
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [availablePlaces, setAvailablePlaces] = useState(evento.availablePlaces);
    const showPlacesHandler = () => {
        setShowPlaces(!showPlaces)
    }
    const showStatsHandler = () => {
        setIsStats(!isStats)
    }
    const addPlaceHandler = () => {
        setAddPlace(!addPlace)
    }

    useEffect(() => {
        const docRef = doc(eventosRef, eventoId);
        getDoc(docRef).then((doc) => {
            const updatedPlaces = [];
            doc.data().placesVotes.forEach((vote) => {
                if (vote.users.includes(user.displayName)) {
                    updatedPlaces.push(vote)
                }
            })
            return updatedPlaces
        }).then((updatedPlaces) => {
            setSelectedPlaces(updatedPlaces)
        })
    }, [evento])

    const managePlace = (place) => {
        if (!selectedPlaces.includes(place)) {
            setSelectedPlaces([...selectedPlaces, place])
        } else {
            setSelectedPlaces(selectedPlaces.filter(item => item !== place))
        }
    }

    const placesDoneHandler = () => { 
        //traemos el array de la DB:
        const arrayToUpload = [...evento.placesVotes];
        //por cada item enviado en la seleccion:
        selectedPlaces.forEach((vote) => {
            //array con 1 item en caso de que este item ya este votada
            const hasBeenVoted = evento.placesVotes.filter((item) => item.place === vote);
            //si estaba votada:
            if (hasBeenVoted.length > 0) {
                //check si ya la habia votado
                const updatedUsers = (hasBeenVoted[0].users.includes(user.displayName))
                //si ya estaba hago un array de users (upadatedUsers) nuevo sin mi:
                 ? hasBeenVoted[0].users.filter((item) => item !== user.displayName)
                 //si la estoy votando de nuevas hago un array nuevo de users (updatedUsers) conmigo
                 : [...hasBeenVoted[0].users, user.displayName];
                
                //elimino de dateVotes el obj de este voto
                const index = arrayToUpload.map(function(e) { return e.place; }).indexOf(vote);
                arrayToUpload.splice(index, 1)
                
                //añado a dateVotes el nuevo objeto de este voto actualizado
                const newVote = {place: vote, users: updatedUsers};
                arrayToUpload.push(newVote); 
                
            //si no estaba votada:    
            } else {
                const newVote = {place: vote, users: [user.displayName]};
                arrayToUpload.push(newVote); 
            }
        })
        const updatedVotes = {placesVotes: arrayToUpload};
        // console.log(updatedVotes)
        updateDoc(doc(eventosRef, eventoId), updatedVotes);
        setShowPlaces(!showPlaces)
    }

    const checkState = (place) => {
        const copyVotes = props.evento.placesVotes.filter((item) => item.place === place)
        if (copyVotes.length > 0 && copyVotes[0].users.includes(user.displayName)) {
            return true
        }

        if (selectedPlaces.includes(place)) {
            return true
        }

        return false
    }

    const addSitiosHandler = sitios => {
        const sitiosListCopy = [...availablePlaces];
        const updatedList = [...sitiosListCopy, ...sitios]
        setAvailablePlaces(updatedList);
        const updatedVotes = {availablePlaces: updatedList};
        updateDoc(doc(eventosRef, eventoId), updatedVotes);
        setAddPlace(false);
    }
   
    const places = availablePlaces.map((place) => <Clickable initial={checkState(place)} key={place} onclick={() => managePlace(place)} title={place}/>)
    return (
        <div>
             <div className="evento-fechas-action">
                <Button title="ELEGIR SITIOS" onclick={showPlacesHandler}/>
            </div>
            {showPlaces &&
                <Fragment>
                     <Overlay onclick={showPlacesHandler}/>
                     <div className="calendar-wrapper places-wrapper">
                        {places}
                        <div className="evento-fechas-action">
                        <Button title="HECHO" onclick={placesDoneHandler}/>
                    </div>
                     </div>
                     
                </Fragment>
            }
            <div className="evento-fechas-action">
                <Button title="VER SELECCIONES" onclick={showStatsHandler}/>
            </div>
            <div className="evento-fechas-action">
                <Button title="AÑADIR SITIO" onclick={addPlaceHandler}/>
            </div>
            {addPlace && <AdderForm onAdd={addSitiosHandler} isAdding="sitios" onclose={() => setAddPlace(false)}/>}
            {(isStats) && <FechasStats
                            evento={evento} 
                            toMeasure={evento.placesVotes}
                            available={availablePlaces}
                            statsOf="sitios"
                            title="SITIOS"
                            onBack={showStatsHandler}
                            fallbackText="Todavía no se han elegido sitios."
                            />}
        </div>
    )
}

export default EventoPlaces;