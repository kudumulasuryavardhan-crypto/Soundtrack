import { db } from "./firebase.js";
import { addDoc, collection, serverTimestamp }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function logAdmin(action) {
  addDoc(collection(db, "logs"), {
    action,
    time: serverTimestamp()
  });
}
