import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTCCHCzdjFQx3g3c8xBo0BfIvRPYTN_hY",
  authDomain: "prod-6a157.firebaseapp.com",
  databaseURL: "https://prod-6a157-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prod-6a157",
  storageBucket: "prod-6a157.appspot.com",
  messagingSenderId: "549866378952",
  appId: "1:549866378952:web:d0dd00343f1add22cf37fd"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export const auth = getAuth(app);
export { db }
