
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const WelcomePage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black" onClick={onEnter}>
            <div className="glass-panel p-12 text-center max-w-2xl">
                <h1 className="text-4xl text-white mb-4">InnovAi <span className="text-gold italic">Music</span></h1>
                <p className="text-stone-400 mb-8">Propuesta de Identidad Sonora Institucional ICPR Junior College.</p>
                <button onClick={onEnter} className="bg-white text-black py-4 px-8 rounded-xl flex items-center gap-2 mx-auto">
                    Ver Propuesta <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
