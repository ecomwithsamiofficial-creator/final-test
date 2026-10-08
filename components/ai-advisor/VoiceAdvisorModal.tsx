'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Volume2, 
  Sparkles, 
  MessageCircle, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  matchAdvisorIntent, 
  ADVISOR_GREETING, 
  QUICK_QUESTIONS, 
  AdvisorResponse 
} from './knowledgeBase';
import { soundEngine } from './soundEngine';
import { useContactConfig } from '@/utils/contactConfig';
import Link from 'next/link';

interface VoiceAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAdvisorModal({ isOpen, onClose }: VoiceAdvisorModalProps) {
  const { getWhatsAppUrl } = useContactConfig();

  // Call States: 'connecting' | 'active' | 'ended'
  const [callState, setCallState] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [remainingSeconds, setRemainingSeconds] = useState(300); // 5 minutes timer
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState<AdvisorResponse>(ADVISOR_GREETING);
  const [hasMicSupport, setHasMicSupport] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = 'ur-PK'; // Urdu with English fallback

      recognizer.onstart = () => {
        setIsListening(true);
      };

      recognizer.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            setTranscript(finalTranscript);
            handleUserQuery(finalTranscript);
          } else {
            interim += event.results[i][0].transcript;
            setTranscript(interim);
          }
        }
      };

      recognizer.onerror = () => {
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    } else {
      setHasMicSupport(false);
    }
  }, []);

  // Answer user query and speak
  const handleUserQuery = useCallback((queryText: string) => {
    soundEngine.stopSpeaking();
    setIsSpeaking(true);

    const response = matchAdvisorIntent(queryText);
    setCurrentResponse(response);

    soundEngine.speakText(
      response.spokenText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, []);

  // Start Call Flow
  const startCall = useCallback(() => {
    setCallState('connecting');
    setRemainingSeconds(300);
    setTranscript('');
    setCurrentResponse(ADVISOR_GREETING);

    soundEngine.playRing();

    const ringTimeout = setTimeout(() => {
      soundEngine.playConnected();
      setCallState('active');

      // Greet user with speech
      soundEngine.speakText(
        ADVISOR_GREETING.spokenText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }, 1200);

    return () => clearTimeout(ringTimeout);
  }, []);

  // End Call Flow
  const endCall = useCallback(() => {
    soundEngine.stopSpeaking();
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch {}
    }
    soundEngine.playCallEnded();
    setCallState('ended');
    setIsSpeaking(false);
    setIsListening(false);
  }, [isListening]);

  // Handle open / close lifecycle
  useEffect(() => {
    if (isOpen) {
      startCall();
    } else {
      soundEngine.stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    }
  }, [isOpen, startCall]);

  // 5 Minutes Countdown Timer
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState, endCall]);

  // Microphone toggle button
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    soundEngine.stopSpeaking();
    setIsSpeaking(false);

    if (isListening) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const whatsappUrl = getWhatsAppUrl("Hi! I spoke with Ayesha AI Advisor and want to enroll in the Mentorship.");

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          endCall();
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-lg bg-[#070B14] border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,160,223,0.25)] overflow-hidden flex flex-col text-white max-h-[92vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* TOP HEADER: Advisor Identity + Timer + Close                      */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#0c1424] via-[#070B14] to-[#0c1424]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#008ac2] to-[#00A0DF] p-0.5 shadow-md flex items-center justify-center">
                <img 
                  src="/mentor-profile.png" 
                  alt="Ayesha AI Advisor" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    // Fallback avatar icon
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#070B14] ${
                callState === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">Ayesha</h3>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 uppercase tracking-wider">
                  AI Advisor
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                Ecom With Sami Official
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {callState === 'active' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{formattedTimer}</span>
              </div>
            )}

            <button
              onClick={() => {
                endCall();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BODY 1: CONNECTING STATE                                          */}
        {/* ================================================================= */}
        {callState === 'connecting' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <span className="absolute -inset-4 rounded-full bg-[#00A0DF]/20 animate-ping" />
              <span className="absolute -inset-2 rounded-full bg-[#00A0DF]/30 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#008ac2] to-[#00A0DF] p-1 flex items-center justify-center shadow-xl">
                <img 
                  src="/mentor-profile.png" 
                  alt="Ayesha" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <h4 className="text-lg font-bold text-white mb-1.5">
              Connecting with Ayesha...
            </h4>
            <p className="text-xs text-slate-400 font-medium max-w-xs">
              Preparing Ecom With Sami Roadmap and Mentorship details.
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* BODY 2: ACTIVE CALL STATE (Sound Wave + Dialogue + Question Chips)*/}
        {/* ================================================================= */}
        {callState === 'active' && (
          <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Audio Wave Visualizer Area */}
            <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
              {/* Equalizer Frequency Wave Bars */}
              <div className="flex items-end justify-center gap-1.5 h-12 mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(bar => {
                  const activeClass = isSpeaking 
                    ? 'animate-pulse bg-[#00A0DF]' 
                    : isListening 
                    ? 'animate-bounce bg-emerald-400' 
                    : 'bg-slate-700 h-2';

                  const height = isSpeaking 
                    ? `${Math.max(12, ((bar * 7) % 40) + 8)}px` 
                    : isListening 
                    ? `${Math.max(16, ((bar * 9) % 44) + 10)}px` 
                    : '6px';

                  return (
                    <span 
                      key={bar} 
                      style={{ height }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${activeClass}`}
                    />
                  );
                })}
              </div>

              {/* Status Indicator Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10">
                {isSpeaking ? (
                  <>
                    <Volume2 size={14} className="text-[#00A0DF] animate-bounce" />
                    <span className="text-[#00A0DF]">Ayesha is speaking...</span>
                  </>
                ) : isListening ? (
                  <>
                    <Mic size={14} className="text-emerald-400 animate-pulse" />
                    <span className="text-emerald-400">Listening to you...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-slate-300">Tap mic or select a question</span>
                  </>
                )}
              </div>
            </div>

            {/* Ayesha's Speech & Display Bubble */}
            <div className="bg-slate-900/70 border border-[#00A0DF]/30 rounded-2xl p-4 sm:p-4.5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-[#00A0DF] tracking-wider">
                  Ayesha (AI Advisor):
                </span>
                {isSpeaking && (
                  <button 
                    onClick={() => {
                      soundEngine.stopSpeaking();
                      setIsSpeaking(false);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
                  >
                    Mute Audio
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentResponse.displayText}
              </p>

              {/* Contextual Action Button if available */}
              {currentResponse.suggestedAction && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end">
                  {currentResponse.suggestedAction.actionType === 'enroll' ? (
                    <Link
                      href="/enrollment"
                      onClick={() => {
                        endCall();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00A0DF] hover:bg-[#008ac2] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all"
                    >
                      <span>{currentResponse.suggestedAction.label}</span>
                      <ExternalLink size={13} />
                    </Link>
                  ) : currentResponse.suggestedAction.actionType === 'whatsapp' ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all"
                    >
                      <MessageCircle size={13} />
                      <span>{currentResponse.suggestedAction.label}</span>
                    </a>
                  ) : (
                    <a
                      href="#curriculum"
                      onClick={() => {
                        endCall();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#00A0DF] text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <span>{currentResponse.suggestedAction.label}</span>
                      <ChevronRight size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* User live speech transcription bubble */}
            {transcript && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300">
                <span className="font-bold text-emerald-400">You said: </span>
                <span>"{transcript}"</span>
              </div>
            )}

            {/* Quick Questions Chips */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Poochne Ke Liye Tap Karein:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(q);
                      handleUserQuery(q);
                    }}
                    className="text-[11px] font-semibold bg-slate-900/90 hover:bg-[#00A0DF]/20 border border-white/10 hover:border-[#00A0DF]/50 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Call Controls (Mic + End Call) */}
            <div className="pt-2 flex items-center justify-center gap-4">
              {hasMicSupport && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
                    isListening 
                      ? 'bg-emerald-500 shadow-emerald-500/50 scale-105 animate-pulse' 
                      : 'bg-slate-800 hover:bg-slate-700 border border-white/20'
                  }`}
                  title={isListening ? "Listening... Tap to stop" : "Tap to Speak via Microphone"}
                >
                  {isListening ? <Mic size={24} /> : <Mic size={22} className="text-slate-300" />}
                </button>
              )}

              <button
                type="button"
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                title="End Call"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* BODY 3: CALL ENDED STATE (Exact Anas Ali Style Conversion Screen) */}
        {/* ================================================================= */}
        {callState === 'ended' && (
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Top Identity */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#008ac2] to-[#00A0DF] p-0.5">
                <img 
                  src="/mentor-profile.png" 
                  alt="Ayesha" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Ayesha <span className="text-xs text-slate-400 font-normal">AI advisor</span>
                </h4>
              </div>
            </div>

            {/* Exact Headline matching Anas Ali screenshot */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Call ended.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mb-6 leading-relaxed">
              Our team reserves seats and shares payment details in WhatsApp chat.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#25D366] hover:opacity-95 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 text-center"
              >
                <MessageCircle size={17} />
                <span>Chat with our team</span>
              </a>

              <button
                type="button"
                onClick={startCall}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Talk again</span>
              </button>
            </div>

            {/* Direct Enrollment Alternative */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Ready to enroll right now?</span>
              <Link
                href="/enrollment"
                onClick={onClose}
                className="font-bold text-[#00A0DF] hover:underline inline-flex items-center gap-1"
              >
                <span>Reserve Seat (Rs. 3,799)</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
