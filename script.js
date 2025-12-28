const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const uploadBtn = document.getElementById("uploadBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const countdownEl = document.getElementById("countdown");
const canvas = document.getElementById("stripCanvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const stopBtn = document.getElementById("stopBtn");
const shutterSound = document.getElementById("shutterSound");
const pdfBtn = document.getElementById("pdfBtn");

const PHOTO_COUNT = 4;
const PHOTO_WIDTH = 300;
const PHOTO_HEIGHT = 220;
const GAP = 20;
const FOOTER = 40;

let photos = [];
let sessionDate = "";
let sessionActive = false;
let stream = null;

/* Start camera on load */
async function startCamera() {
  if (stream) return;
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  stopBtn.disabled = false;

}
window.addEventListener("load", startCamera);

/* Countdown */
function countdown(sec) {
  return new Promise(res => {
    let n = sec;
    countdownEl.textContent = n;
    countdownEl.classList.remove("hidden");
    const i = setInterval(() => {
      n--;
      if (n === 0) {
        clearInterval(i);
        countdownEl.classList.add("hidden");
        res();
      } else countdownEl.textContent = n;
    }, 1000);
  });
}

/* Black & white */
function bw(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = (d[i] + d[i + 1] + d[i + 2]) / 3;
    d[i] = d[i + 1] = d[i + 2] = g;
  }
  ctx.putImageData(imageData, 0, 0);
}
function addGrain(ctx, w, h, intensity = 15) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity;
      data[i]     = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
  
    ctx.putImageData(imageData, 0, 0);
  }
  
/* Init strip */
function initStrip() {
  canvas.width = PHOTO_WIDTH + GAP * 2;
  canvas.height = PHOTO_COUNT * (PHOTO_HEIGHT + GAP) + GAP + FOOTER;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < canvas.width * canvas.height; i++) {
  ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
  ctx.fillRect(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    1,
    1
  );
}
ctx.globalAlpha = 1;
}

/* Place photo */
function place(canvasImg, i) {
  const y = GAP + i * (PHOTO_HEIGHT + GAP);
  ctx.drawImage(canvasImg, GAP, y, PHOTO_WIDTH, PHOTO_HEIGHT);
}

/* Footer */
function footer() {
    const footerY = canvas.height - 18;
  
    // Reset canvas state (IMPORTANT)
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#111";
    ctx.font = "14px 'Times New Roman'";
    ctx.textAlign = "center";
  
    // Separator line
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(GAP, footerY - 12);
    ctx.lineTo(canvas.width - GAP, footerY - 12);
    ctx.stroke();
  
    // Footer text
    ctx.fillText(
        `PHOTO BOOTH • ${sessionDate}`,
        canvas.width / 2,
        footerY
      );      
  
    ctx.restore();
  
    // Show buttons
    downloadBtn.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
    pdfBtn.classList.remove("hidden");
  }
  

/* Capture from camera */
async function startBooth() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    sessionDate = `${day}/${month}/${year}`;

    if (sessionActive) return;
  
    sessionActive = true;
    photos = [];
    initStrip();
  
    for (let i = 0; i < PHOTO_COUNT; i++) {
      if (!sessionActive) break;
  
      await countdown(3);
// 🔊 shutter click
      shutterSound.currentTime = 0;
      shutterSound.play();
      const c = document.createElement("canvas");
      c.width = PHOTO_WIDTH;
      c.height = PHOTO_HEIGHT;
  
      const x = c.getContext("2d");
      x.translate(PHOTO_WIDTH, 0);
      x.scale(-1, 1);
      x.drawImage(video, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
      bw(x, PHOTO_WIDTH, PHOTO_HEIGHT);
      addGrain(x, PHOTO_WIDTH, PHOTO_HEIGHT, 12);

  
      photos.push(c);
      place(c, i);
    }
  
    sessionActive = false;
  
    if (photos.length > 0) {
      footer();
    }
  }
  
function stopCamera() {
    if (!stream) return;
  
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    stopBtn.disabled = true;

  }
  

/* Upload from device */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Limit uploads
    if (photos.length >= PHOTO_COUNT) {
      alert(`You can only add ${PHOTO_COUNT} photos per strip.`);
      fileInput.value = "";
      return;
    }
  
    const img = new Image();
    img.src = URL.createObjectURL(file);
  
    img.onload = () => {
      // Lock session date on first upload only
      if (photos.length === 0) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        sessionDate = `${day}/${month}/${year}`;
  
        initStrip(); // init ONLY once
      }
  
      // Prepare photo canvas
      const c = document.createElement("canvas");
      c.width = PHOTO_WIDTH;
      c.height = PHOTO_HEIGHT;
      const x = c.getContext("2d");
  
      // Center-crop to strip ratio
      const scale = Math.max(
        PHOTO_WIDTH / img.width,
        PHOTO_HEIGHT / img.height
      );
      const w = img.width * scale;
      const h = img.height * scale;
      const dx = (PHOTO_WIDTH - w) / 2;
      const dy = (PHOTO_HEIGHT - h) / 2;
  
      x.drawImage(img, dx, dy, w, h);
      bw(x, PHOTO_WIDTH, PHOTO_HEIGHT);
      addGrain(x, PHOTO_WIDTH, PHOTO_HEIGHT, 12);
  
      // Store & place
      photos.push(c);
      place(c, photos.length - 1);
  
      // Finalize if full
      if (photos.length === PHOTO_COUNT) {
        footer();
      }
  
      // Reset input so same file can be chosen again
      fileInput.value = "";
    };
  };
  
/* Events */
startBtn.onclick = startBooth;

downloadBtn.onclick = () => {
  printAnimation(() => {
    const a = document.createElement("a");
    a.download = "photobooth-strip.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
};


resetBtn.onclick = () => {
  photos = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  downloadBtn.classList.add("hidden");
  pdfBtn.classList.add("hidden");
  resetBtn.classList.add("hidden");
};
stopBtn.onclick = () => {
    sessionActive = false;
    countdownEl.classList.add("hidden");
  };
  pdfBtn.onclick = () => {
    printAnimation(() => {
      const { jsPDF } = window.jspdf;
  
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
  
      const imgData = canvas.toDataURL("image/png", 1.0);
  
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );
  
      pdf.save("photobooth-strip.pdf");
    });
  };
  
  function playPrintSound() {
    const sound = document.getElementById("printSound");
  
    if (!sound) return;
  
    sound.pause();
    sound.currentTime = 0;
  
    sound.play().catch(() => {});
  
    // Stop exactly at 3 seconds
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 3000);
  }
  function printAnimation(callback) {
    const printer = document.querySelector(".printer");
    if (!printer) {
      callback();
      return;
    }
  
    // Restart animation cleanly
    printer.classList.remove("printing");
    void printer.offsetWidth; // force reflow
    printer.classList.add("printing");
  
    // Play print sound (3 seconds)
    playPrintSound();
  
    // Run callback after animation ends
    setTimeout(() => {
      printer.classList.remove("printing");
      callback();
    }, 1600); // must match CSS animation duration
  }
  