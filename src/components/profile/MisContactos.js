import Contacto from './Contacto';
import { BsSearch } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { collection, getFirestore, getDocs } from "firebase/firestore";
import MyFirebase from "../../database/firebase";
import Loader from '../../components/UI/Loader';
import { Link, useNavigate } from 'react-router-dom';
const app = MyFirebase();


const MisContactos = props => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsloading] = useState(true)
  const db = getFirestore(app);
  const navigate = useNavigate();

  const getUsers = async ()=> {
    const usersRef = collection(db, "users");
    getDocs(usersRef).then((querySnapshot) => {
        const loadedUsers = [];
        querySnapshot.forEach((doc) => {
            loadedUsers.push(doc.data());
        });
        setSuggestions(loadedUsers)
        setIsloading(false)
    })
}

useEffect(() => {
    getUsers();
}, [])

  const onChange = (e) => {
    const userInput = e.target.value;
    const unLinked = suggestions.filter(
      (suggestion) =>
        suggestion.displayName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    
    setInput(e.target.value);
    setFilteredSuggestions(unLinked);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const onClick = (e) => {
    setFilteredSuggestions([]);
    setInput(e.target.innerText);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    const found = suggestions.filter(
        (suggestion) =>
          suggestion.displayName.toLowerCase().indexOf(e.target.innerText.toLowerCase()) > -1
      );
    navigate(`/profile/${found[0].userId}`)
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          let className;
          
          if (index === activeSuggestionIndex) {
            className = "suggestion-active";
          }
          return (
            <li className={className} key={suggestion.displayName} 
            onClick={onClick}
            >
              {suggestion.displayName}
            </li>
          );
        })}
      </ul>
    ) : (
      <div class="no-suggestions">
        <em>No hay nadie con ese nombre</em>
      </div>
    );
  };

    return (
        <section className='gapper'>
         <div className='buscar-contactos contacto-card'>
             <BsSearch />
             <input
               type="text"
               onChange={onChange}
               value={input} 
               placeholder='Buscar contacto'
               />
         </div>
         {showSuggestions && input && <SuggestionsListComponent />}   
         {(props.contactos.length > 0) && props.contactos.map((contacto) => <Contacto key={contacto.userId} contacto={contacto}/>)}
       </section>
          
    )
}

export default MisContactos;