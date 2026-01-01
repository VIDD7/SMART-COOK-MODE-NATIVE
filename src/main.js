const presets = {
  rebusan: [
    {name: "Mie instan", time: 180, desc: "Masak mie instan"},
    {name: "Telur Rebus Matang", time: 600, desc: "Telur rebus matang sempurna"},
    {name: "Sayur Sop/Asem", time: 1200, desc: "Rebus sayur sop"},
    {name: "Bubur Kacang Hijau", time: 1800, desc: "Sampai empuk"},
    {name: "Bakso", time: 600, desc: "Rebus bakso"}
  ],
  oven: [
    {name: "Cupcake", time: 1200, desc: "Sampai Lembut"},
    {name: "Pizza", time: 900, desc: "Oven Pizza"},
    {name: "Ayam Panggang", time: 2700, desc: "Panggang Ayam"}
  ],
  kukusan: [
    {name: "Dimsum/Siomay", time: 900, desc: "Kukus dimsum dari beku"},
    {name: "Bakpao", time: 720, desc: "Panaskan bakpao"},
    {name: "Pepes Ikan/Tahu", time: 1800, desc: "Sampai bumbu meresap"},
    {name: "Brownies Kukus", time: 2100, desc: "Sampai adonan matang"}
  ],
  gorengan: [
    {name: "Tempe/Tahu", time: 300, desc: "Goreng garing"},
    {name: "Pisang Goreng", time: 420, desc: "Sampai warna keemasan"},
    {name: "Ikan Goreng", time: 600, desc: "Garing & Matang"},
    {name: "Nugget/Sosis", time: 180, desc: "Goreng cepat"}
  ]
};

// Element DOM
const dataCategory = document.getElementById("data-category");
const timerDisplay = document.getElementById("timer");
const timerStatus = document.getElementById("timer-status");
const startBtn = document.getElementById("start-button");
const pauseBtn = document.getElementById("pause-button");
const resetBtn = document.getElementById("reset-button");
const alarmSound = document.getElementById("alarmSound");

// variabel kategori yg aktif
let activeCategory = null;

// fungsi untuk render kategori
function renderCategory(categoryName) {
  activeCategory = categoryName;
  const listMakanan = presets[categoryName];

  // untuk nambah tab active berdasarkan kategori yg dipilih
  const allTabs = document.querySelectorAll(".tab");
  allTabs.forEach(tab => {
    tab.classList.remove("tab-active");
    if (tab.innerText.toLowerCase() == categoryName) {
      tab.classList.add("tab-active");
    }
  });

  dataCategory.innerHTML = "";

  const addCard = `
  <div class="item-preset" onclick="addPreset()">
    <div class="info-item">
      <h4>Tambah Preset</h4>
      <i class="fa solid fa-plus iconPlus"></i>
      <p class="time-info">Custom Waktu</p>
    </div>
  </div>
  `;
  dataCategory.innerHTML += addCard;

  if (listMakanan) {
    listMakanan.forEach((item) => {
      const card = `
      <div class="item-preset" onclick="pilihWaktu(${item.time})">
        <div class="info">
          <h4>${item.name}</h4>
          <p class="desc-info">${item.desc}</p>
          <p class="time-info">${Math.floor(item.time / 60)} Menit</p>
        </div>
      </div>
      `;
      dataCategory.innerHTML += card;
    })
  }
};

// fungsi untuk menambah preset baru
function addPreset() {
  if (activeCategory == null) {
    alert("Silahkan pilih kategori makanan terlebih dahulu!");
    return;
  }

  let nama = prompt("Masukkan nama makanan:");
  if (nama === null || nama === "") {
    alert("Nama makanan tidak boleh kosong!");
    return;
  }

  let desc = prompt("Masukkan deskripsi makanan:");
  if (desc === null || desc === "") {
    alert("Deskripsi makanan tidak boleh kosong!");
    return;
  }

  let waktu = prompt("Masukkan waktu memasak (dalam menit):");
  if (waktu === null || waktu === "" || isNaN(waktu) || waktu <= 0) {
    alert("Waktu memasak tidak valid!");
    return;
  }

  let menit = parseInt(waktu);
  presets[activeCategory].push({
    name: nama,
    desc: desc,
    time: menit * 60
  });

  renderCategory(activeCategory)
  alert("Preset makanan berhasil ditambahkan!");
};

// tampilan awal pas buka web
renderCategory('rebusan');

// variabel timer
let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;
let isPaused = false;

// fungsi untuk update timer
function updateTimerDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timerDisplay.innerHTML =
  `${hours.toString().padStart(2, "0")}:` +
  `${minutes.toString().padStart(2, "0")}:` +
  `${seconds.toString().padStart(2, "0")}`
}

// fungsi untuk pilihWaktu
function pilihWaktu(seconds) {
  if (isRunning || isPaused) {
    alert("Timer sedang berjalan. Silahkan reset terlebih dahulu.");
    return;
  }
  totalSeconds = seconds;
  updateTimerDisplay();
  timerStatus.innerText = "Timer siap dimulai.";
}

// fungsi untuk timer ketika start
function startTimer() {
  if (totalSeconds === 0) {
    alert("Silahkan pilih preset makanan dulu.");
    return;
  }
  if (isRunning) {
    return;
  }
  isRunning = true;
  isPaused = false;

  timerInterval = setInterval(function() {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateTimerDisplay();
      timerStatus.innerHTML = "Timer dimulai.";
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      timerInterval = null;
      timerStatus.innerText = "Selesai!";
      alarmSound.play();
    }
  }, 1000);
}

// langsung tambahin event listener untuk tombol start
startBtn.addEventListener("click", startTimer);

// fungsi untuk timer ketika di pause
function pauseTimer() {
  if (isRunning === false) {
    alert("Timernya belum dimulai.");
    return;
  }
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = true;
    timerStatus.innerHTML = "Timer dijeda.";
    alarmSound.pause();
    alarmSound.currentTime = 0;
}
};

pauseBtn.addEventListener("click", pauseTimer);

// fungsi untuk timer ketika di reset
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = 0;
  isRunning = false;
  isPaused = false;
  updateTimerDisplay();
  timerStatus.innerHTML = "";
  alarmSound.pause();
  alarmSound.currentTime = 0;
};

resetBtn.addEventListener("click", resetTimer);