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
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 340,000 / month",
    headline: "Sami bhai ka Scaling Formula bilkul game changer hai!",
    reviewText: "MashaAllah Sardar Samiullah bhai ki mentorship join kiye hue 20 din hue hain. Module 4 aur Module 5 ke TikTok Ad scaling formula ko lagaya, pehle hafte hi 180+ orders deliver ho gaye! Pakistan ka sab se practical aur genuine mentor hai.",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-02",
    studentName: "Ali Raza Khan",
    city: "Karachi",
    rating: 5,
    relativeTime: "1 hour ago",
    course: "E-Commerce Masterclass",
    storeRevenue: "AED 12,500 / month",
    headline: "GCC Private Supplier Directory ne meri sourcing problem hal kardi",
    reviewText: "Mujhe Dubai aur Saudi Arabia mein dropshipping start karni thi lekin authentic suppliers nahi mil rahe the. Sami bhai ki LMS mein jo direct WhatsApp contacts aur verified suppliers hain, us se 24 ghante ke andar direct sourcing start ho gayi. 100% recommended!",
    tag: "GCC Dropshipper"
  },
  {
    id: "REV-PK-03",
    studentName: "Daniyal Tariq",
    city: "Islamabad",
    rating: 5,
    relativeTime: "3 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 520,000 / month",
    headline: "Zero se 5 Lakh monthly sales cross kar li!",
    reviewText: "Maine pehle do different courses liye the lekin sirf basic baatein batai thi. Sami bhai ke lectures direct point to point hain, koi fazool time pass nahi. Product hunting ka jo formula inho ne sikhaya hai wo gold hai. Best investment of my career.",
    tag: "High Earner"
  },
  {
    id: "REV-PK-04",
    studentName: "Bilal Ahmed Qureshi",
    city: "Rawalpindi",
    rating: 5,
    relativeTime: "5 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 210,000 / month",
    headline: "Cash on Delivery cashflow aur returns control karne ka formula!",
    reviewText: "Sab se bara masla COD returns ka tha Pakistan mein. Sami bhai ne Module 7 mein courier verification aur WhatsApp confirmation bot ka tareeqa sikhaya, return rate 35% se drop ho kar 11% pe aa gaya! JazakAllah khair Sami bhai.",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-05",
    studentName: "Shahzaib Khan",
    city: "Faisalabad",
    rating: 5,
    relativeTime: "6 hours ago",
    course: "E-Commerce Masterclass",
    storeRevenue: "PKR 180,000 / month",
    headline: "Bhai support system kamaal ka hai",
    reviewText: "Jab bhi koi masla aata hai store pe ya pixel setup mein, LMS portal pe resource files aur guidance step by step milti hai. Har lecture crystal clear hai. 3799 PKR to is content ke samne kuch bhi nahi hai, yeh to lakhon ka content hai.",
    tag: "Fast Track Student"
  },
  {
    id: "REV-PK-06",
    studentName: "Usama Butt",
    city: "Gujranwala",
    rating: 5,
    relativeTime: "8 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "SAR 8,900 / month",
    headline: "KSA Market mein pehli bar profitable ads chali hain",
    reviewText: "Saudi Arabia market mein Snapchat aur TikTok ads ka jo CBO aur ABO testing matrix Sami bhai ne diya, us se mera ROAS 4.8x cross ho gaya. Alhamdulillah rozana orders dispatch ho rahe hain.",
    tag: "KSA Scaling"
  },
  {
    id: "REV-PK-07",
    studentName: "Farhan Siddiqui",
    city: "Karachi",
    rating: 5,
    relativeTime: "11 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 410,000 / month",
    headline: "Authentic Mentor jo real screen dikha kar sikhata hai",
    reviewText: "Market mein bohot saare fake gurus hain jo sirf baatein karte hain. Sardar Samiullah bhai wo wahed mentor hain jo apna dashboard live dikha kar live winning ad sets banate hain. Real proof, real results!",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-08",
    studentName: "Kashif Mehmood",
    city: "Multan",
    rating: 5,
    relativeTime: "14 hours ago",
    course: "E-Commerce Masterclass",
    storeRevenue: "PKR 145,000 / month",
    headline: "Beginner student ke liye blessing hai",
    reviewText: "Mujhe Shopify ka S bhi nahi pata tha. Step 1 se le kar domain linking, payment gateway aur product sourcing tak sab kuch easily samajh agaya. Kal meri pehli 12 sales aayi hain!",
    tag: "Beginner Milestone"
  },
  {
    id: "REV-PK-09",
    studentName: "Saad Ur Rehman",
    city: "Lahore",
    rating: 5,
    relativeTime: "18 hours ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 890,000 / month",
    headline: "Sardar Samiullah ka scaling formula 7-figure hit kar gaya!",
    reviewText: "Jo log poochte hain mentorship worth it hai ya nahi, unhe kahunga ke ek din bhi zaya na karein. Scaling formula ko follow karke maine apna store 7 figures pe scale kiya hai. Allah Sami bhai ko mazeed taraqqi de.",
    tag: "7-Figure Achiever"
  },
  {
    id: "REV-PK-10",
    studentName: "Talha Farooq",
    city: "Sialkot",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 275,000 / month",
    headline: "High Converting Landing Page templates ne conversion double kardi",
    reviewText: "LMS bonuses mein jo Shopify high-converting landing page designs aur product descriptions ke prompt templates mile hain unki wajah se meri store conversion rate 1.4% se seedha 3.9% ho gayi.",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-11",
    studentName: "Arsalan Malik",
    city: "Peshawar",
    rating: 5,
    relativeTime: "Yesterday",
    course: "E-Commerce Masterclass",
    storeRevenue: "PKR 190,000 / month",
    headline: "Peshawar se online store start kiya, results outclass hain",
    reviewText: "Maine apni job ke sath part-time shuru kiya tha. Sami bhai ke local Pakistani e-com strategies follow karke ab main full-time e-commerce karne ja raha hoon. 5 stars blindly!",
    tag: "Career Switch"
  },
  {
    id: "REV-PK-12",
    studentName: "Zeeshan Ali",
    city: "Hyderabad",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 310,000 / month",
    headline: "TikTok Ads strategy no one teaches in Pakistan",
    reviewText: "TikTok spark ads aur creative testing ka jo formula Samiullah bhai ne sikhaya hai, wo pure Pakistan mein koi nahi sikhata. CPM kam aur CPR bohat low mil raha hai.",
    tag: "Ad Master"
  },
  {
    id: "REV-PK-13",
    studentName: "Haris Javed",
    city: "Gujrat",
    rating: 5,
    relativeTime: "Yesterday",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "AED 7,800 / month",
    headline: "UAE COD Market mein safe delivery",
    reviewText: "Gulf countries mein selling ke liye Sami bhai ki advice bilkul gold thi. Delivery time fast ho gaya aur local courier accounts easily khul gaye. Must join mentorship.",
    tag: "GCC Dropshipper"
  },
  {
    id: "REV-PK-14",
    studentName: "Abdullah Chaudhry",
    city: "Bahawalpur",
    rating: 5,
    relativeTime: "2 days ago",
    course: "E-Commerce Masterclass",
    storeRevenue: "PKR 165,000 / month",
    headline: "Paisa wasool mentorship!",
    reviewText: "Fees pehle din hi cover ho gayi thi. Practical knowledge hai jo actual live campaigns mein kaam aati hai. Shukriya Sami bhai itna behtareen platform banane ka.",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-15",
    studentName: "Hamad Sheikh",
    city: "Lahore",
    rating: 5,
    relativeTime: "2 days ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 450,000 / month",
    headline: "Scaling without getting ad account banned",
    reviewText: "Sab se bara masla Meta ad account restrictions ka tha. Sami bhai ke warm-up SOPs aur business manager safety guidelines follow karne ke baad ek bhi account restrict nahi hua.",
    tag: "Ad Master"
  },
  {
    id: "REV-PK-16",
    studentName: "Waleed Qureshi",
    city: "Islamabad",
    rating: 5,
    relativeTime: "2 days ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 390,000 / month",
    headline: "Sardar Samiullah is the undisputed E-Com king!",
    reviewText: "Video lectures ki quality aur portal ka interface itna smooth aur premium hai ke parhne ka maza aata hai. 10/10 experience.",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-17",
    studentName: "Nabeel Akhtar",
    city: "Sargodha",
    rating: 5,
    relativeTime: "2 days ago",
    course: "E-Commerce Masterclass",
    storeRevenue: "PKR 120,000 / month",
    headline: "Local sourcing formula works 100%",
    reviewText: "Shah Alam Market aur Faisalabad wholesale market se direct supply lene ka contact Sami bhai ke network se mila. Wholesale rates pe product mil raha hai aur high profit pe bik raha hai.",
    tag: "Local Ecom"
  },
  {
    id: "REV-PK-18",
    studentName: "Taimoor Hassan",
    city: "Rawalpindi",
    rating: 5,
    relativeTime: "3 days ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "SAR 11,200 / month",
    headline: "Saudi Arabia Store scaled to SAR 11k",
    reviewText: "Sami bhai ne jo winning product testing framework bataya tha us se 3 winning products hit huin. Now doing consistent 300-400 SAR daily profit. MashAllah!",
    tag: "KSA Scaling"
  },
  {
    id: "REV-PK-19",
    studentName: "Mohsin Raza",
    city: "Karachi",
    rating: 5,
    relativeTime: "3 days ago",
    course: "VIP Mentorship + GCC Scaling",
    storeRevenue: "PKR 290,000 / month",
    headline: "Genuine support & lifetime value",
    reviewText: "LMS portal hamesha update hota rehta hai, naye naye updates aur strategies aati rehti hain. Sami bhai apne students ko kabhi akela nahi chorte.",
    tag: "Verified Scaling Student"
  },
  {
    id: "REV-PK-20",
    studentName: "Adeel Ashraf",
    city: "Faisalabad",
    rating: 5,
    relativeTime: "3 days ago",
    course: "E-Commerce Masterclass",
    storeRevenue: "PKR 220,000 / month",
    headline: "Alhamdulillah 5-star experience!",
    reviewText: "Har Pakistani jawan ko yeh mentorship join karni chahiye. Online earning ka genuine aur halal tareeqa Sardar Samiullah ne sikhaya hai.",
    tag: "Fast Track Student"
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
    badge: "Live Proof Engine",
    subBadge: "Video Demonstration Mode",
    title: "Verified Enrollments & 5-Star Testimonials",
    description: "Real Pakistani student traction records, approved mentorship admissions, and verified 5-star testimonials praising Sardar Samiullah's Scaling Formula. Ideal for screen recordings & testimonial videos.",
    enrollmentsTabLabel: "Verified Enrollments",
    reviewsTabLabel: "5-Star Reviews"
  },
  metrics: {
    studentsCount: "50+",
    studentsTag: "+12 Today",
    studentsSubtext: "100% Active in LMS",
    approvalRatio: "100%",
    approvalSubtext: "Verified Payment Slips",
    revenueVolume: "PKR 3,840,000+",
    revenueSubtext: "Total Mentorship Volume",
    satisfactionRating: "5.0",
    satisfactionSubtext: "50+ Verified Ratings"
  },
  enrollments: SHOWCASE_ENROLLMENTS,
  reviews: SHOWCASE_REVIEWS
};
