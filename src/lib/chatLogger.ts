
import { supabase } from './supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ChatInteraction {
    user_id: string;
    user_email?: string;
    agent_type: 'consultor' | 'live_expert' | 'lab';
    transcript: string;
    audio_url?: string;
    sentiment_score?: number;
    sentiment_label?: string;
}

export const logChatInteraction = async (interaction: ChatInteraction) => {
    try {
        let sentiment = { score: 0.5, label: 'neutral' };
        if (interaction.transcript.length > 20) {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `Analiza el sentimiento de esta conversación entre un usuario y un consultor de ICPR. 
            Devuelve JSON con score (0 a 1) y label (positive, neutral, negative).
            Conversación: ${interaction.transcript}`;

            const result = await model.generateContent(prompt);
            try {
                const text = result.response.text();
                const jsonStr = text.replace(/```json|```/g, '').trim();
                sentiment = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Sentiment Analysis failed, using defaults");
            }
        }

        const { data, error } = await supabase.from('ai_chat_interactions').insert({
            user_id: interaction.user_id,
            user_email: interaction.user_email || 'guest',
            agent_type: interaction.agent_type,
            transcript: interaction.transcript,
            audio_url: interaction.audio_url,
            sentiment_score: sentiment.score,
            sentiment_label: sentiment.label
        });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Error logging chat interaction:", err);
    }
};

export const uploadInteractionAudio = async (blob: Blob, fileName: string) => {
    try {
        const { data, error } = await supabase.storage
            .from('interaction-audio')
            .upload(fileName, blob, { contentType: 'audio/wav' });

        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage
            .from('interaction-audio')
            .getPublicUrl(fileName);
        return publicUrl;
    } catch (err) {
        console.error("Error uploading audio:", err);
        return null;
    }
};
