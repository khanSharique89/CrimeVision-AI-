# CrimeVision AI – Intelligent Multimodal Forensic Analysis Platform

> **Advanced Forensic Intelligence Decision-Support System**  
> Automated Crime Scene Reconstruction & Digital Evidence Analysis using Multimodal Artificial Intelligence.

---

## 🏛️ Platform Overview

**CrimeVision AI** is a state-of-the-art forensic intelligence decision-support platform engineered for law enforcement agencies, forensic examiners, and digital detectives. The system bridges raw multimedia evidence with structured forensic intelligence by fusing visual data (CCTV, bodycam, high-res crime scene photos), acoustic recordings (911 emergency calls, ambient microphones, dispatch wiretaps), and physical ballistics markers into a unified, cryptographically verified chronological timeline.

---

## 🚀 Key Forensic Capabilities

### 1. 🎥 Multi-Camera Surveillance Video Station (CCTV)
- **Computer Vision (YOLOv8)**: Real-time detection of people, weapons (firearms, bladed weapons), vehicles, and evidence markers.
- **Action & Pose Velocity Classification**: Identifies critical action signatures including `PERIMETER_INFILTRATION`, `WEAPON_BRANDISHED_HOSTILE`, `BALLISTIC_DISCHARGE_CONFIRMED`, and `VALUABLES_EXTRACTION & FLIGHT`.
- **Tactical HUD & Bounding Box Overlays**: Dynamic canvas rendering with corner brackets, threat indicators, frame-by-frame stepping, and variable speed scrubbing (0.25x to 2x).

### 2. 🎙️ Acoustic Ballistics Lab & 911 Speech Diarization
- **Impulse Spectral Analysis**: Scans audio waveforms for high-impulse shockwaves characteristic of ballistic discharges (e.g. -1.2 dB peak @ 8.42s).
- **Synchronized Transcripts**: Interactive speaker-diarized emergency transcripts (Security Guard, Suspect vocal commands, 911 Dispatch) with click-to-seek timestamp jumping.

### 3. 🔬 Image & Weapon Forensic Inspection
- **Interactive Canvas**: Smooth Zoom (up to 400%), Pan, and Viewport Reset.
- **3x Magnifier Loupe**: Circular magnifying tool to inspect weapon serial stamps, tool markings, and shell casings at pixel resolution.
- **Dynamic Confidence Slider**: Calibrate YOLO detection confidence from 10% to 90% in real-time.
- **Tamper-Evident SHA-256 Verification**: Digital checksum calculation for court admissibility.

### 4. ⏱️ Multimodal Chronological Timeline Reconstruction
- **Automated Fusion**: Unifies heterogeneous data streams (Optical CCTV, Acoustic Shockwaves, 911 Speech) into an authoritative chronological milestone sequence.
- **Evidentiary Corroboration**: Categorizes events into `TRIPLE_VERIFIED` (Visual + Acoustic + Verbal agreement), `DUAL_VERIFIED`, and `SINGLE_SENSOR`.
- **Contradiction Detection**: Flags witness statement discrepancies that contradict optical ground truth.

### 5. 🗺️ Tactical Crime Scene Layout (2D/3D Spatial Map)
- **Architectural Floorplan HUD**: Shows crime scene rooms, vault entry points, and access corridors.
- **Camera Coverage**: Visualizes camera positions and Field-of-View (FOV) cones.
- **Acoustic Triangulation**: Concentric radar blips radiating from firearm discharge origin.
- **Suspect Movement Vectors**: Tracked movement paths for each suspect.

### 6. 🤖 Investigator AI Forensic Copilot
- **Persistent Case Interrogation**: Natural language query engine over the entire multimodal case file.
- **Evidentiary Citations**: Answers include exact source feeds, camera angles, timestamps, and confidence percentages (e.g., `[SOURCE: CCTV_CAM_01 @ 23:14:08.4]`).
- **Dual Engine**: High-fidelity local neural reasoning engine + Google Gemini 1.5 Flash/Pro live multimodal cloud analysis.

### 7. 📄 Official Court-Admissible PDF Forensic Dossier
- **High-Performance Reporting Engine**: Built with ReportLab 5.1.0 adhering to legal forensic documentation standards.
- **Comprehensive Dossier**: Executive synopsis, master SHA-256 hash, chain of custody ledger, timeline table, threat detection matrix, acoustic analysis, and lead examiner certification seal.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, HTML5 Canvas, Web Audio API |
| **Backend** | Python 3.13, Flask, Flask-CORS, Werkzeug |
| **Computer Vision** | Ultralytics YOLOv8, OpenCV (cv2), Pillow, PyTorch |
| **Acoustic & Signal** | SciPy (signal processing, spectrograms, wavfile), NumPy (FFT) |
| **Reporting** | ReportLab 5.1.0 (PDF 1.7 standards) |
| **AI Intelligence** | CrimeVision Local Neural Reasoner, Google Generative AI (Gemini 1.5 Flash/Pro) |

---

## 🚦 Quick Start & Execution

### 1. Start the Python Forensic Backend
```powershell
cd C:\Users\a\.gemini\antigravity\scratch\crimevision-ai\backend
python app.py
```
*Backend runs on `http://127.0.0.1:5000`*

### 2. Start the Tactical React Frontend
```powershell
cd C:\Users\a\.gemini\antigravity\scratch\crimevision-ai\frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📁 Repository Structure

```
crimevision-ai/
├── backend/
│   ├── app.py                  # Flask REST API & routing
│   ├── forensic_engine.py      # YOLOv8 vision & acoustic spectrogram analyzer
│   ├── fusion_engine.py        # Multimodal chronological fusion & timeline
│   ├── report_generator.py     # ReportLab court-admissible PDF dossier generator
│   ├── sample_data.py          # Pre-seeded cases & synthetic media generator
│   ├── evidence_storage/
│   │   ├── samples/            # CCTV videos, audio recordings, crime scene photos
│   │   └── uploads/            # Investigator-uploaded evidentiary files
│   └── reports/                # Generated forensic PDF dossiers
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx              # Tactical status bar & case switcher
    │   │   ├── OperationsHub.tsx       # Main command center & KPIs
    │   │   ├── VideoSurveillance.tsx   # CCTV player with YOLO bounding boxes
    │   │   ├── AudioBallistics.tsx     # Waveform scrubber & 911 transcript
    │   │   ├── ImageInspection.tsx     # High-res canvas with 3x magnifier loupe
    │   │   ├── MultimodalTimeline.tsx  # Unified timeline with corroboration badges
    │   │   ├── Scene3DMapping.tsx      # Tactical spatial layout & camera FOVs
    │   │   ├── InvestigatorCopilot.tsx # Persistent AI forensic chat interface
    │   │   ├── ReportCenter.tsx        # Legal dossier preview & PDF download
    │   │   ├── EvidenceUploadModal.tsx # Multi-format evidence ingestion modal
    │   │   ├── ChainOfCustodyModal.tsx # SHA-256 integrity audit log
    │   │   └── GeminiSettingsModal.tsx # Gemini API configuration
    │   ├── types.ts            # TypeScript forensic data interfaces
    │   ├── App.tsx             # Main container & state coordination
    │   └── main.tsx            # React application entry point
    ├── vite.config.ts          # Vite configuration with API proxying
    └── package.json
```

