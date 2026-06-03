"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Users, Shield, UserCheck, Crown } from "lucide-react";

interface InviteDetails {
  inviteId: string;
  email: string;
  role: string;
  agencyName: string;
  agencyImage: string | null;
  expiresAt: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  manager: <Shield className="h-5 w-5" />,
  contributor: <UserCheck className="h-5 w-5" />,
  owner: <Crown className="h-5 w-5" />,
};

const roleDescriptions: Record<string, string> = {
  manager: "Can manage projects, clients, and team members",
  contributor: "Can view and work on assigned projects",
};

export default function TeamInvitePage() {
  const { token } = useParams<{ token: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [loadError, setLoadError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState("");

  // Load invite details on mount
  useEffect(() => {
    const loadInvite = async () => {
      try {
        const res = await fetch(`/api/team/invite/${token}`);
        if (!res.ok) {
          const data = await res.json();
          setLoadError(data.error ?? "Invitation not found");
        } else {
          setInvite(await res.json());
        }
      } catch {
        setLoadError("Failed to load invitation. Please try again.");
      }
    };
    if (token) loadInvite();
  }, [token]);

  const handleAccept = async () => {
    if (authStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/team/invite/${token}`);
      return;
    }

    setAccepting(true);
    setAcceptError("");
    try {
      const res = await fetch(`/api/team/invite/${token}/accept`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data.loginRequired) {
          router.push(`/login?callbackUrl=/team/invite/${token}`);
          return;
        }
        setAcceptError(data.error ?? "Failed to accept invitation");
        return;
      }

      setAccepted(true);
      // Give a moment for the success state to show, then redirect
      setTimeout(() => router.push("/pro/dashboard"), 2500);
    } catch {
      setAcceptError("Network error. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  // Loading state
  if (!invite && !loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
      </div>
    );
  }

  // Invalid/expired/revoked invite
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Invitation Invalid</h1>
          <p className="text-gray-500 font-medium">{loadError}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 h-11 px-6 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all"
          >
            Go to Telemoz
          </button>
        </motion.div>
      </div>
    );
  }

  // Accepted success state
  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Welcome to the team!</h1>
          <p className="text-gray-500 font-medium">
            You've joined <strong>{invite!.agencyName}</strong>. Redirecting to your dashboard…
          </p>
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-[#0a9396]" />
          </div>
        </motion.div>
      </div>
    );
  }

  const roleLabel = invite!.role.charAt(0).toUpperCase() + invite!.role.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0a9396] to-[#015f63] p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/30">
            {invite!.agencyImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={invite!.agencyImage} alt={invite!.agencyName} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <Users className="h-7 w-7 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">You're invited!</h1>
          <p className="text-white/80 font-medium mt-1 text-sm">
            {invite!.agencyName} wants you on their team
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Role card */}
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-gray-100">
            <div className="h-11 w-11 rounded-xl bg-[#0a9396]/10 text-[#0a9396] flex items-center justify-center shrink-0">
              {roleIcons[invite!.role] ?? <UserCheck className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">{roleLabel}</p>
              <p className="text-xs text-gray-500 font-medium">
                {roleDescriptions[invite!.role] ?? "Team member"}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-medium mb-2">
            This invitation was sent to{" "}
            <span className="font-bold text-gray-900">{invite!.email}</span>
          </p>

          {authStatus === "authenticated" && session?.user?.email?.toLowerCase() !== invite!.email.toLowerCase() && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-amber-700 text-sm font-medium">
              You're logged in as <strong>{session.user.email}</strong>. This invite is for{" "}
              <strong>{invite!.email}</strong>. Please log in with the correct account.
            </div>
          )}

          {acceptError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-red-600 text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />{acceptError}
            </div>
          )}

          <button
            onClick={handleAccept}
            disabled={accepting || (authStatus === "authenticated" && session?.user?.email?.toLowerCase() !== invite!.email.toLowerCase())}
            className="w-full h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0a9396]/25"
          >
            {accepting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Joining…</>
            ) : authStatus === "unauthenticated" ? (
              "Sign in to Accept"
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Accept & Join {invite!.agencyName}</>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 font-medium mt-4">
            Expires {new Date(invite!.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
