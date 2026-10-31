"""
CrimeVision AI - Sample Data & Synthetic Evidence Generator
Generates realistic multimodal forensic cases, including synthetic CCTV video clips,
forensic surveillance images, and acoustic ballistics WAV audio files.
"""

import os
import math
import numpy as np
import cv2
import wave
import struct
from datetime import datetime
from typing import List, Dict
from forensic_engine import calculate_sha256

def generate_synthetic_audio(output_path: str, duration_sec: float = 18.0, sample_rate: int = 44100):
    """Synthesizes a realistic forensic audio recording with background murmur, 911 dispatch, and a sharp gunshot impulse."""
    total_samples = int(duration_sec * sample_rate)
    samples = np.zeros(total_samples, dtype=np.float32)

    # 1. Background environmental room tone / low-frequency hum (60 Hz + pink noise)
    t = np.linspace(0, duration_sec, total_samples, endpoint=False)
    hum = 0.04 * np.sin(2 * np.pi * 60 * t)
    noise = 0.02 * np.random.normal(0, 1, total_samples)
    samples += hum + noise

    # 2. Simulated witness voice formant bands at t = 2.0s to 7.0s ("Someone is breaking into the vault...")
    voice_mask = (t >= 2.0) & (t <= 7.0)
    voice_signal = 0.15 * np.sin(2 * np.pi * 220 * t) + 0.1 * np.sin(2 * np.pi * 440 * t) + 0.08 * np.sin(2 * np.pi * 880 * t)
    # Amplitude modulation to simulate human speech cadence
    speech_envelope = np.abs(np.sin(2 * np.pi * 3.5 * t))
    samples[voice_mask] += (voice_signal * speech_envelope)[voice_mask]

    # 3. High-impulse Gunshot Discharge at t = 8.4s
    gunshot_idx = int(8.4 * sample_rate)
    impulse_len = int(0.35 * sample_rate) # 350ms shockwave + reverb
    if gunshot_idx + impulse_len < total_samples:
        t_shot = np.linspace(0, 0.35, impulse_len, endpoint=False)
        # Fast rise time (<2ms) exponential decay + 1.8 kHz resonance
        shockwave = np.exp(-t_shot / 0.015) * np.random.uniform(-1.0, 1.0, impulse_len)
        reverberation = 0.5 * np.exp(-t_shot / 0.12) * np.sin(2 * np.pi * 1850 * t_shot)
        samples[gunshot_idx:gunshot_idx+impulse_len] += (0.95 * shockwave + 0.4 * reverberation)

    # 4. Secondary scream / distress call at t = 9.2s to 12.0s
    scream_mask = (t >= 9.2) & (t <= 12.0)
    scream_signal = 0.28 * np.sin(2 * np.pi * 1250 * t) + 0.15 * np.sin(2 * np.pi * 2500 * t)
    samples[scream_mask] += scream_signal[scream_mask]

    # Normalize to 16-bit PCM
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)

    # Write WAV
    with wave.open(output_path, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(int_samples.tobytes())


def generate_synthetic_surveillance_image(output_path: str, case_name: str, camera_label: str):
    """Generates an authentic CCTV style evidence frame with timestamp HUD and forensic elements."""
    w, h = 960, 540
    img = np.zeros((h, w, 3), dtype=np.uint8)

    # CCTV monochrome/low-saturation ambient background with noise
    gradient = np.tile(np.linspace(25, 45, h, dtype=np.uint8)[:, None], (1, w))
    img[:, :, 0] = gradient
    img[:, :, 1] = gradient + 2
    img[:, :, 2] = gradient + 5

    # Add realistic digital sensor grain
    noise = np.random.normal(0, 8, (h, w, 3)).astype(np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Draw architectural room features (vault doorway, security grid)
    cv2.rectangle(img, (150, 80), (810, 480), (50, 55, 65), 2)
    cv2.rectangle(img, (380, 140), (580, 480), (35, 40, 50), -1) # Vault door
    cv2.line(img, (0, 380), (w, 380), (60, 65, 75), 1) # Floor horizon

    # Draw Suspect Silhouette (Black tactical attire)
    # Body
    cv2.ellipse(img, (480, 340), (45, 95), 0, 0, 360, (20, 20, 25), -1)
    # Head / Balaclava
    cv2.circle(img, (480, 220), 28, (15, 15, 20), -1)
    # Arm extending forward holding weapon
    cv2.line(img, (500, 280), (575, 275), (25, 25, 30), 12)
    # Weapon profile (Handgun silhouette)
    cv2.rectangle(img, (575, 268), (615, 282), (10, 10, 12), -1)
    cv2.rectangle(img, (585, 280), (598, 302), (10, 10, 12), -1) # Grip

    # Draw Evidence Marker #01 on floor (Yellow cone)
    marker_pt = (310, 430)
    pts = np.array([[marker_pt[0], marker_pt[1]-30], [marker_pt[0]-18, marker_pt[1]], [marker_pt[0]+18, marker_pt[1]]], np.int32)
    cv2.fillPoly(img, [pts], (0, 215, 255))
    cv2.putText(img, "01", (marker_pt[0]-8, marker_pt[1]-5), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1)

    # Ballistic Casing near marker
    cv2.ellipse(img, (340, 435), (4, 2), 25, 0, 360, (50, 200, 230), -1)

    # CCTV HUD Overlay (Military / Police standard)
    cv2.rectangle(img, (20, 20), (w-20, 50), (10, 10, 15), -1)
    cv2.rectangle(img, (20, 20), (w-20, 50), (40, 50, 60), 1)
    hud_text = f"REC [LIVE] // {camera_label} // FPS: 29.97 // 2026-10-31 23:14:08.42 UTC"
    cv2.putText(img, hud_text, (35, 41), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 200), 1, cv2.LINE_AA)

    # Bottom status bar
    cv2.rectangle(img, (20, h-45), (w-20, h-18), (10, 10, 15), -1)
    cv2.putText(img, f"CASE: {case_name} // SENSOR_ID: CAM_4K_DOME_B // FORENSIC ARCHIVE TAMPER_VERIFIED", (35, h-28), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (160, 180, 200), 1)

    cv2.imwrite(output_path, img)


def generate_synthetic_surveillance_video(output_path: str, camera_label: str, duration_sec: float = 6.0, fps: int = 15):
    """Generates an MP4 CCTV video clip showing suspect movement, weapon brandishing, and tactical HUD."""
    w, h = 640, 360
    total_frames = int(duration_sec * fps)
    
    # Try using mp4v codec
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        frame = np.zeros((h, w, 3), dtype=np.uint8)

        # Ambient background
        frame[:] = (30, 32, 38)
        # Vault hallway perspective
        cv2.line(frame, (80, 40), (200, 120), (55, 60, 70), 2)
        cv2.line(frame, (560, 40), (440, 120), (55, 60, 70), 2)
        cv2.rectangle(frame, (200, 120), (440, 320), (22, 24, 28), -1)

        # Suspect movement: enters from left at t=0, moves to center (x: 140 -> 320)
        progress = min(1.0, t / 3.0)
        suspect_x = int(140 + progress * 180)
        suspect_y = 240

        # Suspect silhouette
        cv2.ellipse(frame, (suspect_x, suspect_y), (28, 65), 0, 0, 360, (15, 15, 20), -1)
        cv2.circle(frame, (suspect_x, suspect_y - 75), 18, (12, 12, 16), -1)

        # Weapon brandished at t >= 2.0s
        if t >= 2.0:
            arm_reach = min(40, int((t - 2.0) * 45))
            cv2.line(frame, (suspect_x + 15, suspect_y - 35), (suspect_x + 15 + arm_reach, suspect_y - 40), (20, 20, 25), 8)
            if arm_reach >= 35:
                # Gun profile
                cv2.rectangle(frame, (suspect_x + 50, suspect_y - 45), (suspect_x + 72, suspect_y - 35), (8, 8, 10), -1)
                # Muzzle flash flash at t = 3.5s for 2 frames
                if 3.4 <= t <= 3.6:
                    cv2.circle(frame, (suspect_x + 76, suspect_y - 40), 14, (100, 240, 255), -1)
                    cv2.circle(frame, (suspect_x + 76, suspect_y - 40), 6, (255, 255, 255), -1)

        # HUD Overlay
        cv2.putText(frame, f"[REC] {camera_label} // {t:04.2f}s // 23:14:{8+t:04.2f}", (15, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 200), 1)

        out.write(frame)

    out.release()


def init_sample_cases(samples_dir: str) -> List[dict]:
    """Generates synthetic media files on disk and returns pre-populated rich forensic cases."""
    os.makedirs(samples_dir, exist_ok=True)

    # 1. Media paths for Case 1
    c1_img1 = os.path.join(samples_dir, "case8841_cctv_vault_frame.jpg")
    c1_img2 = os.path.join(samples_dir, "case8841_ballistics_evidence_01.jpg")
    c1_audio = os.path.join(samples_dir, "case8841_911_vault_audio.wav")
    c1_video = os.path.join(samples_dir, "case8841_cctv_cam01.mp4")

    # 2. Media paths for Case 2
    c2_img1 = os.path.join(samples_dir, "case9412_alleyway_frame.jpg")
    c2_audio = os.path.join(samples_dir, "case9412_bodycam_audio.wav")
    c2_video = os.path.join(samples_dir, "case9412_street_cam.mp4")

    # Generate media files if not existing
    if not os.path.exists(c1_img1):
        generate_synthetic_surveillance_image(c1_img1, "CASE-2026-8841", "CCTV_CAM_01_VAULT_NORTH")
    if not os.path.exists(c1_img2):
        generate_synthetic_surveillance_image(c1_img2, "CASE-2026-8841", "FORENSIC_MACRO_CASING_01")
    if not os.path.exists(c1_audio):
        generate_synthetic_audio(c1_audio, duration_sec=16.0)
    if not os.path.exists(c1_video):
        generate_synthetic_surveillance_video(c1_video, "CCTV_CAM_01_VAULT")

    if not os.path.exists(c2_img1):
        generate_synthetic_surveillance_image(c2_img1, "CASE-2026-9412", "STREET_SURVEILLANCE_4TH_ELM")
    if not os.path.exists(c2_audio):
        generate_synthetic_audio(c2_audio, duration_sec=12.0)
    if not os.path.exists(c2_video):
        generate_synthetic_surveillance_video(c2_video, "BODYCAM_UNIT_114")

    # Hashes
    c1_hash1 = calculate_sha256(c1_img1)
    c1_hash2 = calculate_sha256(c1_audio)
    c1_hash3 = calculate_sha256(c1_video)

    cases = [
        {
            'id': 'CASE-2026-8841',
            'title': 'Downtown Diamond Vault Infiltration & Ballistic Discharge',
            'incident_date': '2026-10-31 23:14:00 UTC',
            'jurisdiction': 'Metropolitan Police - Major Crimes & Forensic Division',
            'lead_investigator': 'Det. Viktor Vance (#4892)',
            'threat_level': 'CRITICAL',
            'status': 'ACTIVE_INVESTIGATION',
            'master_hash': c1_hash1,
            'corroboration_index': '97.8%',
            'location': {
                'name': 'Grand Central Diamond Exchange, Vault Room B',
                'lat': 40.7128,
                'lng': -74.0060,
                'floor': 'Sub-Level 2'
            },
            'synopsis': (
                "Armed intrusion at Sub-Level 2 vault. Two suspects equipped with balaclavas breached secure doors. "
                "CCTV Cam 01 and acoustic ballistics microphone captured brandishing and discharge of a semi-automatic handgun "
                "at 23:14:08.4. Simultaneous 911 dispatch audio corroborates security guard panic call. Suspects fled via dark sedan."
            ),
            'evidence_items': [
                {
                    'id': 'EV-8841-01',
                    'title': 'CCTV Feed 01 - Vault Doorway',
                    'source': 'CCTV_CAM_01',
                    'type': 'VIDEO_MP4',
                    'file_name': os.path.basename(c1_video),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c1_video)}',
                    'sha256': c1_hash3,
                    'file_size_mb': round(os.path.getsize(c1_video) / (1024*1024), 2),
                    'verified': True,
                    'description': 'Continuous high-contrast surveillance recording of Vault Doorway North.'
                },
                {
                    'id': 'EV-8841-02',
                    'title': 'CCTV High-Res Keyframe #104',
                    'source': 'CCTV_CAM_01_FRAME_104',
                    'type': 'IMAGE_JPEG',
                    'file_name': os.path.basename(c1_img1),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c1_img1)}',
                    'sha256': c1_hash1,
                    'file_size_mb': round(os.path.getsize(c1_img1) / (1024*1024), 2),
                    'verified': True,
                    'description': 'Extracted high-clarity keyframe capturing suspect drawing weapon from holster.'
                },
                {
                    'id': 'EV-8841-03',
                    'title': 'Emergency 911 Dispatch & Security Wiretap',
                    'source': 'DISPATCH_COMM_CH4',
                    'type': 'AUDIO_WAV',
                    'file_name': os.path.basename(c1_audio),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c1_audio)}',
                    'sha256': c1_hash2,
                    'file_size_mb': round(os.path.getsize(c1_audio) / (1024*1024), 2),
                    'verified': True,
                    'description': 'Synchronized emergency call audio with ambient ballistic shockwave recording.'
                },
                {
                    'id': 'EV-8841-04',
                    'title': 'Physical Evidence Marker #01 - 9mm Casing',
                    'source': 'CRIME_SCENE_PHOTO_B04',
                    'type': 'IMAGE_JPEG',
                    'file_name': os.path.basename(c1_img2),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c1_img2)}',
                    'sha256': calculate_sha256(c1_img2),
                    'file_size_mb': round(os.path.getsize(c1_img2) / (1024*1024), 2),
                    'verified': True,
                    'description': 'Close-up evidentiary photography of discharged 9mm Luger brass casing.'
                }
            ],
            'detected_entities': [
                {
                    'id': 'ENT-01',
                    'category': 'WEAPON',
                    'label': 'Semi-Automatic Handgun (Glock-19 profile)',
                    'confidence': 0.965,
                    'threat': 'CRITICAL',
                    'time': '23:14:08.40',
                    'source': 'CCTV_CAM_01',
                    'box': [575, 268, 615, 302],
                    'box_norm': [0.598, 0.496, 0.640, 0.559],
                    'notes': 'Matte black finish, extended magazine baseplate visible.'
                },
                {
                    'id': 'ENT-02',
                    'category': 'PERSON_OF_INTEREST',
                    'label': 'Suspect #1 (Armed Infiltrator)',
                    'confidence': 0.942,
                    'threat': 'CRITICAL',
                    'time': '23:14:02.10',
                    'source': 'CCTV_CAM_01',
                    'box': [435, 192, 535, 435],
                    'box_norm': [0.453, 0.355, 0.557, 0.805],
                    'notes': 'Approx 6ft 1in, black balaclava mask, Kevlar-style vest, dark tactical trousers.'
                },
                {
                    'id': 'ENT-03',
                    'category': 'PERSON_OF_INTEREST',
                    'label': 'Suspect #2 (Support & Bag Handler)',
                    'confidence': 0.918,
                    'threat': 'HIGH',
                    'time': '23:14:03.50',
                    'source': 'CCTV_CAM_02',
                    'box': [220, 210, 310, 420],
                    'box_norm': [0.229, 0.388, 0.322, 0.777],
                    'notes': 'Approx 5ft 10in, grey hoodie, carrying high-capacity tactical duffel bag.'
                },
                {
                    'id': 'ENT-04',
                    'category': 'BALLISTICS',
                    'label': '9mm Luger Expended Casing (Marker #01)',
                    'confidence': 0.981,
                    'threat': 'EVIDENCE',
                    'time': '23:14:08.45',
                    'source': 'FORENSIC_PHOTO_04',
                    'box': [335, 430, 350, 442],
                    'box_norm': [0.348, 0.796, 0.364, 0.818],
                    'notes': 'Ejection pattern aligns precisely with firing angle of Suspect #1.'
                },
                {
                    'id': 'ENT-05',
                    'category': 'VEHICLE',
                    'label': 'Getaway Vehicle - Dark Sedan',
                    'confidence': 0.887,
                    'threat': 'HIGH',
                    'time': '23:15:32.00',
                    'source': 'PERIMETER_CAM_04',
                    'box': [110, 180, 480, 340],
                    'box_norm': [0.114, 0.333, 0.500, 0.629],
                    'notes': 'Tinted windows, rear license plate obstructed by reflective coating.'
                }
            ],
            'acoustic_events': [
                {
                    'timestamp_sec': 8.42,
                    'event_type': 'ACOUSTIC_GUNSHOT_DISCHARGE',
                    'sensor_id': 'VAULT_MIC_B2',
                    'confidence': 0.978,
                    'peak_decibel_relative': -1.2,
                    'threat_level': 'CRITICAL',
                    'signature': 'High-impulse ballistic acoustic shockwave with 1.85 kHz peak'
                },
                {
                    'timestamp_sec': 9.25,
                    'event_type': 'HUMAN_DISTRESS_SCREAM',
                    'sensor_id': 'VAULT_MIC_B2',
                    'confidence': 0.912,
                    'peak_decibel_relative': -14.6,
                    'threat_level': 'HIGH',
                    'signature': 'High-pitch vocal frequency transient at 1.25 kHz'
                }
            ],
            'transcripts': [
                {
                    'timestamp_sec': 2.10,
                    'speaker': 'SECURITY_GUARD_911',
                    'text': 'Control, we have unauthorized motion at Vault B. Two individuals wearing balaclavas!',
                    'threat_level': 'ELEVATED',
                    'entities_mentioned': ['balaclavas', 'Vault B', 'two individuals'],
                    'credibility_score': 0.96
                },
                {
                    'timestamp_sec': 7.80,
                    'speaker': 'SUSPECT_VOICE_AMB',
                    'text': 'Step back! Keep your hands where I can see them!',
                    'threat_level': 'CRITICAL',
                    'entities_mentioned': ['verbal command'],
                    'credibility_score': 0.92
                },
                {
                    'timestamp_sec': 8.42,
                    'speaker': 'SYSTEM_BALLISTICS',
                    'text': '[ACOUSTIC DISCHARGE DETECTED: 124 dB EQUIVALENT IMPULSE]',
                    'threat_level': 'CRITICAL',
                    'entities_mentioned': ['gunshot'],
                    'credibility_score': 0.99
                },
                {
                    'timestamp_sec': 10.15,
                    'speaker': 'SECURITY_GUARD_911',
                    'text': 'Shots fired! Shots fired in Vault B! Suspects are packing the vault shelves into duffel bags!',
                    'threat_level': 'CRITICAL',
                    'entities_mentioned': ['shots fired', 'duffel bags'],
                    'credibility_score': 0.98
                }
            ],
            'scene_layout_3d': {
                'dimensions': {'x': 25, 'y': 18, 'unit': 'meters'},
                'cameras': [
                    {'id': 'CCTV_CAM_01', 'x': 2.5, 'y': 2.0, 'fov': 85, 'rotation': 45, 'status': 'ONLINE', 'label': 'Vault Entrance North'},
                    {'id': 'CCTV_CAM_02', 'x': 22.0, 'y': 2.0, 'fov': 90, 'rotation': 135, 'status': 'ONLINE', 'label': 'Vault Door East'},
                    {'id': 'CCTV_CAM_03', 'x': 12.5, 'y': 16.5, 'fov': 110, 'rotation': 270, 'status': 'ONLINE', 'label': 'Hallway Approach'}
                ],
                'evidence_points': [
                    {'id': 'MARKER-01', 'x': 8.2, 'y': 9.4, 'type': 'SHELL_CASING', 'label': '9mm Luger Casing'},
                    {'id': 'MARKER-02', 'x': 14.5, 'y': 10.1, 'type': 'IMPACT_MARK', 'label': 'Bullet Ricochet Strike'},
                    {'id': 'MARKER-03', 'x': 18.0, 'y': 4.5, 'type': 'TOOL_MARK', 'label': 'Pry marks on Vault Locking Pin'}
                ],
                'suspect_vectors': [
                    {'suspect': 'Suspect #1', 'path': [[2.5, 16.0], [6.0, 12.0], [10.5, 8.5], [17.5, 6.0]], 'color': '#ef4444'},
                    {'suspect': 'Suspect #2', 'path': [[2.5, 16.0], [5.0, 13.0], [8.0, 11.0], [16.0, 7.5]], 'color': '#f97316'}
                ]
            },
            'chat_history': [
                {
                    'role': 'assistant',
                    'text': 'CrimeVision AI Forensic Copilot initialized for Case #2026-CV-8841. All multimodal evidence streams (CCTV feeds, 911 audio waveforms, ballistics markers) are synchronized and ready for interrogation.',
                    'timestamp': '2026-10-31 23:16:00'
                }
            ]
        },
        {
            'id': 'CASE-2026-9412',
            'title': 'Neon Alleyway Altercation & High-Speed Flight at 4th & Elm',
            'incident_date': '2026-10-30 02:45:10 UTC',
            'jurisdiction': 'Downtown Precinct 4 Patrol & Detective Squad',
            'lead_investigator': 'Det. Sarah Lin (#5120)',
            'threat_level': 'HIGH',
            'status': 'PENDING_BALLISTICS',
            'master_hash': calculate_sha256(c2_img1),
            'corroboration_index': '94.2%',
            'location': {
                'name': 'Alleyway adjacent to 404 Elm Street',
                'lat': 40.7145,
                'lng': -74.0082,
                'floor': 'Ground / Street'
            },
            'synopsis': (
                "Late-night altercation between two individuals outside a commercial nightclub. Bodycam and street cameras "
                "recorded physical engagement followed by edged weapon deployment. Witness 911 statements corroborated "
                "suspect wearing green olive jacket fleeing eastbound in a gray hatchback."
            ),
            'evidence_items': [
                {
                    'id': 'EV-9412-01',
                    'title': 'Street Pole Cam #14 - Alleyway Overlook',
                    'source': 'STREET_CAM_14',
                    'type': 'VIDEO_MP4',
                    'file_name': os.path.basename(c2_video),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c2_video)}',
                    'sha256': calculate_sha256(c2_video),
                    'file_size_mb': round(os.path.getsize(c2_video) / (1024*1024), 2),
                    'verified': True,
                    'description': 'Surveillance video tracking foot pursuit and vehicle acceleration.'
                },
                {
                    'id': 'EV-9412-02',
                    'title': 'High-Res Frame - Edged Weapon Brandishing',
                    'source': 'STREET_CAM_FRAME_88',
                    'type': 'IMAGE_JPEG',
                    'file_name': os.path.basename(c2_img1),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c2_img1)}',
                    'sha256': calculate_sha256(c2_img1),
                    'file_size_mb': round(os.path.getsize(c2_img1) / (1024*1024), 2),
                    'verified': True,
                    'description': 'Stab weapon silhouette visual confirmation in alleyway.'
                },
                {
                    'id': 'EV-9412-03',
                    'title': 'Bodycam Audio & Dispatch Log Unit 114',
                    'source': 'BODYCAM_MIC_114',
                    'type': 'AUDIO_WAV',
                    'file_name': os.path.basename(c2_audio),
                    'file_url': f'/evidence_media/samples/{os.path.basename(c2_audio)}',
                    'sha256': calculate_sha256(c2_audio),
                    'file_size_mb': round(os.path.getsize(c2_audio) / (1024*1024), 2),
                    'verified': True,
                    'description': 'First-responder audio during rapid scene response and suspect chase.'
                }
            ],
            'detected_entities': [
                {
                    'id': 'ENT-94-01',
                    'category': 'WEAPON',
                    'label': 'Edged Weapon (Fixed Blade Knife ~7-inch)',
                    'confidence': 0.932,
                    'threat': 'HIGH',
                    'time': '02:45:18.20',
                    'source': 'STREET_CAM_14',
                    'box': [480, 240, 520, 280],
                    'box_norm': [0.500, 0.444, 0.541, 0.518],
                    'notes': 'Metallic blade reflection confirmed under street sodium vapor lamp.'
                },
                {
                    'id': 'ENT-94-02',
                    'category': 'PERSON_OF_INTEREST',
                    'label': 'Suspect (Olive Green Jacket, Denim Jeans)',
                    'confidence': 0.954,
                    'threat': 'HIGH',
                    'time': '02:45:15.00',
                    'source': 'STREET_CAM_14',
                    'box': [410, 160, 500, 420],
                    'box_norm': [0.427, 0.296, 0.520, 0.777],
                    'notes': 'Aggressive forward stride, concealed right hand prior to draw.'
                }
            ],
            'acoustic_events': [
                {
                    'timestamp_sec': 5.20,
                    'event_type': 'TIRE_TRACTION_SCREECH',
                    'sensor_id': 'STREET_MIC_04',
                    'confidence': 0.895,
                    'peak_decibel_relative': -8.5,
                    'threat_level': 'MEDIUM',
                    'signature': 'High-frequency rubber friction transient'
                }
            ],
            'transcripts': [
                {
                    'timestamp_sec': 1.50,
                    'speaker': 'WITNESS_CALLER',
                    'text': 'There is a fight in the alley behind the diner! One of them just pulled out a knife!',
                    'threat_level': 'HIGH',
                    'entities_mentioned': ['fight', 'knife', 'alley'],
                    'credibility_score': 0.94
                },
                {
                    'timestamp_sec': 6.10,
                    'speaker': 'OFFICER_RADIO_114',
                    'text': 'Unit 114 arriving on scene. Gray hatchback speeding south onto Elm. Requesting pursuit authorization.',
                    'threat_level': 'HIGH',
                    'entities_mentioned': ['gray hatchback', 'Elm'],
                    'credibility_score': 0.99
                }
            ],
            'scene_layout_3d': {
                'dimensions': {'x': 30, 'y': 12, 'unit': 'meters'},
                'cameras': [
                    {'id': 'STREET_CAM_14', 'x': 2.0, 'y': 6.0, 'fov': 95, 'rotation': 0, 'status': 'ONLINE', 'label': 'Alley Overlook Pole'}
                ],
                'evidence_points': [
                    {'id': 'MARKER-10', 'x': 14.2, 'y': 6.1, 'type': 'BLOOD_DROPLET', 'label': 'Biological Blood Evidence Marker'},
                    {'id': 'MARKER-11', 'x': 22.5, 'y': 8.0, 'type': 'TIRE_MARK', 'label': 'Acceleration Skid Mark'}
                ],
                'suspect_vectors': [
                    {'suspect': 'Aggressor', 'path': [[4.0, 5.0], [12.0, 6.0], [24.0, 8.0]], 'color': '#eab308'}
                ]
            },
            'chat_history': [
                {
                    'role': 'assistant',
                    'text': 'CrimeVision AI loaded Case #2026-CV-9412. All multimodal surveillance feeds and 911 witness transcripts ready for analysis.',
                    'timestamp': '2026-10-31 03:00:00'
                }
            ]
        }
    ]

    return cases
