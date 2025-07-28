import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx61uTrFUA5kDln3VSJHcd4BnBhKdZxxU",
  authDomain: "movie-app-6d109.firebaseapp.com",
  projectId: "movie-app-6d109",
  storageBucket: "movie-app-6d109.firebasestorage.app",
  messagingSenderId: "501585973168",
  appId: "1:501585973168:web:352dd2fc373623452c5075",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const googleProvider = provider;