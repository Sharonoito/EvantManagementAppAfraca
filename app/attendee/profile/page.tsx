// app/profile/page.tsx
"use client";

import ProfilePageClient from "./profilepageclient";

async function getUser(email: string, userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?email=${encodeURIComponent(email)}`,
    { cache: "no-store" } // disable caching if you need fresh data
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

async function getSessions(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-sessions?userId=${userId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { sessions: [] };
  }

  return res.json();
}

export default async function ProfilePage({ searchParams }: { searchParams: { email?: string; userId?: string } }) {
  const email = searchParams.email ?? "";
  const userId = searchParams.userId ?? "";

  if (!email || !userId) {
    return <p className="p-8 text-center text-red-500">No email or user ID provided. Please log in again.</p>;
  }

  try {
    const { user } = await getUser(email, userId);
    const { sessions } = await getSessions(userId);

    return <ProfilePageClient user={user} sessions={sessions} />;
  } catch (err: any) {
    return <p className="p-8 text-center text-red-500">{err.message || "Error loading profile."}</p>;
  }
}
