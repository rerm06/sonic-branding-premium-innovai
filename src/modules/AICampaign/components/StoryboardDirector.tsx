import React from 'react';
import { CampaignScene } from '../types';
import { SceneCard } from './SceneCard';
import { CheckCircle2 } from 'lucide-react';

interface StoryboardDirectorProps {
    scenes: CampaignScene[];
    onUpdateScene: (id: string, type: 'start' | 'end', url: string) => void;
    onApproveAll: () => void;
    isGenerating: boolean;
}

export const StoryboardDirector: React.FC<StoryboardDirectorProps> = ({
    scenes,
    onUpdateScene,
    onApproveAll,
    isGenerating
}) => {
    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center bg-stone-900/50 border border-stone-800 p-6 rounded-sm backdrop-blur-md">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Mesa de Luz del Director</h2>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest">Validación de Activos Visuales (HITL)</p>
                </div>

                <button
                    onClick={onApproveAll}
                    disabled={isGenerating}
                    className="flex items-center gap-3 px-8 py-3 bg-gold text-stone-950 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-50"
                >
                    <CheckCircle2 size={16} />
                    <span>Aprobar Todo y Renderizar</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {scenes.map((scene, idx) => (
                    <div key={scene.id} className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col items-center">
                            <span className="text-stone-800 font-mono text-4xl block mt-4 select-none">{(idx + 1).toString().padStart(2, '0')}</span>
                            <div className="flex-1 w-[1px] bg-stone-800 my-4" />
                        </div>
                        <SceneCard
                            scene={scene}
                            onUpdate={(type, url) => onUpdateScene(scene.id, type, url)}
                            isGenerating={isGenerating}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
