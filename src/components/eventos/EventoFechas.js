import Overlay from "../UI/Overlay";
import { useState, Fragment, useEffect } from 'react';
import Button from "../UI/Button";
import FechasStats from "./FechasStats";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import es from 'date-fns/locale/es';
import useUser from "../../hooks/use-user";
import { getFirestore, doc, getDoc, updateDoc, collection } from "firebase/firestore";
import MyFirebase from "../../database/firebase";
import { useParams } from "react-router-dom";
const app = MyFirebase();

const EventoFechas = props => {
    const evento = props.evento;
    const params = useParams();
    const eventoId = params.eventoId;
    const db = getFirestore(app);
    const eventosRef = collection(db, 'fullEventos');
    const user = useUser(localStorage.getItem('uid'));
    const [showCalendar, setShowCalendar] = useState(false);
    const [isStats, setIsStats] = useState(false);
    const [days, setDays] = useState([]);
    const [bookedDays, setBookedDays] = useState();
    const bookedStyle = { border: '2px solid deeppink' };

    useEffect(() => {
        const bookedDaysToDate = [...evento.availableDates].map((msDate) => new Date(msDate));
        setBookedDays(bookedDaysToDate);
        const docRef = doc(eventosRef, eventoId);
        getDoc(docRef).then((doc) => {
            const updatedDays = [];
            doc.data().datesVotes.forEach((vote) => {
                if (vote.users.includes(user.displayName)) {
                    const date = new Date(vote.date)
                    updatedDays.push(date)
                }
            })
            return updatedDays
        }).then((updatedDays) => {
            setDays(updatedDays)
        })
    }, [eventoId, showCalendar])

    const calendarShowHandler = () => {
        setShowCalendar(!showCalendar)
    }
    const showStatsHandler = () => {
        setIsStats(!isStats)
    }

    const fechasDoneHandler = () => {
       
        
        //traemos el array de la DB:
        const arrayToUpload = [...evento.datesVotes];
        //por cada fecha enviada en la seleccion:
        days.forEach((day) => {
            //fecha a milisegundos
            const vote = new Date(day).getTime();
            //array con 1 item en caso de que esta fecha ya este votada
            const hasBeenVoted = evento.datesVotes.filter((item) => item.date === vote);
            //si estaba votada:
            if (hasBeenVoted.length > 0) {
                //check si ya la habia votado
                const updatedUsers = (hasBeenVoted[0].users.includes(user.displayName))
                //si ya estaba hago un array de users (upadatedUsers) nuevo sin mi:
                 ? hasBeenVoted[0].users.filter((item) => item !== user.displayName)
                 //si la estoy votando de nuevas hago un array nuevo de users (updatedUsers) conmigo
                 : [...hasBeenVoted[0].users, user.displayName];
                
                //elimino de dateVotes el obj de este voto
                const index = arrayToUpload.map(function(e) { return e.date; }).indexOf(vote);
                arrayToUpload.splice(index, 1)
                
                //añado a dateVotes el nuevo objeto de este voto actualizado
                const newVote = {date: vote, users: updatedUsers};
                arrayToUpload.push(newVote); 
                
            //si no estaba votada:    
            } else {
                const newVote = {date: vote, users: [user.displayName]};
                arrayToUpload.push(newVote); 
            }
        })
        const updatedVotes = {datesVotes: arrayToUpload};
        // console.log(updatedVotes)
        updateDoc(doc(eventosRef, eventoId), updatedVotes); 
        calendarShowHandler();
    }
    
    const footer =
        days && days.length > 0
        ? `Has elegido ${days.length} día${(days.length !== 1) ? 's' : ''}.`
        : `Elige las fechas.`;

    return (
        <div>
            <div className="evento-fechas-action">
                <Button title="ELEGIR FECHAS" onclick={calendarShowHandler}/>
            </div>
            {(showCalendar)
            && 
            <Fragment>
                <Overlay onclick={calendarShowHandler}/>
                <div className="calendar-wrapper">
                    <DayPicker
                    locale={es} 
                    mode="multiple"
                    selected={days}
                    onSelect={setDays}
                    footer={footer}
                    fromDate={new Date()}
                    modifiers={{ booked: bookedDays }}
                    modifiersStyles={{ booked: bookedStyle }}   
                    />
                    <div className="evento-fechas-action">
                        <Button title="HECHO" onclick={fechasDoneHandler}/>
                    </div>
                </div>
            </Fragment>
            }
            <div className="evento-fechas-action">
                <Button title="VER SELECCIONES" onclick={showStatsHandler}/>
            </div>
            {(isStats) && <FechasStats
                            evento={evento} 
                            toMeasure={evento.datesVotes}
                            available={evento.availableDates}
                            statsOf="fechas"
                            title="FECHAS"
                            onBack={showStatsHandler}
                            fallbackText="Todavía no se han elegido fechas."
                            />}
        </div>
    )
}

export default EventoFechas;