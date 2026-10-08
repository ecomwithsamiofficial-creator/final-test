/**
 * Ecom With Sami - AI Voice Advisor (Ayesha) Knowledge Base & NLP Engine
 * 100% Client-Side, Zero-Cost, Ultra-Fast Response
 * Specially tuned for Urdu, Roman Urdu & English e-commerce inquiries.
 */

export interface AdvisorResponse {
  id: string;
  keywords: string[];
  spokenText: string;
  displayText: string;
  suggestedAction?: {
    label: string;
    actionType: 'enroll' | 'whatsapp' | 'curriculum';
  };
}

export const ADVISOR_GREETING: AdvisorResponse = {
  id: 'greeting',
  keywords: ['hi', 'hello', 'salam', 'assalam', 'aoa', 'hey'],
  spokenText: "Assalam o Alaikum! Main Ayesha hoon, Ecom With Sami ki Senior AI Advisor. Mentor Sardar Samiullah ke UAE aur Saudi Arabia dropshipping program ke baare mein aap mujh se koi bhi sawal pooch sakte hain. Main aapki kaise madad kar sakti hoon?",
  displayText: "Assalam-o-Alaikum! Main Ayesha hoon, Ecom With Sami ki Senior AI Advisor. Aap mujh se course, suppliers, ya enrollment ke baare mein kuch bhi pooch sakte hain!"
};

