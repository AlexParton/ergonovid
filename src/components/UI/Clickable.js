import { useState } from 'react';

const Clickable = props => {
    const [isClicked, setIsClicked] = useState((props.initial) ? !!props.initial : false);
    const clickHandler = () => {
        setIsClicked(!isClicked);
        props.onclick();
    }

    return (
        <button onClick={clickHandler} key={props.title} className={`clickable ${isClicked && "clicked"}`}>{props.title}</button>
    )
}

export default Clickable;