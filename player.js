// ===== WAV Audio Player + EQ + Waveform + Media Session + Background play =====

let playlist = [];
let currentIndex = 0;

const audio = document.getElementById("audio");
const nowPlaying = document.getElementById("now-playing");

/* ===== AudioContext & EQ ===== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

const frequencies = [60, 170, 350, 1000, 3500];
const eqFilters = frequencies.map(freq => {
  const filter = audioCtx.createBiquadFilter();
  filter.type = "peaking";
  filter.frequency.value = freq;
  filter.Q.value = 1;
  filter.gain.value = 0;
  return filter;
});

// Connect audio graph: source -> EQ -> analyser -> destination
source.disconnect();
source.connect(eqFilters[0]);
for (let i = 0; i < eqFilters.length - 1; i++) {
  eqFilters[i].connect(eqFilters[i + 1]);
}
eqFilters[eqFilters.length - 1].connect(analyser);
analyser.connect(audioCtx.destination);

// ===== Waveform Canvas =====
const canvas = document.getElementById("waveform");
const ctx = canvas?.getContext("2d");
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawWaveform() {
  if (!ctx) return;
  requestAnimationFrame(drawWaveform);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ffcc";
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

audio.onplay = () => { audioCtx.resume(); drawWaveform(); };

/* ===== Playlist Management ===== */
function setPlaylist(songs) {
  playlist = songs;
  currentIndex = 0;
}

function playSongByIndex(index) {
  if (!playlist[index]) return;
  currentIndex = index;
  audio.src = playlist[index].wavUrl;
  audio.play();
  nowPlaying.textContent = playlist[index].title;
  updateMediaSession();
}

function togglePlay() { audio.paused ? audio.play() : audio.pause(); }
function stopSong() { audio.pause(); audio.currentTime = 0; }
function nextSong() { if (currentIndex < playlist.length - 1) playSongByIndex(currentIndex+1); }
function prevSong() { if (currentIndex > 0) playSongByIndex(currentIndex-1); }

/* ===== Equalizer ===== */
function setEQ(index, value) { if (eqFilters[index]) eqFilters[index].gain.value = value; }
function resetEQ() { eqFilters.forEach(f => f.gain.value = 0); }

/* ===== Media Session API ===== */
function updateMediaSession() {
  if (!("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: playlist[currentIndex].title,
    artist: "Soundtrack",
    album: "Soundtrack Album",
    artwork: [{ src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }]
  });
  navigator.mediaSession.setActionHandler("play", togglePlay);
  navigator.mediaSession.setActionHandler("pause", togglePlay);
  navigator.mediaSession.setActionHandler("previoustrack", prevSong);
  navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  navigator.mediaSession.setActionHandler("stop", stopSong);
}

audio.addEventListener("ended", nextSong);
audio.controls = false; // disable download
