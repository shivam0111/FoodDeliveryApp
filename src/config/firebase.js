// src/config/firebase.js (React Native Frontend)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9IDjDl0NnRS3vdX61lovv2Hu0Rc8Fxjw",
  authDomain: "fooddelivery.firebaseapp.com",
  projectId: "fooddeliveryapp-5af3d",
  storageBucket: "fooddeliveryapp-5af3d.firebasestorage.app",
  messagingSenderId: "9718244683",
  appId: "1:754104202668:android:46ae945f01d1de2fc47609",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
