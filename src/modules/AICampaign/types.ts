
export type CampaignStatus =
    | 'draft'
    | 'analyzing'
    | 'storyboarding'
    | 'generating_images'
    | 'reviewing'
    | 'production'
    | 'completed';

export type SceneStatus =
    | 'pending_images'
    | 'images_ready'
    | 'approved'
    | 'processing_video'
    | 'completed';

export interface AudioMetadata {
    duration: number;
    bpm: number;
    beats_map: number[];
}

export interface GlobalStyleContext {
    palette: string[];
    lighting: string;
    vibe: string;
    additional_hints: string;
}

export interface Asset {
    id: string;
    name?: string;
    title?: string;
    type: string;
    url: string;
    metadata?: any;
    coverUrl?: string;
}

export interface AICampaign {
    id: string;
    user_id: string;
    status: CampaignStatus;
    global_style_context: GlobalStyleContext;
    audio_metadata: AudioMetadata;
    created_at: string;
    updated_at: string;
}

export interface CampaignScene {
    id: string;
    campaign_id: string;
    sequence_order: number;
    time_start: number;
    duration: number;
    prompt_start_text: string;
    prompt_end_text: string;
    image_start_url: string | null;
    image_end_url: string | null;
    video_clip_url: string | null;
    status: SceneStatus;
}

export interface OrchestratorState {
    campaign: AICampaign | null;
    scenes: CampaignScene[];
    currentPhase: CampaignStatus;
    isLoading: boolean;
    error: string | null;
}
