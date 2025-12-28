import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function protectPage(adminOnly = false) {
  onAuthStateChanged(auth, user => {
    if (!user) location.href = "/auth.html";

    if (adminOnly && user.email !== "kudumulasuryavardhan@gmail.com") {
      location.href = "/";
    }
  });
}
