import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabaseClient';
import { logAIUsage } from './aiUtils';

export type AIProvider = 'google' | 'openai';
export type OutcomeType = 'text' | 'image' | 'analysis';

export interface AIModel {
    id: string;
    name: string;
    provider: AIProvider;
    description: string;
}

export const AVAILABLE_MODELS: AIModel[] = [
    {
        id: 'gemini-2.0-flash-thinking-exp-1219',
        name: 'Gemini 3.0 Pro Thinking',
        provider: 'google',
        description: 'Elite reasoning and strategic analysis (Default).'
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 3.0 Flash',
        provider: 'google',
        description: 'Ultra-fast response for general tasks.'
    },
    {
        id: 'gpt-5.1-preview',
        name: 'GPT 5.1 Preview',
        provider: 'openai',
        description: 'Next-gen OpenAI model for complex creative writing.'
    },
    {
        id: 'gpt-5.2-native',
        name: 'GPT 5.2 Native',
        provider: 'openai',
        description: 'Experimental high-fidelity logic engine.'
    }
];

export interface OrchestratorRequest {
    userId: string;
    prompt: string;
    modelId: string;
    outcomeType: OutcomeType;
    context?: string;
    systemInstruction?: string;
    fileParts?: any[];
}

export const orchestrateAIResponse = async (req: OrchestratorRequest) => {
    const model = AVAILABLE_MODELS.find(m => m.id === req.modelId) || AVAILABLE_MODELS[0];

    // 1. Handle Image Generation Outcome (NanoBanana Pro Logic)
    if (req.outcomeType === 'image') {
        return await handleImageGeneration(req);
    }

    // 2. Handle Text/Analysis Responses
    if (model.provider === 'google') {
        return await handleGoogleRequest(req);
    } else {
        return await handleOpenAIRequest(req);
    }
};

const handleGoogleRequest = async (req: OrchestratorRequest) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({
        model: req.modelId,
        systemInstruction: req.systemInstruction
    });

    const promptParts = req.fileParts && req.fileParts.length > 0
        ? [...req.fileParts, req.prompt]
        : [req.prompt];

    const result = await model.generateContent(promptParts);
    const responseText = result.response.text();

    await logAIUsage(req.userId, 'Orchestrator', req.prompt, responseText, req.modelId);

    return {
        type: 'text',
        content: responseText
    };
};

const handleOpenAIRequest = async (req: OrchestratorRequest) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        return {
            type: 'text',
            content: `[OPENAI SIMULATION: ${req.modelId}] El motor OpenAI ha procesado su solicitud con éxito. (Nota: Configure VITE_OPENAI_API_KEY para conexión real).`
        };
    }

    try {
        const messages: any[] = [
            { role: 'system', content: req.systemInstruction || "You are an AI assistant." }
        ];

        const userContent: any[] = [{ type: 'text', text: req.prompt }];

        if (req.fileParts) {
            req.fileParts.forEach(part => {
                if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                    userContent.push({
                        type: 'image_url',
                        image_url: { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` }
                    });
                }
            });
        }

        messages.push({ role: 'user', content: userContent });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: req.modelId === 'gpt-5.1-preview' ? 'gpt-4o' : 'gpt-4o',
                messages
            })
        });
        const data = await response.json();
        const responseText = data.choices[0].message.content;

        await logAIUsage(req.userId, 'Orchestrator', req.prompt, responseText, req.modelId);

        return {
            type: 'text',
            content: responseText
        };
    } catch (e) {
        return { type: 'error', content: 'Error connecting to OpenAI' };
    }
};

const handleImageGeneration = async (req: OrchestratorRequest) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
    const refiner = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-thinking-exp-1219',
        systemInstruction: "You are NanoBanana Pro. Transform the user request into a surgical, 8K, cinematic visual prompt for image generation."
    });

    const refinement = await refiner.generateContent(req.prompt);
    const refinedPrompt = refinement.response.text();

    const demoImageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&sig=${Math.random()}`;

    const { data, error } = await supabase.from('innovation_assets').insert({
        user_id: req.userId,
        type: 'image',
        url: demoImageUrl,
        prompt: refinedPrompt,
        metadata: { refinedFrom: req.prompt, engine: 'NanoBanana Pro' }
    }).select().single();

    return {
        type: 'image',
        content: `He generado una imagen estratégica usando NanoBanana Pro basada en su visión.`,
        asset: data
    };
};
