import React, { useState } from 'react';
import { Upload, Music, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ForensicUploaderProps {
    onUpload: (audio: File, images: File[]) => void;
    isLoading: boolean;
}

export const ForensicUploader: React.FC<ForensicUploaderProps> = ({ onUpload, isLoading }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const handleProcess = () => {
        if (audioFile && imageFiles.length > 0) {
            onUpload(audioFile, imageFiles);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative border-2 border-dashed border-stone-800 bg-stone-900/30 p-12 rounded-sm hover:border-gold/30 transition-all cursor-pointer">
                    <input
                        type="file"
                        accept="audio/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    />
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Music className={audioFile ? "text-gold" : "text-stone-500"} size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-white">Audio Ingest</p>
                            <p className="text-[10px] text-stone-500 uppercase mt-1">.mp3 / .wav (Max 60MB)</p>
                        </div>
                        {audioFile && (
                            <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-1 rounded-sm uppercase tracking-tighter">
                                {audioFile.name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="group relative border-2 border-dashed border-stone-800 bg-stone-900/30 p-12 rounded-sm hover:border-gold/30 transition-all cursor-pointer">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                    />
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImageIcon className={imageFiles.length > 0 ? "text-gold" : "text-stone-500"} size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-white">Visual Vibe Roots</p>
                            <p className="text-[10px] text-stone-500 uppercase mt-1">Subir assets de referencia</p>
                        </div>
                        {imageFiles.length > 0 && (
                            <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-1 rounded-sm uppercase tracking-tighter">
                                {imageFiles.length} Assets cargados
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleProcess}
                    disabled={isLoading || !audioFile || imageFiles.length === 0}
                    className="group relative px-12 py-4 bg-stone-100 text-stone-950 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-colors disabled:opacity-20 disabled:cursor-not-allowed overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Ejecutando Análisis Forense...</span>
                        </div>
                    ) : (
                        <span>Iniciar Orquestación</span>
                    )}
                </button>
            </div>
        </div>
    );
};
