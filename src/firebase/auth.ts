import { auth } from "./firebase.config";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginUserWithGoogle = () => {
  const provider = new GoogleAuthProvider();

  const result = signInWithPopup(auth, provider);

  return result;
};

export const signOutUser = () => {
  return auth.signOut();
};
