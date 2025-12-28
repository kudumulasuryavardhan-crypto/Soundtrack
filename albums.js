import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { paginate } from "./pagination.js";

let albums = [];
let page = 1;

async function loadAlbums() {
  const q = query(collection(db, "albums"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  albums = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
}

function render() {
  const paged = paginate(albums, page);
  document.getElementById("albums").innerHTML =
    paged.map(a => `<div>${a.title}</div>`).join("");
}

loadAlbums();
