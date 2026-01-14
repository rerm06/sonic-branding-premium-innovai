import React, { useState } from 'react';
import { CampaignScene } from '../types';
import { RefreshCw, Edit3, Upload, Image as ImageIcon, Check } from 'lucide-react';

interface SceneCardProps {
    scene: CampaignScene;
    onUpdate: (type: 'start' | 'end', url: string) => void;
    isGenerating: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onUpdate, isGenerating }) => {
    const Slot = ({ type, url, prompt }: { type: 'start' | 'end', url: string | null, prompt: string }) => (
        <div className="relative aspect-video bg-stone-900 border border-stone-800 group overflow-hidden">
            {url ? (
                <>
                    <img src={url} alt={type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-[10px] text-stone-400 uppercase tracking-tighter mb-4 line-clamp-2 italic">"{prompt}"</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdate(type, `https://picsum.photos/seed/${Math.random()}/1024/576`)}
                                className="p-2 bg-stone-800 text-gold hover:bg-gold hover:text-stone-950 transition-colors"
                                title="Regenerar"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <button className="p-2 bg-stone-800 text-white hover:bg-stone-700 transition-colors" title="Editar Prompt">
                                <Edit3 size={14} />
                            </button>
                            <button className="p-2 bg-stone-800 text-white hover:bg-stone-700 transition-colors" title="Subir Manual">
                                <Upload size={14} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="text-stone-800 animate-spin" size={24} />
                    <span className="text-[10px] text-stone-700 uppercase tracking-widest font-bold">Generando Cimiento...</span>
                </div>
            )}
            <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 border border-stone-800 rounded-sm">
                <span className="text-[9px] font-bold text-gold uppercase tracking-[0.2em]">{type === 'start' ? 'Inicio' : 'Fin'}</span>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr,80px,1fr] items-center gap-4 bg-stone-900/20 p-4 border border-stone-800/50 hover:border-stone-700/50 transition-colors">
            <Slot type="start" url={scene.image_start_url} prompt={scene.prompt_start_text} />

            <div className="flex flex-col items-center justify-center space-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-[1px] bg-stone-800" />
                <span className="text-[10px] font-mono text-stone-600 uppercase">A</span>
                <div className="w-8 h-[1px] bg-stone-800" />
                <span className="text-[10px] font-mono text-stone-600 uppercase">B</span>
            </div>

            <Slot type="end" url={scene.image_end_url} prompt={scene.prompt_end_text} />

            <div className="col-span-full mt-4 flex justify-between items-center border-t border-stone-800/50 pt-4">
                <div className="flex items-center gap-6">
                    <div className="space-y-1">
                        <span className="text-[9px] text-stone-600 uppercase block leading-none">Time Range</span>
                        <span className="text-xs font-mono text-gold leading-none">
                            {scene.time_start.toFixed(1)}s — {(scene.time_start + scene.duration).toFixed(1)}s
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-stone-600 uppercase block leading-none">Clip Duration</span>
                        <span className="text-xs font-mono text-white leading-none">{scene.duration.toFixed(1)}s</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {scene.status === 'approved' && (
                        <div className="flex items-center gap-2 text-green-500">
                            <Check size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Validado</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
