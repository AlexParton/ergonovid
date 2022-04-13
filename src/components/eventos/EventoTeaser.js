import { 
    GiPartyPopper as GCicon, 
    GiBoombox as DPicon, 
    GiCandles as CAicon ,
    GiFamilyHouse as ECicon,
    GiFlipFlops as VVicon,
    GiWoodCabin as ERicon,
    GiSkier as VSicon

} from "react-icons/gi";
import { Link } from "react-router-dom";

const EventoTeaser = props => {

    const WhichIcon = {
        CA: <CAicon />, //cumple
        GC: <GCicon />, // grandes celebraciones
        DP: <DPicon />, // techno party
        ER: <ERicon />,// escapada rural
        VS: <VSicon />,//viaje de ski
        EC: <ECicon />, //encerrona
        VV: <VVicon />, //viaje de verano
    }
    
    return (
        <Link to={`/evento/${props.evento.eventoId}`} className={`evento-teaser ${props.evento.catId}`}>
         <h3>{props.evento.title}</h3>
            <div>   
                {WhichIcon[props.evento.catId]}
            </div>
        </Link>
    )
}

export default EventoTeaser;