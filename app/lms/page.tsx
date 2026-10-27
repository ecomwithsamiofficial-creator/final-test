'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2, 
  BookOpen, 
  Download, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Search, 
  ChevronLeft, 
  Menu, 
  X, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Lock, 
  Cloud, 
  Loader2, 
  Shield, 
  Pin, 
  Radio, 
  FileSpreadsheet, 
  Circle,
  Maximize2,
  Minimize2,
  Settings,
  Send,
  Image as ImageIcon,
  Sparkles,
  MessageCircle,
  Mic,
  Upload,
  Eye,
  CheckCheck,
  Paperclip,
  Bell,
  Users,
  Star
} from 'lucide-react';
import { Module, Supplier, ResourceItem } from '@/utils/db';
import { supabase } from '@/lib/supabase';
import { LmsFrameworkItem, LmsOverviewContent, defaultCmsContent } from '@/utils/cmsStore';

function ChatVoiceNotePlayer({ 
  audioUrl, 
  isMentor = true, 
  savedDuration = null 
}: { 
  audioUrl: string; 
  isMentor?: boolean; 
  savedDuration?: string | null; 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const instanceIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));

  // Normalize audio URL so both /uploads/community/ and /api/community/chat/media/ stream with HTTP Range
  const normalizedAudioUrl = useMemo(() => {
    if (!audioUrl) return '';
    if (audioUrl.startsWith('/uploads/community/')) {
      return audioUrl.replace('/uploads/community/', '/api/community/chat/media/');
    }
    return audioUrl;
  }, [audioUrl]);

  // Preload saved duration if provided from database
  useEffect(() => {
    if (savedDuration && duration === 0) {
      const parsed = parseFloat(savedDuration);
      if (!isNaN(parsed) && parsed > 0) {
        setDuration(parsed);
      }
    }
  }, [savedDuration]);

  // Single audio coordinator: Pause when another audio starts playing
  useEffect(() => {
    const handleOtherPlay = (e: any) => {
      if (e.detail?.id !== instanceIdRef.current && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('sami-voice-play', handleOtherPlay);
    return () => {
      window.removeEventListener('sami-voice-play', handleOtherPlay);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // Notify other players to pause
      try {
        window.dispatchEvent(new CustomEvent('sami-voice-play', { detail: { id: instanceIdRef.current } }));
      } catch (err) {}

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.warn('Audio playback error, retrying with load():', err);
            if (audioRef.current) {
              audioRef.current.load();
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setIsLoading(false);
                })
                .catch((e2) => {
                  console.error('Audio play failed:', e2);
                  setIsLoading(false);
                  setIsPlaying(false);
                  setAudioFailed(true);
                });
            } else {
              setIsLoading(false);
              setIsPlaying(false);
              setAudioFailed(true);
            }
          });
      }
    }
  };

  const seekToClientX = (clientX: number, target: HTMLDivElement) => {
    if (!audioRef.current || !duration || isNaN(duration) || !isFinite(duration)) return;
    const rect = target.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newPercent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0 || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border flex items-center gap-2.5 shadow-2xs my-1 select-none transition-all ${
        isMentor
          ? 'bg-white/95 border-emerald-300 text-slate-800'
          : 'bg-emerald-50/90 border-emerald-200 text-slate-800'
      }`}
    >
      <audio
        ref={audioRef}
        src={normalizedAudioUrl}
        preload="metadata"
        playsInline
        onLoadedMetadata={() => {
          if (audioRef.current && isFinite(audioRef.current.duration) && !isNaN(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current && isFinite(audioRef.current.duration) && !isNaN(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
          setAudioFailed(true);
        }}
      />

      <button
        type="button"
        onClick={togglePlay}
        disabled={isLoading}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer shadow-xs ${
          isMentor ? 'bg-[#008069] hover:bg-[#075e54] text-white' : 'bg-[#128c7e] hover:bg-[#075e54] text-white'
        }`}
        title={isPlaying ? 'Pause voice note' : 'Play voice note'}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-white" />
        ) : isPlaying ? (
          <Pause size={16} className="fill-white text-white" />
        ) : (
          <Play size={16} className="fill-white text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] font-bold">
          <span className="text-[#008069] flex items-center gap-1">
            <Mic size={11} />
            <span>{isMentor ? 'Mentor Voice Note' : 'Voice Note'}</span>
          </span>
          {audioFailed ? (
            <span className="text-[9.5px] text-red-500 font-semibold">⚠️ Audio unavailable</span>
          ) : (
            <span className="text-[9.5px] text-slate-500 font-mono">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          )}
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            seekToClientX(e.clientX, e.currentTarget);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            if (e.touches[0]) seekToClientX(e.touches[0].clientX, e.currentTarget);
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            if (e.touches[0]) seekToClientX(e.touches[0].clientX, e.currentTarget);
          }}
          className="h-2 sm:h-2.5 bg-slate-200/90 hover:bg-slate-300 rounded-full cursor-pointer relative overflow-hidden transition-colors"
        >
          <div
            className="h-full bg-[#008069] rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function LmsClassroomPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [lmsFrameworks, setLmsFrameworks] = useState<LmsFrameworkItem[]>([]);
  const [lmsOverview, setLmsOverview] = useState<LmsOverviewContent | null>(() => {
    return defaultCmsContent.lms_overview || null;
  });
  const [openFrameworkId, setOpenFrameworkId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [accountRevoked, setAccountRevoked] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(() => {
    if (defaultCmsContent.lms_overview && defaultCmsContent.lms_overview.is_active !== false) {
      return {
        id: 'lms_overview_lesson',
        title: defaultCmsContent.lms_overview.title || 'Mentorship Overview & Strategy Roadmap (Watch First)',
        duration: defaultCmsContent.lms_overview.duration || '15:20 mins',
        videoUrl: defaultCmsContent.lms_overview.video_url || '',
        description: defaultCmsContent.lms_overview.description || '',
        badge: defaultCmsContent.lms_overview.badge || 'START HERE • ROADMAP',
        isOverview: true
      };
    }
    return null;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [detectedDurations, setDetectedDurations] = useState<{ [lessonId: string]: string }>({});

  const getOverviewLesson = (overview?: LmsOverviewContent | null) => {
    const o = overview || lmsOverview || defaultCmsContent.lms_overview;
    if (!o || o.is_active === false) return null;
    return {
      id: 'lms_overview_lesson',
      title: o.title || 'Mentorship Overview & Strategy Roadmap (Watch First)',
      duration: o.duration || '15:20 mins',
      videoUrl: o.video_url || '',
      description: o.description || '',
      badge: o.badge || 'START HERE • ROADMAP',
      isOverview: true
    };
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sami_lms_durations');
      if (saved) {
        setDetectedDurations(JSON.parse(saved));
      }
    } catch (e) {}

    // Instant 0ms Cache Hydration: Render classroom immediately without waiting for server network delay
    try {
      let currentOverview = defaultCmsContent.lms_overview || null;
      const cachedOverview = localStorage.getItem('sami_lms_overview_cache');
      if (cachedOverview) {
        try {
          const parsedOv = JSON.parse(cachedOverview);
          if (parsedOv) {
            setLmsOverview(parsedOv);
            currentOverview = parsedOv;
          }
        } catch (e) {}
      }

      const ovLesson = getOverviewLesson(currentOverview);
      if (ovLesson) {
        setActiveLesson((prev: any) => (prev?.isOverview ? prev : ovLesson));
      }

      const cachedMods = localStorage.getItem('sami_lms_modules_cache');
      if (cachedMods) {
        const parsedMods = JSON.parse(cachedMods);
        if (Array.isArray(parsedMods) && parsedMods.length > 0) {
          setModules(parsedMods);
          if (!ovLesson && parsedMods[0]?.lessons?.[0]) {
            setActiveLesson((prev: any) => prev || parsedMods[0].lessons[0]);
          }
        }
      }
      const cachedFw = localStorage.getItem('sami_lms_frameworks_cache');
      if (cachedFw) {
        const parsedFw = JSON.parse(cachedFw);
        if (Array.isArray(parsedFw)) setLmsFrameworks(parsedFw);
      }
      const cachedSuppliers = localStorage.getItem('sami_lms_suppliers_cache');
      if (cachedSuppliers) {
        const parsedSupp = JSON.parse(cachedSuppliers);
        if (Array.isArray(parsedSupp)) setSuppliers(parsedSupp);
      }
      const cachedRes = localStorage.getItem('sami_lms_resources_cache');
      if (cachedRes) {
        const parsedR = JSON.parse(cachedRes);
        if (Array.isArray(parsedR)) setResources(parsedR);
      }
      const cachedAuth = localStorage.getItem('sami_student_auth');
      if (cachedAuth) {
        const parsedUser = JSON.parse(cachedAuth);
        if (parsedUser) {
          setUser(parsedUser);
          setAuthChecking(false);
        }
      }
      if (sessionStorage.getItem('sami_lms_drm_modal_seen') !== 'true') {
        setShowDrmModal(true);
      }
    } catch (e) {}
  }, []);

  const saveDetectedDuration = (lessonId: string, label: string) => {
    if (!lessonId || !label) return;
    setDetectedDurations(prev => {
      if (prev[lessonId] === label) return prev;
      const next = { ...prev, [lessonId]: label };
      try {
        localStorage.setItem('sami_lms_durations', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };
  const [isControlsHovered, setIsControlsHovered] = useState<boolean>(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [openModuleId, setOpenModuleId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'video' | 'suppliers' | 'resources' | 'community'>('video');
  const [subTab, setSubTab] = useState<'notes' | 'discussion'>('notes');
  const [autoProceed, setAutoProceed] = useState<boolean>(true);
  const [communityUpdates, setCommunityUpdates] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierCountryFilter, setSupplierCountryFilter] = useState<'ALL' | 'UAE' | 'Saudi Arabia' | 'Pakistan'>('ALL');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [watchProgress, setWatchProgress] = useState<{ [lessonId: string]: number }>({});
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncFeedback, setSyncFeedback] = useState<string>('');

  const markUpdatesAsRead = () => {
    if (communityUpdates.length > 0) {
      try {
        const allIds = communityUpdates.map((u: any) => u.id);
        localStorage.setItem('sami_lms_read_updates_v1', JSON.stringify(allIds));
        setUnreadCount(0);
      } catch (e) {}
    }
  };

  // Sunday Support & Community Chat State (WhatsApp Group Style)
  const [communitySubView, setCommunitySubView] = useState<'chat' | 'broadcasts'>('chat');
  const [lmsChatConfig, setLmsChatConfig] = useState<{ isOpen: boolean; noticeText: string }>({
    isOpen: true,
    noticeText: 'Sunday Student-to-Student Support Chat is currently locked. Opens every Sunday at 8:00 PM PKT with Mentor Ecom with Sami for reviews and live store audits!'
  });
  const [lmsChatMessages, setLmsChatMessages] = useState<any[]>([]);
  const [lmsChatLoading, setLmsChatLoading] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [newChatToast, setNewChatToast] = useState<{ author: string; text: string; id: string | number } | null>(null);
  const [studentChatMsg, setStudentChatMsg] = useState('');
  const [studentChatImg, setStudentChatImg] = useState<File | null>(null);
  const [studentChatImgPreview, setStudentChatImgPreview] = useState<string | null>(null);
  const [studentChatSubmitting, setStudentChatSubmitting] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const [pinnedNoticeExpanded, setPinnedNoticeExpanded] = useState(false);
  const knownChatMsgIdsRef = useRef<Set<string>>(new Set());
  const hasInitialChatLoadedRef = useRef<boolean>(false);
  const lastAudioNotificationTimeRef = useRef<number>(0);
  const communityBcRef = useRef<BroadcastChannel | null>(null);
  const chatToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const playChatNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      // High-definition WhatsApp / iOS style melodic chime
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.08); // D6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  };

  const markChatAsRead = () => {
    try {
      localStorage.setItem('sami_lms_last_read_chat_time', Date.now().toString());
      setUnreadChatCount(0);
      setNewChatToast(null);
    } catch (e) {}
  };

  const fetchLmsChat = async (isPolling = false) => {
    try {
      if (!isPolling && lmsChatMessages.length === 0) setLmsChatLoading(true);
      const res = await fetch(`/api/community/chat?t=${Date.now()}`);
      const data = await res.json();
      if (data.success) {
        if (data.config) setLmsChatConfig(data.config);
        if (Array.isArray(data.messages)) {
          const newMessages = data.messages;
          setLmsChatMessages(newMessages);

          // Check if message belongs to current student
          const isOwn = (msg: any) => {
            if (!msg) return false;
            if (msg.isMentor) return false;
            if (msg.studentId && user?.id && String(msg.studentId) === String(user.id)) return true;
            if (user?.name && msg.studentName && msg.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()) return true;
            return false;
          };

          // Detect new incoming messages from other students or mentor
          if (hasInitialChatLoadedRef.current) {
            const newlyArrived = newMessages.filter((m: any) => !knownChatMsgIdsRef.current.has(String(m.id)) && !isOwn(m));
            if (newlyArrived.length > 0) {
              const latest = newlyArrived[newlyArrived.length - 1];

              // Play subtle notification chime
              if (Date.now() - lastAudioNotificationTimeRef.current > 1200) {
                lastAudioNotificationTimeRef.current = Date.now();
                playChatNotificationSound();
              }

              // If user is on another tab (video, suppliers, etc.), show instant floating notification toast
              if (activeTab !== 'community') {
                if (chatToastTimerRef.current) clearTimeout(chatToastTimerRef.current);
                setNewChatToast({
                  author: latest.isMentor ? 'Official Mentor Ecom with Sami' : (latest.studentName || 'Student'),
                  text: latest.message || (latest.imageUrl ? '📸 Shared a sales proof screenshot' : 'Sent a message'),
                  id: latest.id
                });
                chatToastTimerRef.current = setTimeout(() => {
                  setNewChatToast(null);
                }, 8000);
              }
            }
          }

          // Register all message IDs
          newMessages.forEach((m: any) => knownChatMsgIdsRef.current.add(String(m.id)));
          hasInitialChatLoadedRef.current = true;

          // Calculate unread badge count
          try {
            const lastReadStr = localStorage.getItem('sami_lms_last_read_chat_time');
            const lastRead = lastReadStr ? parseInt(lastReadStr, 10) : 0;

            if (activeTab === 'community') {
              localStorage.setItem('sami_lms_last_read_chat_time', Date.now().toString());
              setUnreadChatCount(0);
            } else if (lastRead > 0) {
              const unreadMsgs = newMessages.filter((m: any) => new Date(m.createdAt).getTime() > lastRead && !isOwn(m));
              setUnreadChatCount(unreadMsgs.length);
            } else {
              setUnreadChatCount(0);
              localStorage.setItem('sami_lms_last_read_chat_time', Date.now().toString());
            }
          } catch (e) {}
        }
      }
    } catch (e) {
    } finally {
      if (!isPolling) setLmsChatLoading(false);
    }
  };

  const compressImageForChat = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.size < 200 * 1024) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxW = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => resolve(blob || file),
            'image/jpeg',
            0.75
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleStudentImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      alert('Videos are not allowed in Community Chat. Only screenshots and photos are permitted.');
      return;
    }

    setStudentChatImg(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setStudentChatImgPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendStudentChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentChatMsg.trim() && !studentChatImg) {
      alert('Please write a message or attach a sales proof screenshot.');
      return;
    }

    if (!lmsChatConfig.isOpen) {
      alert(lmsChatConfig.noticeText || 'Community chat is currently locked by Mentor.');
      return;
    }

    setStudentChatSubmitting(true);
    try {
      let uploadedImageUrl: string | null = null;

      if (studentChatImg) {
        let fileToUpload: Blob = studentChatImg;
        try {
          fileToUpload = await compressImageForChat(studentChatImg);
        } catch (e) {
          fileToUpload = studentChatImg;
        }

        const formData = new FormData();
        formData.append('file', fileToUpload, studentChatImg.name);
        const upRes = await fetch('/api/community/chat/upload', {
          method: 'POST',
          body: formData
        });
        const upData = await upRes.json();
        if (upData.success && upData.url) {
          uploadedImageUrl = upData.url;
        } else {
          alert(upData.message || 'Image upload failed');
          setStudentChatSubmitting(false);
          return;
        }
      }

      const res = await fetch('/api/community/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id || null,
          studentName: user?.name || 'Enrolled Student',
          isMentor: false,
          message: studentChatMsg.trim(),
          imageUrl: uploadedImageUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setStudentChatMsg('');
        setStudentChatImg(null);
        setStudentChatImgPreview(null);
        if (chatFileInputRef.current) chatFileInputRef.current.value = '';
        fetchLmsChat(false);
        try {
          communityBcRef.current?.postMessage({ type: 'NEW_CHAT_MESSAGE' });
        } catch (e) {}
      } else {
        alert(data.message || 'Failed to send message');
      }
    } catch (e) {
      alert('Network error while posting message');
    } finally {
      setStudentChatSubmitting(false);
    }
  };

  const isLoggingOutRef = useRef(false);
  const tabIdRef = useRef(typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : 'tab');

  // DRM & Anti-Piracy Security System State
  const [showDrmModal, setShowDrmModal] = useState(false);

  // Fullscreen Player & Watermark State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isIosFullscreen, setIsIosFullscreen] = useState(false);
  const isIosRef = useRef(false);
  const lastToggleRef = useRef(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lmsIframeRef = useRef<HTMLIFrameElement>(null);
  const lmsTimelineTrackRef = useRef<HTMLDivElement>(null);
  const lastTouchTimeRef = useRef<number>(0);
  const hasRestoredPosRef = useRef<boolean>(false);
  const moduleListRef = useRef<HTMLDivElement>(null);

  const toggleIosFullscreen = () => {
    const now = Date.now();
    if (now - lastToggleRef.current < 400) return;
    lastToggleRef.current = now;

    setIsIosFullscreen(prev => {
      const next = !prev;
      try {
        if (next) {
          document.body.style.overflow = 'hidden';
          if (screen.orientation && (screen.orientation as any).lock) {
            (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } else {
          document.body.style.overflow = '';
          if (screen.orientation && (screen.orientation as any).unlock) {
            (screen.orientation as any).unlock();
          }
        }
      } catch (e) {}
      return next;
    });
  };

  const togglePlayerFullscreen = () => {
    if (isIosRef.current) {
      toggleIosFullscreen();
      return;
    }
    if (!playerContainerRef.current) return;
    const isCurrentlyFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement || isFullscreen);

    if (!isCurrentlyFs) {
      const elem: any = playerContainerRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch (e) {}
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      try {
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
      } catch (e) {}
      setIsFullscreen(false);
    }
  };

  const getYouTubeId = (url?: string) => {
    if (!url) return '';
    let clean = url.trim();
    if (clean.includes('<iframe')) {
      const match = clean.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) clean = match[1];
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match && match[1] ? match[1] : '';
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    const vId = getYouTubeId(url);
    if (!vId) return '';
    const originParam = typeof window !== 'undefined' && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
    return `https://www.youtube.com/embed/${vId}?enablejsapi=1&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&loop=0&cc_load_policy=0&cc_lang_pref=none&vq=hd1080${originParam}`;
  };

  const formatVideoTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatDurationLabel = (secs: number) => {
    if (!secs || isNaN(secs) || secs <= 0) return '';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s} mins`;
  };

  const isFakeTimer = (d?: string | null) => {
    if (!d) return true;
    const trimmed = d.trim().toLowerCase();
    return trimmed === '12m' || trimmed === '15:00' || trimmed === '12:40 mins' || trimmed === '12:40' || trimmed === '00:00';
  };

  const checkIsAdmin = () => {
    try {
      if (typeof document !== 'undefined') {
        if (
          document.cookie.includes('sami_admin_session=') || 
          document.cookie.includes('sami_admin_active=1')
        ) return true;
      }
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('sami_admin_token') || localStorage.getItem('sami_admin_user')) return true;
      }
    } catch (e) {}
    return false;
  };

  const handleImmediateForceLogout = (
    reason = 'Your student access has been suspended or rejected by the administrator.',
    type: 'rejected' | 'session_locked' = 'rejected'
  ) => {
    // Admins are completely immune from student auto-logout and session lock
    if (checkIsAdmin()) return;

    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    setAccountRevoked(reason);
    setUser(null);
    setActiveLesson(null);
    setAuthChecking(true);

    try {
      const mediaElements = document.querySelectorAll('video, audio');
      mediaElements.forEach((m: any) => {
        try {
          m.pause();
          m.removeAttribute('src');
          m.load();
        } catch (e) {}
      });
    } catch (e) {}

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/auth/logout');
      } else {
        fetch('/api/auth/logout', { method: 'POST', cache: 'no-store', keepalive: true }).catch(() => {});
      }
    } catch (e) {}

    try {
      const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = `sami_student_auth=; path=/; expires=${pastDate}; max-age=0;`;
      document.cookie = `sami_student_session=; path=/; expires=${pastDate}; max-age=0;`;
    } catch (e) {}

    try {
      sessionStorage.removeItem('sami_lms_session_active');
      sessionStorage.removeItem('sami_lms_hidden_at');
      sessionStorage.removeItem('sami_student_auth');
      localStorage.removeItem('sami_student_auth');
      localStorage.removeItem('sami_lms_completed_cache');
      localStorage.removeItem('sami_lms_watch_progress');
    } catch (e) {}

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('sami_auth_sync');
        channel.postMessage({ type: 'FORCE_LOGOUT', reason, senderId: tabIdRef.current });
        setTimeout(() => {
          try { channel.close(); } catch (e) {}
        }, 500);
      }
      localStorage.setItem('sami_force_logout_signal', `${Date.now()}_${tabIdRef.current}`);
    } catch (e) {}

    const targetUrl = `/login?reason=${type}&msg=${encodeURIComponent(reason)}&t=${Date.now()}`;
    if (typeof window !== 'undefined') {
      try {
        window.location.href = targetUrl;
      } catch (e) {
        try {
          window.location.assign(targetUrl);
        } catch (e2) {
          window.location.replace(targetUrl);
        }
      }
      setTimeout(() => {
        try {
          window.location.href = targetUrl;
        } catch (e) {}
      }, 250);
    } else {
      router.replace(targetUrl);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    try {
      localStorage.removeItem('sami_student_auth');
      sessionStorage.removeItem('sami_lms_drm_modal_seen');
      document.cookie = 'sami_student_auth=; path=/; max-age=0';
      document.cookie = 'sami_student_session=; path=/; max-age=0';
    } catch (e) {}
    router.replace('/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const isApple = 
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
        (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);
      setIsApple(isApple);
      isIosRef.current = isApple;
    }

    try {
      const cached = localStorage.getItem('sami_lms_completed_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompletedLessons(parsed);
        }
      }
      const watchCache = localStorage.getItem('sami_lms_watch_progress');
      if (watchCache) {
        setWatchProgress(JSON.parse(watchCache));
      }
      const savedAuto = localStorage.getItem('sami_lms_auto_proceed');
      if (savedAuto !== null) {
        setAutoProceed(savedAuto === 'true');
      }
      const cachedAuth = localStorage.getItem('sami_student_auth');
      if (cachedAuth) {
        const parsed = JSON.parse(cachedAuth);
        if (parsed && parsed.name) {
          setUser((prev: any) => prev || parsed);
        }
      }
    } catch (e) {}

    let realtimeChannel: any = null;
    let realtimeEnrChannel: any = null;
    let heartbeatInterval: any = null;
    let bc: BroadcastChannel | null = null;

    // 0. Check Admin immunity and Detect Page Reload
    const isAdmin = checkIsAdmin();

    let isPageReload = false;
    try {
      if (typeof window !== 'undefined' && window.performance) {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries && navEntries[0] && navEntries[0].type === 'reload') {
          isPageReload = true;
        }
      }
      if (sessionStorage.getItem('sami_lms_is_reloading') === 'true') {
        isPageReload = true;
        sessionStorage.removeItem('sami_lms_is_reloading');
      }
    } catch (e) {}

    // On page reload or for Admin, preserve/rehydrate active session key
    if (isPageReload || isAdmin) {
      try {
        if (!sessionStorage.getItem('sami_lms_session_active')) {
          sessionStorage.setItem('sami_lms_session_active', isAdmin ? ('admin_' + Date.now()) : String(Date.now()));
        }
      } catch (e) {}
    }

    // 0.1 Cross-Platform Page Lifecycle Protection (iOS Safari, Android Chrome & Modern Web)
    let hideTimer: any = null;

    const onVisibilityChange = () => {
      // Admins are completely immune from auto-logout
      if (checkIsAdmin()) return;

      if (document.visibilityState === 'hidden') {
        const now = Date.now();
        try {
          sessionStorage.setItem('sami_lms_hidden_at', String(now));
        } catch (e) {}

        // Grace buffer (5 seconds): exactly as requested
        // "Agar wo tab se bahar jata hai phir logout ho jaye... Aur abhi itni jaldi bhi na ho, 4-5 second baad logout ho jaya kare"
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
              navigator.sendBeacon('/api/auth/logout');
            }
          } catch (e) {}
          try {
            sessionStorage.removeItem('sami_lms_session_active');
            sessionStorage.setItem('sami_lms_locked_state', 'true');
          } catch (e) {}
        }, 5000);
      } else if (document.visibilityState === 'visible') {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }

        try {
          const isLocked = sessionStorage.getItem('sami_lms_locked_state') === 'true';
          const hiddenAtStr = sessionStorage.getItem('sami_lms_hidden_at');
          sessionStorage.removeItem('sami_lms_hidden_at');
          sessionStorage.removeItem('sami_lms_locked_state');

          if (isLocked) {
            handleImmediateForceLogout('Session locked after leaving app for your account security. Please log in to resume your course.', 'session_locked');
            return;
          }

          if (hiddenAtStr) {
            const hiddenDuration = Date.now() - parseInt(hiddenAtStr, 10);
            if (hiddenDuration >= 5000) {
              handleImmediateForceLogout('Session locked after leaving app for your account security. Please log in to resume your course.', 'session_locked');
              return;
            }
          }
        } catch (e) {}
      }
    };

    const onBeforeUnload = () => {
      try {
        sessionStorage.setItem('sami_lms_is_reloading', 'true');
      } catch (e) {}
    };

    const onPageShow = (e: PageTransitionEvent) => {
      if (checkIsAdmin()) return;

      // Handle iOS Safari Back-Forward Cache (bfcache) restore
      if (e.persisted) {
        try {
          const active = sessionStorage.getItem('sami_lms_session_active');
          if (!active) {
            handleImmediateForceLogout('Session locked for account security. Please log in to access your classroom.', 'session_locked');
            return;
          }
        } catch (e) {}
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pageshow', onPageShow);

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('sami_auth_sync');
        bc.onmessage = (event) => {
          if (event.data?.senderId === tabIdRef.current) return;
          if (event.data?.type === 'FORCE_LOGOUT') {
            handleImmediateForceLogout(event.data.reason);
          }
        };
      }
    } catch (e) {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sami_force_logout_signal') {
        const sender = (e.newValue || '').split('_')[1];
        if (sender === tabIdRef.current) return;
        handleImmediateForceLogout('Session ended from another tab.');
      } else if (e.key === 'sami_student_auth' && !e.newValue) {
        handleImmediateForceLogout('Session ended from another tab.');
      }
    };
    window.addEventListener('storage', onStorage);

    try {
      const target = sessionStorage.getItem('sami_lms_target_tab');
      if (target === 'suppliers' || target === 'resources' || target === 'community') {
        setActiveTab(target as any);
        sessionStorage.removeItem('sami_lms_target_tab');
      }
    } catch (e) {}

    const timestamp = Date.now();

    fetch(`/api/auth/me?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.authenticated && res.user) {
          setUser(res.user);
          try {
            localStorage.setItem('sami_student_auth', JSON.stringify(res.user));
          } catch (e) {}
          try {
            if (sessionStorage.getItem('sami_lms_drm_modal_seen') !== 'true') {
              setShowDrmModal(true);
            }
          } catch (e) {}
          const serverLessons: string[] = Array.isArray(res.user.completedLessons) ? res.user.completedLessons : [];
          let localLessons: string[] = [];
          try {
            const userKey = `sami_lms_completed_${res.user.email}`;
            const localSaved = localStorage.getItem(userKey);
            if (localSaved) localLessons = JSON.parse(localSaved);
          } catch (e) {}

          const merged = Array.from(new Set([...serverLessons, ...localLessons]));
          setCompletedLessons(merged);
          try {
            localStorage.setItem('sami_lms_completed_cache', JSON.stringify(merged));
            if (res.user.email) {
              localStorage.setItem(`sami_lms_completed_${res.user.email}`, JSON.stringify(merged));
            }
          } catch (e) {}
          setAuthChecking(false);

          if (supabase && res.user.id) {
            try {
              realtimeChannel = supabase
                .channel(`lms_auth_user_${res.user.id}`)
                .on(
                  'postgres_changes',
                  {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'students',
                    filter: `id=eq.${res.user.id}`
                  },
                  (payload: any) => {
                    if (payload.new && payload.new.is_active === false) {
                      handleImmediateForceLogout('Your enrollment has been rejected or suspended by the administrator.');
                    }
                  }
                )
                .on(
                  'postgres_changes',
                  {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'students',
                    filter: `id=eq.${res.user.id}`
                  },
                  () => {
                    handleImmediateForceLogout('Your student account has been removed by the administrator.');
                  }
                )
                .subscribe();
            } catch (err) {}
          }

          if (supabase && res.user.email) {
            try {
              const safeEmail = res.user.email.replace(/[^a-zA-Z0-9]/g, '_');
              realtimeEnrChannel = supabase
                .channel(`lms_enr_user_${safeEmail}`)
                .on(
                  'postgres_changes',
                  {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'enrollments',
                    filter: `email=eq.${res.user.email}`
                  },
                  (payload: any) => {
                    if (payload.new && payload.new.status === 'rejected') {
                      handleImmediateForceLogout('Your enrollment has been rejected by the administrator.');
                    }
                  }
                )
                .subscribe();
            } catch (err) {}
          }
        } else {
          if (!checkIsAdmin() && res.role !== 'ADMIN') {
            handleImmediateForceLogout(res.message || 'Please log in with an active student account.');
          }
        }
      })
      .catch(() => {
        if (!checkIsAdmin()) {
          handleImmediateForceLogout('Network connection error verifying credentials.');
        }
      });

    heartbeatInterval = setInterval(() => {
      fetch(`/api/auth/me?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
        .then(r => r.json())
        .then(authRes => {
          if (checkIsAdmin() || authRes?.role === 'ADMIN') return;
          if (!authRes.authenticated || !authRes.user) {
            handleImmediateForceLogout(authRes.message || 'Your enrollment access has been revoked or rejected by Administrator Ecom with Sami.');
          }
        })
        .catch(() => {});
    }, 20000);

    // Fetch modules directly from DB
    fetch(`/api/lms/modules?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.modules) {
          setModules(res.modules);
          try {
            localStorage.setItem('sami_lms_modules_cache', JSON.stringify(res.modules));
          } catch (e) {}
          if (res.modules[0]?.lessons[0]) {
            setActiveLesson((prev: any) => prev || res.modules[0].lessons[0]);
          }
        }
      });

    // Fetch suppliers directly from DB
    fetch(`/api/lms/suppliers?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.suppliers) {
          setSuppliers(res.suppliers);
          try {
            localStorage.setItem('sami_lms_suppliers_cache', JSON.stringify(res.suppliers));
          } catch (e) {}
        }
      });

    // Fetch resources directly from DB
    fetch(`/api/lms/resources?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.resources) {
          setResources(res.resources);
          try {
            localStorage.setItem('sami_lms_resources_cache', JSON.stringify(res.resources));
          } catch (e) {}
        }
      });

    // Fetch CMS settings (including special LMS frameworks) directly from DB
    fetch(`/api/cms/content?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.content?.lms_overview) {
          const ov = res.content.lms_overview;
          setLmsOverview(ov);
          try {
            localStorage.setItem('sami_lms_overview_cache', JSON.stringify(ov));
          } catch (e) {}

          // Update activeLesson if it's currently on overview so live video URL / titles update immediately
          setActiveLesson((prev: any) => {
            if (prev?.isOverview) {
              return {
                ...prev,
                title: ov.title || prev.title,
                duration: ov.duration || prev.duration,
                videoUrl: ov.video_url !== undefined ? ov.video_url : prev.videoUrl,
                description: ov.description || prev.description,
                badge: ov.badge || prev.badge
              };
            }
            return prev;
          });
        }
        if (res.success && Array.isArray(res.content?.lms_frameworks)) {
          setLmsFrameworks(res.content.lms_frameworks);
          try {
            localStorage.setItem('sami_lms_frameworks_cache', JSON.stringify(res.content.lms_frameworks));
          } catch (e) {}
        } else if (res.success && !res.content?.lms_frameworks) {
          setLmsFrameworks(defaultCmsContent.lms_frameworks || []);
        }
      })
      .catch(() => {});

    // Fetch Community Updates & Announcements
    fetch(`/api/community?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.updates)) {
          setCommunityUpdates(res.updates);
          try {
            const readIdsStr = localStorage.getItem('sami_lms_read_updates_v1') || '[]';
            const readIds: string[] = JSON.parse(readIdsStr);
            const unread = res.updates.filter((u: any) => !readIds.includes(u.id)).length;
            setUnreadCount(unread);
          } catch (e) {
            setUnreadCount(res.updates.length);
          }
        }
      })
      .catch(() => {});

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pageshow', onPageShow);
      clearInterval(heartbeatInterval);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
      if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
      if (realtimeEnrChannel && supabase) supabase.removeChannel(realtimeEnrChannel);
    };
  }, []);

  // Real-Time Community Chat Sync, Cross-Tab Broadcast & Ultra-Fast Polling
  useEffect(() => {
    // Immediate initial sync
    fetchLmsChat(false);

    // Cross-tab broadcast channel for instantaneous 0ms local sync
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('sami_community_chat');
        communityBcRef.current = bc;
        bc.onmessage = (ev) => {
          if (ev.data?.type === 'NEW_CHAT_MESSAGE') {
            fetchLmsChat(true);
          }
        };
      }
    } catch (e) {}

    // Dynamic Fast Polling (Only poll when student is actively on Community view)
    let interval: any = null;
    if (activeTab === 'community') {
      interval = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return;
        fetchLmsChat(true);
      }, 3500);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (communityBcRef.current) {
        communityBcRef.current.close();
        communityBcRef.current = null;
      }
    };
  }, [activeTab]);

  // Auto-scroll WhatsApp chat to newest message internally WITHOUT pushing outer container up
  useEffect(() => {
    if (activeTab === 'community' && communitySubView === 'chat') {
      const timer = setTimeout(() => {
        if (chatScrollContainerRef.current) {
          chatScrollContainerRef.current.scrollTo({
            top: chatScrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, communitySubView, lmsChatMessages.length]);

  const setIsApple = (val: boolean) => {
    setIsIos(val);
  };

  useEffect(() => {
    const handleFsChange = () => {
      const fsElem = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(Boolean(fsElem));
    };

    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.event === 'fullscreen') {
          if (isIosRef.current) {
            setIsIosFullscreen(true);
            try {
              document.body.style.overflow = 'hidden';
            } catch (e) {}
          } else {
            setIsFullscreen(true);
          }
        } else if (data.event === 'exitfullscreen') {
          if (isIosRef.current) {
            setIsIosFullscreen(false);
            try {
              document.body.style.overflow = '';
            } catch (e) {}
          } else {
            setIsFullscreen(false);
          }
        }
      } catch (e) {}
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    window.addEventListener('message', handleWindowMessage);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isIosFullscreen) {
        toggleIosFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isIosFullscreen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sidebarOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevTouchAction = document.body.style.touchAction;
      try {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
      } catch (e) {}

      return () => {
        try {
          document.body.style.overflow = prevOverflow || '';
          document.body.style.touchAction = prevTouchAction || '';
        } catch (e) {}
      };
    }
  }, [sidebarOpen]);

  useEffect(() => {
    return () => {
      try {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      } catch (e) {}
    };
  }, []);

  const isAdmin = Boolean(
    user?.role === 'SUPER_ADMIN' || 
    user?.role === 'ADMIN' || 
    user?.email === 'admin@samiecom.com'
  );

  const markLessonComplete = async (lessonId: string, forceStatus?: boolean) => {
    const isCompleted = completedLessons.includes(lessonId);
    const newStatus = forceStatus !== undefined ? forceStatus : !isCompleted;
    if (isCompleted === newStatus) return;

    const updated = newStatus 
      ? Array.from(new Set([...completedLessons, lessonId]))
      : completedLessons.filter(id => id !== lessonId);
    
    setCompletedLessons(updated);
    setSyncStatus('syncing');
    setSyncFeedback('Syncing progress...');

    try {
      localStorage.setItem('sami_lms_completed_cache', JSON.stringify(updated));
      if (user?.email) {
        localStorage.setItem(`sami_lms_completed_${user.email}`, JSON.stringify(updated));
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id || 'demo',
          email: user?.email || '',
          lessonId,
          completed: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus('synced');
        setSyncFeedback(newStatus ? '✓ Saved to Cloud' : 'Progress updated');
        setTimeout(() => setSyncFeedback(''), 4000);

        if (newStatus && autoProceed && nextLesson) {
          setTimeout(() => {
            setActiveLesson(nextLesson);
          }, 1200);
        }
      } else {
        setSyncStatus('idle');
      }
    } catch (e) {
      console.error('Progress sync error:', e);
      setSyncStatus('idle');
    }
  };

  const toggleLessonComplete = (lessonId: string) => {
    markLessonComplete(lessonId);
  };

  // 100% Dynamic Lesson & Module Calculations (Zero Hardcoding)
  const overviewLesson = useMemo(() => {
    if (!lmsOverview || lmsOverview.is_active === false) return null;
    return {
      id: 'lms_overview_lesson',
      title: lmsOverview.title || 'Mentorship Overview & Strategy Roadmap (Watch First)',
      duration: lmsOverview.duration || '15:20 mins',
      videoUrl: lmsOverview.video_url || '',
      description: lmsOverview.description || '',
      badge: lmsOverview.badge || 'START HERE • ROADMAP',
      isOverview: true
    };
  }, [lmsOverview]);

  const activeFrameworks = (lmsFrameworks || []).filter(f => f.is_active !== false);
  const frameworkLessons = activeFrameworks.flatMap(f => (f.lessons || []).map(l => ({ ...l, moduleId: f.id, isFramework: true })));
  const allLessons = [
    ...(overviewLesson ? [overviewLesson] : []),
    ...modules.flatMap(m => m.lessons || []),
    ...frameworkLessons
  ];
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const isCurrentDone = activeLesson ? completedLessons.includes(activeLesson.id) : false;
  const currentLessonWatchPct = activeLesson 
    ? (isCurrentDone ? 100 : (watchProgress[activeLesson.id] || 0)) 
    : 0;
  const hasLessonVideo = Boolean(
    activeLesson?.videoUrl && 
    activeLesson.videoUrl.trim() && 
    !activeLesson.videoUrl.includes('dQw4w9WgXcQ')
  );
  const isDirectLessonVideo = Boolean(
    activeLesson?.videoUrl && (
      activeLesson.videoUrl.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i) ||
      activeLesson.videoUrl.includes('supabase.co/storage')
    )
  );

  const startPlayback = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastTouchTimeRef.current < 400) return;
      lastTouchTimeRef.current = now;
    }
    setIsPlaying(true);
    setIsMuted(false);

    if (isDirectLessonVideo && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    } else if (lmsIframeRef.current) {
      try {
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*'
        );
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        );
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }),
          '*'
        );
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackQualityRange', args: ['hd1080', 'hd1080'] }),
          '*'
        );
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ method: 'play' }),
          '*'
        );
      } catch (err) {}
    }
  };

  const togglePlay = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastTouchTimeRef.current < 400) return;
      lastTouchTimeRef.current = now;
    }
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (isDirectLessonVideo && videoRef.current) {
      if (nextPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    } else if (lmsIframeRef.current) {
      try {
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: nextPlaying ? 'playVideo' : 'pauseVideo',
            args: []
          }),
          '*'
        );
        if (nextPlaying) {
          lmsIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
            '*'
          );
          lmsIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }),
            '*'
          );
          lmsIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'setPlaybackQualityRange', args: ['hd1080', 'hd1080'] }),
            '*'
          );
        }
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ method: nextPlaying ? 'play' : 'pause' }),
          '*'
        );
      } catch (err) {}
    }
  };

  const toggleMute = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastTouchTimeRef.current < 400) return;
      lastTouchTimeRef.current = now;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isDirectLessonVideo && videoRef.current) {
      videoRef.current.muted = nextMuted;
    } else if (lmsIframeRef.current) {
      try {
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: nextMuted ? 'mute' : 'unMute',
            args: []
          }),
          '*'
        );
        if (!nextMuted) {
          lmsIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
            '*'
          );
        }
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ method: nextMuted ? 'mute' : 'unmute' }),
          '*'
        );
      } catch (err) {}
    }
  };

  const seekVideo = (targetSeconds: number) => {
    const clamped = Math.max(0, Math.min(targetSeconds, Math.max(1, duration)));
    setCurrentTime(clamped);

    if (isDirectLessonVideo && videoRef.current) {
      videoRef.current.currentTime = clamped;
    } else if (lmsIframeRef.current) {
      try {
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [clamped, true]
          }),
          '*'
        );
        lmsIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ method: 'setCurrentTime', value: clamped }),
          '*'
        );
      } catch (err) {}
    }
  };

  const handleTimelineInteraction = (clientX: number) => {
    if (!lmsTimelineTrackRef.current) return;
    const rect = lmsTimelineTrackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetSeconds = Math.floor(percent * Math.max(1, duration));
    seekVideo(targetSeconds);
  };

  const onIframeLoaded = () => {
    try {
      lmsIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1 }),
        '*'
      );
      lmsIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }),
        '*'
      );
      lmsIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackQualityRange', args: ['hd1080', 'hd1080'] }),
        '*'
      );
    } catch (err) {}
  };

  // Reset playback and duration on lesson switch
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    hasRestoredPosRef.current = false;
    setVideoLoadError(false);
  }, [activeLesson?.id]);

  // Listen for YouTube API & PlayerJS progress & state updates
  useEffect(() => {
    const handleWindowMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            const cur = Math.floor(data.info.currentTime);
            setCurrentTime(cur);
            if (activeLesson) {
              try {
                localStorage.setItem(`sami_lms_pos_${activeLesson.id}`, String(cur));
              } catch (err) {}
            }
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            const dur = Math.floor(data.info.duration);
            setDuration(dur);
            if (activeLesson) {
              saveDetectedDuration(activeLesson.id, formatDurationLabel(dur));
            }

            // Restore saved timestamp once per lesson load
            if (activeLesson && !hasRestoredPosRef.current) {
              hasRestoredPosRef.current = true;
              try {
                const savedPos = localStorage.getItem(`sami_lms_pos_${activeLesson.id}`);
                if (savedPos && Number(savedPos) > 5 && Number(savedPos) < dur - 10) {
                  seekVideo(Number(savedPos));
                }
              } catch (err) {}
            }

            // Watch progress tracking for YouTube videos
            if (data.info.currentTime && dur > 0) {
              const pct = Math.min(100, Math.round((data.info.currentTime / dur) * 100));
              if (activeLesson) {
                setWatchProgress(prev => {
                  const current = prev[activeLesson.id] || 0;
                  if (pct > current) {
                    const nextMap = { ...prev, [activeLesson.id]: pct };
                    try {
                      localStorage.setItem('sami_lms_watch_progress', JSON.stringify(nextMap));
                    } catch (err) {}
                    return nextMap;
                  }
                  return prev;
                });
                if (pct >= 90 && !completedLessons.includes(activeLesson.id)) {
                  markLessonComplete(activeLesson.id, true);
                }
              }
            }
          }
          if (typeof data.info.playerState === 'number') {
            if (data.info.playerState === 1) {
              setIsPlaying(true);
              try {
                lmsIframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }),
                  '*'
                );
              } catch (err) {}
            } else if (data.info.playerState === 2) {
              setIsPlaying(false);
            } else if (data.info.playerState === 0) {
              setIsPlaying(false);
              if (activeLesson && !completedLessons.includes(activeLesson.id)) {
                markLessonComplete(activeLesson.id, true);
              }
            }
          }
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [activeLesson, completedLessons]);

  const isOverviewActive = Boolean(activeLesson?.isOverview);
  const activeFrameworkObj = activeFrameworks.find(f => f.lessons?.some((l: any) => l.id === activeLesson?.id));
  const activeModule = isOverviewActive ? {
    id: 0,
    title: lmsOverview?.title || 'Mentorship Overview & Strategy Roadmap (Watch First)',
    duration: lmsOverview?.duration || '',
    description: lmsOverview?.description || '',
    lessons: overviewLesson ? [overviewLesson] : []
  } : (modules.find(m => m.lessons?.some(l => l.id === activeLesson?.id)) || (activeFrameworkObj ? {
    id: 999,
    title: activeFrameworkObj.title,
    duration: '',
    description: activeFrameworkObj.description || '',
    lessons: (activeFrameworkObj.lessons || []) as any
  } : modules[0]));
  const activeModuleCompletedCount = activeModule ? (activeModule.lessons || []).filter((l: any) => completedLessons.includes(l.id)).length : 0;
  const activeModuleTotalCount = activeModule?.lessons?.length || 1;
  const isOverviewDone = overviewLesson ? completedLessons.includes(overviewLesson.id) : false;
  const activeModulePercent = isOverviewActive 
    ? (isOverviewDone ? 100 : (currentLessonWatchPct || 0))
    : Math.round((activeModuleCompletedCount / activeModuleTotalCount) * 100);

  const filteredSuppliers = suppliers.filter(s => {
    const matchesCountry = supplierCountryFilter === 'ALL' || s.country === supplierCountryFilter;
    const matchesQuery = s.name.toLowerCase().includes(supplierSearch.toLowerCase()) || 
                         s.category.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                         s.city.toLowerCase().includes(supplierSearch.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  if (accountRevoked) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20">
          <Lock size={40} className="text-red-400" />
        </div>

        <div className="max-w-md space-y-3">
          <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
            LMS ACCESS SUSPENDED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Account Revoked
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {accountRevoked}
          </p>
          <p className="text-[11px] text-slate-400">
            If you already submitted your enrollment fee, please verify your payment proof slip with Mentor Ecom with Sami on WhatsApp.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/login?reason=rejected"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Go to Login Page
            </a>
            <a
              href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20My%20LMS%20account%20was%20marked%20as%20suspended.%20Please%20verify%20my%20proof."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <MessageSquare size={14} />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      
      {/* ========================================================================= */}
      {/* TOP HEADER BAR (Ultra-Clean Light & Royal Blue Theme) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xs">
        {/* Left Branding (Non-clickable: Student stays inside LMS classroom) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
            aria-label="Toggle Curriculum Sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="hidden xs:inline">Modules</span>
          </button>

          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-700 flex items-center justify-center font-black text-white text-base shadow-sm shadow-blue-500/30">
              S
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight block leading-tight">
                Ecom With Sami
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                Mastery Mentorship
              </span>
            </div>
          </div>

          {/* DRM Secure Badge */}
          <button
            onClick={() => setShowDrmModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold transition-all shadow-xs cursor-pointer ml-1"
            title="Content Protection Active"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>DRM Protected &amp; Secure</span>
          </button>
        </div>

        {/* Center Navigation Pills (Desktop) */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Play size={13} className={activeTab === 'video' ? 'fill-white' : ''} />
            <span>Curriculum</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'suppliers'
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShoppingBag size={13} />
            <span>Supplier Details</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Download size={13} />
            <span>Bonuses</span>
          </button>

          {(() => {
            const totalCommunityUnread = unreadCount + unreadChatCount;
            return (
              <button
                onClick={() => {
                  setActiveTab('community');
                  markUpdatesAsRead();
                  markChatAsRead();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer relative ${
                  activeTab === 'community'
                    ? 'bg-[#008069] text-white font-bold shadow-sm shadow-[#008069]/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <MessageCircle size={13} className={totalCommunityUnread > 0 ? 'text-amber-300 animate-pulse' : ''} />
                <span>Community</span>
                {totalCommunityUnread > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}
                  </span>
                )}
              </button>
            );
          })()}
        </div>

        {/* Right Status, Progress & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Progress Tracker Strip (Dynamic & Accurate) */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">Progress:</span>
            <div className="w-20 md:w-28 bg-slate-200/90 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <strong className="text-blue-700 font-bold text-xs">{progressPercent}%</strong>
            <span className="text-slate-400 text-[10px]">({completedLessons.length}/{totalLessons})</span>
            
            {syncStatus === 'syncing' && (
              <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold animate-pulse ml-1">
                <Loader2 size={11} className="animate-spin" />
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold ml-1" title="Cloud Synced">
                <Cloud size={12} />
              </span>
            )}
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="hidden md:block leading-tight">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="truncate max-w-[110px]">{user?.name || 'Student'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Online" />
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {user?.email || 'student@samiecom.com'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/80 transition-colors cursor-pointer"
              title="Log Out of Classroom"
            >
              <LogOut size={15} />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN LAYOUT: SIDEBAR + MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            onTouchMove={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          />
        )}

        {/* ========================================================================= */}
        {/* LEFT COLUMN: COURSE CURRICULUM ACCORDION & CONNECTING TREE LINES */}
        {/* ========================================================================= */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-[92vw] max-w-sm sm:w-88 md:w-96 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          } h-[100dvh] lg:h-[calc(100vh-61px)] max-h-[100dvh] lg:max-h-[calc(100vh-61px)] overscroll-contain`}
          style={{ touchAction: 'pan-y' }}
        >
          {/* Sidebar Top: Title & Completion Stats (Dynamic and accurate) */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white shrink-0 z-10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    Course Curriculum
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block">
                    {completedLessons.length} of {totalLessons} Lectures completed ({progressPercent}%)
                  </span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors shadow-xs active:scale-95"
                aria-label="Close Curriculum Drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Curriculum Search Bar */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search lessons, topics, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Currently On Tracker Sub-header */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span className="text-slate-600 font-semibold text-[11px] truncate" title={activeLesson?.title}>
                  Currently on: <strong className="text-slate-900">{activeLesson?.title || 'Module 1.1'}</strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md shrink-0">
                {activeModulePercent}% Mastered
              </span>
            </div>
          </div>

          {/* Module List with Vertical Connecting Tree Lines & Smooth Touch Momentum Scrolling */}
          <div 
            ref={moduleListRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-2.5 bg-slate-50/50 touch-pan-y"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              overscrollBehaviorY: 'contain'
            }}
          >
            {/* Dedicated Course Overview & Mentorship Roadmap (Direct Top Section, No Nested Lectures) */}
            {overviewLesson && (!searchQuery || overviewLesson.title.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <div 
                className={`border rounded-2xl bg-white transition-all shadow-xs ${
                  activeLesson?.isOverview 
                    ? 'border-blue-500 ring-2 ring-blue-100 shadow-md bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30' 
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveLesson(overviewLesson)}
                  className="w-full p-3 text-left flex items-start justify-between gap-2.5 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-800 min-w-0 flex-1">
                    {completedLessons.includes(overviewLesson.id) ? (
                      <div 
                        style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
                        className="w-5.5 h-5.5 min-w-[22px] min-h-[22px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 aspect-square mt-0.5"
                      >
                        <CheckCircle2 size={14} />
                      </div>
                    ) : (
                      <div 
                        style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
                        className={`w-5.5 h-5.5 min-w-[22px] min-h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square mt-0.5 ${
                          activeLesson?.isOverview 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors'
                        }`}
                      >
                        <Play size={10} className="fill-current ml-0.5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200/80">
                          <Sparkles size={9} className="text-blue-600" />
                          <span>{overviewLesson.badge || 'START HERE • ROADMAP'}</span>
                        </span>
                        {activeLesson?.isOverview && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <span className="text-slate-900 font-bold text-xs leading-snug break-words block">
                        {overviewLesson.title}
                      </span>
                      {(() => {
                        const detectedDur = detectedDurations[overviewLesson.id];
                        const validDbDur = overviewLesson.duration && !isFakeTimer(overviewLesson.duration) ? overviewLesson.duration : '';
                        const liveDur = activeLesson?.isOverview && duration > 0 ? formatDurationLabel(duration) : '';
                        const displayDur = liveDur || detectedDur || validDbDur;
                        if (!displayDur) return null;
                        return (
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-1">
                            <Clock size={10} className="text-slate-400" />
                            <span>{displayDur}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] shrink-0 pt-0.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                      activeLesson?.isOverview
                        ? 'bg-blue-600 text-white'
                        : Boolean(overviewLesson.videoUrl && overviewLesson.videoUrl.trim())
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                    }`}>
                      {activeLesson?.isOverview ? 'Watching' : 'Overview'}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {modules.map((m) => {
              const isOpen = openModuleId === m.id;
              const moduleCompletedCount = m.lessons?.filter(l => completedLessons.includes(l.id)).length || 0;
              const activeLessonsCount = m.lessons?.filter(l => Boolean(l.videoUrl && l.videoUrl.trim() && !l.videoUrl.includes('dQw4w9WgXcQ'))).length || 0;
              const totalLessonsCount = m.lessons?.length || 0;
              const isAllCompleted = moduleCompletedCount === totalLessonsCount && totalLessonsCount > 0;
              const isActiveModule = m.lessons?.some(l => l.id === activeLesson?.id);

              return (
                <div 
                  key={m.id} 
                  className={`border rounded-2xl bg-white transition-all shadow-xs ${
                    isActiveModule ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
                  }`}
                >
                  {/* Module Header Button */}
                  <button
                    onClick={() => setOpenModuleId(isOpen ? 0 : m.id)}
                    className="w-full p-3 text-left flex items-start justify-between gap-2 hover:bg-slate-50/80 rounded-2xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 text-xs font-bold text-slate-800 min-w-0 flex-1">
                      {isAllCompleted ? (
                        <div 
                          style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
                          className="w-5.5 h-5.5 min-w-[22px] min-h-[22px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 aspect-square mt-0.5"
                        >
                          <CheckCircle2 size={14} />
                        </div>
                      ) : (
                        <div 
                          style={{ width: '22px', height: '22px', minWidth: '22px', minHeight: '22px' }}
                          className={`w-5.5 h-5.5 min-w-[22px] min-h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 aspect-square mt-0.5 ${
                            isActiveModule 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {m.id}
                        </div>
                      )}
                      <span className="text-slate-900 font-bold text-xs leading-snug break-words">
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 shrink-0 pt-0.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                        activeLessonsCount > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                      }`}>
                        {activeLessonsCount}/{totalLessonsCount} Active
                      </span>
                      {isOpen ? (
                        <ChevronDown size={14} className="text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Collapsed Lectures Tree (Vertical Connector Line Branching out) */}
                  {isOpen && (
                    <div className="px-2.5 sm:px-3 pb-3 pt-1 border-t border-slate-100">
                      {/* Vertical Connecting Line Container */}
                      <div className="relative pl-3.5 ml-2 sm:pl-5 sm:ml-3 border-l-2 border-blue-200/90 space-y-2 py-1">
                        {m.lessons
                          ?.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((lesson) => {
                            const isDone = completedLessons.includes(lesson.id);
                            const isCurrent = activeLesson?.id === lesson.id;

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  setActiveLesson(lesson);
                                  setActiveTab('video');
                                  setSidebarOpen(false);
                                }}
                                className={`relative p-2.5 rounded-xl cursor-pointer flex items-start gap-2.5 text-xs transition-all ${
                                  isCurrent
                                    ? 'bg-blue-50/90 text-blue-950 font-bold border-2 border-blue-400 shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/70 hover:border-slate-300'
                                }`}
                              >
                                {/* Tree Branch Connector Line Node */}
                                <div 
                                  className={`absolute -left-[16px] sm:-left-[21px] top-4 w-3.5 sm:w-4 h-0.5 pointer-events-none ${
                                    isCurrent ? 'bg-blue-500' : 'bg-blue-200'
                                  }`} 
                                />

                                {/* Play Icon or CheckCircle */}
                                <div className="shrink-0 mt-0.5">
                                  {isCurrent ? (
                                    <div 
                                      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                                      className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 aspect-square shadow-xs shadow-blue-500/40"
                                    >
                                      <Play size={10} className="fill-white ml-0.5" />
                                    </div>
                                  ) : isDone ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLessonComplete(lesson.id);
                                      }}
                                      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                                      className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 aspect-square text-emerald-600 hover:text-emerald-700 flex items-center justify-center cursor-pointer p-0 m-0 border-0 bg-transparent"
                                      title="Completed (Click to Toggle)"
                                    >
                                      <CheckCircle2 size={18} className="shrink-0 aspect-square" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isAdmin || isDone) {
                                          toggleLessonComplete(lesson.id);
                                        } else {
                                          setSyncFeedback('Watch 90% to complete');
                                          setTimeout(() => setSyncFeedback(''), 3000);
                                        }
                                      }}
                                      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                                      className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 aspect-square flex items-center justify-center text-slate-300 hover:text-blue-500 cursor-pointer p-0 m-0 border-0 bg-transparent"
                                      title={isAdmin ? 'Admin toggle' : 'Watch video to complete'}
                                    >
                                      <Circle size={18} strokeWidth={2.2} className="shrink-0 aspect-square" />
                                    </button>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                  <span className={`block text-xs leading-snug break-words ${isCurrent ? 'font-black text-blue-950' : 'font-semibold text-slate-800'}`}>
                                    {lesson.title}
                                  </span>

                                  {/* Sub-row: Status & Duration Badge (cleanly placed underneath title) */}
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    {(() => {
                                      const hasVideo = Boolean(lesson.videoUrl && lesson.videoUrl.trim() && !lesson.videoUrl.includes('dQw4w9WgXcQ'));
                                      const detectedDur = detectedDurations[lesson.id];
                                      const validDbDuration = lesson.duration && !isFakeTimer(lesson.duration) ? lesson.duration : '';
                                      const currentActiveDur = isCurrent && duration > 0 ? formatDurationLabel(duration) : '';
                                      const displayDuration = currentActiveDur || detectedDur || validDbDuration;

                                      if (!hasVideo) {
                                        return (
                                          <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md text-slate-400 bg-slate-100 border border-slate-200/50 inline-block">
                                            Upcoming
                                          </span>
                                        );
                                      }

                                      return (
                                        <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 ${
                                          isCurrent 
                                            ? 'bg-blue-600 text-white shadow-xs' 
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        }`}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
                                          <span>Active</span>
                                          {displayDuration && (
                                            <span className={`font-medium ${isCurrent ? 'text-blue-100' : 'text-emerald-800'}`}>
                                              • {displayDuration}
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ========================================================================= */}
            {/* SPECIAL SIGNATURE & FINAL FRAMEWORK MODULES (PREMIUM HIGHLIGHTED SECTION) */}
            {/* ========================================================================= */}
            {modules.length > 0 && activeFrameworks.map((fw) => {
              const isOpen = openFrameworkId === fw.id;
              const fwCompletedCount = fw.lessons?.filter(l => completedLessons.includes(l.id)).length || 0;
              const activeLessonsCount = fw.lessons?.filter(l => Boolean(l.videoUrl && l.videoUrl.trim())).length || 0;
              const totalLessonsCount = fw.lessons?.length || 0;
              const isAllCompleted = fwCompletedCount === totalLessonsCount && totalLessonsCount > 0;
              const isActiveFramework = fw.lessons?.some(l => l.id === activeLesson?.id);

              const filteredLessons = (fw.lessons || []).filter(l => 
                l.title.toLowerCase().includes(searchQuery.toLowerCase())
              );

              return (
                <div 
                  key={fw.id}
                  className={`relative rounded-2xl transition-all duration-300 mt-5 mb-2 overflow-visible ${
                    isActiveFramework 
                      ? 'ring-2 ring-[#00A0DF] shadow-[0_0_25px_rgba(0,160,223,0.35)]' 
                      : 'shadow-xl hover:shadow-[0_0_20px_rgba(0,160,223,0.2)]'
                  } bg-gradient-to-br from-[#0B0F19] via-[#0d1627] to-[#070b13] border-2 border-[#00A0DF] text-white`}
                >
                  {/* Floating Signature/Final Badge on top right */}
                  <div className="absolute -top-3 right-3 sm:right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 select-none z-10">
                    <Star size={10} className="fill-slate-950 text-slate-950" />
                    <span>{fw.badge || '★ SIGNATURE FRAMEWORK'}</span>
                  </div>

                  {/* Ambient soft glow inside card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A0DF]/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Card Header Button */}
                  <button
                    type="button"
                    onClick={() => setOpenFrameworkId(isOpen ? null : fw.id)}
                    className="w-full p-3.5 text-left rounded-2xl transition-colors cursor-pointer relative z-1"
                  >
                    {/* Tag Pill */}
                    {fw.tag && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00A0DF]/20 border border-[#00A0DF]/40 text-[#00A0DF] text-[9.5px] font-black tracking-wider uppercase mb-1.5 shadow-2xs">
                        <Sparkles size={10} className="text-[#00A0DF]" />
                        <span className="truncate max-w-[210px]">{fw.tag}</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight leading-snug line-clamp-2">
                          {fw.title}
                        </h3>
                        {fw.subtitle && (
                          <p className="text-[10px] font-bold text-amber-400 tracking-wide mt-0.5 truncate">
                            {fw.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] flex-shrink-0 pt-0.5">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40">
                          {activeLessonsCount}/{totalLessonsCount} Active
                        </span>
                        {isOpen ? (
                          <ChevronDown size={14} className="text-slate-300" />
                        ) : (
                          <ChevronRight size={14} className="text-slate-300" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Collapsed Lectures Tree (Dark Mode Glassmorphism) */}
                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-white/10 relative z-1">
                      {filteredLessons.length === 0 ? (
                        <p className="text-[11px] text-slate-400 py-2 text-center">
                          No lectures found
                        </p>
                      ) : (
                        <div className="relative pl-3.5 ml-2 sm:pl-5 sm:ml-3 border-l-2 border-[#00A0DF]/40 space-y-2 py-1">
                          {filteredLessons.map((lesson) => {
                            const isDone = completedLessons.includes(lesson.id);
                            const isCurrent = activeLesson?.id === lesson.id;
                            const hasVideo = Boolean(lesson.videoUrl && lesson.videoUrl.trim());

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  setActiveLesson({ ...lesson, moduleId: fw.id, isFramework: true } as any);
                                  setActiveTab('video');
                                  setSidebarOpen(false);
                                }}
                                className={`relative p-2.5 rounded-xl cursor-pointer flex items-start gap-2.5 text-xs transition-all ${
                                  isCurrent
                                    ? 'bg-[#00A0DF]/25 text-white font-bold border-2 border-[#00A0DF] shadow-md shadow-[#00A0DF]/20'
                                    : 'bg-[#111827]/90 hover:bg-[#1a2336] text-slate-200 border border-white/10 hover:border-[#00A0DF]/40'
                                }`}
                              >
                                {/* Tree Branch Connector Line */}
                                <div 
                                  className={`absolute -left-[16px] sm:-left-[21px] top-4 w-3.5 sm:w-4 h-0.5 pointer-events-none ${
                                    isCurrent ? 'bg-[#00A0DF]' : 'bg-[#00A0DF]/40'
                                  }`} 
                                />

                                <div className="shrink-0 mt-0.5">
                                  {isCurrent ? (
                                    <div 
                                      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                                      className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-[#00A0DF] text-white flex items-center justify-center shrink-0 aspect-square shadow-xs shadow-[#00A0DF]/40"
                                    >
                                      <Play size={10} className="fill-white ml-0.5" />
                                    </div>
                                  ) : isDone ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLessonComplete(lesson.id);
                                      }}
                                      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                                      className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 aspect-square text-emerald-400 hover:text-emerald-300 flex items-center justify-center cursor-pointer p-0 m-0 border-0 bg-transparent"
                                      title="Completed (Click to Toggle)"
                                    >
                                      <CheckCircle2 size={18} className="shrink-0 aspect-square" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isAdmin || isDone) {
                                          toggleLessonComplete(lesson.id);
                                        } else {
                                          setSyncFeedback('Watch 90% to complete');
                                          setTimeout(() => setSyncFeedback(''), 3000);
                                        }
                                      }}
                                      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                                      className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 aspect-square flex items-center justify-center text-slate-500 hover:text-[#00A0DF] cursor-pointer p-0 m-0 border-0 bg-transparent"
                                      title={isAdmin ? 'Admin toggle' : 'Watch video to complete'}
                                    >
                                      <Circle size={18} strokeWidth={2.2} className="shrink-0 aspect-square" />
                                    </button>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                  <span className={`block text-xs leading-snug break-words ${isCurrent ? 'font-black text-white' : isDone ? 'text-slate-400 line-through' : 'text-slate-200 font-semibold'}`}>
                                    {lesson.title}
                                  </span>

                                  {/* Sub-row: Status & Duration Badge */}
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    {hasVideo ? (
                                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 ${
                                        isCurrent 
                                          ? 'bg-[#00A0DF] text-white shadow-xs' 
                                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} />
                                        <span>Active</span>
                                        {lesson.duration && (
                                          <span className={`font-medium ${isCurrent ? 'text-blue-100' : 'text-emerald-200'}`}>
                                            • {lesson.duration}
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md text-slate-400 bg-slate-800 border border-white/10 inline-block">
                                        Upcoming
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer Security Tag */}
          <div className="p-3 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Lock size={12} className="text-blue-600" />
              <span>Encrypted Mentorship Vault</span>
            </span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              SamiLMS v2.4
            </span>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT STAGE: MAIN CLASSROOM AREA */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col overflow-y-auto max-h-screen lg:max-h-[calc(100vh-61px)] bg-[#F8FAFC]">
          
          {/* Subtle Clean Notice Banner */}
          <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs z-20">
            <div className="flex items-center gap-2 text-blue-900">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
              <span className="font-bold text-[11px] sm:text-xs">Dynamic Watermark Active:</span>
              <span className="text-slate-600 text-[11px] hidden sm:inline">
                All video streams contain encrypted forensic identification tied to your student ID.
              </span>
            </div>

            <button
              onClick={() => setShowDrmModal(true)}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View Policy</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* CONTENT ROUTING BASED ON ACTIVE TAB */}
          {/* ========================================================================= */}
          <div className="p-3 sm:p-6 lg:p-8 flex-1">
            
            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: VIDEO LECTURE / CURRICULUM */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'video' && (
              <div className="max-w-5xl mx-auto space-y-5">
                
                {/* Top Action & Navigation Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  {/* Previous / Next Lecture Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prevLesson && setActiveLesson(prevLesson)}
                      disabled={!prevLesson}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={() => nextLesson && setActiveLesson(nextLesson)}
                      disabled={!nextLesson}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>Next Lecture</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Auto-proceed & Mark as Completed Button */}
                  <div className="flex items-center gap-3">
                    <label className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoProceed}
                        onChange={(e) => {
                          setAutoProceed(e.target.checked);
                          try {
                            localStorage.setItem('sami_lms_auto_proceed', String(e.target.checked));
                          } catch (err) {}
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>Auto-proceed</span>
                    </label>

                    {/* Main Mark as Completed Button */}
                    <button
                      onClick={() => {
                        if (!activeLesson) return;
                        if (isCurrentDone) {
                          markLessonComplete(activeLesson.id, false);
                        } else if (!isDirectLessonVideo || currentLessonWatchPct >= 90 || isAdmin) {
                          markLessonComplete(activeLesson.id, true);
                        }
                      }}
                      disabled={!isCurrentDone && isDirectLessonVideo && currentLessonWatchPct < 90 && !isAdmin}
                      className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                        isCurrentDone
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : !isDirectLessonVideo || currentLessonWatchPct >= 90 || isAdmin
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80'
                      }`}
                    >
                      {isCurrentDone ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Completed (Undo)</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 16:9 Responsive Video Player Container (Watermark STRICTLY locked inside) */}
                <div
                  ref={playerContainerRef}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`bg-slate-950 flex items-center justify-center transition-all select-none ${
                    isIosFullscreen
                      ? 'fixed inset-0 z-[999999] w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none border-0 shadow-none'
                      : 'relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300 shadow-xl'
                  }`}
                  style={
                    isIosFullscreen
                      ? {
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          width: '100vw',
                          height: '100dvh',
                          zIndex: 999999,
                          backgroundColor: '#000',
                        }
                      : undefined
                  }
                >
                  {/* Video Stage Container */}
                  <div
                    className="relative w-full h-full flex items-center justify-center overflow-hidden"
                    style={{
                      width: isIosFullscreen ? 'min(100vw, calc(100dvh * 16 / 9))' : '100%',
                      height: isIosFullscreen ? 'min(100dvh, calc(100vw * 9 / 16))' : '100%',
                    }}
                  >
                    {!hasLessonVideo ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-black select-none">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10 animate-pulse">
                          <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                        </div>
                        <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                          ⏳ COMING SOON
                        </span>
                        <h3 className="text-base sm:text-xl font-bold text-white max-w-md line-clamp-2 mb-2">
                          {activeLesson?.title || 'Video Lecture'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                          Lecture video stream link will be uploaded soon by Mentor Ecom with Sami.
                        </p>
                      </div>
                    ) : isDirectLessonVideo ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video
                          ref={videoRef}
                          key={activeLesson?.id + (activeLesson?.videoUrl || '')}
                          playsInline
                          // @ts-ignore
                          webkit-playsinline="true"
                          x5-playsinline="true"
                          preload="metadata"
                          onError={() => setVideoLoadError(true)}
                          onLoadedData={() => setVideoLoadError(false)}
                          onLoadedMetadata={(e) => {
                            setVideoLoadError(false);
                            const vid = e.currentTarget;
                            if (vid.duration && isFinite(vid.duration) && vid.duration > 0) {
                              const dur = Math.floor(vid.duration);
                              setDuration(dur);
                              if (activeLesson) {
                                saveDetectedDuration(activeLesson.id, formatDurationLabel(dur));
                              }
                            }
                            try {
                              const savedPos = localStorage.getItem(`sami_lms_pos_${activeLesson?.id}`);
                              if (savedPos && Number(savedPos) > 5 && Number(savedPos) < vid.duration - 10) {
                                vid.currentTime = Number(savedPos);
                                setCurrentTime(Number(savedPos));
                              }
                            } catch (err) {}
                          }}
                          onTimeUpdate={(e) => {
                            const vid = e.currentTarget;
                            if (!vid.duration || !isFinite(vid.duration) || vid.duration <= 0) return;
                            const cur = Math.floor(vid.currentTime);
                            setCurrentTime(cur);
                            const pct = Math.min(100, Math.round((vid.currentTime / vid.duration) * 100));

                            try {
                              localStorage.setItem(`sami_lms_pos_${activeLesson?.id}`, String(cur));
                            } catch (err) {}

                            setWatchProgress(prev => {
                              const current = prev[activeLesson?.id] || 0;
                              if (pct > current) {
                                const nextMap = { ...prev, [activeLesson?.id]: pct };
                                try {
                                  localStorage.setItem('sami_lms_watch_progress', JSON.stringify(nextMap));
                                } catch (err) {}
                                return nextMap;
                              }
                              return prev;
                            });

                            if (pct >= 90 && activeLesson && !completedLessons.includes(activeLesson.id)) {
                              markLessonComplete(activeLesson.id, true);
                            }
                          }}
                          onEnded={() => {
                            setIsPlaying(false);
                            if (activeLesson && !completedLessons.includes(activeLesson.id)) {
                              markLessonComplete(activeLesson.id, true);
                            }
                          }}
                          className="w-full h-full object-contain bg-black pointer-events-none select-none"
                        >
                          <source src={activeLesson?.videoUrl} />
                          Your browser does not support HTML5 video streaming.
                        </video>

                        {videoLoadError && (
                          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-20">
                            <AlertCircle size={32} className="text-amber-400 mb-2 animate-bounce" />
                            <p className="text-sm font-bold text-white mb-1">Video stream connection buffering...</p>
                            <button
                              onClick={() => {
                                setVideoLoadError(false);
                                if (videoRef.current) {
                                  videoRef.current.load();
                                  videoRef.current.play().catch(() => {});
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                            >
                              <RotateCcw size={13} />
                              <span>Reload Video Stream</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                        <iframe
                          ref={lmsIframeRef}
                          key={activeLesson?.id + (activeLesson?.videoUrl || '')}
                          src={getYouTubeEmbedUrl(activeLesson?.videoUrl)}
                          title={activeLesson?.title || 'Lesson Video'}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          tabIndex={-1}
                          onLoad={onIframeLoaded}
                          width="100%"
                          height="100%"
                          className="w-full h-full pointer-events-none select-none border-0"
                        />
                      </div>
                    )}
                  </div>

                  {/* Transparent Click Shield (Physically intercepts 100% of taps/clicks, zero YouTube clickthrough leaks) */}
                  {hasLessonVideo && (
                    <div
                      onClick={togglePlay}
                      style={{ touchAction: 'manipulation' }}
                      className="absolute inset-0 z-10 cursor-pointer"
                      title={isPlaying ? 'Click to Pause' : 'Click to Play'}
                    />
                  )}

                  {/* Center Floating Play Button (When video is paused) */}
                  {hasLessonVideo && !isPlaying && (
                    <button
                      type="button"
                      aria-label="Play lecture video"
                      onClick={startPlayback}
                      style={{ touchAction: 'manipulation' }}
                      className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-black/25 backdrop-blur-[1px] cursor-pointer transition-opacity select-none group/playbtn"
                    >
                      <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16">
                        <span className="afaq-wave-ring afaq-wave-ring-1" />
                        <span className="afaq-wave-ring afaq-wave-ring-2" />
                        <span className="afaq-wave-ring afaq-wave-ring-3" />

                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,99,235,0.5)] border-2 border-white/90 hover:scale-105 active:scale-95 transition-transform duration-200">
                          <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-white text-white pointer-events-none" />
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Dynamic Forensic Watermark Overlay (STRICTLY within video canvas at z-20, persists on Fullscreen) */}
                  <DynamicForensicWatermark user={user} isFullscreen={isFullscreen || isIosFullscreen} />

                  {/* Custom Sleek Bottom Control Bar */}
                  {hasLessonVideo && (
                    <div
                      className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2.5 transition-opacity duration-200 ${
                        !isPlaying || isControlsHovered ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                      }`}
                      onMouseEnter={() => setIsControlsHovered(true)}
                      onMouseLeave={() => setIsControlsHovered(false)}
                    >
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Play / Pause Toggle Button */}
                      <button
                        type="button"
                        onClick={togglePlay}
                        style={{ touchAction: 'manipulation' }}
                        className="text-white hover:text-blue-400 active:scale-90 transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center cursor-pointer select-none hover:bg-white/10"
                        title={isPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-white ml-0.5" />}
                      </button>

                      {/* Mute / Unmute Button */}
                      <button
                        type="button"
                        onClick={toggleMute}
                        style={{ touchAction: 'manipulation' }}
                        className="text-white hover:text-blue-400 active:scale-90 transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center cursor-pointer select-none hover:bg-white/10"
                        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>

                      {/* Video Time Indicator */}
                      <span className="text-[10.5px] sm:text-xs font-mono font-bold text-white tracking-tight whitespace-nowrap ml-1 select-none">
                        {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                      </span>
                    </div>

                    {/* Interactive Draggable & Tap-to-Seek Scrubber Bar */}
                    <div
                      ref={lmsTimelineTrackRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimelineInteraction(e.clientX);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        if (e.touches[0]) handleTimelineInteraction(e.touches[0].clientX);
                      }}
                      onTouchMove={(e) => {
                        e.stopPropagation();
                        if (e.touches[0]) handleTimelineInteraction(e.touches[0].clientX);
                      }}
                      style={{ touchAction: 'none' }}
                      className="flex-1 mx-2 sm:mx-3 py-3 -my-3 flex items-center cursor-pointer select-none group/timeline relative"
                      title="Drag or tap to seek"
                    >
                      <div className="w-full bg-white/25 group-hover/timeline:bg-white/35 rounded-full h-1.5 sm:h-2 relative overflow-visible transition-colors">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-[width] duration-75"
                          style={{ width: `${Math.min(100, (currentTime / Math.max(1, duration)) * 100)}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 transition-transform active:scale-125 group-hover/timeline:scale-110 pointer-events-none"
                          style={{ left: `${Math.min(100, (currentTime / Math.max(1, duration)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Container Fullscreen Button (Watermark stays active) */}
                    <button
                      type="button"
                      onClick={togglePlayerFullscreen}
                      style={{ touchAction: 'manipulation' }}
                      className="text-white hover:text-blue-400 active:scale-90 transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center cursor-pointer select-none hover:bg-white/10"
                      title={isFullscreen || isIosFullscreen ? 'Exit Fullscreen' : 'Protected Fullscreen (Watermark Active)'}
                    >
                      {isFullscreen || isIosFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                  </div>
                  )}

                  {/* iOS Fullscreen Floating Exit [X] Button */}
                  {isIosFullscreen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleIosFullscreen();
                      }}
                      className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-black/80 hover:bg-red-600 text-white border border-white/20 shadow-2xl backdrop-blur-md active:scale-95 flex items-center justify-center cursor-pointer"
                      title="Exit Fullscreen"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  )}
                </div>

                {/* Lecture Info Card (Below Video Player) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                  {/* Badges Strip */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {activeLesson?.isOverview ? (activeLesson?.badge || 'START HERE • ROADMAP') : `CURRENT LECTURE • MODULE ${activeModule?.id || 1}`}
                    </span>
                    {hasLessonVideo ? (
                      <>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Active Lecture</span>
                        </span>
                        {(() => {
                          const detectedDur = activeLesson?.id ? detectedDurations[activeLesson.id] : '';
                          const validDbDur = activeLesson?.duration && !isFakeTimer(activeLesson.duration) ? activeLesson.duration : '';
                          const liveDur = duration > 0 ? formatDurationLabel(duration) : '';
                          const displayDur = liveDur || detectedDur || validDbDur;
                          if (!displayDur) return null;
                          return (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Clock size={12} className="text-slate-500" />
                              <span>{displayDur}</span>
                            </span>
                          );
                        })()}
                      </>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} className="text-amber-600" />
                        <span>Upcoming • Video Stream Soon</span>
                      </span>
                    )}
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      <span>Mentorship Verified</span>
                    </span>
                  </div>

                  {/* Main Lecture Title */}
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {activeLesson?.title || '1.1 E-Commerce Overview: Dropshipping, White Label & Private Label Differences'}
                  </h1>

                  {/* Overview Roadmap Description (if viewing Overview) */}
                  {activeLesson?.isOverview && activeLesson?.description && (
                    <div className="bg-blue-50/70 border border-blue-200/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider mb-1">
                        <Sparkles size={13} className="text-blue-600" />
                        <span>Roadmap Guidelines &amp; Instructions</span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700">
                        {activeLesson.description}
                      </p>
                    </div>
                  )}

                  {/* Student Support & DRM Protection Notice */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageCircle size={16} />
                        </div>
                        <div className="flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          Kisi bhi kisam ki madad ya rahnumai ke liye hamari support team se WhatsApp par rabta karein (
                          <a 
                            href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Support%20Team!%20Mujhe%20LMS%20ke%20hawale%20se%20madad%20chahiye." 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors inline-block"
                          >
                            0333-0093269
                          </a>
                          ).
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 sm:gap-3 pt-3 border-t border-slate-200/60">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Shield size={16} />
                        </div>
                        <p className="flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <span className="font-bold text-rose-600">Yaad rahe hamara platform DRM protected hai;</span> screenshots ya screen recordings lene par account foran ban kar diya jayega, aur unban karne ke liye 2000 ka Fine dena pary ga.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: VERIFIED GCC WHOLESALE SUPPLIERS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'suppliers' && (
              <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-200">
                {/* Header & Filter Controls */}
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-slate-900">
                      Verified Wholesale Supplier Details
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSupplierCountryFilter('ALL')}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        supplierCountryFilter === 'ALL'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({suppliers.length})
                    </button>
                    <button
                      onClick={() => setSupplierCountryFilter('UAE')}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        supplierCountryFilter === 'UAE'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      UAE
                    </button>
                    <button
                      onClick={() => setSupplierCountryFilter('Saudi Arabia')}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        supplierCountryFilter === 'Saudi Arabia'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      KSA 🇸🇦
                    </button>
                    <button
                      onClick={() => setSupplierCountryFilter('Pakistan')}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        supplierCountryFilter === 'Pakistan'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Pakistan 🇵🇰
                    </button>
                  </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuppliers.map((s) => (
                    <div 
                      key={s.id} 
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                            {s.country} • {s.city}
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            COD Enabled
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                          {s.name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-3">
                          {s.category} • {s.notes}
                        </p>
                        
                        <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4">
                          <div><strong>MOQ:</strong> {s.minOrder}</div>
                          <div><strong>Delivery:</strong> {s.deliveryTime}</div>
                          <div><strong>Phone:</strong> <span className="font-mono text-blue-700 font-semibold">{s.phone}</span></div>
                        </div>
                      </div>

                      {(() => {
                        const targetUrl = s.whatsappLink && !s.whatsappLink.includes('971501234567') && s.whatsappLink.includes('wa.me')
                          ? s.whatsappLink
                          : `https://wa.me/923330093269?text=${encodeURIComponent(`Assalam-o-Alaikum Mentor Ecom with Sami! I am your student on LMS and need onboarding for supplier: ${s.name}`)}`;
                        return (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            <MessageSquare size={14} />
                            <span>Chat on WhatsApp</span>
                          </a>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: BONUSES & DOWNLOADS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'resources' && (
              <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-slate-900">
                      Power Bonus Resources Hub
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Premium Shopify themes, video ad blueprints, and profit calculators
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      Total Value: Rs 30,000+
                    </span>
                    <Link
                      href="/lms/bonuses"
                      className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Open Full Hub ↗
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((r) => {
                    const isPdfFile = (r.downloadUrl || '').toLowerCase().includes('.pdf') || r.type.toLowerCase().includes('pdf');
                    return (
                      <div key={r.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                              {r.type} • {r.size}
                            </span>
                            <span className="text-xs font-bold text-amber-600">{r.value}</span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">{r.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed mb-4">{r.description}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              const rawExt = (r.downloadUrl.split('.').pop() || 'zip').split('?')[0].toLowerCase();
                              const cleanExt = (rawExt.length > 5 || rawExt.includes('/')) ? 'zip' : rawExt;
                              const cleanTitle = r.title.replace(/[/\\?%*:|"<>]/g, '-').trim() || 'theme-resource';
                              const finalDownloadName = cleanTitle.toLowerCase().endsWith('.' + cleanExt)
                                ? cleanTitle
                                : `${cleanTitle}.${cleanExt}`;

                              const downloadUrl = `/api/lms/resources/download?url=${encodeURIComponent(r.downloadUrl)}&name=${encodeURIComponent(finalDownloadName)}`;
                              const a = document.createElement('a');
                              a.href = downloadUrl;
                              a.download = finalDownloadName;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                            title="Direct download file"
                          >
                            <Download size={14} />
                            <span>Direct Download</span>
                          </button>

                          {isPdfFile && (
                            <a
                              href={r.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                              title="Open PDF in new tab"
                            >
                              <span>Preview</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: COMMUNITY & SUNDAY SUPPORT HUB */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'community' && (
              <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 animate-in fade-in duration-200">
                
                {/* Top Quick Bar: Return to Course / Close Chat */}
                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={() => setActiveTab('video')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-200/90 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft size={15} />
                    <span>Back to Video Lessons</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    title="Close Community & Return to Video"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <span>Close Chat</span>
                    <X size={15} />
                  </button>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* WHATSAPP GROUP CHAT BOX CONTAINER */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-[#efeae2] border border-slate-300/80 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-xl overflow-hidden flex flex-col h-[calc(100dvh-130px)] sm:h-[640px] lg:h-[700px] max-h-[84vh] sm:max-h-[720px] min-h-[460px] relative">
                  
                  {/* 1. WHATSAPP HEADER */}
                  <div className="bg-[#008069] text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-xs overflow-hidden">
                          <span className="tracking-tighter font-extrabold">SS</span>
                        </div>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#008069] ${lmsChatConfig.isOpen ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xs sm:text-base font-bold text-white truncate leading-tight">
                          Ecom With Sami — VIP Community Group 🇵🇰
                        </h2>
                        <p className="text-[10px] sm:text-[11px] text-white/85 truncate mt-0.5 flex items-center gap-1.5">
                          {lmsChatConfig.isOpen ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
                              <span className="truncate">🟢 Online • Sunday Live Mentorship ({lmsChatMessages.length} updates)</span>
                            </>
                          ) : (
                            <>
                              <Lock size={11} className="text-amber-200 shrink-0" />
                              <span className="truncate">🔒 Scheduled • Read-Only (Opens Sundays)</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Header Right Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {/* Sub-View Switcher */}
                      <div className="flex items-center bg-[#075e54] p-0.5 rounded-xl border border-white/10 text-[10px] sm:text-[11px]">
                        <button
                          onClick={() => setCommunitySubView('chat')}
                          className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            communitySubView === 'chat'
                              ? 'bg-white text-[#008069] shadow-xs'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <MessageCircle size={11} />
                          <span className="hidden sm:inline">Group Chat</span>
                        </button>
                        <button
                          onClick={() => setCommunitySubView('broadcasts')}
                          className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            communitySubView === 'broadcasts'
                              ? 'bg-white text-[#008069] shadow-xs'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <Radio size={11} />
                          <span>SOPs ({communityUpdates.length})</span>
                        </button>
                      </div>

                      <button
                        onClick={() => fetchLmsChat(false)}
                        title="Refresh Messages"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCcw size={13} className={lmsChatLoading ? 'animate-spin' : ''} />
                      </button>

                      {/* Close / Cross Button */}
                      <button
                        onClick={() => setActiveTab('video')}
                        title="Close Chat & Return to Lessons"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* 2. PINNED NOTICE BAR (Slim WhatsApp Style) */}
                  <div className={`sticky top-0 z-20 px-3 sm:px-4 py-1.5 sm:py-2 border-b text-xs flex items-center justify-between gap-2 transition-all shadow-2xs backdrop-blur-xs shrink-0 ${
                    lmsChatConfig.isOpen
                      ? 'bg-emerald-100/95 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-amber-100/95 border-amber-300 text-amber-950 font-medium'
                  }`}>
                    <div
                      onClick={() => setPinnedNoticeExpanded(!pinnedNoticeExpanded)}
                      className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                      title="Click to toggle full notice"
                    >
                      <Pin size={13} className="shrink-0 text-slate-700" />
                      <span className={`text-[10.5px] sm:text-[11px] leading-tight ${pinnedNoticeExpanded ? '' : 'truncate'}`}>
                        <strong>{lmsChatConfig.isOpen ? 'Sunday Live:' : 'Notice:'}</strong>{' '}
                        {lmsChatConfig.isOpen
                          ? 'Chat is OPEN! Share your Shopify sales proofs, order milestones, or ask questions.'
                          : (lmsChatConfig.noticeText || '').replace(/Mentor Sardar Samiullah/gi, 'Mentor Ecom with Sami').replace(/Sardar Samiullah/gi, 'Ecom with Sami')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-800 shadow-2xs">
                        {lmsChatConfig.isOpen ? 'LIVE NOW' : 'SCHEDULED'}
                      </span>
                    </div>
                  </div>

                  {/* 3. SUB-VIEW 1: WHATSAPP CHAT FEED */}
                  {communitySubView === 'chat' && (
                    <div className="flex-1 flex flex-col min-h-0 bg-[#efeae2]">
                      
                      {/* Scrollable Messages Area */}
                      <div
                        ref={chatScrollContainerRef}
                        className="flex-1 min-h-0 overflow-y-auto p-2.5 sm:p-4 space-y-2 sm:space-y-2.5 touch-pan-y"
                      >
                        {/* Group Creation Date Pill */}
                        <div className="flex justify-center my-1">
                          <span className="bg-white/90 text-slate-600 text-[10px] font-semibold px-3 py-1 rounded-full shadow-2xs border border-slate-200/60 uppercase tracking-wider">
                            Official Sunday Student Community
                          </span>
                        </div>

                        {lmsChatLoading && lmsChatMessages.length === 0 ? (
                          <div className="text-center py-16">
                            <Loader2 size={24} className="mx-auto text-[#008069] animate-spin mb-2" />
                            <p className="text-xs text-slate-500 font-medium">Opening WhatsApp Group...</p>
                          </div>
                        ) : lmsChatMessages.length === 0 ? (
                          <div className="text-center py-16 bg-white/80 rounded-2xl p-6 max-w-sm mx-auto shadow-2xs border border-slate-200">
                            <MessageSquare size={32} className="mx-auto text-slate-400 mb-2" />
                            <h4 className="text-sm font-bold text-slate-800">No Messages Yet</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              Be the first to share your Shopify milestone or ask a query in the group!
                            </p>
                          </div>
                        ) : (
                          lmsChatMessages.map((msg) => {
                            const isMentor = Boolean(msg.isMentor);
                            const isMe = !isMentor && ((msg.studentId && user?.id && String(msg.studentId) === String(user.id)) || (user?.name && msg.studentName && msg.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()));

                            // Mentor VIP Broadcast Message (Centered / Highlighted)
                            if (isMentor) {
                              return (
                                <div key={msg.id} className="flex justify-center my-2">
                                  <div className="w-full max-w-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-[#008069]/40 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-2">
                                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#008069] text-white flex items-center justify-center font-black text-xs shadow-xs">
                                          ★
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-extrabold text-xs text-[#008069]">
                                              Official Mentor Ecom with Sami
                                            </span>
                                            <span className="bg-[#008069] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                                              MENTOR VIP
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-medium">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>

                                    {msg.message && (
                                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                                        {msg.message}
                                      </p>
                                    )}

                                    {/* Mentor Voice Note Player */}
                                    {msg.audioUrl && (
                                      <ChatVoiceNotePlayer audioUrl={msg.audioUrl} isMentor={true} savedDuration={msg.audioDuration} />
                                    )}

                                    {/* Attached Image if any */}
                                    {msg.imageUrl && (
                                      <div
                                        onClick={() => setZoomedImage(msg.imageUrl)}
                                        className="relative cursor-pointer rounded-xl overflow-hidden border border-emerald-200 shadow-2xs max-w-sm mt-1 group"
                                      >
                                        <img
                                          src={msg.imageUrl}
                                          alt="Mentor attachment"
                                          className="max-h-64 w-full object-cover group-hover:scale-101 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                          <Eye size={16} className="mr-1" /> Click to Zoom
                                        </div>
                                      </div>
                                    )}

                                    <div className="text-right text-[10px] text-emerald-800 font-bold flex items-center justify-end gap-1">
                                      <span>Official Mentorship Broadcast</span>
                                      <CheckCheck size={13} className="text-blue-600" />
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Student Message: Outgoing (Me) vs Incoming (Others)
                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xs max-w-[85%] sm:max-w-[70%] transition-all ${
                                    isMe
                                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-[#c1e7bb]'
                                      : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80'
                                  }`}
                                >
                                  {/* Author Header */}
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span
                                      className={`text-[11px] font-extrabold truncate ${
                                        isMe ? 'text-emerald-800' : 'text-[#128c7e]'
                                      }`}
                                    >
                                      {isMe ? 'You (Student)' : (msg.studentName ? msg.studentName.replace(/Mentor Sardar Samiullah/gi, 'Official Mentor Ecom with Sami').replace(/Sardar Samiullah/gi, 'Ecom with Sami') : 'Student')}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium">
                                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>

                                  {/* Attached Screenshot Image */}
                                  {msg.imageUrl && (
                                    <div
                                      onClick={() => setZoomedImage(msg.imageUrl)}
                                      className="relative cursor-pointer rounded-lg sm:rounded-xl overflow-hidden border border-black/10 shadow-2xs my-1 max-w-xs group"
                                    >
                                      <img
                                        src={msg.imageUrl}
                                        alt="Student Proof"
                                        className="max-h-36 sm:max-h-44 w-auto object-cover rounded-lg group-hover:scale-101 transition-transform"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                        <Eye size={12} className="mr-1" /> Zoom Proof
                                      </div>
                                    </div>
                                  )}

                                  {/* Message Text */}
                                  {msg.message && (
                                    <p className="text-[11.5px] sm:text-xs leading-relaxed whitespace-pre-wrap break-words">
                                      {msg.message}
                                    </p>
                                  )}

                                  {/* Attached Voice Note if any */}
                                  {msg.audioUrl && (
                                    <ChatVoiceNotePlayer audioUrl={msg.audioUrl} isMentor={false} savedDuration={msg.audioDuration} />
                                  )}

                                  {/* Bottom Ticks for outgoing */}
                                  {isMe && (
                                    <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-slate-400">
                                      <CheckCheck size={12} className="text-blue-500" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}

                        <div ref={chatMessagesEndRef} />
                      </div>

                      {/* 4. PINNED BOTTOM WHATSAPP INPUT BAR */}
                      <div className="bg-[#f0f2f5] border-t border-slate-300/80 p-2.5 sm:p-3 relative z-10">
                        {/* Attachment Preview Chip */}
                        {studentChatImgPreview && (
                          <div className="mb-2 p-2 bg-white rounded-xl border border-emerald-300 shadow-sm flex items-center justify-between gap-3 max-w-md animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={studentChatImgPreview}
                                alt="Preview"
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                              />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 block truncate">
                                  {studentChatImg?.name}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-semibold block">
                                  ✓ Auto-Compressed Proof Screenshot
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setStudentChatImg(null);
                                setStudentChatImgPreview(null);
                                if (chatFileInputRef.current) chatFileInputRef.current.value = '';
                              }}
                              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}

                        {lmsChatConfig.isOpen ? (
                          <form onSubmit={handleSendStudentChatMessage} className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                ref={chatFileInputRef}
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleStudentImageSelect}
                                className="hidden"
                              />
                              
                              {/* Clip / Attachment Button */}
                              <button
                                type="button"
                                onClick={() => chatFileInputRef.current?.click()}
                                title="Attach Proof Screenshot (JPG/PNG)"
                                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95 shadow-2xs"
                              >
                                <Paperclip size={17} />
                              </button>

                              {/* Input field */}
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={studentChatMsg}
                                  onChange={(e) => setStudentChatMsg(e.target.value)}
                                  placeholder="Type a message or share sales screenshot..."
                                  className="w-full bg-white border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008069] shadow-inner"
                                />
                              </div>

                              {/* Send Button */}
                              <button
                                type="submit"
                                disabled={studentChatSubmitting}
                                className="w-9 h-9 rounded-full bg-[#008069] hover:bg-[#075e54] disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
                              >
                                {studentChatSubmitting ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Send size={15} />
                                )}
                              </button>
                            </div>

                            <div className="flex items-center justify-between px-2 text-[10px] text-slate-500">
                              <span>🔒 Privacy Shield: Only your name is displayed. Contact details stay 100% private.</span>
                              <span className="hidden sm:inline">Images auto-compressed for speed</span>
                            </div>
                          </form>
                        ) : (
                          <div className="py-2.5 px-4 bg-white/90 border border-amber-200 rounded-2xl text-center flex items-center justify-center gap-2 text-xs text-slate-700">
                            <Lock size={14} className="text-amber-600 shrink-0" />
                            <span>
                              <strong>Chat is in Read-Only Mode.</strong> Replies open this Sunday with Mentor Ecom with Sami.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. SUB-VIEW 2: MENTOR BROADCASTS & SOPS */}
                  {communitySubView === 'broadcasts' && (
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-3">
                      {communityUpdates.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6">
                          <Radio size={32} className="mx-auto text-slate-400 mb-2 animate-pulse" />
                          <h3 className="text-sm font-bold text-slate-800 mb-1">No Broadcasts Yet</h3>
                          <p className="text-xs text-slate-500">All new mentorship announcements will appear right here.</p>
                        </div>
                      ) : (
                        communityUpdates.map((update: any) => (
                          <div
                            key={update.id}
                            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2.5 hover:border-emerald-300 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {update.pinned && (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Pin size={10} /> Pinned
                                  </span>
                                )}
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                  {update.tag || 'Announcement'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                {new Date(update.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              {update.title}
                            </h3>

                            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                              {update.content}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-700">
                                {(update.author || 'Official Mentor Ecom with Sami').replace(/Mentor Sardar Samiullah/gi, 'Official Mentor Ecom with Sami').replace(/Sardar Samiullah/gi, 'Ecom with Sami')}
                              </span>
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                <span>Official Broadcast</span>
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>

                {/* Screenshot Lightbox Modal */}
                {zoomedImage && (
                  <div
                    onClick={() => setZoomedImage(null)}
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
                  >
                    <div className="relative max-w-4xl max-h-[90vh]">
                      <img
                        src={zoomedImage}
                        alt="Zoomed sales proof"
                        className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/20"
                      />
                      <button
                        onClick={() => setZoomedImage(null)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </main>

      </div>

      {/* Floating Real-Time Community Notification Toast */}
      {newChatToast && activeTab !== 'community' && (
        <div
          onClick={() => {
            setActiveTab('community');
            markUpdatesAsRead();
            markChatAsRead();
            setNewChatToast(null);
          }}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#008069] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 cursor-pointer hover:bg-[#075e54] transition-all animate-in slide-in-from-bottom duration-300 max-w-sm border-2 border-emerald-300/40"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                New Community Message
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewChatToast(null);
                }}
                className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 ml-2 cursor-pointer transition-colors"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs font-black truncate mt-0.5 text-white">
              {newChatToast.author}
            </p>
            <p className="text-[11px] text-white/90 truncate font-medium">
              {newChatToast.text}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      {/* ========================================================================= */}
      <div 
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-bold shadow-lg"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => { setSidebarOpen(true); }}
          className="flex flex-col items-center gap-1 p-1 text-slate-600 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
        >
          <BookOpen size={18} className="text-blue-600" />
          <span>Curriculum</span>
        </button>

        <button
          onClick={() => { setActiveTab('video'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform cursor-pointer ${
            activeTab === 'video' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Play size={18} />
          <span>Watch</span>
        </button>

        <button
          onClick={() => { setActiveTab('suppliers'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform cursor-pointer ${
            activeTab === 'suppliers' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <ShoppingBag size={18} />
          <span>Suppliers</span>
        </button>

        <button
          onClick={() => { setActiveTab('resources'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform cursor-pointer ${
            activeTab === 'resources' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Download size={18} />
          <span>Bonuses</span>
        </button>

        {(() => {
          const totalCommunityUnread = unreadCount + unreadChatCount;
          return (
            <button
              onClick={() => { 
                setActiveTab('community'); 
                setSidebarOpen(false); 
                markUpdatesAsRead(); 
                markChatAsRead();
              }}
              className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform relative cursor-pointer ${
                activeTab === 'community' ? 'text-[#008069] font-extrabold' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <MessageCircle size={18} />
                {totalCommunityUnread > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-black text-[9px] min-w-[17px] h-[17px] px-0.5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}
                  </span>
                )}
              </div>
              <span>Community</span>
            </button>
          );
        })()}
      </div>

      {/* ========================================================================= */}
      {/* DRM POLICY & SECURITY MODAL */}
      {/* ========================================================================= */}
      <DrmAnnouncementModal
        isOpen={showDrmModal}
        onClose={() => {
          setShowDrmModal(false);
          try {
            sessionStorage.setItem('sami_lms_drm_modal_seen', 'true');
          } catch (e) {}
        }}
      />

    </div>
  );
}

// =============================================================================
// SUBCOMPONENT: Dynamic Moving Forensic Watermark Overlay
// Strictly locked within the Video Player canvas with z-10 (NEVER leaks outside)
// =============================================================================
function DynamicForensicWatermark({ user, isFullscreen = false }: { user: any; isFullscreen?: boolean }) {
  const [sector, setSector] = useState(0);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setClock(`${dateStr} • ${timeStr}`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    const moveInterval = setInterval(() => {
      setSector(prev => {
        let next = Math.floor(Math.random() * 9);
        while (next === prev) {
          next = Math.floor(Math.random() * 9);
        }
        return next;
      });
    }, 5500);

    return () => {
      clearInterval(clockInterval);
      clearInterval(moveInterval);
    };
  }, []);

  const sectorClasses = [
    'top-2.5 left-2.5',
    'top-2.5 left-1/2 -translate-x-1/2',
    'top-2.5 right-2.5',
    'top-1/3 left-2.5',
    'top-1/3 right-2.5',
    'top-2/3 left-2.5',
    'bottom-12 sm:bottom-14 left-2.5',
    'bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2',
    'bottom-12 sm:bottom-14 right-2.5',
  ];

  const studentName = user?.name || 'Authorized Student';
  const enrollmentCode = user?.enrollmentCode || user?.trackingCode || (user?.id ? `SAMI-ENR-${String(user.id).slice(-5).toUpperCase()}` : 'SAMI-ENR');
  const studentPhone = user?.phone || '';
  const studentEmail = user?.email || '';
  const studentPassword = user?.password || '';
  const studentCity = user?.city || '';
  const ipAddress = user?.ip || 'Verified Session';

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 overflow-hidden text-left">
      <div
        className={`absolute transition-all duration-1000 ease-in-out px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-black/45 backdrop-blur-[2px] border border-cyan-400/30 text-white shadow-xl ${
          isFullscreen ? 'max-w-[260px] sm:max-w-[300px]' : 'max-w-[210px] sm:max-w-[250px]'
        } ${sectorClasses[sector]}`}
      >
        {/* Row 1: Header - DRM Code & Confidential badge */}
        <div className="flex items-center justify-between gap-1 text-[7.5px] sm:text-[8.5px] font-black tracking-wider text-cyan-300 uppercase leading-none pb-1 border-b border-white/10 mb-1">
          <div className="flex items-center gap-1 min-w-0 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
            <Shield size={9} className="text-cyan-400 flex-shrink-0" />
            <span className="font-mono truncate">DRM • {enrollmentCode}</span>
          </div>
          <span className="text-[6px] sm:text-[6.5px] font-mono px-1 py-0.2 bg-red-500/25 text-red-200 border border-red-400/30 rounded flex-shrink-0">
            CONFIDENTIAL
          </span>
        </div>

        {/* Row 2: Identity & Phone */}
        <div className="flex items-center justify-between gap-1 text-[8.5px] sm:text-[9.5px] font-mono leading-none truncate mb-1">
          <span className="font-bold text-white truncate">
            {studentName} {studentCity ? <span className="text-slate-300 font-normal text-[7.5px] sm:text-[8px]">({studentCity})</span> : ''}
          </span>
          {studentPhone && (
            <span className="text-emerald-300 font-bold text-[7.5px] sm:text-[8.5px] flex-shrink-0">
              📞 {studentPhone}
            </span>
          )}
        </div>

        {/* Row 3: Email & Password */}
        <div className="flex items-center justify-between gap-1 text-[7.5px] sm:text-[8.5px] font-mono text-slate-300 leading-none truncate mb-1">
          {studentEmail ? (
            <span className="truncate text-slate-300">
              ✉️ {studentEmail}
            </span>
          ) : <span />}
          {studentPassword && (
            <span className="text-amber-300 font-bold bg-amber-500/20 px-1 py-0.5 rounded border border-amber-500/30 flex-shrink-0 text-[6.5px] sm:text-[7.5px] tracking-tight">
              🔒 PASS: {studentPassword}
            </span>
          )}
        </div>

        {/* Row 4: IP Address & Timestamp */}
        <div className="text-[6.5px] sm:text-[7.5px] font-mono text-cyan-200/80 leading-none truncate flex items-center justify-between">
          <span className="truncate">IP: {ipAddress}</span>
          <span className="flex-shrink-0 text-slate-400 text-[6px] sm:text-[7px] ml-1">{clock}</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SUBCOMPONENT: DRM Policy Modal
// =============================================================================
function DrmAnnouncementModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      {/* Outer Card with strict overflow-hidden so scrollbar stays strictly inside the rounded boundaries */}
      <div className="w-full max-w-lg max-h-[88vh] bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Inner Scrollable Container with sleek branded scrollbar inside */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 pr-3 sm:pr-4 space-y-3.5 [scrollbar-width:thin] [scrollbar-color:#00A0DF_#f1f5f9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-thumb]:bg-[#00A0DF]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#00A0DF] [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-0.5">
                SECURITY ADVISORY
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                LMS Content Protection &amp; DRM Policy
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Welcome to the Ecom with Sami Mentorship. All course modules, wholesale supplier directories, and Shopify assets are copyright protected.
          </p>

          {/* High Priority Red Security Alert */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-red-50 border-2 border-red-500/40 text-red-950 space-y-1 shadow-xs">
            <div className="flex items-center gap-2 font-black text-red-700 text-xs sm:text-sm">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>STRICT DRM SECURITY WARNING: AUTO-BAN &amp; FINE</span>
            </div>
            <p className="text-[11px] sm:text-xs text-red-800 leading-relaxed font-medium">
              Agar aap screen record ya screenshot lene ki koshish karein ge, toh hamari AI &amp; DRM protected security layer <strong>2 screenshots ya screen recordings count hotay hi aapka account foran automatically block kar degi</strong>. Suspended account ko unblock karwane ke liye <strong>Rs. 2,000 ka Fine</strong> ada karna parega.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <span className="p-1.5 rounded-xl bg-blue-100 text-blue-600 mt-0.5 flex-shrink-0">
                <Shield size={14} />
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs mb-0.5">Dynamic Forensic Watermarking</strong>
                <span className="text-slate-500 text-[11px] leading-tight">
                  Your Student Name, ID, phone number, and IP address are dynamically embedded across all video frames to prevent unauthorized recording and trace content leaks.
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <span className="p-1.5 rounded-xl bg-amber-100 text-amber-600 mt-0.5 flex-shrink-0">
                <Lock size={14} />
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs mb-0.5">Authorized Student License</strong>
                <span className="text-slate-500 text-[11px] leading-tight">
                  This portal is licensed exclusively for your individual learning. Sharing account credentials, downloading files, or screen capturing is strictly prohibited.
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                <ShieldCheck size={14} />
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs mb-0.5">Intellectual Property Protection</strong>
                <span className="text-slate-500 text-[11px] leading-tight">
                  Any leaked recordings will be forensically traced back to the offending student account, resulting in immediate termination and legal action.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 pb-1">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              I Understand &amp; Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
