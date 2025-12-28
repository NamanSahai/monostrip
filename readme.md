# MonoStrip

**A retro black-and-white online photobooth**

_Moments captured before they fade_

MonoStrip is a browser-based photobooth experience inspired by classic newspaper prints and analog photo strips. It captures or accepts images, processes them in monochrome with film grain, and exports them as authentic photobooth strips in PNG or PDF format.

---

## Features

- Retro black and white photobooth
- Live camera preview using webcam
- Upload images from device
- Automatic photo strip assembly
- Film grain effect applied to preview and final output
- Camera shutter sound
- Ability to stop camera mid-session
- Dynamic date stamp (DD/MM/YYYY)
- Download output as PNG
- Download output as print-ready PDF
- Mobile responsive layout
- Newspaper and darkroom inspired user interface

---

## How It Works

1. The user starts the camera or uploads images  
2. Each photo is converted to grayscale and enhanced with film grain  
3. Photos are stacked into a vertical strip  
4. A footer with the session date is added  
5. The final strip can be downloaded as PNG or PDF  

All processing happens entirely in the browser. No backend services are required.

---

## Tech Stack

- HTML5
- CSS3 (Flexbox and Media Queries)
- Vanilla JavaScript
- Canvas API
- Web Media API
- jsPDF for PDF export

---

## Project Structure

```text
monostrip/
│
├── index.html        # Main HTML structure
├── style.css         # Retro newspaper styling
├── script.js         # Camera, canvas, and application logic
├── assets/
│   └── shutter.mp3   # Camera shutter sound
└── README.md
````

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/NamanSahai/monostrip.git
```

### Open the project

You can run MonoStrip using any local server.

Recommended approach:

* Use Visual Studio Code
* Install the Live Server extension
* Right-click `index.html` and open with Live Server

Webcam access requires HTTPS or localhost.

---

## Usage

### Camera Mode

1. Click **Start Booth**
2. Sit still and look at the camera lens
3. Four photos are captured automatically
4. Download the strip as PNG or PDF

### Upload Mode

1. Click **Add from Device**
2. Upload images one by one (up to four)
3. Each image is cropped and processed
4. Download the final strip

Camera and upload modes are intentionally kept separate to avoid ambiguity.

---

## Mobile Support

MonoStrip is fully responsive and adapts to smaller screens by stacking the layout vertically and scaling the camera preview and controls.

Tested on:

* iOS browsers (Safari and Chrome)
* Android browsers (Chrome)

---

## PDF Export

* Exact canvas dimensions
* High-quality output
* Print-ready photobooth strip
* No scaling or cropping artifacts

---

## Design Philosophy

MonoStrip is designed to feel:

* Analog rather than digital
* Editorial rather than app-like
* Minimal rather than cluttered

Design inspirations include:

* Newspaper layouts
* Traditional darkroom photography
* Physical photo booths

---

## Privacy

* No images are uploaded to any server
* No user data is stored
* All image processing happens locally in the browser

---

## Limitations

* Webcam permission is required for camera mode
* Best experienced in modern browsers
* Audio playback requires user interaction due to browser policies

---

## License

This project is released under the **MIT License**.
You are free to use, modify, and distribute it.

---

## Acknowledgements

* HTML Canvas API documentation
* jsPDF library
* TransparentTextures for paper and grain textures

---

## Author

**MonoStrip**
Designed and developed as a creative web project exploring retro user interfaces and client-side image processing.
