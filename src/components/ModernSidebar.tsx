
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import {
  FileText, MessageSquare, ShieldCheck,
  Layout, Music, LogOut, Sparkles, Mic, Play, Bot,
  ChevronLeft, ChevronRight, Menu, Wand2, Mail
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: Session | null;
  role: 'admin' | 'regular';
  width?: number;
  onWidthChange?: (width: number) => void;
}

export const ModernSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, session, role, width = 320, onWidthChange }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const user = session?.user;
  const fullName = user?.user_metadata?.full_name || 'InnovAi User';
  const email = user?.email || 'No email provided';

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { id: 'welcome', label: 'Bienvenida', icon: Layout },
    { id: 'propuesta', label: 'Propuesta 2026', icon: FileText },
    { id: 'consultor', label: 'Consultor AI', icon: MessageSquare },
    { id: 'licencia', label: 'Music Lab', icon: Music },
    { id: 'inicio', label: 'Campaign Studio', icon: Wand2 },
    { id: 'studio', label: 'Audio Studio', icon: Mic },
    { id: 'lab', label: 'Innovation Lab', icon: Sparkles },
    { id: 'factura', label: 'Admin Panel', icon: ShieldCheck },
    { id: 'agents', label: 'Agents Hub', icon: Bot },
    { id: 'sonic-sync', label: 'Sonic-Sync', icon: Play },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (role === 'admin') return true;
    const adminOnlyTabs = ['consultor', 'licencia', 'inicio', 'lab', 'factura', 'studio', 'sonic-sync', 'agents'];
    return !adminOnlyTabs.includes(item.id);
  });

  return (
    <aside
      style={{ width: isCollapsed ? '80px' : `${width}px` }}
      className="bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-700"
    >
      <div className="flex items-center h-28 px-8 border-b border-white/5">
        {!isCollapsed && (
          <span className="font-display font-medium text-2xl text-white">
            INNOVA<span className="text-gold italic">i</span>
          </span>
        )}
        <button onClick={toggleSidebar} className="ml-auto text-stone-600 hover:text-gold">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-10">
        <ul className="space-y-1 px-4">
          {filteredNavItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-4 rounded-xl transition-all ${activeTab === item.id ? 'text-white' : 'text-stone-500'}`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-gold' : 'text-stone-600'} />
                {!isCollapsed && <span className="ml-5 text-[11px] font-bold uppercase">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
