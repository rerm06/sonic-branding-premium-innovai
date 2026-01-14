
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { ModernSidebar } from './components/ModernSidebar';
import { PropuestaPage } from './components/PropuestaPage';
import { ConsultorAI } from './components/ConsultorAI';
import { CampaignAIStudio } from './components/CampaignAIStudio';
import { AdminDashboard } from './components/AdminDashboard';
import { MusicLab } from './components/MusicLab';
import { InnovationLab } from './components/InnovationLab';
import { AudioStudio } from './components/AudioStudio';
import { WelcomePage } from './components/WelcomePage';
import { OrchestratorLayout } from './modules/AICampaign/components/OrchestratorLayout';
import { AgentsLanding } from './components/AgentsHub/AgentsLanding';
import { AnimatePresence, motion } from 'framer-motion';
import { EliteLayout } from './components/layout/EliteLayout';
import { Auth } from './components/Auth';
import { ShieldCheck } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { EliteErrorFallback } from './components/common/EliteErrorFallback';
import { Toaster, toast } from 'sonner';
import './index.css';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState('welcome');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'regular'>('admin');
  const [sidebarWidth, setSidebarWidth] = useState(320);

  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 5000);

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          if (session) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            if (profile) setUserRole(profile.role as 'admin' | 'regular');
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (profile && mounted) setUserRole(profile.role as 'admin' | 'regular');
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-stone-800 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={EliteErrorFallback}
      onReset={() => { window.location.reload(); }}
    >
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(12, 12, 12, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#E5E4E2',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <EliteLayout>
        <ModernSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          session={session}
          role={userRole}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
        />
        <main className="flex-1 overflow-y-auto relative no-scrollbar perspective-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full transform-3d"
            >
              {activeTab === 'welcome' && <WelcomePage onEnter={() => setActiveTab('propuesta')} />}
              {activeTab === 'propuesta' && <PropuestaPage />}
              {(activeTab === 'consultor' && userRole === 'admin') && <ConsultorAI role={userRole} session={session} />}
              {(activeTab === 'inicio' && userRole === 'admin') && <CampaignAIStudio session={session} />}
              {(activeTab === 'factura' && userRole === 'admin') && <AdminDashboard session={session} />}
              {(activeTab === 'licencia' && userRole === 'admin') && <MusicLab role={userRole} session={session} />}
              {(activeTab === 'lab' && userRole === 'admin') && <InnovationLab session={session} />}
              {(activeTab === 'studio' && userRole === 'admin') && <AudioStudio />}
              {(activeTab === 'sonic-sync' && userRole === 'admin') && <OrchestratorLayout />}
              {(activeTab === 'agents' && userRole === 'admin') && <AgentsLanding session={session} />}
              {(userRole === 'regular' && ['consultor', 'inicio', 'factura', 'licencia', 'lab', 'studio', 'sonic-sync'].includes(activeTab)) && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center relative bg-black/20 backdrop-blur-md">
                    <ShieldCheck className="text-gold animate-pulse" size={32} />
                  </div>
                  <h3 className="font-display text-white text-lg tracking-widest uppercase">Acceso Restringido</h3>
                  <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-stone-600">Este módulo requiere credenciales de nivel Ejecutivo / Admin</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </EliteLayout>
    </ErrorBoundary>
  );
};

export default App;
