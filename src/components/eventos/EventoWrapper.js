import EventoTeaser from "./EventoTeaser";

const EventoWrapper = props => {
    if (props.eventos.length === 0) {
        return <p>no hay eventos para mostrar.</p>
    }
    const eventos = props.eventos.map((evento) => <EventoTeaser key={evento.eventoId} evento={evento}/>)
    return (
        <div className="evento-wrapper">{eventos}</div>
    )
}

export default EventoWrapper;