import { FaUsers as UsersIcon } from "react-icons/fa";
import { Fragment, useState } from 'react';
import Overlay from '../UI/Overlay';
import UsersModal from "../UI/UsersModal";

const FechasHeatmap = props => {
    const [showModal, setShowModal] = useState(false)

    const measureItem = {
        fechas: 'date',
        sitios: 'place',
        regalos: 'regalo'
    }

    const Tr = ({children}) => {
        return <tr>{children}</tr>
    }

    const TdBottom = () => {
        const userTds =  props.evento.users.map((user) => <td key={Math.floor(Math.random() * 10000)}>{user.split(" ").map((n)=>n[0]).join("")}</td>)
        return <tr key={Math.floor(Math.random() * 10000)}><td key={Math.floor(Math.random() * 10000)}><button onClick={() => setShowModal(true)} className="see-voters"><UsersIcon /></button></td>{userTds}</tr>
    }

    const rows = props.toMeasure.map((item) => {
        // const dateInVotes = props.toMeasure.filter(obj => obj[measureItem[props.statsOf]] === item);
        // console.log(dateInVotes)
        const subject = (props.statsOf === 'fechas') 
        ? `${new Date(item.date).getDate()}/${new Date(item.date).getMonth()}/${new Date(item.date).getFullYear() - 2000} `
        : item[measureItem[props.statsOf]]
        const tdWidth = 85 / props.evento.users.length;
        return (
            <Tr key={Math.floor(Math.random() * 10000)}><td>{subject}</td>{ props.evento.users.map((user) => <td key={Math.floor(Math.random() * 10000)} style={{width: tdWidth + '%'}}><span className={(item.users.includes(user)) ? 'voted' : ''}></span></td>)}</Tr>
        )
    });

    return (
        <Fragment>
            <section className="fechas-stats-heatmap marger gapper neumorpher">
                    <h3>MAPA DE CALOR</h3>
                <table>
                    <tbody>
                        {rows}
                        <TdBottom />
                    </tbody>
                </table> 
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

export default FechasHeatmap;