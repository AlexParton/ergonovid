import Overlay from "../UI/Overlay";
import { Fragment, useState } from 'react';
import Button from "../UI/Button";

const AdderForm = props => {
    const [cosas, setCosas] = useState([]);
    const [userInput, setUserInput] = useState('');
    const cosasDisplay = cosas.map((cosa) => <div key={cosa} className="cosa-added contacto-card">{cosa}</div>);

    const inputHandler = event => {
        setUserInput(event.target.value)
    }

    const addCosaHandler = (event) => {
        event.preventDefault();
        const cosasCopy = [...cosas];
        const cosasUpdate = [...cosasCopy, userInput];
        setCosas(cosasUpdate);
        setUserInput('');
    }

    return (
        <Fragment>
            <Overlay onclick={props.onclose}/>
            <div className="add-gente-wrapper gapper">
                <h3>Añadir {props.isAdding}</h3>
                {cosasDisplay}
                <form onSubmit={addCosaHandler}>
                    {/* <Input value={userInput} onInputChange={inputHandler} name='cosa' type='text' label="Escribe tu propuesta"/> */}
                    <div className="input-wrapper">
                        <input placeholder="Escribe tu propuesta" onChange={inputHandler} value={userInput}/>
                    </div>
                    <button className="classic-button">AÑADIR A LA LISTA</button>
                </form>
                {(cosas.length > 0) && <div className="medium-button"><Button title="TODO LISTO" onclick={() => props.onAdd(cosas)}/></div>}
            </div>
        </Fragment>    
        
    )
}

export default AdderForm;