export const ADVISOR_KNOWLEDGE_BASE: AdvisorResponse[] = [
  // 1. Difference from normal courses (User's high priority)
  {
    id: 'difference_from_others',
    keywords: [
      'difference', 'farq', 'normal course', 'aam course', 'dosre course', 'dusre', 'kyun alag',
      'special', 'unique', 'ecom with sami alag', 'market', 'dosro se'
    ],
    spokenText: "Aapka sawal bohot ahem hai. Market mein aam log YouTube ya basic courses bechte hain jo direct bina planning ke ads chalana bolte hain. Ecom With Sami bilkul mukhtalif hai: Ye pehle Pakistan se shuru karwata hai, aapko proper store architecture, winning product validation aur risk management sikhata hai. Iske baad aapko GCC scaling ka proven roadmap milta hai. Aur sab se bari baat, Mentor Samiullah khud WhatsApp par 1-on-1 support dete hain!",
    displayText: "Ecom With Sami aam courses ki tarah nahi hai. Ye pehle Pakistan se complete roadmap, winning product matrix, aur verified GCC suppliers deta hai. Sath 1-on-1 direct WhatsApp mentorship bhi shamil hai.",
    suggestedAction: { label: "Roadmap Check Karein", actionType: "curriculum" }
  },

  // 2. Suppliers & Low Budget (User's high priority)
  {
    id: 'suppliers_and_budget',
    keywords: [
      'supplier', 'suppliers', 'stock', 'inventory', 'maal', 'budget', 'paise', 'investment',
      'kitne paise chahye', 'kitna budget', 'kam budget', 'low budget', 'warehouse', 'deira', 'riyadh'
    ],
    spokenText: "Sab se bari khubsoorat baat ye hai ke aapko lakhoon rupay ki inventory khareedne ki bilkul zaroorat nahi hoti! Course ke andar Dubai, Sharjah aur Riyadh ke verified wholesale suppliers ke direct phone numbers aur contacts diye jate hain. Customer order karega to supplier khud Cash-On-Delivery deliver karega. Aap sirf 10 se 15 hazar PKR testing budget se apna store start kar sakte hain.",
    displayText: "Zero Inventory Risk! Dubai aur Riyadh ke verified wholesale suppliers ke direct contacts course mein milte hain. Supplier khud COD deliver karega. Start karne ke liye sirf PKR 10,000-15,000 ad testing budget kaafi hai.",
    suggestedAction: { label: "Verified Suppliers List", actionType: "curriculum" }
  },

  // 3. Legitimacy / Scam Objections (User's high priority)
  {
    id: 'is_it_scam',
    keywords: [
      'scam', 'fraud', 'fake', 'dhoka', 'asli hai', 'sach hai', 'trust', 'bharosa',
      'kese yaqeen', 'yaqeen', 'real', 'legit'
    ],
    spokenText: "Bilkul nahi! Ecom With Sami 100% verified aur legit mentorship hai. Website par hamare 1,200 se zyada students ke live earnings screenshots aur video reviews mojood hain. Aur sab se bari baat, Mentor Samiullah khud official WhatsApp par live guidance dete hain. Agar koi scam hota to direct phone number, student proofs aur public mentorship desk mojood na hoti!",
    displayText: "100% Verified & Authentic! 1,200+ students ke real bank proofs, profit dashboards aur student video reviews website par mojood hain. Direct WhatsApp access bhi milta hai.",
    suggestedAction: { label: "Student Proofs Dekhein", actionType: "curriculum" }
  },

  // 4. Who is Mentor Samiullah?
  {
    id: 'who_is_sami',
    keywords: [
      'sami', 'samiullah', 'mentor kaun', 'sir sami', 'kon hai', 'who is', 'about mentor',
      'abbottabad', 'founder', 'teacher'
    ],
    spokenText: "Mentor Sardar Samiullah Abbottabad se hain. Wo active e-commerce operator aur agency director hain jo pichle 5 saal se UAE, Saudi Arabia aur Pakistan mein 7-figure stores chala rahe hain. Unhone 1,200 se zyada Pakistani students ko train kiya hai jo ghar baithe Dirhams aur Riyals kama rahe hain.",
    displayText: "Mentor Sardar Samiullah Abbottabad se hain. 5+ saal ka active e-commerce tajurba aur 1,200+ trained students. GCC dropshipping aur brand building ke specialist hain."
  },

  // 5. Course Fee & Ramadan Discount
  {
    id: 'fee_and_price',
    keywords: [
      'fee', 'fees', 'price', 'charges', 'kitne ka hai', 'cost', 'discount', 'kitne paise',
      'ramadan', 'offer', 'kitna hai'
    ],
    spokenText: "Course ki regular fee PKR 14,999 hai, lekin abhi Ramadan Special 88% discount chal raha hai. Aapko lifetime portal access, verified GCC suppliers directory, premium Shopify theme aur direct WhatsApp support sirf PKR 3,799 mein mil raha hai!",
    displayText: "Ramadan Special 88% Off: Regular PKR 14,999 ke bajaye sirf PKR 3,799 me Lifetime Access, 6 VIP Bonuses aur WhatsApp Mentorship shamil hai.",
    suggestedAction: { label: "Rs. 3,799 Me Enroll Karein", actionType: "enroll" }
  },

  // 6. How to enroll / payment methods
  {
    id: 'how_to_enroll',
    keywords: [
      'enroll', 'buy', 'purchase', 'kese join', 'join kaise', 'admission', 'payment', 'jazzcash',
      'easypaisa', 'meezan', 'sadapay', 'bank transfer', 'seat reserve'
    ],
    spokenText: "Enroll karna bohot asaan hai! Aap website par 'Reserve Your Seat' ya 'Enroll Now' button dabayein. Wahan aap JazzCash, EasyPaisa, SadaPay ya Meezan Bank se PKR 3,799 transfer karke receipt upload karein. 15 minute ke andar aapka student LMS account activate ho jayega.",
    displayText: "Enrollment ka tareeqa: Website par 'Enroll Now' button dabayein, EasyPaisa / JazzCash / Bank se PKR 3,799 bhej kar receipt submit karein. LMS credentials foran mil jayenge.",
    suggestedAction: { label: "Abhi Seat Reserve Karein", actionType: "enroll" }
  },

  // 7. Can I do this from Pakistan? / Laptop requirement
  {
    id: 'from_pakistan_mobile',
    keywords: [
      'pakistan se', 'ghar baithe', 'laptop', 'mobile', 'computer', 'device', 'phone',
      'pakistani bank', 'pkr me paise', 'withdraw'
    ],
    spokenText: "Ji bilkul! Hamare 90% se zyada students Pakistan ke alag alag shehron se apne ghar baithe mobile aur laptop se UAE aur Saudi stores chala rahe hain. Aur aapke Dirhams aur Riyals ka profit seedha aapke Pakistani bank account mein transfer hota hai.",
    displayText: "Ji haan! 100% Pakistan se chal sakta hai. Laptop ya mobile dono se operate ho sakta hai. Earning direct Pakistani banks (Meezan, HBL, etc.) me withdraw hoti hai."
  },

  // 8. What is included / Course modules
  {
    id: 'course_content',
    keywords: [
      'kya sikhayeinge', 'modules', 'content', 'syllabus', 'curriculum', 'lectures', 'hours',
      'kya milega', 'bonuses'
    ],
    spokenText: "Isme 8 complete modules hain jisme 36 HD video lectures hain: Shopify store setup, TikTok aur Meta ads, GCC winning products hunt karna, verified suppliers list, COD courier setup, aur scaling roadmap. Sath 6 VIP bonuses jinme premium theme aur WhatsApp mentorship bilkul free hain.",
    displayText: "8 Modules, 36 HD Video Lectures: Store setup, Winning Product Hunting, TikTok/Meta Ads, GCC Suppliers, Couriers, plus 6 VIP Bonuses worth Rs. 30,000 Free!",
    suggestedAction: { label: "Complete Curriculum Dekhein", actionType: "curriculum" }
  },

  // 9. WhatsApp direct contact
  {
    id: 'contact_whatsapp',
    keywords: [
      'whatsapp', 'call', 'number', 'contact', 'baat karni', 'team', 'sami se baat', 'direct baat'
    ],
    spokenText: "Agar aap mentor Samiullah ya unki senior admissions team se WhatsApp par direct baat karna chahte hain, to screen par diye gaye 'Chat on WhatsApp' button par click karein. Hamari team foran guide karegi!",
    displayText: "Direct WhatsApp Mentorship: Screen par 'Chat on WhatsApp' button dabayein aur Mentor Sami ki official admissions desk se direct rabta karein.",
    suggestedAction: { label: "WhatsApp Par Rabta Karein", actionType: "whatsapp" }
  }
];

