
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-8749034461-b2f2d",
  "appId": "1:387997785977:web:e73bb86489c6fd711959a8",
  "apiKey": "AIzaSyBzPwqdgZ_b2PLz4tvrFC3M7COUnJOgLOo",
  "authDomain": "studio-8749034461-b2f2d.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "387997785977"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
