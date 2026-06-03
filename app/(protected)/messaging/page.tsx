"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Universal /messaging redirect.
 * Notification links and other references point here;
 * this page immediately redirects to the correct role-specific
 * messaging page, preserving all query parameters.
 */
export default function MessagingRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return;

    const userType = session?.user?.userType;
    const params = searchParams.toString();
    const suffix = params ? `?${params}` : "";

    if (userType === "pro") {
      router.replace(`/pro/messaging${suffix}`);
    } else {
      // client or unknown — default to client messaging
      router.replace(`/client/messaging${suffix}`);
    }
  }, [session, status, router, searchParams]);

  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin text-[#0a9396]" />
    </div>
  );
}
