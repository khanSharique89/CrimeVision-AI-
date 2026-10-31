export type ThreatLevel = 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'EXTREME' | 'EVIDENCE';

export type ModalityType = 'VISUAL' | 'ACOUSTIC' | 'AUDIO_TRANSCRIPT' | 'PHYSICAL_BALLISTICS';

export interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  type: 'IMAGE_JPEG' | 'VIDEO_MP4' | 'AUDIO_WAV' | string;
  file_name: string;
  file_url: string;
  sha256: string;
  file_size_mb: number;
  verified: boolean;
  description: string;
}

export interface DetectedEntity {
  id: string;
  category: 'WEAPON' | 'PERSON_OF_INTEREST' | 'VEHICLE' | 'BALLISTICS' | 'CONCEALMENT' | 'BIOLOGICAL' | string;
  label: string;
  confidence: number;
  threat: ThreatLevel;
  time: string;
  source: string;
  box: [number, number, number, number];
  box_norm: [number, number, number, number];
  notes?: string;
}

export interface AcousticEvent {
  timestamp_sec: number;
  event_type: string;
  sensor_id: string;
  confidence: number;
  peak_decibel_relative: number;
  threat_level: ThreatLevel;
  signature: string;
}

export interface TranscriptEntry {
  timestamp_sec: number;
  speaker: string;
  text: string;
  threat_level: ThreatLevel;
  entities_mentioned: string[];
  credibility_score: number;
}

export interface TimelineEvent {
  id: string;
  timestamp_sec: number;
  wall_clock: string;
  modality: ModalityType;
  source: string;
  title: string;
  description: string;
  threat_level: ThreatLevel;
  entities: string[];
  confidence: number;
  corroboration: 'TRIPLE_VERIFIED' | 'DUAL_VERIFIED' | 'SINGLE_MODALITY' | 'PENDING';
  corroboration_score: number;
  corroboration_notes?: string;
  exhibits?: string[];
}

export interface Camera3D {
  id: string;
  x: number;
  y: number;
  fov: number;
  rotation: number;
  status: string;
  label: string;
}

export interface EvidenceMarker3D {
  id: string;
  x: number;
  y: number;
  type: string;
  label: string;
}

export interface SuspectVector3D {
  suspect: string;
  path: [number, number][];
  color: string;
}

export interface SceneLayout3D {
  dimensions: { x: number; y: number; unit: string };
  cameras: Camera3D[];
  evidence_points: EvidenceMarker3D[];
  suspect_vectors: SuspectVector3D[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  model?: string;
  timestamp?: string;
}

export interface ForensicCase {
  id: string;
  title: string;
  incident_date: string;
  jurisdiction: string;
  lead_investigator: string;
  threat_level: ThreatLevel;
  status: string;
  master_hash: string;
  corroboration_index: string;
  location: {
    name: string;
    lat?: number;
    lng?: number;
    floor?: string;
  };
  synopsis: string;
  evidence_items: EvidenceItem[];
  detected_entities: DetectedEntity[];
  acoustic_events: AcousticEvent[];
  transcripts: TranscriptEntry[];
  timeline_events: TimelineEvent[];
  scene_layout_3d: SceneLayout3D;
  chat_history: ChatMessage[];
  fusion_meta?: {
    corroboration_index: number;
    triple_verified_count: number;
    dual_verified_count: number;
    discrepancies: any[];
    summary: string;
  };
}

