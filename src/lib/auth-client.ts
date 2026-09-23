import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// আলাদাভাবে হুকগুলো এক্সপোর্ট করার সঠিক নিয়ম:
export const { signIn, signUp, useSession } = authClient;