import { db } from "./firebase.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { setPlaylist } from "./player.js";

const id = new URLSearchParams(location.search).get("id");

async function loadAlbum() {
  const snap = await getDoc(doc(db, "albums", id));
  const album = snap.data();
  setPlaylist(album.songs);
}

loadAlbum();
