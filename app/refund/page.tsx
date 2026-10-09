'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  XCircle,
  HelpCircle, 
  ArrowRight,
  Phone,
  Mail,
  Zap,
  Check,
  Flame,
  Globe2,
  Lock,
  Layers,
  Sparkles,
  Award,
  FileText
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';
import { defaultCmsContent, CmsContentSchema } from '@/utils/cmsStore';
import { supabase } from '@/lib/supabase';

export default function RefundPolicyPage() {
  const { email, displayPhone, getWhatsAppUrl } = useContactConfig();
  const [content, setContent] = useState<CmsContentSchema>(defaultCmsContent);

  useEffect(() => {
    const fetchContent = async () => {
      // 1. Try local API
      try {
        const res = await fetch('/api/public/cms-content?_t=' + Date.now(), {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.sections) {
            setContent(prev => ({ ...prev, ...data.sections }));
            return;
          }
        }
      } catch (e) {}

      // 2. Direct Supabase Cloud Fetch fallback
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('cms_settings')
            .select('value_json')
            .eq('key', 'main_cms')
            .maybeSingle();

          if (!error && data && data.value_json) {
            const parsed = typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
            if (parsed && typeof parsed === 'object') {
              setContent(prev => ({ ...prev, ...parsed }));
            }
          }
        } catch (e) {}
      }
    };

    fetchContent();
  }, []);

  const policy = content.refund_policy || defaultCmsContent.refund_policy!;
  const days = policy.guarantee_days || 10;
  const refundWhatsAppUrl = getWhatsAppUrl(`Hi Sami Team! I would like to submit a formal refund audit request regarding the ${days}-Day Conditional Money-Back Guarantee.`);

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-[#00A0DF] selection:text-white font-sans antialiased">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-40px] left-[20%] w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-40px] right-[20%] w-[300px] h-[300px] bg-[#00A0DF]/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck size={14} />
            {policy.badge || `${days}-DAY CONDITIONAL MONEY-BACK GUARANTEE`}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {policy.hero_title || `${days}-Day Conditional Refund Policy`}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {policy.hero_subtitle || 'Read Carefully Before Enrolling. Action-Based, Transparent, & Zero-Gimmick Policy.'}
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
            <span>{policy.effective_date || 'Effective Date: January 1, 2026 • Last Updated: October 2026'}</span>
          </div>
        </div>
      </section>

      {/* Main Refund Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-6 sm:p-10 md:p-12 space-y-12">

          {/* Top Guarantee Pill Card */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/60 to-white border-2 border-emerald-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex flex-col items-center justify-center font-black shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none">{days}</span>
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">DAYS</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5 flex items-center gap-2">
                <span>Action-Based Satisfaction Guarantee</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">100% Transparent</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We are committed to your success. If you watch 100% of the course lectures, list and test 10–15 products on your store, follow the ads matrix, and generate zero results within <strong>{days} calendar days</strong>, we honor your refund promptly.
              </p>
            </div>
          </div>

          {/* SECTION 1: CRITICAL CLARIFICATION (NOT AMAZON / EBAY / ETSY) */}
          <section className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-6 sm:p-7 space-y-3.5">
            <div className="flex items-center gap-2.5 text-amber-800">
              <AlertTriangle size={22} className="flex-shrink-0 text-amber-600" />
              <span className="text-xs font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                {policy.not_marketplaces_badge || 'CRITICAL MENTORSHIP CLARIFICATION'}
              </span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {policy.not_marketplaces_title || 'Strictly Dropshipping to Brand Mentorship (NOT Amazon / eBay / Etsy)'}
            </h3>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line font-medium">
              {policy.not_marketplaces_text || `We are 100% committed to your real practical e-commerce success. This mentorship teaches Shopify Store Architecture, High-Margin Winning Product Hunting, Meta & TikTok Paid Ads Scaling, and Direct Verified Supplier Sourcing.\n\nThis program is STRICTLY a Dropshipping, White Label & Private Label E-Commerce Training. It is NOT an Amazon FBA, eBay, or Etsy marketplace course.`}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-100/90 border border-amber-300/80 text-xs font-bold text-amber-950">
              ⚠️ {policy.mistake_enrollment_warning || 'By enrolling, you confirm that you have reviewed the curriculum and understand the nature of the training. Enrolling by mistake, misunderstanding the course type, or claiming "I assumed this was an Amazon or eBay course" does NOT qualify for a refund under any circumstances.'}
            </div>
          </section>

          {/* SECTION 2: MENTOR SAMI'S REAL ROADMAP EXPLANATION */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Globe2 size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {policy.sami_roadmap_title || 'Mentor Sami’s Real Step-by-Step E-Commerce Roadmap'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
              {policy.sami_roadmap_text || `Our proven blueprint starts beginners locally in Pakistan with Local Dropshipping on a low testing budget. This guarantees minimum risk, keeps student capital safe, and builds instant practical confidence.\n\nOnce students start seeing positive ROAS and consistent orders, we guide them step by step to transition into White Label custom branding, Private Label enterprise equity, and scaling into GCC (UAE AED & Saudi Arabia SAR) and international global markets. This takes a beginner from scratch to a professional multi-market brand owner.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-black text-[#00A0DF] uppercase tracking-wider mb-1">STAGE 1: LOW RISK START</div>
                <div className="text-xs font-bold text-slate-900">Local Pakistan Dropshipping</div>
                <div className="text-[11px] text-slate-500 mt-1">Zero inventory risk, low budget testing to build confidence.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">STAGE 2: BRAND BUILDING</div>
                <div className="text-xs font-bold text-slate-900">White Label & Packaging</div>
                <div className="text-[11px] text-slate-500 mt-1">Custom boxes, logo stickers & direct manufacturer sourcing.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">STAGE 3: GCC SCALING</div>
                <div className="text-xs font-bold text-slate-900">Private Label (UAE & KSA)</div>
                <div className="text-[11px] text-slate-500 mt-1">Selling in Dirhams & Riyals with high purchasing power.</div>
              </div>
            </div>
          </section>

          {/* SECTION 3: NO INSTANT OR NO-ACTION REFUNDS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black flex-shrink-0">
                <XCircle size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {policy.no_refund_title || 'No Instant or No-Action Refunds (Strictly Enforced)'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Refunds are <strong className="text-rose-600">STRICTLY NOT APPLICABLE</strong> under the following circumstances:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {(policy.no_refund_points || []).map((point, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/80 flex items-start gap-2.5">
                  <XCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-700 leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white text-xs font-bold leading-relaxed border border-slate-800">
              👉 <strong>Zero-Tolerance Notice:</strong> If you enroll today without watching the complete course lectures, testing products, and submitting the mandatory audit proofs below, a refund will NOT be issued under any circumstances.
            </div>
          </section>

          {/* SECTION 4: 10-DAY ELIGIBILITY CRITERIA (ALL MUST BE MET) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {policy.criteria_title || `${days}-Day Refund Eligibility Criteria (ALL Must Be Met)`}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              A refund request will only be audited and approved if <strong className="text-slate-900">ALL 5 mandatory conditions</strong> below are satisfied:
            </p>

            <div className="space-y-4 pt-1">
              {/* Criterion 1: 100% Course Completion & DRM Tracker */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-black flex items-center justify-center">1</span>
                  <h4 className="text-sm font-black text-slate-900">100% Course Completion on LMS Portal</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  {policy.criteria_course_completion || `You must watch and complete 100% of all video modules, exercises, and assignments within ${days} calendar days of enrollment.`}
                </p>
                <div className="ml-8 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold leading-relaxed">
                  {policy.drm_tracker_notice || '⚠️ AUTOMATED LMS LIVE TRACKER & DRM MONITORING: Our student portal features an active DRM Live Watch Tracker that automatically logs your exact watch duration, playback completion percentage, and lesson progress in our database. False claims of completing the course will be verified directly against system logs.'}
                </div>
              </div>

              {/* Criterion 2: 10 to 15 Products Tested */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-black flex items-center justify-center">2</span>
                  <h4 className="text-sm font-black text-slate-900">10 to 15 Products Researched, Listed & Tested</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  {policy.criteria_products_hunting || 'You must research, launch, and test at least 10 to 15 products on your live store using the 15-Point Product Matrix and testing framework taught in the course. Testing only 1 to 3 products does NOT qualify.'}
                </p>
              </div>

              {/* Criterion 3: Concrete Implementation Proof */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-black flex items-center justify-center">3</span>
                  <h4 className="text-sm font-black text-slate-900">Verifiable Implementation Proof</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium pl-8">
                  {policy.criteria_proof_text || 'You must provide concrete, verifiable proof of full implementation, including:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                  {(policy.criteria_proof_points || []).map((proof, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                      <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">{proof}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Criterion 4: Zero Sales */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-black flex items-center justify-center">4</span>
                  <h4 className="text-sm font-black text-slate-900">Zero Sales After Full 10-Day Implementation</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  {policy.criteria_zero_sales || `If after ${days} full days of active, verified, and consistent implementation you have generated zero sales despite applying all optimization and supplier strategies, you qualify to submit a refund request.`}
                </p>
              </div>

              {/* Criterion 5: Timely Request */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-black flex items-center justify-center">5</span>
                  <h4 className="text-sm font-black text-slate-900">Submission Within Exactly {days} Days</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  {policy.criteria_timely_request || `Your request must be submitted within exactly ${days} calendar days from the purchase timestamp. Late requests cannot be considered.`}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5: HOW TO SUBMIT A CLAIM (4 STEPS) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <RotateCcw size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {policy.claim_steps_title || 'How to Submit a Refund Claim (4 Steps)'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {(policy.claim_steps || []).map((stepItem, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#00A0DF] text-white text-xs font-black flex items-center justify-center">
                      {stepItem.step}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{stepItem.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                    {stepItem.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed">
              🔒 <strong>LMS Deactivation Notice:</strong> {policy.deactivation_notice || 'Upon refund approval, your Student LMS Portal access, course certificates, and 1-on-1 WhatsApp mentorship desk access will be permanently deactivated.'}
            </div>
          </section>

          {/* SUPPORT ACTIONS */}
          <section className="pt-4 border-t border-gray-100">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-4 text-center sm:text-left">
              Contact Official Support Desk
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={refundWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors font-bold text-sm shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Contact Via WhatsApp</div>
                  <div className="text-sm font-black">{displayPhone}</div>
                </div>
              </a>

              <a
                href={`mailto:${email}?subject=Refund%20Request%20–%20Ecom%20With%20Sami`}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors font-bold text-sm shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-sky-600 font-bold uppercase tracking-wider">Contact Via Email</div>
                  <div className="text-sm font-black">{email}</div>
                </div>
              </a>
            </div>
          </section>

          {/* Bottom Back CTA */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#00A0DF] transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Back to Home
            </Link>
            <Link
              href="/enrollment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00A0DF] hover:bg-[#008ac2] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <span>Enroll With Confidence</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
