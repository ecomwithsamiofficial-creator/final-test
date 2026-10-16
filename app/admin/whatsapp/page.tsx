'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Camera,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  Pin,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Settings2,
  X,
  Volume2,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

// Preset avatar choices
const PRESET_AVATARS = [
  { id: 'default', label: 'Default Gray Avatar', type: 'svg' },
  { id: 'boy_car', label: 'Boy with Car', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'boy_blazer', label: 'Boy in Blazer (Formal)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'boy_wings', label: 'Boy Neon / Profile', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'boy_beach', label: 'Boy on Beach', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'tool_logo', label: 'Business Logo', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'girl_portrait', label: 'Female Student', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'sami_gold', label: 'Sami Bahi 🤑', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80' },
];

export interface ChatItem {
  id: string;
  name: string;
  avatarUrl?: string;
  isDefaultAvatar?: boolean;
  avatarRing?: boolean;
  isPinned?: boolean;
  lastMessage: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  timeDisplay: string;
  useLiveTime?: boolean;
  liveMinutesAgo?: number; // relative minutes from current PK time
  unreadCount: number;
  isArchived?: boolean;
  conversation?: Array<{
    id: string;
    sender: 'user' | 'me';
    text: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
  }>;
}

const DEFAULT_CHATS: ChatItem[] = [
  {
    id: 'sami_pin',
    name: 'Sami Bahi 🤑',
    isPinned: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Audio',
    isVoiceNote: true,
    voiceDuration: 'Audio',
    timeDisplay: '10/6/26',
    unreadCount: 0,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Sami bhai store audit video check kar lein', time: '5:10 PM', status: 'read' },
      { id: 'm2', sender: 'me', text: 'Zabardast kaam kiya hai bro, winning ads chalao ab!', time: '5:12 PM', status: 'read' },
    ]
  },
  {
    id: 'c1',
    name: '+92 326 4074204',
    isDefaultAvatar: true,
    lastMessage: 'Satisfied bahi mentorship bohot zabardast rahi, store se 35k sales generate ho gayi!',
    timeDisplay: '4:01 PM',
    unreadCount: 3,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Assalam o alaikum Sami bhai', time: '3:55 PM' },
      { id: 'm2', sender: 'user', text: 'Aapki mentorship strategy implement ki thi', time: '3:58 PM' },
      { id: 'm3', sender: 'user', text: 'Satisfied bahi mentorship bohot zabardast rahi, store se 35k sales generate ho gayi!', time: '4:01 PM' },
    ]
  },
  {
    id: 'c2',
    name: '+92 318 4235800',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Satisfied sir! Aj pehle 8 orders dispatch karwaye hain TCS se 🔥',
    timeDisplay: '4:45 PM',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied sir! Aj pehle 8 orders dispatch karwaye hain TCS se 🔥', time: '4:45 PM' }
    ]
  },
  {
    id: 'c3',
    name: '+92 315 9402673',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Satisfied bro',
    isVoiceNote: true,
    voiceDuration: '0:19',
    timeDisplay: '3:42 PM',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied bro, voice note me sari details bata di hain', time: '3:42 PM' }
    ]
  },
  {
    id: 'c4',
    name: '+92 329 5231696',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Satisfied bhai! TCS courier portal integrate hogya Alhamdulillah',
    timeDisplay: '2:15 PM',
    unreadCount: 3,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied bhai! TCS courier portal integrate hogya Alhamdulillah', time: '2:15 PM' }
    ]
  },
  {
    id: 'c5',
    name: 'Sani Sadqat',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    avatarRing: true,
    lastMessage: '100% Satisfied sir, pehle 10 din me 95,000 ka revenue hit hua hai!',
    timeDisplay: 'Yesterday',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: '100% Satisfied sir, pehle 10 din me 95,000 ka revenue hit hua hai!', time: 'Yesterday' }
    ]
  },
  {
    id: 'c6',
    name: '+92 347 9448102',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Satisfied bahi, aap jaisa mentor puri market me nahi dekha',
    timeDisplay: 'Yesterday',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied bahi, aap jaisa mentor puri market me nahi dekha', time: 'Yesterday' }
    ]
  },
  {
    id: 'c7',
    name: 'Tool on rent Pvt Ltd',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Satisfied. Tools access active hai sir aapke batch k liye.',
    timeDisplay: 'Yesterday',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied. Tools access active hai sir aapke batch k liye.', time: 'Yesterday' }
    ]
  },
  {
    id: 'c8',
    name: '+971 52 967 7550',
    isDefaultAvatar: true,
    lastMessage: 'Satisfied! Dubai dropshipping store se pehla order convert hogya 👍',
    timeDisplay: 'Yesterday',
    unreadCount: 2,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied! Dubai dropshipping store se pehla order convert hogya 👍', time: 'Yesterday' }
    ]
  },
  {
    id: 'c9',
    name: '+92 300 8472911',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Totally satisfied sir, profit margins expected se ziyada hain',
    timeDisplay: '10/13/26',
    unreadCount: 3,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Totally satisfied sir, profit margins expected se ziyada hain', time: '10/13/26' }
    ]
  },
  {
    id: 'c10',
    name: '+92 333 1928475',
    isDefaultAvatar: true,
    lastMessage: 'Satisfied sir. ROAS 4.8x aa raha hai abhi',
    timeDisplay: '10/11/26',
    unreadCount: 2,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied sir. ROAS 4.8x aa raha hai abhi', time: '10/11/26' }
    ]
  },
  {
    id: 'c11',
    name: 'Hamza Ecom Batch 4',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    lastMessage: 'Satisfied bahi! Next month physical office open kar raha hoon',
    timeDisplay: '10/09/26',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied bahi! Next month physical office open kar raha hoon', time: '10/09/26' }
    ]
  },
  {
    id: 'c12',
    name: '+92 312 9081234',
    isDefaultAvatar: true,
    lastMessage: 'Satisfied, thank you for personal support call',
    timeDisplay: '10/06/26',
    unreadCount: 1,
    conversation: [
      { id: 'm1', sender: 'user', text: 'Satisfied, thank you for personal support call', time: '10/06/26' }
    ]
  }
];

