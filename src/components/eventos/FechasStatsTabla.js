import { Fragment, useState } from 'react';
import { BsBookmarkHeart as FavIcon } from "react-icons/bs";
import { FaUsers as UsersIcon } from "react-icons/fa";
import Overlay from '../UI/Overlay';
import UsersModal from "../UI/UsersModal";

const FechasStatsTabla = props => {
    const [showModal, setShowModal] = useState(false)
    const tableTr = props.toMeasure.map((measure) => {
        let toMeasureCopy = [...measure.users];
        if (toMeasureCopy.length > 5) {
            toMeasureCopy.length = 5;
        }

        const measureItem = {
            fechas: measure.date,
            sitios: measure.place,
            regalos: measure.regalo
        }

        const subject = (props.statsOf === 'fechas') 
          ? `${new Date(measure.date).getDate()}/${new Date(measure.date).getMonth()}/${new Date(measure.date).getFullYear() - 2000} `
          : measureItem[props.statsOf]

        return (
            <div key={measureItem[props.statsOf]} className="fechas-stats-tabla-tr">
                <div><FavIcon /></div>
                <div>{subject}</div>
                <div>{toMeasureCopy.map((user) => <span key={user} className="dummy-avatar">{user.split(" ").map((n)=>n[0]).join("")}</span>)}{(measure.users.length > 5) && <span className="dummy-avatar plus">+{measure.users.length - 5}</span>}</div>
                <button onClick={() => setShowModal(true)} className="see-voters"><UsersIcon /></button>
            </div>
        )
    })

    return (
        <Fragment>
            <section className="fechas-stats-tabla marger gapper neumorpher">
                <h3>TOP {props.title}</h3>
                {tableTr}
            </section>
            {showModal && 
                <Fragment>
                    <Overlay onclick={() => setShowModal(false)}/>
                    <UsersModal users={props.evento.users} onclose={() => setShowModal(false)}/>
                </Fragment>
            }
        </Fragment>
       
    )
}

export default FechasStatsTabla;
