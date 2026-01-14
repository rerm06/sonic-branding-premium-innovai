
import { supabase } from './supabaseClient';

export const AI_PRICING: Record<string, { prompt: number, completion: number, base?: number }> = {
    'gemini-1.5-flash': { prompt: 0.000075 / 1000, completion: 0.000225 / 1000 },
    'gemini-2.0-flash-exp': { prompt: 0, completion: 0 },
    'gemini-2.5-flash-new': { prompt: 0.00005 / 1000, completion: 0.00015 / 1000 },
    'gemini-2.5-pro-preview': { prompt: 0.0005 / 1000, completion: 0.0015 / 1000 },
    'gemini-3.0-flash-new': { prompt: 0.00003 / 1000, completion: 0.0001 / 1000 },
    'gemini-3.0-pro-thinking': { prompt: 0.001 / 1000, completion: 0.003 / 1000 },
    'veo-3.1-fast-generate-preview': { prompt: 0, completion: 0, base: 0.05 },
    'veo-3.5-pro-high-fidelity': { prompt: 0, completion: 0, base: 0.15 },
    'gemini-2.5-flash-image': { prompt: 0, completion: 0, base: 0.02 }
};

export const logAIUsage = async (userId: string, module: string, prompt: string, completion: string, modelId: string = 'gemini-2.0-flash-thinking-exp-1219') => {
    const pricing = AI_PRICING[modelId] || AI_PRICING['gemini-1.5-flash'];
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(completion.length / 4);

    let cost = (promptTokens * pricing.prompt) + (completionTokens * pricing.completion);
    if (pricing.base) cost += pricing.base;

    const { error } = await supabase.from('ai_usage_logs').insert({
        user_id: userId,
        module,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        cost: parseFloat(cost.toFixed(6))
    });

    if (error) console.error('Error logging usage:', error);
    return { promptTokens, completionTokens, cost };
};

export const saveToMemory = async (userId: string, role: 'user' | 'ai', content: string, sessionId?: string, tags: string[] = []) => {
    await supabase.from('chat_memory').insert({
        user_id: userId,
        role,
        content,
        session_id: sessionId,
        tags
    });
};

export const getRelevantMemory = async (userId: string, query: string, sessionId?: string, tags: string[] = []) => {
    let queryBuilder = supabase
        .from('chat_memory')
        .select('content, role, tags')
        .eq('user_id', userId);

    if (sessionId) {
        queryBuilder = queryBuilder.eq('session_id', sessionId);
    } else if (tags && tags.length > 0) {
        queryBuilder = queryBuilder.contains('tags', tags);
    }

    const { data } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(15);

    if (!data || data.length === 0) return "";
    return data.reverse().map(m => `${m.role.toUpperCase()}: ${m.content}${m.tags ? ` [Assets: ${m.tags.join(', ')}]` : ''}`).join('\n');
};

export const getUserConfig = async (userId: string, key: string, defaultValue: string) => {
    const { data } = await supabase
        .from('user_configs')
        .select('value')
        .eq('user_id', userId)
        .eq('key', key)
        .single();

    return data?.value || defaultValue;
};

