import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChuIt2CR0zzpYt3p_l7TFQDba46qFZICc",
    authDomain: "sevaghar-ba054.firebaseapp.com",
    databaseURL: "https://sevaghar-ba054-default-rtdb.firebaseio.com",
    projectId: "sevaghar-ba054",
    storageBucket: "sevaghar-ba054.firebasestorage.app",
    messagingSenderId: "152993267662",
    appId: "1:152993267662:web:e6ac6e0c9f139db27eb59f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database }; 