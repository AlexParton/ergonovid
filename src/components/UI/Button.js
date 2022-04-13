const Button = props => {
    return (
        <button onClick={props.onclick} className="classic-button">{props.title}</button>
    )
}

export default Button;