// Realistic Showcase & Testimonial Data for Video Demonstrations & Marketing Hype
// Perfectly formatted for Pakistani E-commerce Mentorship with Mentor Sardar Samiullah

export interface ShowcaseEnrollment {
  id: string;
  trackingCode: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  paymentMethod: string;
  transactionId: string;
  amount: string;
  status: 'approved';
  relativeTime: string;
  courseTier: string;
}

export interface ShowcaseReview {
  id: string;
  studentName: string;
  city: string;
  rating: number;
  relativeTime: string;
  course: string;
  storeRevenue?: string;
  headline: string;
  reviewText: string;
  tag: string;
  studentType?: string;
  isVerifiedStudent?: boolean;
  category?: string;
}

export const SHOWCASE_ENROLLMENTS: ShowcaseEnrollment[] = [
  {
    id: "ENR-PK-8901",
    trackingCode: "TRK-98214",
    name: "Muhammad Hamza",
    email: "hamza.ecom92@gmail.com",
    phone: "+92 301 8472910",
    city: "Lahore",
    paymentMethod: "Meezan Bank Transfer",
    transactionId: "MZB9821049281",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "12 mins ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8902",
    trackingCode: "TRK-98215",
    name: "Ali Raza Khan",
    email: "ali.raza.ecom@outlook.com",
    phone: "+92 321 4920184",
    city: "Karachi",
    paymentMethod: "JazzCash",
    transactionId: "JC0849201849",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "28 mins ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8903",
    trackingCode: "TRK-98216",
    name: "Daniyal Tariq",
    email: "daniyal.tariq99@gmail.com",
    phone: "+92 333 5192847",
    city: "Islamabad",
    paymentMethod: "Easypaisa",
    transactionId: "EP7402849102",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "45 mins ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8904",
    trackingCode: "TRK-98217",
    name: "Bilal Ahmed Qureshi",
    email: "bilal.ahmed.biz@gmail.com",
    phone: "+92 345 7829104",
    city: "Rawalpindi",
    paymentMethod: "SadaPay",
    transactionId: "SP6501928401",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "1 hour ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8905",
    trackingCode: "TRK-98218",
    name: "Shahzaib Khan",
    email: "shahzaib.dropship@gmail.com",
    phone: "+92 300 9283741",
    city: "Faisalabad",
    paymentMethod: "NayaPay",
    transactionId: "NP8392019482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "1 hour ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8906",
    trackingCode: "TRK-98219",
    name: "Usama Butt",
    email: "usama.butt.ecom@gmail.com",
    phone: "+92 312 8472019",
    city: "Gujranwala",
    paymentMethod: "Bank Alfalah",
    transactionId: "BAF492018491",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8907",
    trackingCode: "TRK-98220",
    name: "Farhan Siddiqui",
    email: "farhan.siddiqui94@gmail.com",
    phone: "+92 302 7482910",
    city: "Karachi",
    paymentMethod: "JazzCash",
    transactionId: "JC9482019481",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8908",
    trackingCode: "TRK-98221",
    name: "Kashif Mehmood",
    email: "kashif.mehmood.pk@gmail.com",
    phone: "+92 334 6829104",
    city: "Multan",
    paymentMethod: "Easypaisa",
    transactionId: "EP8492018491",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "3 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8909",
    trackingCode: "TRK-98222",
    name: "Saad Ur Rehman",
    email: "saad.rehman.scale@gmail.com",
    phone: "+92 308 5928104",
    city: "Lahore",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB8492019482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "3 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8910",
    trackingCode: "TRK-98223",
    name: "Talha Farooq",
    email: "talha.farooq.dev@gmail.com",
    phone: "+92 322 7492018",
    city: "Sialkot",
    paymentMethod: "SadaPay",
    transactionId: "SP9482019481",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "4 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8911",
    trackingCode: "TRK-98224",
    name: "Arsalan Malik",
    email: "arsalan.malik.ecom@gmail.com",
    phone: "+92 315 9283741",
    city: "Peshawar",
    paymentMethod: "Easypaisa",
    transactionId: "EP7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "4 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8912",
    trackingCode: "TRK-98225",
    name: "Zeeshan Ali",
    email: "zeeshan.ali.commerce@gmail.com",
    phone: "+92 306 4829102",
    city: "Hyderabad",
    paymentMethod: "JazzCash",
    transactionId: "JC9482018491",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "5 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8913",
    trackingCode: "TRK-98226",
    name: "Haris Javed",
    email: "haris.javed.dropship@gmail.com",
    phone: "+92 331 8492018",
    city: "Gujrat",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "5 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8914",
    trackingCode: "TRK-98227",
    name: "Abdullah Chaudhry",
    email: "abdullah.chaudhry96@gmail.com",
    phone: "+92 320 6829104",
    city: "Bahawalpur",
    paymentMethod: "NayaPay",
    transactionId: "NP9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "6 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8915",
    trackingCode: "TRK-98228",
    name: "Hamad Sheikh",
    email: "hamad.sheikh.biz@gmail.com",
    phone: "+92 342 8492018",
    city: "Lahore",
    paymentMethod: "Bank Alfalah",
    transactionId: "BAF8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "6 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8916",
    trackingCode: "TRK-98229",
    name: "Waleed Qureshi",
    email: "waleed.qureshi.scale@gmail.com",
    phone: "+92 307 9283741",
    city: "Islamabad",
    paymentMethod: "SadaPay",
    transactionId: "SP7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "7 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8917",
    trackingCode: "TRK-98230",
    name: "Nabeel Akhtar",
    email: "nabeel.akhtar.ecom@gmail.com",
    phone: "+92 313 7482910",
    city: "Sargodha",
    paymentMethod: "Easypaisa",
    transactionId: "EP8492019481",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "8 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8918",
    trackingCode: "TRK-98231",
    name: "Taimoor Hassan",
    email: "taimoor.hassan.pk@gmail.com",
    phone: "+92 336 5928104",
    city: "Rawalpindi",
    paymentMethod: "JazzCash",
    transactionId: "JC8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "8 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8919",
    trackingCode: "TRK-98232",
    name: "Mohsin Raza",
    email: "mohsin.raza.ecom98@gmail.com",
    phone: "+92 305 8492018",
    city: "Karachi",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "9 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8920",
    trackingCode: "TRK-98233",
    name: "Adeel Ashraf",
    email: "adeel.ashraf.scale@gmail.com",
    phone: "+92 323 9283741",
    city: "Faisalabad",
    paymentMethod: "Easypaisa",
    transactionId: "EP9482018491",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "10 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8921",
    trackingCode: "TRK-98234",
    name: "Shahmir Afridi",
    email: "shahmir.afridi@gmail.com",
    phone: "+92 344 6829104",
    city: "Peshawar",
    paymentMethod: "JazzCash",
    transactionId: "JC7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "11 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8922",
    trackingCode: "TRK-98235",
    name: "Sarmad Ali",
    email: "sarmad.ali.dropship@gmail.com",
    phone: "+92 304 7482910",
    city: "Lahore",
    paymentMethod: "SadaPay",
    transactionId: "SP8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "12 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8923",
    trackingCode: "TRK-98236",
    name: "Umer Farooq",
    email: "umer.farooq.biz97@gmail.com",
    phone: "+92 316 8492018",
    city: "Kasur",
    paymentMethod: "NayaPay",
    transactionId: "NP7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "13 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8924",
    trackingCode: "TRK-98237",
    name: "Zuhair Shah",
    email: "zuhair.shah.ecom@gmail.com",
    phone: "+92 332 9283741",
    city: "Islamabad",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB9482018491",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "14 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8925",
    trackingCode: "TRK-98238",
    name: "Ahsan Nawaz",
    email: "ahsan.nawaz.scale@gmail.com",
    phone: "+92 303 6829104",
    city: "Okara",
    paymentMethod: "Bank Alfalah",
    transactionId: "BAF7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "15 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8926",
    trackingCode: "TRK-98239",
    name: "Muzammil Baig",
    email: "muzammil.baig.pk@gmail.com",
    phone: "+92 324 7482910",
    city: "Karachi",
    paymentMethod: "Easypaisa",
    transactionId: "EP8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "16 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8927",
    trackingCode: "TRK-98240",
    name: "Rehan Dar",
    email: "rehan.dar.ecom@gmail.com",
    phone: "+92 346 8492018",
    city: "Sialkot",
    paymentMethod: "JazzCash",
    transactionId: "JC9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "17 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8928",
    trackingCode: "TRK-98241",
    name: "Ammar Zahid",
    email: "ammar.zahid.ecom@gmail.com",
    phone: "+92 317 9283741",
    city: "Lahore",
    paymentMethod: "SadaPay",
    transactionId: "SP7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "18 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8929",
    trackingCode: "TRK-98242",
    name: "Faizan Cheema",
    email: "faizan.cheema.scale@gmail.com",
    phone: "+92 335 6829104",
    city: "Gujranwala",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "19 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8930",
    trackingCode: "TRK-98243",
    name: "Hassan Raza",
    email: "hassan.raza.ecom95@gmail.com",
    phone: "+92 309 7482910",
    city: "Sheikhupura",
    paymentMethod: "Easypaisa",
    transactionId: "EP9482018491",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "20 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8931",
    trackingCode: "TRK-98244",
    name: "Junaid Abbasi",
    email: "junaid.abbasi.pk@gmail.com",
    phone: "+92 325 8492018",
    city: "Abbottabad",
    paymentMethod: "NayaPay",
    transactionId: "NP8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "21 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8932",
    trackingCode: "TRK-98245",
    name: "Awais Munir",
    email: "awais.munir.dropship@gmail.com",
    phone: "+92 347 9283741",
    city: "Multan",
    paymentMethod: "Bank Alfalah",
    transactionId: "BAF9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "22 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8933",
    trackingCode: "TRK-98246",
    name: "Sheraz Gul",
    email: "sheraz.gul.ecom@gmail.com",
    phone: "+92 318 6829104",
    city: "Quetta",
    paymentMethod: "JazzCash",
    transactionId: "JC7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "23 hours ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8934",
    trackingCode: "TRK-98247",
    name: "Danish Mehmood",
    email: "danish.mehmood.biz@gmail.com",
    phone: "+92 337 7482910",
    city: "Rawalpindi",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 11:30 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8935",
    trackingCode: "TRK-98248",
    name: "Babar Azam Khan",
    email: "babar.azam.ecom@gmail.com",
    phone: "+92 308 8492018",
    city: "Lahore",
    paymentMethod: "SadaPay",
    transactionId: "SP8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 10:15 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8936",
    trackingCode: "TRK-98249",
    name: "Shoaib Akhtar Warraich",
    email: "shoaib.warraich.scale@gmail.com",
    phone: "+92 326 9283741",
    city: "Gujrat",
    paymentMethod: "Easypaisa",
    transactionId: "EP9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 08:45 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8937",
    trackingCode: "TRK-98250",
    name: "Zeeshan Haider",
    email: "zeeshan.haider.pk@gmail.com",
    phone: "+92 348 6829104",
    city: "Chiniot",
    paymentMethod: "JazzCash",
    transactionId: "JC8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 07:20 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8938",
    trackingCode: "TRK-98251",
    name: "Noman Ijaz",
    email: "noman.ijaz.dropship@gmail.com",
    phone: "+92 319 7482910",
    city: "Sahiwal",
    paymentMethod: "Bank Alfalah",
    transactionId: "BAF8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 06:10 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8939",
    trackingCode: "TRK-98252",
    name: "Shahid Afridi Khan",
    email: "shahid.afridi.ecom@gmail.com",
    phone: "+92 338 8492018",
    city: "Peshawar",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 04:30 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8940",
    trackingCode: "TRK-98253",
    name: "Khurram Shahzad",
    email: "khurram.shahzad.scale@gmail.com",
    phone: "+92 301 9283741",
    city: "Faisalabad",
    paymentMethod: "NayaPay",
    transactionId: "NP9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 02:40 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8941",
    trackingCode: "TRK-98254",
    name: "Waqas Anwar",
    email: "waqas.anwar.ecom@gmail.com",
    phone: "+92 327 6829104",
    city: "Lahore",
    paymentMethod: "SadaPay",
    transactionId: "SP9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 12:15 PM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8942",
    trackingCode: "TRK-98255",
    name: "Zain Ul Abideen",
    email: "zain.abideen.pk@gmail.com",
    phone: "+92 349 7482910",
    city: "Karachi",
    paymentMethod: "Easypaisa",
    transactionId: "EP7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "Yesterday, 10:00 AM",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8943",
    trackingCode: "TRK-98256",
    name: "Adeel Khalid",
    email: "adeel.khalid.ecom@gmail.com",
    phone: "+92 302 8492018",
    city: "Islamabad",
    paymentMethod: "JazzCash",
    transactionId: "JC8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8944",
    trackingCode: "TRK-98257",
    name: "Muhammad Bilal",
    email: "m.bilal.scale98@gmail.com",
    phone: "+92 328 9283741",
    city: "Wah Cantt",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8945",
    trackingCode: "TRK-98258",
    name: "Sufyan Tariq",
    email: "sufyan.tariq.ecom@gmail.com",
    phone: "+92 339 6829104",
    city: "Rahim Yar Khan",
    paymentMethod: "Bank Alfalah",
    transactionId: "BAF9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8946",
    trackingCode: "TRK-98259",
    name: "Hammad Aslam",
    email: "hammad.aslam.dropship@gmail.com",
    phone: "+92 311 7482910",
    city: "Mardan",
    paymentMethod: "Easypaisa",
    transactionId: "EP9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8947",
    trackingCode: "TRK-98260",
    name: "Tayyab Rasheed",
    email: "tayyab.rasheed.pk@gmail.com",
    phone: "+92 304 8492018",
    city: "Lahore",
    paymentMethod: "SadaPay",
    transactionId: "SP7482910482",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "2 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8948",
    trackingCode: "TRK-98261",
    name: "Moiz Ur Rehman",
    email: "moiz.rehman.ecom@gmail.com",
    phone: "+92 329 9283741",
    city: "Karachi",
    paymentMethod: "NayaPay",
    transactionId: "NP8492018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "3 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8949",
    trackingCode: "TRK-98262",
    name: "Ahsan Raza Bajwa",
    email: "ahsan.bajwa.scale@gmail.com",
    phone: "+92 340 6829104",
    city: "Narowal",
    paymentMethod: "JazzCash",
    transactionId: "JC9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "3 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  },
  {
    id: "ENR-PK-8950",
    trackingCode: "TRK-98263",
    name: "Saqib Javed",
    email: "saqib.javed.commerce@gmail.com",
    phone: "+92 306 7482910",
    city: "Jhang",
    paymentMethod: "Meezan Bank",
    transactionId: "MZB9482018492",
    amount: "PKR 3,799",
    status: "approved",
    relativeTime: "3 days ago",
    courseTier: "VIP Ecom Mentorship + GCC Scaling"
  }
];