export default function WhatsAppSimulatorPage() {
  // Persistence
  const [chats, setChats] = useState<ChatItem[]>(DEFAULT_CHATS);
  const [isClient, setIsClient] = useState(false);

  // View state
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Favorites' | 'Groups'>('Unread');
  const [viewMode, setViewMode] = useState<'mobile' | 'web'>('mobile');
  const [showPhoneFrame, setShowPhoneFrame] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [disguiseMode, setDisguiseMode] = useState(false); // hides all floating admin controls for screen record
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Drawer Controls
  const [isControlOpen, setIsControlOpen] = useState(false);
  const [editingChat, setEditingChat] = useState<ChatItem | null>(null);
  const [newChatDraft, setNewChatDraft] = useState<Partial<ChatItem>>({
    name: '+92 300 0000000',
    lastMessage: 'Satisfied sir, mentorship was amazing!',
    unreadCount: 1,
    timeDisplay: 'Just now',
    isDefaultAvatar: true,
  });

  // Pakistan Live Clock
  const [pktTime, setPktTime] = useState('5:05 PM');

  // Load from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('sami_whatsapp_simulator_chats_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChats(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync PKT time
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Karachi',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        setPktTime(formatter.format(now));
      } catch {
        setPktTime('5:05 PM');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage
  const saveChats = (newChats: ChatItem[]) => {
    setChats(newChats);
    try {
      localStorage.setItem('sami_whatsapp_simulator_chats_v1', JSON.stringify(newChats));
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut to toggle disguise mode: Esc or Ctrl+H
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && disguiseMode) {
        setDisguiseMode(false);
      }
      if (e.ctrlKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setDisguiseMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [disguiseMode]);

  // Total unread count
  const totalUnreadCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Filtered chats
  const filteredChats = chats.filter((c) => {
    if (activeTab === 'Unread' && c.unreadCount <= 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    }
    return true;
  });

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Simulate new incoming satisfied review message
  const simulateIncomingMessage = () => {
    const sampleReviews = [
      'Satisfied bahi! Store ka pehla 50k sales milestone cross hogya mashallah ❤️',
      'Satisfied sir! Facebook ads pe 4.2x ROAS mil raha hai guidance k baad',
      'Totally Satisfied! Courier portal setup hogya pehle 15 parcels deliver hogye',
      'Satisfied brother, aapki private mentorship best investment thi meri zindagi ki',
      '100% Satisfied! Aaj store live hua aur 3 orders pehle ghante me aa gaye!'
    ];
    const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    const randomNum = `+92 3${Math.floor(10 + Math.random() * 38)} ${Math.floor(1000000 + Math.random() * 8999999)}`;

    const newChat: ChatItem = {
      id: 'c_' + Date.now(),
      name: randomNum,
      isDefaultAvatar: Math.random() > 0.4,
      avatarUrl: Math.random() > 0.5 ? PRESET_AVATARS[1 + Math.floor(Math.random() * 4)].url : undefined,
      lastMessage: randomReview,
      timeDisplay: 'Just now',
      unreadCount: 1,
      conversation: [
        { id: 'm_' + Date.now(), sender: 'user', text: randomReview, time: pktTime }
      ]
    };

    const updated = [newChat, ...chats];
    saveChats(updated);
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm('Kya aap chats ko reset karna chahte hain default Pakistani student reviews data par?')) {
      saveChats(DEFAULT_CHATS);
    }
  };

  // Add chat
  const handleAddNewChat = () => {
    if (!newChatDraft.name || !newChatDraft.lastMessage) return;
    const newChat: ChatItem = {
      id: 'c_' + Date.now(),
      name: newChatDraft.name,
      lastMessage: newChatDraft.lastMessage,
      timeDisplay: newChatDraft.timeDisplay || 'Just now',
      unreadCount: Number(newChatDraft.unreadCount || 1),
      isDefaultAvatar: newChatDraft.isDefaultAvatar,
      avatarUrl: newChatDraft.avatarUrl,
      conversation: [
        { id: 'm_' + Date.now(), sender: 'user', text: newChatDraft.lastMessage, time: newChatDraft.timeDisplay || pktTime }
      ]
    };
    saveChats([newChat, ...chats]);
    setNewChatDraft({
      name: '+92 300 0000000',
      lastMessage: 'Satisfied sir, mentorship was amazing!',
      unreadCount: 1,
      timeDisplay: 'Just now',
      isDefaultAvatar: true,
    });
    alert('Nayi review chat add ho gayi!');
  };

  // Update existing chat
  const handleSaveEditChat = () => {
    if (!editingChat) return;
    const updated = chats.map((c) => (c.id === editingChat.id ? editingChat : c));
    saveChats(updated);
    setEditingChat(null);
  };

  // Delete chat
  const handleDeleteChat = (id: string) => {
    if (confirm('Kya aap is chat ko delete karna chahte hain?')) {
      const updated = chats.filter((c) => c.id !== id);
      saveChats(updated);
      if (activeChatId === id) setActiveChatId(null);
    }
  };

  // Send message inside chat view
  const [replyInput, setReplyInput] = useState('');
  const handleSendReply = () => {
    if (!replyInput.trim() || !activeChat) return;
    const msg = {
      id: 'm_' + Date.now(),
      sender: 'me' as const,
      text: replyInput,
      time: pktTime,
      status: 'read' as const,
    };
    const updated = chats.map((c) => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          lastMessage: replyInput,
          conversation: [...(c.conversation || []), msg],
        };
      }
      return c;
    });
    saveChats(updated);
    setReplyInput('');
  };

  return (
    <div className="min-h-screen bg-[#0c1317] text-[#e9edef] font-sans antialiased flex flex-col justify-center items-center select-none overflow-x-hidden">
      
      {/* =========================================================================
          FLOATING ADMIN CONTROL BAR (Hideable for 100% pure screen recording)
      ========================================================================= */}
      {!disguiseMode && (
        <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#1f2c34]/95 backdrop-blur-md border border-[#2a3942] rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 transition-all duration-300">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#2a3942] transition-colors"
            title="Wapis Admin Dashboard jayein"
          >
            <ArrowLeft size={14} />
            <span>Admin</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#111b21] p-0.5 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => { setViewMode('mobile'); setShowPhoneFrame(true); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'mobile' && showPhoneFrame ? 'bg-[#00a884] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={13} />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => { setViewMode('mobile'); setShowPhoneFrame(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'mobile' && !showPhoneFrame ? 'bg-[#00a884] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Full Screen</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'web' ? 'bg-[#00a884] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={13} />
              <span>WhatsApp Web</span>
            </button>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Quick Actions */}
          <button
            onClick={simulateIncomingMessage}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl transition-all"
            title="Ek naya student review message inject karein"
          >
            <Sparkles size={13} />
            <span>+ Review Message</span>
          </button>

          <button
            onClick={() => setIsControlOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-[#2a3942] text-white hover:bg-[#32434e] px-3 py-1.5 rounded-xl transition-colors"
          >
            <Edit3 size={13} />
            <span>Edit Chats</span>
          </button>

          {/* Hide button for video record */}
          <button
            onClick={() => setDisguiseMode(true)}
            className="flex items-center gap-1.5 text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 px-3 py-1.5 rounded-xl transition-all"
            title="Screen recording ke liye controls hide karein (Press Esc to bring back)"
          >
            <EyeOff size={13} />
            <span>Record Mode</span>
          </button>
        </header>
      )}

      {/* Subtle trigger when disguised */}
      {disguiseMode && (
        <button
          onClick={() => setDisguiseMode(false)}
          className="fixed top-2 right-2 z-50 opacity-10 hover:opacity-100 bg-black/80 text-white text-[10px] px-2 py-1 rounded transition-opacity"
          title="Controls show karein (Ya keyboard se Esc press karein)"
        >
          Exit Record Mode (Esc)
        </button>
      )}

      {/* =========================================================================
          VIEW MODE 1: MOBILE WHATSAPP BUSINESS APP CLONE (Exact User Screenshots)
      ========================================================================= */}
      {viewMode === 'mobile' && (
        <div
          className={`w-full transition-all duration-300 flex justify-center items-center ${
            showPhoneFrame
              ? 'my-6 sm:my-12 px-2'
              : 'min-h-screen h-screen'
          }`}
        >
          {/* Outer Phone Mockup Frame or Direct Screen */}
          <div
            className={`w-full max-w-[420px] bg-white text-[#111b21] flex flex-col relative transition-all ${
              showPhoneFrame
                ? 'h-[850px] max-h-[92vh] rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-[6px] border-[#20272b] overflow-hidden'
                : 'h-screen max-w-full rounded-none border-none'
            }`}
            style={{ fontFamily: "'Roboto', 'Segoe UI', system-ui, -apple-system, sans-serif" }}
          >
            
            {/* 1. REALISTIC ANDROID PHONE STATUS BAR */}
            {showStatusBar && (
              <div className="w-full bg-white px-5 pt-2 pb-1 flex items-center justify-between text-xs text-[#111b21] font-medium tracking-tight">
                <span className="font-semibold text-[13px]">{pktTime}</span>
                <div className="flex items-center gap-2 text-[11px] text-[#222]">
                  <span className="text-[10px] opacity-75">30.4 K/s</span>
                  <span className="text-[10px] font-bold">VoLTE</span>
                  <span className="text-[10px] font-bold">4G</span>
                  {/* Battery icon */}
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-bold">39</span>
                    <div className="w-4 h-2.5 border border-[#222] rounded-[2px] p-[1px] relative flex items-center">
                      <div className="h-full bg-[#222] w-[40%] rounded-[1px]" />
                      <div className="w-[1.5px] h-1 bg-[#222] absolute -right-[2.5px] top-[2px] rounded-r-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAT SCREEN VIEW (If user clicks on a chat) */}
            {activeChat ? (
              <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
                {/* Chat Top Bar */}
                <div className="bg-white border-b border-[#e9edef] px-2 py-2 flex items-center justify-between shadow-xs z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatId(null)}
                      className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    {/* Contact DP */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#e9edef] flex items-center justify-center shrink-0">
                      {activeChat.avatarUrl ? (
                        <img src={activeChat.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-[#8696a0]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    {/* Contact Info */}
                    <div className="leading-tight">
                      <h3 className="font-semibold text-sm text-[#111b21]">{activeChat.name}</h3>
                      <p className="text-[11px] text-[#00a884] font-medium">online</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[#54656f] pr-2">
                    <Video size={19} className="cursor-pointer" />
                    <Phone size={18} className="cursor-pointer" />
                    <MoreVertical size={18} className="cursor-pointer" />
                  </div>
                </div>

                {/* Chat Messages Body (Realistic Doodle Pattern) */}
                <div
                  className="flex-1 p-3 overflow-y-auto space-y-2.5 flex flex-col"
                  style={{
                    backgroundImage: `radial-gradient(#d1d7db 0.75px, transparent 0.75px)`,
                    backgroundSize: '16px 16px',
                    backgroundColor: '#efeae2',
                  }}
                >
                  {/* Encrypted Security Notice */}
                  <div className="self-center bg-[#ffeecd] text-[#54656f] text-[11px] text-center px-3 py-1.5 rounded-lg shadow-2xs max-w-[85%] border border-[#ffe099]">
                    🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                  </div>

                  {/* Messages */}
                  {(activeChat.conversation || [
                    { id: '1', sender: 'user', text: activeChat.lastMessage, time: activeChat.timeDisplay }
                  ]).map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[78%] rounded-lg px-2.5 py-1.5 text-xs shadow-2xs relative leading-relaxed ${
                        msg.sender === 'me'
                          ? 'self-end bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                          : 'self-start bg-white text-[#111b21] rounded-tl-none'
                      }`}
                    >
                      <p className="pr-12 text-[13px]">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] -mt-1 float-right ml-2">
                        <span>{msg.time}</span>
                        {msg.sender === 'me' && (
                          <CheckCheck size={14} className="text-[#53bdeb]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Bottom Reply Bar */}
                <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full flex items-center px-3 py-2 shadow-2xs gap-2">
                    <Smile size={20} className="text-[#8696a0]" />
                    <input
                      type="text"
                      placeholder="Message"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      className="flex-1 text-xs outline-none bg-transparent text-[#111b21]"
                    />
                    <Paperclip size={18} className="text-[#8696a0]" />
                    <Camera size={18} className="text-[#8696a0]" />
                  </div>
                  <button
                    onClick={handleSendReply}
                    className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
                  >
                    {replyInput.trim() ? <Send size={18} /> : <Mic size={18} />}
                  </button>
                </div>
              </div>
            ) : (
              /* ==========================================================
                  MAIN CHAT LIST SCREEN (EXACT REPLICA OF USER SCREENSHOTS)
              ========================================================== */
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                
                {/* 2. TOP BAR (WhatsApp Title, Camera, 3 Dots) */}
                <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                  <h1 className="text-xl font-bold tracking-tight text-[#111b21]" style={{ fontFamily: 'sans-serif' }}>
                    WhatsApp
                  </h1>
                  <div className="flex items-center gap-5 text-[#111b21]">
                    <button className="hover:opacity-75 transition-opacity">
                      <Camera size={21} strokeWidth={2.1} />
                    </button>
                    <button className="hover:opacity-75 transition-opacity">
                      <MoreVertical size={20} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>

                {/* 3. SEARCH BAR PILL */}
                <div className="px-4 py-1.5">
                  <div className="bg-[#f0f2f5] rounded-full px-4 py-2 flex items-center gap-3">
                    <Search size={18} className="text-[#54656f]" />
                    <input
                      type="text"
                      placeholder="Search unread chats"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-[#111b21] placeholder-[#54656f] w-full"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-[#54656f]">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. FILTER PILLS (All, Unread 31, Favorites, Groups 1) */}
                <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab('All')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      activeTab === 'All'
                        ? 'bg-[#d9fdd3] text-[#008069] font-bold'
                        : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('Unread')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                      activeTab === 'Unread'
                        ? 'bg-[#d9fdd3] text-[#008069] font-bold'
                        : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
                    }`}
                  >
                    <span>Unread</span>
                    <span className="font-semibold">{totalUnreadCount}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('Favorites')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      activeTab === 'Favorites'
                        ? 'bg-[#d9fdd3] text-[#008069] font-bold'
                        : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
                    }`}
                  >
                    Favorites
                  </button>
                  <button
                    onClick={() => setActiveTab('Groups')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                      activeTab === 'Groups'
                        ? 'bg-[#d9fdd3] text-[#008069] font-bold'
                        : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
                    }`}
                  >
                    <span>Groups</span>
                    <span>1</span>
                  </button>
                  <div className="w-2 h-2 rounded-full bg-[#008069] shrink-0" />
                </div>

                {/* 5. CHAT LIST */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#f5f6f6]">
                  {/* Optional Archived Row */}
                  {activeTab === 'All' && (
                    <div className="px-4 py-3 flex items-center gap-4 hover:bg-[#f5f6f6] cursor-pointer">
                      <div className="w-8 flex justify-center text-[#54656f]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="4" rx="1" />
                          <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                          <path d="M10 12h4" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#111b21] flex-1">Archived</span>
                    </div>
                  )}

                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className="px-4 py-2.5 flex items-center gap-3.5 hover:bg-[#f5f6f6] active:bg-[#eaebec] cursor-pointer transition-colors relative"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-[48px] h-[48px] rounded-full overflow-hidden flex items-center justify-center ${
                            chat.avatarRing
                              ? 'ring-2 ring-[#00a884] ring-offset-2'
                              : ''
                          } ${chat.isDefaultAvatar ? 'bg-[#e9edef]' : 'bg-[#e9edef]'}`}
                        >
                          {chat.avatarUrl && !chat.isDefaultAvatar ? (
                            <img src={chat.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-7 h-7 text-[#8696a0]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Middle: Name & Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[15px] font-semibold text-[#111b21] truncate tracking-tight">
                            {chat.name}
                          </h2>
                          {/* Time on right */}
                          <span
                            className={`text-[11px] shrink-0 font-medium ${
                              chat.unreadCount > 0 ? 'text-[#25d366]' : 'text-[#667781]'
                            }`}
                          >
                            {chat.timeDisplay}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-0.5">
                          {/* Message snippet */}
                          <div className="flex items-center gap-1 text-[13px] text-[#667781] truncate pr-2">
                            {chat.isVoiceNote ? (
                              <>
                                <Mic size={14} className="text-[#00a884] shrink-0" />
                                <span className="text-[#3b4a54] font-medium">Voice message ({chat.voiceDuration || '0:15'})</span>
                              </>
                            ) : chat.isPinned ? (
                              <>
                                <CheckCheck size={14} className="text-[#8696a0] shrink-0" />
                                <Mic size={14} className="text-[#8696a0] shrink-0" />
                                <span>{chat.lastMessage}</span>
                              </>
                            ) : (
                              <span className="truncate">{chat.lastMessage}</span>
                            )}
                          </div>

                          {/* Unread badge & Pin */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {chat.isPinned && (
                              <Pin size={13} className="text-[#8696a0] rotate-45" />
                            )}
                            {chat.unreadCount > 0 && (
                              <span className="w-5 h-5 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredChats.length === 0 && (
                    <div className="p-8 text-center text-xs text-[#8696a0]">
                      Koi chat nahi mili is filter me.
                    </div>
                  )}
                </div>

                {/* 6. FLOATING ACTION BUTTON (FAB) */}
                <div className="absolute right-4 bottom-20 z-20">
                  <button
                    onClick={() => {
                      const name = prompt('Naye student ka Name / Number likhein:');
                      if (name) {
                        const msg = prompt('Student ka Satisfied review likhein:', 'Satisfied bhai mentorship se bohot faida hua!');
                        if (msg) {
                          const newC: ChatItem = {
                            id: 'c_' + Date.now(),
                            name,
                            lastMessage: msg,
                            unreadCount: 1,
                            timeDisplay: 'Just now',
                            isDefaultAvatar: true,
                          };
                          saveChats([newC, ...chats]);
                        }
                      }
                    }}
                    className="w-13 h-13 rounded-2xl bg-[#0b141a] text-white flex items-center justify-center shadow-xl hover:bg-black active:scale-95 transition-all"
                    title="Naya Review Chat Add Karein"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9h-4v4h-2v-4H8V9h4V5h2v4h4v2z" />
                    </svg>
                  </button>
                </div>

                {/* 7. BOTTOM NAVIGATION BAR (WhatsApp Business Style) */}
                <div className="bg-white border-t border-[#f0f2f5] py-2 px-3 flex items-center justify-around z-10">
                  {/* Chats */}
                  <div className="flex flex-col items-center cursor-pointer relative">
                    <div className="relative">
                      <div className="w-13 h-7 rounded-full bg-[#d9fdd3] flex items-center justify-center text-[#008069]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                        </svg>
                      </div>
                      <span className="absolute -top-1 -right-1 bg-[#25d366] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {totalUnreadCount}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#111b21] mt-1">Chats</span>
                  </div>

                  {/* Calls */}
                  <div className="flex flex-col items-center cursor-pointer text-[#54656f] hover:text-[#111b21]">
                    <div className="w-13 h-7 flex items-center justify-center">
                      <Phone size={19} />
                    </div>
                    <span className="text-[11px] font-medium mt-1">Calls</span>
                  </div>

                  {/* Updates */}
                  <div className="flex flex-col items-center cursor-pointer text-[#54656f] hover:text-[#111b21] relative">
                    <div className="w-13 h-7 flex items-center justify-center relative">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9" />
                      </svg>
                      <span className="w-2 h-2 rounded-full bg-[#25d366] absolute top-1 right-3" />
                    </div>
                    <span className="text-[11px] font-medium mt-1">Updates</span>
                  </div>

                  {/* Tools */}
                  <div className="flex flex-col items-center cursor-pointer text-[#54656f] hover:text-[#111b21] relative">
                    <div className="w-13 h-7 flex items-center justify-center relative">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="w-2 h-2 rounded-full bg-[#25d366] absolute top-1 right-3" />
                    </div>
                    <span className="text-[11px] font-medium mt-1">Tools</span>
                  </div>
                </div>

                {/* 8. ANDROID VIRTUAL SOFT BUTTONS (Back, Home, Recents) */}
                {showStatusBar && (
                  <div className="bg-white py-1.5 flex items-center justify-around text-[#8696a0] border-t border-[#f7f8f9]">
                    {/* Back triangle */}
                    <div className="w-3.5 h-3.5 border-l-2 border-b-2 border-[#8696a0] -rotate-45" />
                    {/* Home circle */}
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#8696a0]" />
                    {/* Recents square */}
                    <div className="w-3 h-3 border-2 border-[#8696a0] rounded-xs" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: WHATSAPP WEB DESKTOP CLONE
      ========================================================================= */}
      {viewMode === 'web' && (
        <div className="w-full h-screen flex flex-col bg-[#111b21] p-0 sm:p-5">
          <div className="flex-1 w-full max-w-7xl mx-auto bg-[#111b21] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex border border-[#222e35]">
            
            {/* Left Column: Chat List */}
            <div className="w-full sm:w-[420px] md:w-[460px] border-r border-[#222e35] flex flex-col bg-[#111b21] shrink-0">
              
              {/* Web Header */}
              <div className="bg-[#202c33] px-4 py-2.5 flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#6a7b83] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-5 text-[#aebac1]">
                  <svg className="w-5 h-5 cursor-pointer hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  <MoreVertical size={20} className="cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Web Search & Filter */}
              <div className="p-3 bg-[#111b21] border-b border-[#222e35] space-y-2">
                <div className="bg-[#202c33] rounded-lg px-3 py-1.5 flex items-center gap-3">
                  <Search size={16} className="text-[#8696a0]" />
                  <input
                    type="text"
                    placeholder="Search or start new chat"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-[#d1d7db] placeholder-[#8696a0] w-full"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['All', 'Unread', 'Favorites', 'Groups'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        activeTab === tab
                          ? 'bg-[#00a884] text-[#111b21]'
                          : 'bg-[#202c33] text-[#8696a0] hover:text-white'
                      }`}
                    >
                      {tab} {tab === 'Unread' && `(${totalUnreadCount})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Web Chat Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#222e35]">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      activeChatId === chat.id ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#6a7b83] shrink-0 flex items-center justify-center">
                      {chat.avatarUrl && !chat.isDefaultAvatar ? (
                        <img src={chat.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-7 h-7 text-[#cfd9de]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#e9edef] truncate">{chat.name}</span>
                        <span className={`text-[11px] ${chat.unreadCount > 0 ? 'text-[#00a884]' : 'text-[#8696a0]'}`}>
                          {chat.timeDisplay}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[#8696a0] truncate pr-2">{chat.lastMessage}</span>
                        {chat.unreadCount > 0 && (
                          <span className="w-4.5 h-4.5 rounded-full bg-[#00a884] text-[#111b21] text-[10px] font-black flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Chat Screen or WhatsApp Web Placeholder */}
            <div className="hidden sm:flex flex-1 flex-col bg-[#222e35] relative">
              {activeChat ? (
                <div className="flex-1 flex flex-col bg-[#0b141a]">
                  {/* Web Chat Header */}
                  <div className="bg-[#202c33] px-4 py-2.5 flex items-center justify-between border-b border-[#222e35]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#6a7b83]">
                        {activeChat.avatarUrl ? (
                          <img src={activeChat.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">👤</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#e9edef]">{activeChat.name}</h3>
                        <p className="text-[11px] text-[#00a884]">online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[#aebac1]">
                      <Search size={18} />
                      <MoreVertical size={18} />
                    </div>
                  </div>

                  {/* Web Chat Body */}
                  <div
                    className="flex-1 p-6 overflow-y-auto space-y-3 flex flex-col"
                    style={{
                      backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                      backgroundColor: '#0b141a',
                    }}
                  >
                    {(activeChat.conversation || [
                      { id: '1', sender: 'user', text: activeChat.lastMessage, time: activeChat.timeDisplay }
                    ]).map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[65%] rounded-lg px-3 py-2 text-xs shadow-md ${
                          msg.sender === 'me'
                            ? 'self-end bg-[#005c4b] text-[#e9edef]'
                            : 'self-start bg-[#202c33] text-[#e9edef]'
                        }`}
                      >
                        <p className="pr-10 text-[13px]">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] -mt-1 float-right ml-2">
                          <span>{msg.time}</span>
                          {msg.sender === 'me' && <CheckCheck size={13} className="text-[#53bdeb]" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Web Chat Reply Bar */}
                  <div className="bg-[#202c33] p-3 flex items-center gap-3">
                    <Smile size={22} className="text-[#8696a0] cursor-pointer" />
                    <Paperclip size={20} className="text-[#8696a0] cursor-pointer" />
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2.5 text-xs text-[#d1d7db] outline-none"
                    />
                    <button
                      onClick={handleSendReply}
                      className="text-[#00a884] hover:text-[#25d366] transition-colors p-1"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Authentic WhatsApp Web Lockscreen Graphic */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8696a0] border-b-[6px] border-[#00a884]">
                  <div className="w-24 h-24 rounded-full bg-[#111b21] flex items-center justify-center mb-6 border border-[#2a3942]">
                    <svg className="w-12 h-12 text-[#00a884]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2M12.05 3.67C16.58 3.67 20.28 7.37 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16C10.59 20.16 9.17 19.78 7.93 19.04L7.54 18.81L4.41 19.63L5.25 16.58L5 16.18C4.19 14.89 3.77 13.43 3.77 11.91C3.77 7.37 7.48 3.67 12.05 3.67Z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-light text-[#e9edef] mb-2">WhatsApp Web</h2>
                  <p className="text-xs max-w-sm leading-relaxed mb-6">
                    Send and receive messages without keeping your phone online.
                    <br />
                    Use WhatsApp on up to 4 linked devices and 1 phone.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#8696a0]">
                    <span>🔒 End-to-end encrypted</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN EDIT DRAWER (Control Panel for Customizing Chats)
      ========================================================================= */}
      {isControlOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#111827] text-white h-full overflow-y-auto p-5 border-l border-white/10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Edit3 size={16} className="text-[#00A0DF]" />
                    <span>WhatsApp Chats Editor</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Har chat ka Name, Number, Message, Time aur DP customize karein
                  </p>
                </div>
                <button
                  onClick={() => { setIsControlOpen(false); setEditingChat(null); }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Settings */}
              <div className="space-y-4 mb-6 bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
                <span className="text-xs font-bold text-slate-300 block">Display Settings:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showStatusBar}
                      onChange={(e) => setShowStatusBar(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Phone Status Bar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPhoneFrame}
                      onChange={(e) => setShowPhoneFrame(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Phone Frame Border</span>
                  </label>
                </div>
              </div>

              {/* Edit Selected Chat or Add New */}
              {editingChat ? (
                <div className="space-y-3 bg-[#1e293b] p-4 rounded-xl border border-[#00A0DF]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#00A0DF]">Editing Chat:</span>
                    <button
                      onClick={() => setEditingChat(null)}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">Contact Name / Number:</label>
                    <input
                      type="text"
                      value={editingChat.name}
                      onChange={(e) => setEditingChat({ ...editingChat, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00A0DF]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">Review / Last Message:</label>
                    <textarea
                      rows={2}
                      value={editingChat.lastMessage}
                      onChange={(e) => setEditingChat({ ...editingChat, lastMessage: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00A0DF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-bold">Time Display:</label>
                      <input
                        type="text"
                        value={editingChat.timeDisplay}
                        onChange={(e) => setEditingChat({ ...editingChat, timeDisplay: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00A0DF]"
                        placeholder="e.g. 4:01 PM / Just now"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-bold">Unread Badge Count:</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={editingChat.unreadCount}
                        onChange={(e) => setEditingChat({ ...editingChat, unreadCount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">Profile Picture (DP):</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setEditingChat({ ...editingChat, isDefaultAvatar: true, avatarUrl: undefined })}
                        className={`text-[10px] px-2.5 py-1 rounded-md border ${
                          editingChat.isDefaultAvatar ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'bg-slate-800 text-slate-300 border-white/10'
                        }`}
                      >
                        Default Grey
                      </button>
                      {PRESET_AVATARS.filter((p) => p.url).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setEditingChat({ ...editingChat, isDefaultAvatar: false, avatarUrl: p.url })}
                          className={`text-[10px] px-2 py-1 rounded-md border ${
                            editingChat.avatarUrl === p.url ? 'bg-[#00A0DF] text-white font-bold border-[#00A0DF]' : 'bg-slate-800 text-slate-300 border-white/10'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveEditChat}
                      className="flex-1 bg-[#00A0DF] hover:bg-[#008ec6] text-white font-bold text-xs py-2 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => handleDeleteChat(editingChat.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Add New Chat Form */
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                  <span className="text-xs font-extrabold text-emerald-400 block">+ Add New Review Chat:</span>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Name / Phone Number:</label>
                    <input
                      type="text"
                      value={newChatDraft.name}
                      onChange={(e) => setNewChatDraft({ ...newChatDraft, name: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Satisfied Review Message:</label>
                    <input
                      type="text"
                      value={newChatDraft.lastMessage}
                      onChange={(e) => setNewChatDraft({ ...newChatDraft, lastMessage: e.target.value })}
                      placeholder="Satisfied sir, result mil gaya"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Time:</label>
                      <input
                        type="text"
                        value={newChatDraft.timeDisplay}
                        onChange={(e) => setNewChatDraft({ ...newChatDraft, timeDisplay: e.target.value })}
                        placeholder="Just now / 4:05 PM"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Unread Count:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={newChatDraft.unreadCount}
                        onChange={(e) => setNewChatDraft({ ...newChatDraft, unreadCount: parseInt(e.target.value) || 1 })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddNewChat}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2 rounded-lg transition-colors mt-2"
                  >
                    Add to WhatsApp List
                  </button>
                </div>
              )}

              {/* Chat List for quick click-to-edit */}
              <div className="mt-6 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Existing Chats ({chats.length}):</span>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {chats.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setEditingChat(c)}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        editingChat?.id === c.id
                          ? 'bg-[#00A0DF]/20 border-[#00A0DF] text-white'
                          : 'bg-slate-900 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold truncate">{c.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{c.lastMessage}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                          {c.unreadCount} unread
                        </span>
                        <Edit3 size={13} className="text-slate-400 ml-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
              <button
                onClick={handleResetDefaults}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white py-2 rounded-lg bg-slate-900 border border-white/5 transition-colors"
              >
                <RefreshCw size={13} />
                <span>Reset to Pakistani Reviews Default</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
