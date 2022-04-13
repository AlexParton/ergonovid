import { useState } from "react";

const Toggler = props => {
    const [isYes, setIsYes] = useState(props.initial);

    const togglerHandler = () => {
        if (isYes) {
            setIsYes(false)
            props.onActivated(false)
        } else {
            setIsYes(true)
            props.onActivated(true)
        }
       
    }
    return (
        <div className="toggler-wrapper gapper center marger">
            <p className="fake-label">{props.label}</p>
            <button onClick={togglerHandler} className={(isYes) ? 'toggler active' : 'toggler'}>
                {isYes && <p className="toggler-si">Sí</p>}
                <span className={(isYes ? 'yes' : ' no')}></span>
                {!isYes && <p className="toggler-no">No</p>}
            </button>
        </div>
    )
}

export default Toggler;