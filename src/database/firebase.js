import { initializeApp } from 'firebase/app';

const MyFirebase = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyB8EkgTNtbd0GZCQHbi0RRIPNruF4oVyfY",
      authDomain: "ergonomic-8b133.firebaseapp.com",
      projectId: "ergonomic-8b133",
      storageBucket: "ergonomic-8b133.appspot.com",
      messagingSenderId: "91632116542",
      appId: "1:91632116542:web:12165c114c956b2a4d826f",
      measurementId: "G-G2T2X9P44K"
      };    
      
    return initializeApp(firebaseConfig);
}

  export default MyFirebase;