import React from 'react';
import { useCampaignEngine } from '../hooks/useCampaignEngine';
import { ForensicUploader } from './ForensicUploader';
import { StoryboardDirector } from './StoryboardDirector';
import { ProductionMonitor } from './ProductionMonitor';
import { motion, AnimatePresence } from 'framer-motion';

export const OrchestratorLayout: React.FC = () => {
    const { state, startForensicAnalysis, updateSceneImage, approveAllScenes } = useCampaignEngine();

    const renderPhase = () => {
        switch (state.currentPhase) {
            case 'draft':
            case 'analyzing':
                return <ForensicUploader onUpload={startForensicAnalysis} isLoading={state.isLoading} />;
            case 'storyboarding':
            case 'generating_images':
            case 'reviewing':
                return (
                    <StoryboardDirector
                        scenes={state.scenes}
                        onUpdateScene={updateSceneImage}
                        onApproveAll={approveAllScenes}
                        isGenerating={state.currentPhase === 'generating_images'}
                    />
                );
            case 'production':
            case 'completed':
                return <ProductionMonitor scenes={state.scenes} />;
            default:
                return <div>Unknown state</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-stone-200 p-8 font-sans">
            <header className="mb-12 flex justify-between items-end border-b border-stone-800 pb-6">
                <div>
                    <h1 className="text-4xl font-display tracking-tighter text-white mb-2 uppercase italic">
                        Sonic<span className="text-gold">Sync</span> Campaign
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500">
                        Director Creativo AI / Orquestación de Video
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    {state.campaign && (
                        <div className="px-4 py-2 bg-stone-900 border border-stone-800 rounded-sm">
                            <span className="text-[10px] text-stone-500 block leading-none mb-1">CAMPAIGN ID</span>
                            <span className="text-xs font-mono text-gold leading-none">{state.campaign.id.split('-')[0]}...</span>
                        </div>
                    )}
                    <div className="px-4 py-2 bg-stone-900 border border-stone-800 rounded-sm">
                        <span className="text-[10px] text-stone-500 block leading-none mb-1">STATUS</span>
                        <span className="text-xs font-bold uppercase text-white leading-none">{state.currentPhase}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state.currentPhase}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {renderPhase()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {state.error && (
                <div className="fixed bottom-8 right-8 bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-sm backdrop-blur-xl">
                    <p className="text-xs font-bold uppercase tracking-widest">{state.error}</p>
                </div>
            )}
        </div>
    );
};