export const SHOWCASE_REVIEWS: ShowcaseReview[] = [
  {
    id: "REV-PK-01",
    studentName: "Muhammad Hamza",
    city: "Lahore",
    rating: 5,
    relativeTime: "35 mins ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "MashaAllah 3rd day pe profitable orders start ho gaye!",
    reviewText: "MashaAllah se mera aaj 3rd day hai ads chalaye hue, pehle din 15 orders, doosre din 25 orders, teesre din 20 orders, store profitable ja raha hai aapki strategy se. Pehle main product testing aur creative hook samajhne mein confuse tha, lekin Sami bhai ke step-by-step framework aur 3-shift formula ne har step crystal clear kar diya. Highly recommended!",
    tag: "Meta & TikTok Ads",
    studentType: "University Student",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-02",
    studentName: "Ayesha Siddiqa",
    city: "Lahore",
    rating: 5,
    relativeTime: "1 hour ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Ghar baith kar step-by-step seekhne ka behtareen platform",
    reviewText: "Ghar aur bacchon ke sath online business start karna pehle bohot mushkil lagta tha. Lekin Sami bhai ke lectures itne simple aur clear hain ke Shopify store setup, product page layout aur conversion triggers khud design kiye. Direct WhatsApp support se har confusion time pe solve ho jati hai.",
    tag: "Shopify Store & CRO",
    studentType: "Housewife / Mompreneur",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-03",
    studentName: "Ali Raza Khan",
    city: "Karachi",
    rating: 5,
    relativeTime: "2 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    headline: "GCC supplier directory aur COD delivery ka practical roadmap",
    reviewText: "Main corporate job karta hoon aur side pe UAE dropshipping plan kar raha tha. Sami bhai ki mentorship mein jo GCC private supplier contacts, Arabic product positioning aur local courier accounts ka workflow mila, us se mujhe bohot confidence mila. Koi faltu theory nahi, sab practical implementation hai.",
    tag: "UAE & GCC Operations",
    studentType: "Working Professional",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-04",
    studentName: "Fatima Noor",
    city: "Islamabad",
    rating: 5,
    relativeTime: "3 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Product research ka actual validation framework samajh aya",
    reviewText: "Pehle random TikTok scroll karke products select karti thi aur ad spend waste hota tha. Sami bhai ke winning product research module, validation matrix aur spy tools strategy se pehli baar samajh aya ke market demand aur profit margin mathematically kaise evaluate karte hain. Ab mind bilkul clear hai.",
    tag: "Winning Product Research",
    studentType: "University Student",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-05",
    studentName: "Bilal Ahmed Qureshi",
    city: "Rawalpindi",
    rating: 5,
    relativeTime: "5 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "COD returns control karne ka SOP waqai effective hai",
    reviewText: "Pakistan market mein sab se bara masla fake orders aur return ratio ka tha jo profit kha jata tha. Module 7 mein Sami bhai ne jo courier verification, WhatsApp confirmation SOP aur address validation sikhaya, us se mere store ka return rate bohot control mein aa gaya. JazakAllah khair!",
    tag: "COD & Return Management",
    studentType: "Existing E-Commerce Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-06",
    studentName: "Daniyal Tariq",
    city: "Islamabad",
    rating: 5,
    relativeTime: "6 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Shopify ka S bhi nahi pata tha, ab store live hai",
    reviewText: "Main bilkul beginner tha. Mujhe domain connect karna ya payment gateway link karna tak nahi aata tha. Video tutorials itne step-by-step hain ke screen dekh dekh kar pura store set up kiya. Ab mujhe next steps ka clear idea hai aur main step by step implement kar raha hoon.",
    tag: "Shopify Store & CRO",
    studentType: "Beginner Online Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-07",
    studentName: "Zainab Bibi",
    city: "Rawalpindi",
    rating: 5,
    relativeTime: "8 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Local suppliers aur wholesale rate pe inventory source ho gayi",
    reviewText: "Ghar se bahar market jana mushkil hota tha. Sami bhai ke verified supplier network aur WhatsApp sourcing contacts ki wajah se Shah Alam Market aur Faisalabad ke trusted wholesale suppliers se direct connect ho gayi. Wholesale rates pe product milna start ho gaya bina kisi fraud ke.",
    tag: "Supplier Sourcing",
    studentType: "Housewife",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-08",
    studentName: "Shahzaib Khan",
    city: "Faisalabad",
    rating: 5,
    relativeTime: "10 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Creative testing aur video hooks ka concept clear hua",
    reviewText: "Pehle ad run karte hi budget waste hota tha kyunki creative testing ka method nahi pata tha. Sami bhai ne jo 3-second hook formula aur UGC video testing strategy sikhayi hai, us se low CPM aur high click-through rate milna start ho gaya. Practical mentor hain.",
    tag: "Product Creatives & Testing",
    studentType: "Local Dropshipper",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-09",
    studentName: "Maryam Tariq",
    city: "Karachi",
    rating: 5,
    relativeTime: "12 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Pixel tracking aur CAPI setup mein jo issues thay sab solve ho gaye",
    reviewText: "Freelance client ke Meta Pixel aur conversion API tracking mein bohot time se issue aa raha tha. Course ke tracking module aur resource guides ko dekh kar proper server-side events setup kiye. Freelancers aur media buyers ke liye must-watch content hai.",
    tag: "Meta & TikTok Ads",
    studentType: "Freelancer / Media Buyer",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-10",
    studentName: "Usama Butt",
    city: "Gujranwala",
    rating: 5,
    relativeTime: "14 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    headline: "Saudi Arabia market mein Snapchat aur TikTok ads ka practical tareeqa",
    reviewText: "Saudi market ke liye Arabic creative guidelines aur ABO/CBO testing structure jo Sami bhai ne sikhaya wo zabardast hai. Sourcing se le kar delivery partner tak sab guidance detailed hai. Dil se dua nikalti hai Sami bhai ke liye.",
    tag: "UAE & GCC Operations",
    studentType: "GCC Market Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-11",
    studentName: "Farhan Siddiqui",
    city: "Karachi",
    rating: 5,
    relativeTime: "16 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Live screen dikha kar campaigns optimize karna sikhate hain",
    reviewText: "Market mein bohot log sirf baatein karte hain, lekin Sardar Samiullah bhai live screen share karke campaign dashboard, metrics analysis aur budget scaling sikhate hain. Real dashboard walkthrough se banda confidence ke sath budget allocate karta hai.",
    tag: "Campaign Optimization",
    studentType: "Working Professional",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-12",
    studentName: "Sana Javed",
    city: "Multan",
    rating: 5,
    relativeTime: "18 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Community aur WhatsApp Q&A support ne bohot madad ki",
    reviewText: "Jab bhi kisi lecture mein query aayi, community group aur WhatsApp support team ne promptly guide kiya. Khas tor par female students ke liye respectful aur helpful environment hai. Jo cheez samajh na aaye direct pooch sakti hoon.",
    tag: "WhatsApp & Community Support",
    studentType: "Beginner Female Entrepreneur",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-13",
    studentName: "Kashif Mehmood",
    city: "Multan",
    rating: 5,
    relativeTime: "20 hours ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Product research ka process pehli baar mathematically samajh aya",
    reviewText: "Main pehle andazay se products uthata tha. Sami bhai ne jo criteria bataya hai: problem-solving aspect, packaging weight, supplier margin aur seasonal trends, us se filter karke ek solid product shortlist ki. Foundation mazboot ho gayi hai.",
    tag: "Winning Product Research",
    studentType: "Beginner Online Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-14",
    studentName: "Saad Ur Rehman",
    city: "Lahore",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + GCC Scaling",
    headline: "3-Shift Scaling Formula ne ad spend optimize kar diya",
    reviewText: "Hamari ads pehle break-even pe chal rahi thin. Mentorship ke 3-Shift Scaling Formula aur budget pacing rules apply karne ke baad profit margin maintain hona shuru ho gaya. Advanced media buying concepts bohat aasan zuban mein samjhaye hain.",
    tag: "Campaign Optimization",
    studentType: "Existing E-Commerce Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-15",
    studentName: "Mahnoor Khan",
    city: "Peshawar",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Landing page conversion rate optimize karne ke hacks outclass hain",
    reviewText: "LMS bonuses mein jo Shopify CRO landing page templates aur copywriting prompt sheets mili hain, unse store conversion rate improve hua. Customer checkout friction kaise kam karna hai, yeh bohot bariki se sikhaya gaya hai.",
    tag: "Shopify Store & CRO",
    studentType: "University Student",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-16",
    studentName: "Talha Farooq",
    city: "Sialkot",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Pakistan local market ka realistic overview mila",
    reviewText: "Bahar ke goron ke courses Pakistan ke local e-commerce ke liye fail ho jatay hain kyunke yahan cash-on-delivery system hai. Sami bhai ka content pure Pakistani market ke ground realities pe based hai: courier selection, billing cycle aur customer trust building.",
    tag: "Local Dropshipping",
    studentType: "Local Dropshipper",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-17",
    studentName: "Hira Aslam",
    city: "Faisalabad",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Bina mehnge tools ke phone se video creatives banana seekha",
    reviewText: "Mujhe video editing bilkul nahi aati thi. Course mein CapCut aur mobile phone se realistic product video shoots aur viral hooks banana sikhaya gaya hai. Mere ad creatives pe CTR foran improve ho gaya. Very practical guidance.",
    tag: "Product Creatives & Testing",
    studentType: "Housewife",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-18",
    studentName: "Arsalan Malik",
    city: "Peshawar",
    rating: 5,
    relativeTime: "2 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Roadmap itna clear hai ke confusion khatam ho gayi",
    reviewText: "Pehle YouTube pe 100 videos dekh kar confuse ho jata tha ke pehla step kya loon. Yahan module 1 se lekar 11 tak step-by-step roadmap diya gaya hai. Har module ke baad pata hota hai ke aaj kya task complete karna hai. Worth every single rupee.",
    tag: "Winning Product Research",
    studentType: "Working Professional",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-19",
    studentName: "Zeeshan Ali",
    city: "Hyderabad",
    rating: 5,
    relativeTime: "2 days ago",
    course: "VIP Mentorship + GCC Scaling",
    headline: "TikTok Spark Ads aur Meta testing matrix bohat zabardast hai",
    reviewText: "Spark ads run karne ka jo tareeqa Sami bhai ne sikhaya hai us se cost per click bohot low milti hai. Jo log kehte hain ads bohot mehngi hain unhe yeh testing strategy lazmi seekhni chahiye. Full practical value!",
    tag: "Meta & TikTok Ads",
    studentType: "Beginner Online Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-20",
    studentName: "Nimra Sheikh",
    city: "Sialkot",
    rating: 5,
    relativeTime: "2 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Dropshipping se Private Label tak ka realistic vision mila",
    reviewText: "Sirf dropshipping nahi balke aage chal kar customized packaging, logo branding aur white label product development kaise karni hai, iska proper vision Sami bhai ne diya hai. Ecominion mentorship long-term business mindset develop karti hai.",
    tag: "White Label & Private Label",
    studentType: "Aspiring Brand Owner",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-21",
    studentName: "Haris Javed",
    city: "Gujrat",
    rating: 5,
    relativeTime: "2 days ago",
    course: "VIP Mentorship + GCC Scaling",
    headline: "Dubai COD dropshipping ke ground realities clear huin",
    reviewText: "Bahar ke mentors GCC dropshipping ko asaan dikhate hain lekin actual courier issues nahi batate. Sami bhai ne UAE mein local warehouses, cash delivery cycles aur returns verification ka jo roadmap diya wo 100% genuine hai.",
    tag: "UAE & GCC Operations",
    studentType: "GCC Market Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-22",
    studentName: "Sadia Batool",
    city: "Bahawalpur",
    rating: 5,
    relativeTime: "3 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "LMS portal ka interface bohot clean aur structured hai",
    reviewText: "Mobile pe bhi saare lectures smooth chaltay hain aur har module ke niche downloadable checklist aur supplier templates hain. Sami bhai ne har ek baat asaan Roman Urdu aur Urdu mein explain ki hai jo aam Pakistani student easily samajh sakta hai.",
    tag: "Shopify Store & CRO",
    studentType: "Housewife",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-23",
    studentName: "Abdullah Chaudhry",
    city: "Bahawalpur",
    rating: 5,
    relativeTime: "3 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Community mein questions poochne aur guidance lene ka behtareen experience",
    reviewText: "Student community bohot supportive hai. Koi bhi senior student ya Sami bhai khud query ka detailed jawab dete hain. Pehle akela struggle kar raha tha, ab ek poori community ke sath seekhne ka maza aa raha hai.",
    tag: "WhatsApp & Community Support",
    studentType: "University Student",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-24",
    studentName: "Hamad Sheikh",
    city: "Lahore",
    rating: 5,
    relativeTime: "3 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Meta ad account bans aur asset safety ke SOPs life saver hain",
    reviewText: "Pehle ad account bar bar restrict ho jata tha. Business Manager warm-up aur identity verification ke jo standard guidelines Sami bhai ne share kiye hain, unko follow karne ke baad restriction ka masla 90% solve ho gaya. Shukriya Sami bhai!",
    tag: "Meta & TikTok Ads",
    studentType: "Existing E-Commerce Seller",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-25",
    studentName: "Waleed Qureshi",
    city: "Islamabad",
    rating: 5,
    relativeTime: "4 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Authentic e-commerce brand banane ki solid guidance",
    reviewText: "Pehle bina planning ke dropshipping kar raha tha. Yahan brand positioning, customer experience aur repeat order strategy samajh aayi. Ab proper foundation ke sath kaam kar raha hoon.",
    tag: "White Label & Private Label",
    studentType: "Working Professional",
    isVerifiedStudent: true
  },
  {
    id: "REV-PK-26",
    studentName: "Nabeel Akhtar",
    city: "Sargodha",
    rating: 5,
    relativeTime: "4 days ago",
    course: "VIP Mentorship + Ecominion LMS",
    headline: "Shah Alam Market aur local supplier network se direct link",
    reviewText: "Wholesale market se direct sample lene aur bulk orders dispatch karwane ka tareeqa practical hai. Online fake suppliers se bachne ke liye Sami bhai ki advice bilkul gold hai. 5 stars blindly!",
    tag: "Supplier Sourcing",
    studentType: "Local Dropshipper",
    isVerifiedStudent: true
  }
];

