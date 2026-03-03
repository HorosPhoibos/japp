// ASET GAMBAR & AUDIO
const birdImg = new Image();
birdImg.src = 'flappyju.png'; 
const bgm = document.getElementById('bgm');
const toggleBtn = document.getElementById('music-toggle');
let isMusicPlaying = true;

// LOGIKA SURAT SPLASH SCREEN & BGM
document.getElementById('btn-mengerti').addEventListener('click', () => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    bgm.volume = 0.4;
    bgm.play().catch(e => console.log("Gagal memutar lagu:", e));
});

// TOGGLE MUSIK
toggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgm.pause();
        toggleBtn.innerText = '🔇 BGM: OFF';
    } else {
        bgm.play();
        toggleBtn.innerText = '🎵 BGM: ON';
    }
    isMusicPlaying = !isMusicPlaying;
});

// 1. JAM REAL-TIME & SHIFT KERJA
function updateClock() {
    const clock = document.getElementById('clock');
    if (clock) clock.innerText = new Date().toLocaleTimeString('id-ID', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

function updateWorkTimer() {
    const now = new Date();
    const timer = document.getElementById('countdown');
    if (!timer) return;
    if (now.getDay() === 0 || (now.getDay() === 6 && now.getHours() >= 12)) {
        timer.innerText = "WAKTU REBAHAN 🛌"; return;
    }
    const end = new Date(); end.setHours(17, 30, 0, 0);
    const start = new Date(); start.setHours(8, 0, 0, 0);
    if (now >= start && now <= end) {
        let diff = end - now;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        timer.innerText = `${h}:${m}:${s}`;
    } else { timer.innerText = now > end ? "SHIFT SELESAI 🌙" : "BELUM KERJA ☕"; }
}
setInterval(updateWorkTimer, 1000);
updateWorkTimer();

// 2. TO-DO LIST (MISI RAHASIA)
let todos = [
    { text: "Tarik napas panjang hadapi warga 🧘‍♀️", done: false },
    { text: "Cari alasan kalau ditanya bos 👀", done: false },
    { text: "Isi bensin full buat kabur cepat 🚜", done: false }
];

function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTodo(${index})">${todo.done ? '✅' : '🔲'} ${todo.text}</span>
            <button onclick="deleteTodo(${index})" class="delete-btn">❌</button>
        `;
        list.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text) {
        todos.push({ text: text, done: false });
        input.value = '';
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

// Render ToDo pertama kali
renderTodos();

// Mungkinkan Enter untuk tambah ToDo
document.getElementById('todo-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTodo();
});

// 3. AYAT ALKITAB (Perkamen)
async function fetchRandomVerse() {
    const verseEl = document.getElementById('daily-verse');
    try {
        const response = await fetch('alkitab.json?v=' + Date.now());
        const versesList = await response.json();
        if (versesList.length > 0) {
            verseEl.innerText = `"${versesList[Math.floor(Math.random() * versesList.length)]}"`;
        }
    } catch (e) {
        verseEl.innerText = `"Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku. - Filipi 4:13"`;
    }
}
fetchRandomVerse();

// 4. GAME FLAPPY JUJU
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
let birdY = 100, birdV = 0, pipes = [], frame = 0, score = 0, isGameOver = false;

function drawBird() { ctx.drawImage(birdImg, 30, birdY, 24, 24); }

function updateGame() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Langit Biru
    ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    birdV += 0.3; birdY += birdV; 
    if (birdY > canvas.height - 24 || birdY < 0) endGame();
    
    if (frame % 90 === 0) { 
        let gap = 85, top = Math.random() * (canvas.height - gap - 50) + 20;
        pipes.push({ x: canvas.width, top: top, bottom: canvas.height - top - gap });
    }
    
    pipes.forEach(p => {
        p.x -= 1.5; 
        
        ctx.fillStyle = '#6ab04c';
        ctx.fillRect(p.x, 0, 30, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, 30, p.bottom);
        
        ctx.strokeStyle = '#2d521d';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, 0, 30, p.top);
        ctx.strokeRect(p.x, canvas.height - p.bottom, 30, p.bottom);

        if (p.x < 54 && p.x > 0 && (birdY < p.top || birdY > canvas.height - p.bottom)) endGame();
        if (p.x === 30) score++;
    });
    
    pipes = pipes.filter(p => p.x > -30);
    drawBird();
    
    ctx.fillStyle = '#fff'; 
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = '10px "Press Start 2P"';
    ctx.strokeText("SKOR:" + score, 5, 20);
    ctx.fillText("SKOR:" + score, 5, 20);
    
    frame++; requestAnimationFrame(updateGame);
}

function jump() { if (!isGameOver) birdV = -4.5; }
function endGame() { isGameOver = true; document.getElementById('game-over-overlay').style.display = 'flex'; document.getElementById('final-score').innerText = score; }
function resetGame() { birdY = 100; birdV = 0; pipes = []; score = 0; frame = 0; isGameOver = false; document.getElementById('game-over-overlay').style.display = 'none'; updateGame(); }

canvas.addEventListener('mousedown', jump);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); });

// 5. CUACA KHUSUS PEKANBARU DAN JAKARTA
async function fetchCityWeather(lat, lon, elementId) {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        document.getElementById(elementId).innerText = `${Math.round(data.current_weather.temperature)}°`;
        return data.current_weather.weathercode;
    } catch (e) {
        document.getElementById(elementId).innerText = '--°';
        return 0;
    }
}

async function loadAllWeather() {
    const adviceEl = document.getElementById('weather-advice');
    const pkuCode = await fetchCityWeather(0.5333, 101.4500, 'temp-pku');
    const jktCode = await fetchCityWeather(-6.2000, 106.8166, 'temp-jkt');
    
    if (pkuCode > 50 || jktCode > 50) {
        adviceEl.innerText = "Awas hujan! Nanti sepatu kerjanya kotor 🌧️";
    } else {
        adviceEl.innerText = "Cerah nih! Panas dikit nggak apa-apa lah ya ☀️";
    }
}
loadAllWeather();

// 6. BERITA (Papan Desa)
async function fetchNews() {
    const container = document.getElementById('newsContainer');
    try {
        const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=id&country=id&max=3&apikey=330c4524949a323d82659df746a05672`;
        const res = await fetch(url);
        const data = await res.json();
        if(data.articles) { 
            container.innerHTML = data.articles.map(n => `<p>• ${n.title}</p>`).join(''); 
        }
    } catch (e) { container.innerHTML = "<p>Gagal memuat berita...</p>"; }
}
fetchNews();
updateGame();