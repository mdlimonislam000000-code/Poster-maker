# 🎨 Poster Maker BD (Political & Social Poster Platform)

**Poster Maker BD** হলো একটি ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন, যা স্থানীয় রাজনৈতিক কর্মী, কমিটি সদস্য এবং প্রচারকদের জন্য খুব সহজেই প্রফেশনাল এবং প্রিন্ট-রেডি রাজনৈতিক ও সামাজিক পোস্টার তৈরির উদ্দেশ্যে তৈরি করা হয়েছে। কোনো ধরনের জটিল ডিজাইন সফটওয়্যার (যেমন Photoshop বা Illustrator) ছাড়াই মুহূর্তের মধ্যে চমৎকার সব পোস্টার তৈরি করাই এই প্ল্যাটফর্মের মূল লক্ষ্য।

---

## 🚀 Key Features & Functionality

- **Curated Template Library:** বিভিন্ন উপলক্ষ্য (যেমন: মহান বিজয় দিবস, নির্বাচনী প্রচার, শোক ও স্মরণ, এবং শুভেচ্ছা/উৎসব) অনুযায়ী ফিল্টার করার সুবিধাসহ প্রি-বিল্ড টেমপ্লেট লাইব্রেরি।
- **Interactive User Input Form:** নাম, পদবি, রাজনৈতিক দল বা সংগঠন, থানা/জেলা, উপলক্ষ্য, বাংলা বা ইংরেজি হেডলাইন এবং একাধিক ছবি আপলোড করার সুব্যবস্থা।
- **AI-Powered Layout & Decoration:** গুগলের **Gemini API** ইন্টিগ্রেশনের মাধ্যমে স্মার্ট লেআউট কম্পোজিশন, কালার স্কিম এবং ডেকোরেশন সাজেশন জেনারেট করার পাইপলাইন।
- **High-Resolution Print-Ready Export:** প্রিন্ট করার উপযোগী হাই-রেজুলেশন (কমপক্ষে 1200×1600px) PNG/JPG ফরম্যাটে পোস্টার এক্সপোর্ট বা ডাউনলোড সুবিধা।
- **User Account & Poster History:** সিকিউরড অথেন্টিকেশন সিস্টেমের মাধ্যমে ইউজাররা তাদের পূর্ববর্তী তৈরি করা পোস্টারগুলোর হিস্ট্রি দেখতে এবং যেকোনো সময় পুনরায় ডাউনলোড করতে পারেন।

---

## 🛠️ Technology Stack

### **Frontend:**
- **Framework:** Next.js (TypeScript) with App Router
- **Styling:** Tailwind CSS
- **Icons:** React Icons

### **Backend:**
- **Server:** Express.js (TypeScript)
- **Module System:** Node.js ESM (`NodeNext`)
- **Database:** MongoDB & Mongoose ODM
- **AI Engine:** Google Gemini API
- **File Storage:** Cloudinary (for user photos & generated assets)
- **Authentication:** JWT / Better Auth

---

## 📂 Project Architecture

প্রজেক্টটি ক্লায়েন্ট এবং সার্ভার আর্কিটেকচারে বিভক্ত:

```text
Make a poster/
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App router pages & layouts
│   │   └── components/         # Reusable UI components (Hero, HowItWorks, Footer)
│   └── package.json
└── server/                     # Express.js Backend
    ├── models/                 # Mongoose Schemas (User, Template, Poster)
    ├── index.ts                # Server entry point & API routes
    └── package.json



    git clone [https://github.com/mdlimonislam000000-code/Poster-maker](https://github.com/mdlimonislam000000-code/Poster-maker)
cd "Make a poster"