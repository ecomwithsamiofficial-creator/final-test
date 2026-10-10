// Unified Persistent Backend Database Engine for Ecom With Sami

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  isActive: boolean;
  enrolledAt: string;
  completedLessons: string[]; // array of lesson IDs
  lastLogin?: string;
  strikeCount?: number;
}

export interface Enrollment {
  id: string;
  trackingCode: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  paymentMethod: string;
  transactionId: string;
  whereHeard?: string;
  receiptUrl?: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  password?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  notes?: string;
}

export interface Module {
  id: number;
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  country: 'UAE' | 'Saudi Arabia';
  city: string;
  phone: string;
  whatsappLink: string;
  minOrder: string;
  deliveryTime: string;
  codSupported: boolean;
  notes: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
  value: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

// -------------------------------------------------------------
// INITIAL SEED DATA
// -------------------------------------------------------------
export const initialStudents: Student[] = [
  {
    id: 'std_demo1',
    name: 'Hamza Tariq',
    email: 'student@samiecom.com',
    phone: '03158960026',
    city: 'Lahore',
    password: 'studentpass2026',
    isActive: true,
    enrolledAt: '2026-08-28',
    completedLessons: ['m1_l1', 'm1_l2', 'm1_l3'],
    lastLogin: '2026-09-02'
  },
  {
    id: 'std_demo2',
    name: 'Bilal Ahmad',
    email: 'bilal@gmail.com',
    phone: '03001234567',
    city: 'Karachi',
    password: 'studentpass2026',
    isActive: true,
    enrolledAt: '2026-08-29',
    completedLessons: ['m1_l1', 'm1_l2', 'm1_l3', 'm2_l1', 'm2_l2'],
    lastLogin: '2026-09-01'
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    id: 'enr_1',
    trackingCode: 'SAMI-ENR-98421',
    studentId: 'std_demo1',
    name: 'Hamza Tariq',
    email: 'student@samiecom.com',
    phone: '03158960026',
    city: 'Lahore',
    paymentMethod: 'Easypaisa',
    transactionId: 'TXN-984210984',
    whereHeard: 'TikTok',
    amount: 'PKR 3,799',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'enr_2',
    trackingCode: 'SAMI-ENR-77312',
    studentId: 'std_demo2',
    name: 'Bilal Ahmad',
    email: 'bilal@gmail.com',
    phone: '03001234567',
    city: 'Karachi',
    paymentMethod: 'Meezan Bank Ltd',
    transactionId: 'FT-20260902-8812',
    whereHeard: 'Instagram',
    amount: 'PKR 3,799',
    status: 'approved',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 'enr_3',
    trackingCode: 'SAMI-ENR-65109',
    studentId: 'std_3',
    name: 'Usman Ghani',
    email: 'usman.ghani@yahoo.com',
    phone: '03219876543',
    city: 'Islamabad',
    paymentMethod: 'JazzCash',
    transactionId: 'JC-876234190',
    whereHeard: 'YouTube',
    amount: 'PKR 3,799',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const initialModules: Module[] = [
  {
    id: 1,
    title: 'Module 1: E-Commerce Launch Secrets (2026-27 Beginner Blueprint)',
    duration: '45 mins',
    description: 'Master the 2026-27 e-commerce opportunity window, dropshipping fundamentals, Shopify setup, and your exact zero to first sale roadmap.',
    lessons: [
      { id: 'm1_l1', title: '1.1 The 2026-27 E-Commerce Opportunity Window', duration: '', videoUrl: '' },
      { id: 'm1_l2', title: '1.2 Dropshipping Decoded - What Nobody Explains Properly', duration: '', videoUrl: '' },
      { id: 'm1_l3', title: '1.3 The White Label Secret Most Beginners Never Discover', duration: '', videoUrl: '' },
      { id: 'm1_l4', title: '1.4 Shopify Setup - The Right Way From Day 1', duration: '', videoUrl: '' },
      { id: 'm1_l5', title: '1.5 Which Business Model Pays in Pakistan', duration: '', videoUrl: '' },
      { id: 'm1_l6', title: '1.6 My Exact Roadmap: Zero to First Sale', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 2,
    title: 'Module 2: Winning Product & Supplier Secrets',
    duration: '50 mins',
    description: 'Discover winning products using Sardar Samiullah’s private formula, competitor creative spying, 3-step risk validation, and trusted supplier sourcing.',
    lessons: [
      { id: 'm2_l1', title: '2.1 My Private Winning-Product Formula', duration: '', videoUrl: '' },
      { id: 'm2_l2', title: '2.2 How I Spot Winning Creatives Before Everyone Else', duration: '', videoUrl: '' },
      { id: 'm2_l3', title: '2.3 Creative Testing - The Step 99% of Sellers Skip', duration: '', videoUrl: '' },
      { id: 'm2_l4', title: '2.4 My Exact Creative Formula, Word-for-Word', duration: '', videoUrl: '' },
      { id: 'm2_l5', title: '2.5 The 3-Step Test Before You Risk a Single Rupee', duration: '', videoUrl: '' },
      { id: 'm2_l6', title: '2.6 Insider Supplier Sourcing - Who I Actually Trust', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 3,
    title: 'Module 3: CRO Store Secrets (Built to Convert)',
    duration: '55 mins',
    description: 'Build a high-converting storefront with premium themes, landing page formulas, homepage psychology, copy-ready blueprints, and COD trust funnels.',
    lessons: [
      { id: 'm3_l1', title: '3.1 Paid Themes for Free - The Method Nobody Shares', duration: '', videoUrl: '' },
      { id: 'm3_l2', title: '3.2 The Landing-Page Formula That Quickly Prints Sales', duration: '', videoUrl: '' },
      { id: 'm3_l3', title: '3.3 Homepage Psychology - Why Visitors Trust You Instantly', duration: '', videoUrl: '' },
      { id: 'm3_l4', title: '3.4 My Product Page Blueprint, Copy Ready', duration: '', videoUrl: '' },
      { id: 'm3_l5', title: '3.5 Speed Secrets - What\'s Silently Killing Your Sales', duration: '', videoUrl: '' },
      { id: 'm3_l6', title: '3.6 The COD Trust Trick Most Stores Get Wrong', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 4,
    title: 'Module 4: Pixel Integration - The Right Way',
    duration: '40 mins',
    description: 'Set up Meta and TikTok pixels correctly, eliminate hidden parameter errors and blind targeting, and master the consistent-sales signal formula.',
    lessons: [
      { id: 'm4_l1', title: '4.1 Pixel & Signal Setup - Most Beginners Get Wrong', duration: '', videoUrl: '' },
      { id: 'm4_l2', title: '4.2 Hidden Parameter Errors - Every Wrong Signal You\'re Sending to TikTok & Meta', duration: '', videoUrl: '' },
      { id: 'm4_l3', title: '4.3 Why This Creates \'Blind Targeting?', duration: '', videoUrl: '' },
      { id: 'm4_l4', title: '4.4 My Consistent-Sales Signal Formula', duration: '', videoUrl: '' },
      { id: 'm4_l5', title: '4.5 Most Sellers Think Their Pixel is Working - It Isn\'t', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 5,
    title: 'Module 5: TikTok Ads - The Untold Playbook',
    duration: '60 mins',
    description: 'Master TikTok Business Center setup, unbannable agency ad accounts, low-budget high-sales campaign launches, and account verification secrets.',
    lessons: [
      { id: 'm5_l1', title: '5.1 Pixel & Signal Setup - Most Beginners Get Wrong', duration: '', videoUrl: '' },
      { id: 'm5_l2', title: '5.2 Business Center setup - The Right Way, Not the YouTube Way', duration: '', videoUrl: '' },
      { id: 'm5_l3', title: '5.3 Free Agency Account - My Exact Method', duration: '', videoUrl: '' },
      { id: 'm5_l4', title: '5.4 Launching Your First Ad Without Wasting Budget', duration: '', videoUrl: '' },
      { id: 'm5_l5', title: '5.5 My Low-Budget, High-Sales Formula - Real Numbers', duration: '', videoUrl: '' },
      { id: 'm5_l6', title: '5.6 Verification Secrets to Avoid Getting Restricted', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 6,
    title: 'Module 6: Meta Ads - The Insider System',
    duration: '65 mins',
    description: 'Master Meta Ads manager creation, high-converting creatives, audiences, fast scaling methodologies, and the 300 PKR low-budget testing formula.',
    lessons: [
      { id: 'm6_l1', title: '6.1 Beginners\' Luck Doesn\'t Exist - This is What Nobody Explains', duration: '', videoUrl: '' },
      { id: 'm6_l2', title: '6.2 Free Creation Of Whole Meta  Adds Account - My Exact Method', duration: '', videoUrl: '' },
      { id: 'm6_l3', title: '6.3 Creatives & Audiences - Things That Actually Connect', duration: '', videoUrl: '' },
      { id: 'm6_l4', title: '6.4 My Proven Method to Launch and Scale Adds Fastly', duration: '', videoUrl: '' },
      { id: 'm6_l5', title: '6.5 My Low-Budget, High-Sales Formula ( Spend Only Just 300PKR )', duration: '', videoUrl: '' },
      { id: 'm6_l6', title: '6.6 The Scaling Decision that Changed Everything', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 7,
    title: 'Module 7: Live Store Case Study (Real Numbers, No Theory)',
    duration: '45 mins',
    description: 'Full transparency breakdown of a real profitable e-commerce store, order metrics, net profit margins, why the product won, and key mistakes to avoid.',
    lessons: [
      { id: 'm7_l1', title: '7.1 A Real Store, Fully Exposed - Start to Finish', duration: '', videoUrl: '' },
      { id: 'm7_l2', title: '7.2 The Exact Order & Profit Breakdown', duration: '', videoUrl: '' },
      { id: 'm7_l3', title: '7.3 Why My This Selected Product Won - The Untold Reason', duration: '', videoUrl: '' },
      { id: 'm7_l4', title: '7.4 Real Mistakes I Made (So You Don\'t Have To)', duration: '', videoUrl: '' }
    ]
  },
  {
    id: 8,
    title: 'Module 8: VIP Lifetime Access & Inner Circle',
    duration: '35 mins',
    description: 'Lifetime LMS updates, 1-on-1 private mentorship sessions on demand, VIP seller networking community, weekly live coaching, and direct WhatsApp support.',
    lessons: [
      { id: 'm8_l1', title: '8.1 Lifetime LMS Access - Yours Forever', duration: '', videoUrl: '' },
      { id: 'm8_l2', title: '8.2 Private 1-on-1 Mentorship Session With Me ( On Demand )', duration: '', videoUrl: '' },
      { id: 'm8_l3', title: '8.3 VIP Community - Network With Real Sellers', duration: '', videoUrl: '' },
      { id: 'm8_l4', title: '8.4 Weekly Live Sessions - Direct Access to Me', duration: '', videoUrl: '' },
      { id: 'm8_l5', title: '8.5 Direct WhatsApp Line - Real Support Real Fast', duration: '', videoUrl: '' },
      { id: 'm8_l6', title: '8.6 Every Future Update, Free, Forever ( Winning Products & Market Trends )', duration: '', videoUrl: '' }
    ]
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Al-Madina Electronics & Gadgets Wholesale',
    category: 'Consumer Electronics & Smart Home',
    country: 'UAE',
    city: 'Dubai (Deira Wholesale Market)',
    phone: '+971508923411',
    whatsappLink: 'https://wa.me/971508923411',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '24-48 Hours Across UAE',
    codSupported: true,
    notes: 'Direct warehouse stock in Deira. Offers same-day dispatch for Dubai & Sharjah orders.'
  },
  {
    id: 'sup_2',
    name: 'Gulf Beauty & Personal Care Hub',
    category: 'Skincare, Haircare & Fragrances',
    country: 'UAE',
    city: 'Sharjah (Industrial Area 4)',
    phone: '+971561234567',
    whatsappLink: 'https://wa.me/971561234567',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '24-48 Hours Across UAE',
    codSupported: true,
    notes: 'Approved GCC cosmetics importer. High margin products with Arabic compliance packaging.'
  },
  {
    id: 'sup_3',
    name: 'Riyadh Prime Kitchen & Home Essentials',
    category: 'Kitchenware & Problem-Solving Home Products',
    country: 'Saudi Arabia',
    city: 'Riyadh (Al-Batha Wholesale Market)',
    phone: '+966509876543',
    whatsappLink: 'https://wa.me/966509876543',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '48 Hours Across Saudi Arabia (SMSA Courier)',
    codSupported: true,
    notes: 'Specializes in TikTok viral kitchen gadgets with local Riyadh stock.'
  },
  {
    id: 'sup_4',
    name: 'Jeddah Auto & Car Accessories Central',
    category: 'Automotive Accessories & Outdoor Gear',
    country: 'Saudi Arabia',
    city: 'Jeddah (Bab Makkah Wholesale)',
    phone: '+966551122334',
    whatsappLink: 'https://wa.me/966551122334',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '24-48 Hours Across Western Province',
    codSupported: true,
    notes: 'High average order value items. Great for Saudi male demographic targeting.'
  }
];

export const initialResources: ResourceItem[] = [
  {
    id: 'res_1',
    title: 'Verified GCC Suppliers Directory (Excel + WhatsApp Contacts)',
    type: 'XLSX Spreadsheet',
    size: '1.4 MB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 10,000',
    description: 'Complete list of 40+ wholesale suppliers in Dubai, Sharjah, Riyadh and Jeddah with phone numbers.'
  },
  {
    id: 'res_2',
    title: 'Custom Fast-Converting Shopify Theme (ZIP File)',
    type: 'Shopify Theme ZIP',
    size: '8.2 MB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 8,500',
    description: 'The exact custom code theme used on our 7-figure stores with built-in 1-click COD popup form.'
  },
  {
    id: 'res_3',
    title: 'Ready-to-Use Facebook & TikTok Ads Blueprint (PDF)',
    type: 'PDF Guide',
    size: '4.7 MB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 5,000',
    description: 'Pre-written ad copy scripts in Arabic and English, campaign testing frameworks and hooks.'
  },
  {
    id: 'res_4',
    title: 'E-Commerce P&L Margin & Profit Calculator (Excel)',
    type: 'Excel Calculator',
    size: '650 KB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 3,000',
    description: 'Automatically calculates advertising ROAS, courier COD deductions, product cost, and net PKR profit.'
  }
];

export const initialTickets: SupportTicket[] = [
  {
    id: 'tkt_1',
    name: 'Hamza Tariq',
    email: 'hamza@gmail.com',
    phone: '03451122334',
    topic: 'Course Access / LMS Activation',
    message: 'Hello Sami, I paid via Meezan Bank. Please check my receipt.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// In-memory Database Store with Global Singleton
class DatabaseStore {
  students: Student[] = [...initialStudents];
  enrollments: Enrollment[] = [...initialEnrollments];
  modules: Module[] = [...initialModules];
  suppliers: Supplier[] = [...initialSuppliers];
  resources: ResourceItem[] = [...initialResources];
  tickets: SupportTicket[] = [...initialTickets];

  // Students Methods
  getStudents() {
    return this.students;
  }

  getStudentByEmail(email: string) {
    return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  getStudentById(id: string) {
    return this.students.find(s => s.id === id);
  }

  addStudent(student: Student) {
    this.students.unshift(student);
    return student;
  }

  updateStudent(id: string, patch: Partial<Student>) {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...patch };
      return this.students[idx];
    }
    return null;
  }

  // Enrollments Methods
  getEnrollments() {
    return this.enrollments;
  }

  addEnrollment(enr: Enrollment) {
    this.enrollments.unshift(enr);
    return enr;
  }

  updateEnrollmentStatus(id: string, status: 'approved' | 'rejected') {
    const enr = this.enrollments.find(e => e.id === id || e.trackingCode === id);
    if (enr) {
      enr.status = status;
      if (status === 'approved') {
        const student = this.getStudentByEmail(enr.email);
        if (student) {
          student.isActive = true;
        } else {
          this.addStudent({
            id: enr.studentId || `std_${Date.now()}`,
            name: enr.name,
            email: enr.email,
            phone: enr.phone,
            city: enr.city,
            password: 'studentpass2026',
            isActive: true,
            enrolledAt: new Date().toISOString().split('T')[0],
            completedLessons: []
          });
        }
      }
      return enr;
    }
    return null;
  }

  deleteEnrollment(id: string) {
    const idx = this.enrollments.findIndex(e => e.id === id || e.trackingCode === id);
    if (idx !== -1) {
      const removed = this.enrollments.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  // Modules & LMS Methods
  getModules() {
    return this.modules;
  }

  getModuleById(id: number) {
    return this.modules.find(m => m.id === id);
  }

  addModule(module: Module) {
    this.modules.push(module);
    return module;
  }

  updateModule(id: number, patch: Partial<Module>) {
    const idx = this.modules.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.modules[idx] = { ...this.modules[idx], ...patch };
      return this.modules[idx];
    }
    return null;
  }

  deleteModule(id: number) {
    const idx = this.modules.findIndex(m => m.id === id);
    if (idx !== -1) {
      const removed = this.modules.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  addLessonToModule(moduleId: number, lesson: Lesson) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      mod.lessons.push(lesson);
      return lesson;
    }
    return null;
  }

  updateLesson(moduleId: number, lessonId: string, patch: Partial<Lesson>) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lIdx !== -1) {
        mod.lessons[lIdx] = { ...mod.lessons[lIdx], ...patch };
        return mod.lessons[lIdx];
      }
    }
    return null;
  }

  deleteLesson(moduleId: number, lessonId: string) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lIdx !== -1) {
        const removed = mod.lessons.splice(lIdx, 1);
        return removed[0];
      }
    }
    return null;
  }

  // Suppliers CRUD
  getSuppliers() {
    return this.suppliers;
  }

  addSupplier(supplier: Supplier) {
    this.suppliers.unshift(supplier);
    return supplier;
  }

  deleteSupplier(id: string) {
    const idx = this.suppliers.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.suppliers.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  // Resources CRUD
  getResources() {
    return this.resources;
  }

  addResource(resource: ResourceItem) {
    this.resources.unshift(resource);
    return resource;
  }

  deleteResource(id: string) {
    const idx = this.resources.findIndex(r => r.id === id);
    if (idx !== -1) {
      const removed = this.resources.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  // Support Tickets
  getTickets() {
    return this.tickets;
  }

  addTicket(ticket: SupportTicket) {
    this.tickets.unshift(ticket);
    return ticket;
  }
}

// Global Singleton
declare global {
  var __ecomDbInstance: DatabaseStore | undefined;
}

export const db: DatabaseStore = global.__ecomDbInstance || (global.__ecomDbInstance = new DatabaseStore());