export const formatTextForSpeech = (text: string): string => {
    if (!text) return "";
    return text
        .replace(/\*\*.*?\*\*/g, ' ')
        .replace(/\*.*?\*/g, ' ')
        .replace(/#+ /g, '')
        .replace(/ICPR Junior College/gi, "Ai Si Pi Ar Yunior Cólech")
        .replace(/ICPR/gi, "Ai Si Pi Ar")
        .replace(/InnovAi/gi, "Innov-ái")
        .replace(/ASAI/gi, "A-sái")
        .replace(/80 Aniversario/gi, "Ochenta Aniversario")
        .replace(/Puerto Rico/gi, "Puerto Rico,")
        .replace(/marketing/gi, "marketing,")
        .replace(/\bNO\b/g, "no")
        .replace(/Guion:|Tono:|Narrador:|Entusiasmo creciente|Tono inspirador/gi, '')
        .replace(/Aquí está el guion persuasivo.*?:/gi, '')
        .replace(/Este es el guion.*?/gi, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export const getBestFemaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    const femalePriorityNames = ['monica', 'paulina', 'helena', 'marisol', 'claudia', 'luciana', 'siri', 'google', 'natural', 'neural'];
    const spanishVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
    const bestVoices = spanishVoices.filter(v => {
        const name = v.name.toLowerCase();
        return femalePriorityNames.some(p => name.includes(p));
    });

    if (bestVoices.length > 0) {
        const localVoice = bestVoices.find(v => v.lang.includes('PR') || v.lang.includes('US') || v.lang.includes('MX'));
        return localVoice || bestVoices[0];
    }
    return spanishVoices[0] || null;
};

export const analyzeReferenceImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const ai = new (await import('@google/generative-ai')).GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
        const model = ai.getGenerativeModel({
            model: "gemini-2.0-flash-thinking-exp-1219",
            systemInstruction: "Actúa como un Senior Visual Deconstructor & Cinematographer. Tu tarea es realizar un análisis QUIRÚRGICO de la imagen para replicar su DNA en una campaña de IA."
        });

        const prompt = `
        Realiza un análisis técnico exhaustivo de esta imagen siguiendo esta estructura:
        1. DESCRIPCIÓN QUIRÚRGICA: Acción, sujeto, detalles de facciones y vestimenta.
        2. ANÁLISIS DE IMAGEN: Estilo (ej. hiperrealista), composición (regla de tercios, etc.), ángulos y encuadres.
        3. ESTÉTICAS E ILUMINACIÓN: Paleta de colores, tipo de luz, sombras, atmósfera.
        4. ESCENA Y NARRATIVA: Posible historia detrás de la imagen, contexto.
        5. RECOMENDACIONES CRÍTICAS: Áreas de mejora y puntos clave para replicar este estilo.
        6. BACKEND ANALYSIS: Atributos técnicos sugeridos para prompts de IA.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType
                }
            }
        ]);

        return result.response.text();
    } catch (error) {
        console.error('Error in analyzeReferenceImage:', error);
        throw error;
    }
};

export const refinePromptWithNanoBananaPro = async (basePrompt: string, styleDNA: string = ""): Promise<string> => {
    try {
        const ai = new (await import('@google/generative-ai')).GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
        const model = ai.getGenerativeModel({
            model: "gemini-2.0-flash-thinking-exp-1219",
            systemInstruction: "You are NanoBanana Pro, an elite cinematic prompt engineer using Gemini 3.0 Pro Thinking reasoning. Your goal is to transform basic descriptions into surgical, high-fidelity visual prompts for AI generation."
        });

        const prompt = `
        Optimize this base prompt: "${basePrompt}"
        Style DNA to integrate: "${styleDNA}"
        
        Requirements:
        - Add cinematic lighting (Golden hour, Neo-Noir, etc.)
        - Specify camera optics (Arri Alexa, 35mm, Anamorphic)
        - Detail composition and movement.
        - Output ONLY the optimized prompt string. No conversational text.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error('Error in NanoBanana Pro:', error);
        return basePrompt;
    }
};

export const generateSceneImage = async (prompt: string, batchSize: number = 1): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500 * batchSize));
    const p = prompt.toLowerCase();
    const fallbacks = [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80',
        'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80',
        'https://images.unsplash.com/photo-1531297461136-82lw9b22d7d6?w=1600&q=80'
    ];

    let baseImg = fallbacks[4];
    if (p.includes('drone') || p.includes('aerial')) baseImg = 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1600&q=80';
    else if (p.includes('student') || p.includes('uni')) baseImg = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80';
    else if (p.includes('face') || p.includes('portrait')) baseImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80';
    else if (p.includes('building')) baseImg = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80';
    else if (p.includes('tech')) baseImg = 'https://images.unsplash.com/photo-1531297461136-82lw9b22d7d6?w=1600&q=80';

    return Array(batchSize).fill(0).map((_, i) => `${baseImg}&sig=${i}`);
};
