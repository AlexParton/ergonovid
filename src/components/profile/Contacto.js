import { Link } from "react-router-dom";

const Contacto = props => {

    return (
        <Link className="contacto-card" to={`/profile/${props.contacto.userId}`}>
            <div className="profile-avatar medium">
                {(props.contacto.displayName.trim().indexOf(' ') !== -1)  ? props.contacto.displayName.trim().split(" ").map((n)=>n[0]).join("") : props.contacto.displayName.trim().substring(0,2)}
            </div>
            {props.contacto.displayName}
        </Link> 
    )
}

export default Contacto;