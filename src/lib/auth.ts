import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  // সেশন ও কুকি ক্যাশ কনফিগারেশন একসঙ্গে একটি অবজেক্টের ভেতরে রাখা হয়েছে
  session: {
    expiresIn: 60 * 60 * 24 * 7, // ৭ দিন (সেকেন্ডে হিসাব)
    updateAge: 60 * 60 * 24,     // প্রতিদিন সেশন আপডেট হবে
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  user: {
    additionalFields: {
      district: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      party: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  plugins: [
    jwt()
  ]
});