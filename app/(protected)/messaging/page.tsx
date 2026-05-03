"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";

function MessagingRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiryId");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      const userType = session.user.userType;
      // Build the destination path
      const userPath = userType === "pro" ? "pro" : "client";
      const destination = `/${userPath}/inquiries${inquiryId ? `?inquiryId=${inquiryId}` : ""}`;
      
      router.replace(destination);
    }
  }, [status, session, router, inquiryId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="h-12 w-12 border-4 border-[#0a9396]/20 border-t-[#0a9396] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-[#0a9396] rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-gray-500 font-bold animate-pulse tracking-wide uppercase text-[10px]">Entering Secure Channel...</p>
    </div>
  );
}

export default function MessagingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    }>
      <MessagingRedirect />
    </Suspense>
  );
}
