import { useState, useCallback } from 'react';
import {
    AICampaign,
    CampaignScene,
    OrchestratorState,
    AudioMetadata,
    GlobalStyleContext
} from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useCampaignEngine = () => {
    const [state, setState] = useState<OrchestratorState>({
        campaign: null,
        scenes: [],
        currentPhase: 'draft',
        isLoading: false,
        error: null,
    });

    const startForensicAnalysis = useCallback(async (audioFile: File, referenceImages: File[]) => {
        setState(prev => ({ ...prev, isLoading: true, currentPhase: 'analyzing' }));

        try {
            const audioMetadata: AudioMetadata = {
                duration: 24.5,
                bpm: 120,
                beats_map: [0, 0.5, 1.0, 1.5, 2.0]
            };

            const styleContext: GlobalStyleContext = {
                palette: ['#000000', '#FFD700', '#1A1A1A'],
                lighting: 'Cinematic, high contrast',
                vibe: 'Cyberpunk, elegant, rhythmic',
                additional_hints: 'Neon highlights, golden accents'
            };

            const newCampaign: AICampaign = {
                id: uuidv4(),
                user_id: 'user_123',
                status: 'analyzing',
                global_style_context: styleContext,
                audio_metadata: audioMetadata,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setState(prev => ({ ...prev, campaign: newCampaign }));
            await generateStoryboard(newCampaign);

        } catch (error) {
            setState(prev => ({ ...prev, error: 'Failed to analyze assets', isLoading: false }));
        }
    }, []);

    const generateStoryboard = async (campaign: AICampaign) => {
        setState(prev => ({ ...prev, currentPhase: 'storyboarding' }));

        const T = campaign.audio_metadata.duration;
        const N = Math.ceil(T / 8);

        const newScenes: CampaignScene[] = Array.from({ length: N }).map((_, i) => ({
            id: uuidv4(),
            campaign_id: campaign.id,
            sequence_order: i,
            time_start: i * 8,
            duration: Math.min(8, T - (i * 8)),
            prompt_start_text: `Scene ${i + 1} starting evolution...`,
            prompt_end_text: `Scene ${i + 1} ending evolution...`,
            image_start_url: null,
            image_end_url: null,
            video_clip_url: null,
            status: 'pending_images',
        }));

        setState(prev => ({
            ...prev,
            scenes: newScenes,
            currentPhase: 'generating_images',
            isLoading: false
        }));

        await generateInitialImages(newScenes, campaign.global_style_context);
    };

    const generateInitialImages = async (scenes: CampaignScene[], style: GlobalStyleContext) => {
        const updatedScenes = await Promise.all(scenes.map(async (scene) => {
            return {
                ...scene,
                image_start_url: `https://picsum.photos/seed/${scene.id}-start/1024/576`,
                image_end_url: `https://picsum.photos/seed/${scene.id}-end/1024/576`,
                status: 'images_ready' as const
            };
        }));

        setState(prev => ({
            ...prev,
            scenes: updatedScenes,
            currentPhase: 'reviewing'
        }));
    };

    const updateSceneImage = (sceneId: string, type: 'start' | 'end', url: string) => {
        setState(prev => ({
            ...prev,
            scenes: prev.scenes.map(s => s.id === sceneId ? {
                ...s,
                [type === 'start' ? 'image_start_url' : 'image_end_url']: url,
                status: 'images_ready'
            } : s)
        }));
    };

    const approveAllScenes = () => {
        const allReady = state.scenes.every(s => s.image_start_url && s.image_end_url);
        if (!allReady) return;

        setState(prev => ({
            ...prev,
            scenes: prev.scenes.map(s => ({ ...s, status: 'approved' })),
            currentPhase: 'production'
        }));

        startVideoProduction();
    };

    const startVideoProduction = async () => {
        console.log('Starting parallel video production...');
    };

    return {
        state,
        startForensicAnalysis,
        updateSceneImage,
        approveAllScenes
    };
};
