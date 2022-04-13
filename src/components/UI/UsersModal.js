const UsersModal = props => {
    const users =  props.users.map((user) => <div key={user} ><span className="dummy-avatar">{user.split(" ").map((n)=>n[0]).join("")}</span><p>{user}</p></div>);
    
    return (
        <section className="users-modal">
            {users}
        </section>
    )
}

export default UsersModal;