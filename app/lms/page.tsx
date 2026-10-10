'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
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
  Circle 
} from 'lucide-react';
import { Module, Supplier, ResourceItem } from '@/utils/db';
import { supabase } from '@/lib/supabase';

export default function LmsClassroomPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [accountRevoked, setAccountRevoked] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [openModuleId, setOpenModuleId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'video' | 'suppliers' | 'resources' | 'community'>('video');
  const [subTab, setSubTab] = useState<'notes' | 'discussion'>('notes');
  const [autoProceed, setAutoProceed] = useState<boolean>(true);
  const [communityUpdates, setCommunityUpdates] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierCountryFilter, setSupplierCountryFilter] = useState<'ALL' | 'UAE' | 'Saudi Arabia'>('ALL');
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

  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    let clean = url.trim();

    if (clean.includes('<iframe')) {
      const match = clean.match(/<iframe[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        clean = match[1];
      }
    }

    if (clean.includes('youtube.com/watch?v=')) {
      const vId = clean.split('v=')[1]?.split('&')[0];
      if (vId) return `https://www.youtube.com/embed/${vId}`;
    }
    if (clean.includes('youtu.be/')) {
      const vId = clean.split('youtu.be/')[1]?.split('?')[0];
      if (vId) return `https://www.youtube.com/embed/${vId}`;
    }

    return clean;
  };

  const handleImmediateForceLogout = (reason = 'Your student access has been suspended or rejected by the administrator.') => {
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
      fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' }).catch(() => {});
    } catch (e) {}

    try {
      const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = `sami_student_auth=; path=/; expires=${pastDate}; max-age=0;`;
      document.cookie = `sami_student_session=; path=/; expires=${pastDate}; max-age=0;`;
      document.cookie = `sami_admin_auth=; path=/; expires=${pastDate}; max-age=0;`;
    } catch (e) {}

    try {
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

    const targetUrl = `/login?reason=rejected&msg=${encodeURIComponent(reason)}&t=${Date.now()}`;
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
      router.replace('/login?reason=rejected');
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
    } catch (e) {}

    let realtimeChannel: any = null;
    let realtimeEnrChannel: any = null;
    let heartbeatInterval: any = null;
    let bc: BroadcastChannel | null = null;

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
          handleImmediateForceLogout(res.message || 'Please log in with an active student account.');
        }
      })
      .catch(() => {
        handleImmediateForceLogout('Network connection error verifying credentials.');
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
          if (!authRes.authenticated || !authRes.user) {
            handleImmediateForceLogout(authRes.message || 'Your enrollment access has been revoked or rejected by Administrator Sardar Samiullah.');
          }
        })
        .catch(() => {});
    }, 2500);

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
          if (res.modules[0]?.lessons[0]) {
            setActiveLesson(res.modules[0].lessons[0]);
            setOpenModuleId(res.modules[0].id);
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
        if (res.success && res.suppliers) setSuppliers(res.suppliers);
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
        if (res.success && res.resources) setResources(res.resources);
      });

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
      clearInterval(heartbeatInterval);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
      if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
      if (realtimeEnrChannel && supabase) supabase.removeChannel(realtimeEnrChannel);
    };
  }, []);

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
    return () => {
      try {
        document.body.style.overflow = '';
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
  const allLessons = modules.flatMap(m => m.lessons || []);
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const isCurrentDone = activeLesson ? completedLessons.includes(activeLesson.id) : false;
  const currentLessonWatchPct = activeLesson 
    ? (isCurrentDone ? 100 : (watchProgress[activeLesson.id] || 0)) 
    : 0;
  const isDirectLessonVideo = Boolean(
    activeLesson?.videoUrl && (
      activeLesson.videoUrl.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i) ||
      activeLesson.videoUrl.includes('supabase.co/storage')
    )
  );

  const activeModule = modules.find(m => m.lessons?.some(l => l.id === activeLesson?.id)) || modules[0];
  const activeModuleCompletedCount = activeModule ? activeModule.lessons.filter(l => completedLessons.includes(l.id)).length : 0;
  const activeModuleTotalCount = activeModule?.lessons?.length || 1;
  const activeModulePercent = Math.round((activeModuleCompletedCount / activeModuleTotalCount) * 100);

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
            If you already submitted your enrollment fee, please verify your payment proof slip with Mentor Sardar Samiullah on WhatsApp.
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
            <span>GCC Suppliers</span>
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

          <button
            onClick={() => {
              setActiveTab('community');
              markUpdatesAsRead();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'community'
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Radio size={13} className={unreadCount > 0 ? 'text-amber-500 animate-pulse' : ''} />
            <span>Community</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
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
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          />
        )}

        {/* ========================================================================= */}
        {/* LEFT COLUMN: COURSE CURRICULUM ACCORDION & CONNECTING TREE LINES */}
        {/* ========================================================================= */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-[88vw] max-w-sm sm:w-84 md:w-96 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          } max-h-screen lg:max-h-[calc(100vh-61px)]`}
        >
          {/* Sidebar Top: Title & Completion Stats (Dynamic and accurate) */}
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    Course Curriculum
                  </h2>
                  <span className="text-[10px] text-slate-500 block">
                    {completedLessons.length} of {totalLessons} Lectures completed ({progressPercent}%)
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
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
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-slate-600 font-semibold text-[11px]">
                  Currently on: <strong className="text-slate-900">{activeLesson?.title?.slice(0, 15) || 'Module 1.1'}...</strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                {activeModulePercent}% Mastered
              </span>
            </div>
          </div>

          {/* Module List with Vertical Connecting Tree Lines */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50">
            {modules.map((m) => {
              const isOpen = openModuleId === m.id;
              const moduleCompletedCount = m.lessons?.filter(l => completedLessons.includes(l.id)).length || 0;
              const isAllCompleted = moduleCompletedCount === m.lessons?.length && (m.lessons?.length || 0) > 0;
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
                    className="w-full p-3 text-left flex items-center justify-between gap-2.5 hover:bg-slate-50/80 rounded-2xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 min-w-0">
                      {isAllCompleted ? (
                        <div 
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}
                          className="w-6 h-6 min-w-[24px] min-h-[24px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 aspect-square"
                        >
                          <CheckCircle2 size={15} />
                        </div>
                      ) : (
                        <div 
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}
                          className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 aspect-square ${
                            isActiveModule 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {m.id}
                        </div>
                      )}
                      <span className="truncate text-slate-900 font-bold">{m.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        isAllCompleted 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isActiveModule 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {moduleCompletedCount}/{m.lessons?.length || 0} {isActiveModule ? 'Active' : ''}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={14} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Collapsed Lectures Tree (Vertical Connector Line Branching out) */}
                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                      {/* Vertical Connecting Line Container */}
                      <div className="relative pl-5 ml-3 border-l-2 border-blue-200/90 space-y-2 py-1">
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
                                className={`relative p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2.5 text-xs transition-all ${
                                  isCurrent
                                    ? 'bg-blue-50/90 text-blue-950 font-bold border-2 border-blue-400 shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/70 hover:border-slate-300'
                                }`}
                              >
                                {/* Tree Branch Connector Line Node */}
                                <div 
                                  className={`absolute -left-[21px] top-1/2 -translate-y-1/2 w-4 h-0.5 pointer-events-none ${
                                    isCurrent ? 'bg-blue-500' : 'bg-blue-200'
                                  }`} 
                                />

                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* Play Icon or 100% Round SVG Circle (Zero Stretching into Ovals on iPhone / Android) */}
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

                                  <div className="truncate">
                                    <span className={`block truncate text-xs ${isCurrent ? 'font-black text-blue-950' : 'font-semibold text-slate-800'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                </div>

                                <span className={`text-[10px] flex-shrink-0 font-semibold px-2 py-0.5 rounded-md ${
                                  isCurrent ? 'bg-blue-200/70 text-blue-900' : 'text-slate-400 bg-slate-100'
                                }`}>
                                  {lesson.duration || '12m'}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer Security Tag */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-500 font-medium">
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
                  className={`bg-slate-950 flex items-center justify-center transition-all ${
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
                  <div
                    className="relative w-full h-full flex items-center justify-center overflow-hidden"
                    style={
                      isIosFullscreen
                        ? {
                            width: 'min(100vw, calc(100dvh * 16 / 9))',
                            height: 'min(100dvh, calc(100vw * 9 / 16))',
                          }
                        : undefined
                    }
                  >
                    {activeLesson?.videoUrl && (
                      activeLesson.videoUrl.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i) ||
                      activeLesson.videoUrl.includes('supabase.co/storage')
                    ) ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video
                          ref={videoRef}
                          key={activeLesson.id + activeLesson.videoUrl}
                          controls
                          controlsList="nodownload nofullscreen"
                          playsInline
                          // @ts-ignore
                          webkit-playsinline="true"
                          x5-playsinline="true"
                          preload="metadata"
                          onError={() => setVideoLoadError(true)}
                          onLoadedData={() => setVideoLoadError(false)}
                          onLoadedMetadata={(e) => {
                            setVideoLoadError(false);
                            try {
                              const savedPos = localStorage.getItem(`sami_lms_pos_${activeLesson.id}`);
                              if (savedPos && Number(savedPos) > 5 && Number(savedPos) < e.currentTarget.duration - 10) {
                                e.currentTarget.currentTime = Number(savedPos);
                              }
                            } catch (err) {}
                          }}
                          onTimeUpdate={(e) => {
                            const vid = e.currentTarget;
                            if (!vid.duration || !isFinite(vid.duration) || vid.duration <= 0) return;
                            const pct = Math.min(100, Math.round((vid.currentTime / vid.duration) * 100));

                            try {
                              localStorage.setItem(`sami_lms_pos_${activeLesson.id}`, String(Math.floor(vid.currentTime)));
                            } catch (err) {}

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

                            if (pct >= 90 && activeLesson && !completedLessons.includes(activeLesson.id)) {
                              markLessonComplete(activeLesson.id, true);
                            }
                          }}
                          onEnded={() => {
                            if (activeLesson && !completedLessons.includes(activeLesson.id)) {
                              markLessonComplete(activeLesson.id, true);
                            }
                          }}
                          className="w-full h-full object-contain bg-black"
                        >
                          <source src={activeLesson.videoUrl} />
                          Your browser does not support HTML5 video streaming.
                        </video>

                        {videoLoadError && (
                          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-20">
                            <AlertCircle size={32} className="text-amber-400 mb-2 animate-bounce" />
                            <p className="text-sm font-bold text-white mb-1">Video stream connection buffering...</p>
                            <button
                              onClick={() => {
                                setVideoLoadError(false);
                                const vid = document.querySelector('video');
                                if (vid) {
                                  vid.load();
                                  vid.play().catch(() => {});
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
                      <iframe
                        key={activeLesson?.id + (activeLesson?.videoUrl || '')}
                        src={getEmbedUrl(activeLesson?.videoUrl)}
                        title={activeLesson?.title || 'Lesson Video'}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full border-0"
                      />
                    )}

                    {/* Dynamic Forensic Watermark Overlay (STRICTLY within video canvas) */}
                    <DynamicForensicWatermark user={user} isFullscreen={isFullscreen || isIosFullscreen} />

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
                </div>

                {/* Lecture Info Card (Below Video Player) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                  {/* Badges Strip (Share & Bookmark removed as requested) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      CURRENT LECTURE • MODULE {activeModule?.id || 1}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      <span>{activeLesson?.duration || '12:40 mins'}</span>
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      <span>Mentorship Verified</span>
                    </span>
                  </div>

                  {/* Main Lecture Title */}
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {activeLesson?.title || '1.1 E-Commerce Overview: Dropshipping, White Label & Private Label Differences'}
                  </h1>

                  {/* Comprehensive Overview Text */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Master the fundamental architectural models in contemporary e-commerce. Discover the trade-offs between zero-inventory dropshipping and localized GCC &amp; Domestic private label warehousing, ad spend thresholds, and healthy cashflow runways.
                  </p>

                  {/* Sub-Tabs: Notes vs Q&A */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs font-bold">
                    <button
                      onClick={() => setSubTab('notes')}
                      className={`pb-2 transition-colors relative cursor-pointer ${
                        subTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Lecture Notes &amp; Overview (2 Files)
                    </button>
                    <button
                      onClick={() => setSubTab('discussion')}
                      className={`pb-2 transition-colors relative cursor-pointer ${
                        subTab === 'discussion' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Q&amp;A Discussion (38)
                    </button>
                  </div>

                  {/* Tab 1 Content: Downloadable Resource Cards */}
                  {subTab === 'notes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* PDF Resource Card */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                              Dropshipping_vs_PrivateLabel_Cheatsheet.pdf
                            </h4>
                            <span className="text-[10px] text-slate-500 block">
                              PDF Document • 2.4 MB • Updated this week
                            </span>
                          </div>
                        </div>

                        <a
                          href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20Please%20send%20the%20cheatsheet%20PDF%20file."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                          title="Get Resource File"
                        >
                          <Download size={16} />
                        </a>
                      </div>

                      {/* Excel Resource Card */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                            <FileSpreadsheet size={20} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                              Unit_Economics_Calculator_PK_UAE.xlsx
                            </h4>
                            <span className="text-[10px] text-slate-500 block">
                              Spreadsheet • 860 KB • Formulation template
                            </span>
                          </div>
                        </div>

                        <a
                          href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20Please%20send%20the%20Unit%20Economics%20calculator%20sheet."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                          title="Get Resource File"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Tab 2 Content: Q&A Preview */}
                  {subTab === 'discussion' && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          AK
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-800">
                            Ali Khan <span className="text-[10px] font-normal text-slate-400">• 2 days ago</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Mentor Sami, should I test 3 creative variations on TikTok ads before scaling the daily ad budget to 50 AED?
                          </p>
                          <div className="pl-3 border-l-2 border-blue-400 mt-2 space-y-0.5">
                            <div className="text-[11px] font-bold text-blue-700">
                              Mentor Sardar Samiullah (Instructor)
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Yes Ali! Always validate minimum 3 UGC hooks before raising the budget. Watch Module 5 for the exact breakdown.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Pinned Mentor Announcement Card */}
                <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-50/80 border border-blue-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold text-blue-950">Mentor Sami</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                          Pinned Mentor Announcement
                        </span>
                        <span className="text-[10px] text-slate-400">• Updated today</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                        "Live Weekly Q&amp;A Session this Friday at 8:00 PM PKT. We will review winning product spreadsheets and troubleshoot TikTok Ad account setups. Be on time with your questions!"
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20I%20have%20a%20question%20for%20the%20live%20session."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    Join Discussion
                  </a>
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
                      Verified GCC Wholesale Suppliers
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct warehouse contacts across Dubai, Sharjah, Riyadh &amp; Jeddah
                    </p>
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
                      KSA
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

                      <a
                        href={s.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <MessageSquare size={14} />
                        <span>Chat on WhatsApp with Warehouse</span>
                      </a>
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
                      Premium templates, Shopify themes, and profit calculators
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    Total Value: Rs 30,000+
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((r) => (
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

                      <a
                        href={`https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20Please%20share%20access%20to%20bonus%20resource:%20${encodeURIComponent(r.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors border border-slate-200 active:scale-95 cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Request Access Link</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: COMMUNITY & BROADCASTS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'community' && (
              <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-xl font-black text-slate-900">
                          Community &amp; Broadcasts
                        </h2>
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Live Hub
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                        Official announcements, winning product drops, and scaling guidance directly from <strong>Mentor Sardar Samiullah</strong>.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20I%20am%20an%20active%20student%20in%20LMS%20mentorship."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>VIP WhatsApp Group</span>
                  </a>
                </div>

                {/* Updates List */}
                <div className="space-y-3">
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
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2.5 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {update.pinned && (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Pin size={10} /> Pinned
                              </span>
                            )}
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
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
                            {update.author || 'Mentor Sardar Samiullah'}
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
              </div>
            )}

          </div>

        </main>

      </div>

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

        <button
          onClick={() => { 
            setActiveTab('community'); 
            setSidebarOpen(false); 
            markUpdatesAsRead(); 
          }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform relative cursor-pointer ${
            activeTab === 'community' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Radio size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <span>Updates</span>
        </button>
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
    'top-2.5 left-2.5 text-left',
    'top-2.5 left-1/2 -translate-x-1/2 text-center',
    'top-2.5 right-2.5 text-right',
    'top-1/2 -translate-y-1/2 left-2.5 text-left',
    'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center',
    'top-1/2 -translate-y-1/2 right-2.5 text-right',
    'bottom-10 left-2.5 text-left',
    'bottom-10 left-1/2 -translate-x-1/2 text-center',
    'bottom-10 right-2.5 text-right',
  ];

  const studentName = user?.name || 'Authorized Student';
  const studentId = user?.id ? String(user.id).slice(-5).toUpperCase() : 'SAMI';
  const maskedPhone = user?.phone ? user.phone.replace(/(\d{4})\d{4}(\d{3})/, '$1****$2') : '';
  const ipAddress = user?.ip || 'Verified Session';

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      <div
        className={`absolute transition-all duration-1000 ease-in-out px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-black/45 backdrop-blur-[1px] border border-white/10 text-white/60 shadow-md ${
          isFullscreen ? 'max-w-[220px] sm:max-w-[290px]' : 'max-w-[190px] sm:max-w-[250px]'
        } ${sectorClasses[sector]}`}
      >
        <div className="flex items-center gap-1 text-[7.5px] sm:text-[9px] font-black tracking-wider text-cyan-400 uppercase leading-none mb-0.5">
          <Shield size={9} className="flex-shrink-0" />
          <span>SAMI DRM • {studentId}</span>
        </div>
        <div className="text-[8px] sm:text-[9.5px] font-mono font-bold leading-tight truncate text-white/80">
          {studentName}
        </div>
        <div className="text-[7px] sm:text-[8px] font-mono leading-none text-white/50 mt-0.5 truncate">
          {maskedPhone ? `${maskedPhone} • ` : ''}IP: {ipAddress}
        </div>
        <div className="text-[6.5px] sm:text-[7.5px] font-mono text-white/40 leading-none mt-0.5">
          {clock}
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Dismiss Notice"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
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
          Welcome to Sardar Samiullah's Mentorship LMS. All course modules, wholesale supplier directories, and Shopify assets are copyright-protected.
        </p>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-100 text-blue-600 mt-0.5 flex-shrink-0">
              <Shield size={15} />
            </span>
            <div>
              <strong className="text-slate-900 block font-bold text-xs mb-0.5">Dynamic Forensic Watermarking</strong>
              <span className="text-slate-500 text-[11px] leading-tight">
                Your Student Name, ID, and IP address are dynamically embedded across all video frames to prevent unauthorized recording and trace content leaks.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-600 mt-0.5 flex-shrink-0">
              <Lock size={15} />
            </span>
            <div>
              <strong className="text-slate-900 block font-bold text-xs mb-0.5">Authorized Student License</strong>
              <span className="text-slate-500 text-[11px] leading-tight">
                This portal is licensed exclusively for your individual learning. Sharing account credentials, downloading files, or screen capturing is strictly prohibited.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
              <ShieldCheck size={15} />
            </span>
            <div>
              <strong className="text-slate-900 block font-bold text-xs mb-0.5">Intellectual Property Protection</strong>
              <span className="text-slate-500 text-[11px] leading-tight">
                Any leaked recordings will be forensically traced back to the offending student account, resulting in immediate termination and legal action.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
}
