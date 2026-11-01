'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface StudentEnrollment {
  name: string;
  city: string;
  time: string;
}

const RAW_ENROLLMENTS: StudentEnrollment[] = [
  // Lahore
  { name: 'Hamza Tariq', city: 'Lahore', time: 'Just now' },
  { name: 'Zainab Bibi', city: 'Lahore (DHA)', time: '3 mins ago' },
  { name: 'Ali Raza', city: 'Lahore (Johar Town)', time: '8 mins ago' },
  { name: 'Fatima Noor', city: 'Lahore (Model Town)', time: '14 mins ago' },
  { name: 'Usman Ghani', city: 'Lahore', time: '27 mins ago' },
  { name: 'Ayesha Siddiqua', city: 'Lahore', time: '42 mins ago' },
  { name: 'Shahzad Akram', city: 'Lahore (Gulberg)', time: '1 hour ago' },

  // Karachi
  { name: 'Daniyal Ahmed', city: 'Karachi (Gulshan)', time: '2 mins ago' },
  { name: 'Maryam Khan', city: 'Karachi (Clifton)', time: '6 mins ago' },
  { name: 'Bilal Farooq', city: 'Karachi (North Nazimabad)', time: '18 mins ago' },
  { name: 'Hira Salman', city: 'Karachi', time: '31 mins ago' },
  { name: 'Farhan Sheikh', city: 'Karachi (PECHS)', time: '49 mins ago' },
  { name: 'Nimra Javed', city: 'Karachi', time: '1 hour ago' },
  { name: 'Syed Owais', city: 'Karachi (Malir)', time: '2 hours ago' },

  // Islamabad & Rawalpindi
  { name: 'Arsalan Baig', city: 'Islamabad (F-10)', time: 'Just now' },
  { name: 'Mahnoor Shah', city: 'Islamabad (G-11)', time: '4 mins ago' },
  { name: 'Taimoor Hassan', city: 'Rawalpindi (Bahria Town)', time: '11 mins ago' },
  { name: 'Sana Malik', city: 'Rawalpindi (Saddar)', time: '22 mins ago' },
  { name: 'Waleed Qureshi', city: 'Islamabad', time: '35 mins ago' },
  { name: 'Khadija Rehman', city: 'Rawalpindi (Chaklala)', time: '55 mins ago' },
  { name: 'Haris Abbasi', city: 'Islamabad (PWD)', time: '2 hours ago' },

  // Faisalabad
  { name: 'Muhammad Saad', city: 'Faisalabad (D Ground)', time: '5 mins ago' },
  { name: 'Sadia Perveen', city: 'Faisalabad', time: '16 mins ago' },
  { name: 'Adeel Ashraf', city: 'Faisalabad (Madina Town)', time: '29 mins ago' },
  { name: 'Iqra Jameel', city: 'Faisalabad (Peoples Colony)', time: '45 mins ago' },
  { name: 'Zeeshan Haider', city: 'Faisalabad', time: '1 hour ago' },

  // Multan
  { name: 'Mohsin Raza', city: 'Multan (Cantt)', time: '1 min ago' },
  { name: 'Zunaira Aslam', city: 'Multan (Gulgasht)', time: '19 mins ago' },
  { name: 'Faizan Ali', city: 'Multan', time: '38 mins ago' },
  { name: 'Bushra Batool', city: 'Multan (Shah Rukn-e-Alam)', time: '1 hour ago' },

  // Abbottabad & KPK
  { name: 'Sardar Umair', city: 'Abbottabad (Mandian)', time: 'Just now' },
  { name: 'Laiba Jadoon', city: 'Abbottabad', time: '7 mins ago' },
  { name: 'Asad Khan', city: 'Peshawar (Hayatabad)', time: '12 mins ago' },
  { name: 'Anum Yousafzai', city: 'Mardan', time: '26 mins ago' },
  { name: 'Babar Sher', city: 'Swat (Mingora)', time: '41 mins ago' },
  { name: 'Sohail Tanoli', city: 'Haripur', time: '1 hour ago' },
  { name: 'Waqas Swati', city: 'Mansehra', time: '2 hours ago' },
  { name: 'Noman Khattak', city: 'Nowshera', time: '3 hours ago' },

  // Sargodha & Gujranwala Division
  { name: 'Nabeel Akhtar', city: 'Sargodha', time: '3 mins ago' },
  { name: 'Kinza Tariq', city: 'Sargodha (Satellite Town)', time: '21 mins ago' },
  { name: 'Kamran Cheema', city: 'Gujranwala', time: '9 mins ago' },
  { name: 'Mehak Munir', city: 'Gujranwala (Cantt)', time: '33 mins ago' },
  { name: 'Rehan Butt', city: 'Sialkot (Cantt)', time: '15 mins ago' },
  { name: 'Rabia Iftikhar', city: 'Sialkot (Daska)', time: '48 mins ago' },
  { name: 'Hassan Gujjar', city: 'Gujrat', time: '1 hour ago' },
  { name: 'Muneeb Warraich', city: 'Mandi Bahauddin', time: '2 hours ago' },
  { name: 'Zubair Wazir', city: 'Wazirabad', time: '3 hours ago' },

  // Southern Punjab & Sindh
  { name: 'Abdullah Chaudhry', city: 'Bahawalpur', time: '4 mins ago' },
  { name: 'Fariha Qasim', city: 'Bahawalpur', time: '24 mins ago' },
  { name: 'Tariq Mehmood', city: 'Rahim Yar Khan', time: '13 mins ago' },
  { name: 'Jaweria Naz', city: 'Sadiqabad', time: '39 mins ago' },
  { name: 'Shahid Leghari', city: 'Dera Ghazi Khan', time: '52 mins ago' },
  { name: 'Abdul Sami', city: 'Sukkur', time: '1 hour ago' },
  { name: 'Sidra Soomro', city: 'Hyderabad (Qasimabad)', time: '23 mins ago' },
  { name: 'Mirza Danish', city: 'Mirpurkhas', time: '2 hours ago' },

  // Potohar & Northern Areas
  { name: 'Kashif Mehmood', city: 'Chakwal', time: '6 mins ago' },
  { name: 'Mehwish Raja', city: 'Rawalpindi (Gujar Khan)', time: '17 mins ago' },
  { name: 'Saqib Kiyani', city: 'Jhelum', time: '34 mins ago' },
  { name: 'Nida Kazmi', city: 'Mirpur (AJK)', time: '44 mins ago' },
  { name: 'Saman Bukhari', city: 'Muzaffarabad', time: '1 hour ago' },
  { name: 'Junaid Malik', city: 'Attock', time: '2 hours ago' },
  { name: 'Rohail Ahmed', city: 'Wah Cantt', time: '3 hours ago' },

  // Balochistan & Other Towns
  { name: 'Ahmed Kasi', city: 'Quetta (Cantt)', time: '10 mins ago' },
  { name: 'Komal Baloch', city: 'Quetta', time: '58 mins ago' },
  { name: 'Shayan Bugti', city: 'Hub', time: '2 hours ago' },
  { name: 'Sajid Sial', city: 'Jhang', time: '28 mins ago' },
  { name: 'Amna Bibi', city: 'Okara', time: '37 mins ago' },
  { name: 'Salman Lodhi', city: 'Sahiwal', time: '1 hour ago' },
  { name: 'Shoaib Bhatti', city: 'Kasur', time: '2 hours ago' },
  { name: 'Tayyaba Rajput', city: 'Sheikhupura', time: '3 hours ago' }
];

