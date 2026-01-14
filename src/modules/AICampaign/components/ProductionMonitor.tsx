import React, { useEffect, useState } from 'react';
import { CampaignScene } from '../types';
import { Play, Loader2, CheckCircle2 } from 'lucide-react';

interface ProductionMonitorProps {
    scenes: CampaignScene[];
}

export const ProductionMonitor: React.FC<ProductionMonitorProps> = ({ scenes }) => {
    const [progress, setProgress] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        scenes.forEach((scene) => {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const current = prev[scene.id] || 0;
                    if (current >= 100) {
                        clearInterval(interval);
                        return prev;
                    }
                    return { ...prev, [scene.id]: current + Math.random() * 10 };
                });
            }, 500 + Math.random() * 1000);
        });
    }, [scenes]);

    const totalProgress = Object.values(progress).reduce((a, b) => a + b, 0) / (scenes.length || 1);

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-display italic tracking-tighter text-white uppercase">Renderizando Campaña</h2>
                <div className="flex justify-center items-center gap-4">
                    <div className="h-1 flex-1 max-w-md bg-stone-900 overflow-hidden rounded-full">
                        <div
                            className="h-full bg-gold transition-all duration-500"
                            style={{ width: `${totalProgress}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-gold">{totalProgress.toFixed(0)}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenes.map((scene, idx) => (
                    <div key={scene.id} className="bg-stone-900 border border-stone-800 p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] text-stone-500 uppercase font-bold tracking-widest">Clip {idx + 1}</span>
                                <p className="text-xs font-mono text-stone-400">{scene.time_start.toFixed(1)}s</p>
                            </div>
                            {progress[scene.id] >= 100 ? (
                                <CheckCircle2 size={16} className="text-green-500" />
                            ) : (
                                <Loader2 size={16} className="text-gold animate-spin" />
                            )}
                        </div>

                        <div className="relative aspect-video bg-black overflow-hidden group">
                            {progress[scene.id] >= 100 ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Play size={32} className="text-white opacity-40 group-hover:scale-125 transition-transform" />
                                    <div className="absolute inset-0 bg-gold/10 pointer-events-none" />
                                </div>
                            ) : (
                                <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center">
                                    <span className="text-[32px] font-display text-stone-900 select-none">{(idx + 1).toString().padStart(2, '0')}</span>
                                </div>
                            )}
                            <div
                                className="absolute bottom-0 left-0 h-[2px] bg-gold transition-all duration-300"
                                style={{ width: `${progress[scene.id] || 0}%` }}
                            />
                        </div>

                        <p className="text-[9px] text-stone-500 uppercase tracking-widest text-center truncate italic">
                            Interpolating image_start to image_end...
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
