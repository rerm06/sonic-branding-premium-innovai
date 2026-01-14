
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('Fallo en la autenticación', { description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="glass-panel p-10 text-center">
        <h2 className="text-4xl text-white mb-8">INNOVA<span className="italic text-gold">i</span></h2>
        <button onClick={handleLogin} disabled={isLoading} className="bg-white text-black py-4 px-6 rounded-xl">
          {isLoading ? <Loader2 className="animate-spin" /> : 'CONTINUAR CON GOOGLE'}
        </button>
      </div>
    </div>
  );
};
