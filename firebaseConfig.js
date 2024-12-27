import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5EWOo3NPBCJt25zW0BD_PUUETLvChwkw",
  projectId: "auth-bd74c",
  appId: "1:1040446881151:android:768ddcec794a6579bf6e4a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db=getFirestore(app);
export default app;