export const FALLBACK_RESPONSE: AdvisorResponse = {
  id: 'fallback',
  keywords: [],
  spokenText: "Main aapka sawal samajh rahi hoon. Ecom With Sami UAE aur Saudi Arabia dropshipping ka Pakistan ka premier program hai. Isme PKR 3,799 mein verified suppliers aur WhatsApp mentorship milti hai. Aap hamari team se WhatsApp par bhi direct details le sakte hain!",
  displayText: "Ecom With Sami UAE/KSA dropshipping ka complete roadmap sikhata hai. Mazeed kisi bhi sawal ke liye aap hamare WhatsApp button se direct rabta kar sakte hain!"
};

/**
 * Intelligent fuzzy matching for Urdu, Roman Urdu & English inputs.
 */
export function matchAdvisorIntent(query: string): AdvisorResponse {
  if (!query || query.trim().length === 0) {
    return ADVISOR_GREETING;
  }

  const clean = query.toLowerCase().trim();

  // 1. Direct greeting check
  if (/^(hi|hello|salam|assalam|aoa|hey|hy|kia hal|kese ho)\b/.test(clean)) {
    return ADVISOR_GREETING;
  }

  let bestMatch: AdvisorResponse | null = null;
  let maxScore = 0;

  for (const item of ADVISOR_KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (clean.includes(keyword.toLowerCase())) {
        score += keyword.length > 5 ? 3 : 2;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore >= 2) {
    return bestMatch;
  }

  return FALLBACK_RESPONSE;
}

export const QUICK_QUESTIONS = [
  "Fee kitni hai?",
  "Aam course se kaise alag hai?",
  "Suppliers kahan ke hain?",
  "Kya ye koi scam to nahi?",
  "Pakistan se kaise hoga?",
  "Enroll kaise karoon?"
];