export interface ShowcaseCmsData {
  navLabels: {
    dashboard: string;
    cms: string;
    enrollments: string;
    students: string;
    community: string;
    showcase: string;
  };
  hero: {
    badge: string;
    subBadge: string;
    title: string;
    description: string;
    enrollmentsTabLabel: string;
    reviewsTabLabel: string;
  };
  metrics: {
    studentsCount: string;
    studentsTag: string;
    studentsSubtext: string;
    approvalRatio: string;
    approvalSubtext: string;
    revenueVolume: string;
    revenueSubtext: string;
    satisfactionRating: string;
    satisfactionSubtext: string;
  };
  enrollments: ShowcaseEnrollment[];
  reviews: ShowcaseReview[];
}

export const defaultShowcaseCmsData: ShowcaseCmsData = {
  navLabels: {
    dashboard: "Dashboard Overview",
    cms: "Website & LMS CMS",
    enrollments: "Enrollment Queue",
    students: "Students Directory",
    community: "Community Broadcast",
    showcase: "Proof & Reviews Hub"
  },
  hero: {
    badge: "Verified Student Reviews",
    subBadge: "Authentic Mentorship Experiences",
    title: "Student Reviews & Learning Experiences",
    description: "Genuine feedback from Pakistani students, university learners, working professionals, and home entrepreneurs learning Shopify, Meta & TikTok Ads, Sourcing, and GCC operations with Ecom with Sami.",
    enrollmentsTabLabel: "Verified Admissions",
    reviewsTabLabel: "Student Reviews"
  },
  metrics: {
    studentsCount: "1,538+",
    studentsTag: "Active Learners",
    studentsSubtext: "Enrolled in Ecominion LMS",
    approvalRatio: "98.5%",
    approvalSubtext: "Verified Course Admissions",
    revenueVolume: "11 Practical Modules",
    revenueSubtext: "Step-by-Step E-Com Curriculum",
    satisfactionRating: "4.9",
    satisfactionSubtext: "Verified Student Reviews"
  },
  enrollments: SHOWCASE_ENROLLMENTS,
  reviews: SHOWCASE_REVIEWS
};