export function LiveEnrollmentTicker() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Fisher-Yates shuffle array once on mount so every visitor sees a unique, non-repeating sequence
  const shuffledList = useMemo(() => {
    const list = [...RAW_ENROLLMENTS];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, []);

  useEffect(() => {
    setMounted(true);
    // Cycle every 4.5 seconds
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % shuffledList.length);
        setIsFading(false);
      }, 350); // fast smooth cross-fade duration
    }, 4500);

    return () => clearInterval(interval);
  }, [shuffledList]);

  if (!mounted) {
    // SSR initial placeholder: perfectly clean & zero layout shift
    const initial = RAW_ENROLLMENTS[0];
    return (
      <div className="w-full flex justify-center lg:justify-start my-2.5 sm:my-3">
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 border border-[#00A0DF]/30 shadow-xs text-[11px] sm:text-xs text-slate-700 font-medium select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="truncate">
            <strong className="text-slate-900 font-bold">{initial.name}</strong> from {initial.city} enrolled
          </span>
          <span className="text-slate-400 font-bold">•</span>
          <span className="text-[#00A0DF] font-semibold whitespace-nowrap">{initial.time}</span>
        </div>
      </div>
    );
  }

  const current = shuffledList[currentIndex] || shuffledList[0];

  return (
    <div className="w-full flex justify-center lg:justify-start my-2.5 sm:my-3">
      <div 
        className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#00A0DF]/35 shadow-[0_2px_10px_rgba(0,160,223,0.12)] text-[11px] sm:text-xs text-slate-700 select-none transition-all duration-300 ease-out max-w-[95%] sm:max-w-none ${
          isFading ? 'opacity-0 -translate-y-1 scale-98' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Live Pulsing Emerald Green Dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {/* Dynamic Student Info with Verified Check */}
        <div className="flex items-center gap-1 sm:gap-1.5 truncate">
          <span className="truncate">
            <strong className="text-slate-900 font-bold tracking-tight">{current.name}</strong>
            <span className="text-slate-600 font-medium"> from </span>
            <span className="text-slate-800 font-semibold">{current.city}</span>
            <span className="text-slate-600 font-medium"> enrolled</span>
          </span>

          <CheckCircle2 size={13} className="text-[#00A0DF] fill-[#00A0DF]/15 flex-shrink-0" />
        </div>

        {/* Separator Dot & Relative Time */}
        <span className="text-slate-300 font-bold flex-shrink-0">•</span>
        <span className="text-[#00A0DF] font-bold text-[10px] sm:text-[11px] whitespace-nowrap flex-shrink-0 bg-[#E0F2FE]/60 px-1.5 py-0.5 rounded-md">
          {current.time}
        </span>
      </div>
    </div>
  );
}

export default LiveEnrollmentTicker;
