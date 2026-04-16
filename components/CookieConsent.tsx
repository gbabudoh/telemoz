"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "telemoz_cookie_consent";

function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  // Dispatch event so other components can react (e.g. load analytics)
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<Omit<ConsentState, "necessary">>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Show banner only if consent hasn't been given yet
    if (!loadConsent()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    const consent: ConsentState = { necessary: true, analytics: true, marketing: true };
    saveConsent(consent);
    setVisible(false);
  };

  const acceptNecessaryOnly = () => {
    const consent: ConsentState = { necessary: true, analytics: false, marketing: false };
    saveConsent(consent);
    setVisible(false);
  };

  const savePreferences = () => {
    const consent: ConsentState = { necessary: true, ...prefs };
    saveConsent(consent);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
    >
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Main bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-[#0a9396]/10 flex items-center justify-center">
              <Cookie className="h-5 w-5 text-[#0a9396]" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Cookie Preferences</span>
          </div>

          <p className="flex-1 text-sm text-gray-600 leading-relaxed">
            We use cookies to provide core platform functionality and, with your consent, to analyse usage and personalise content.
            See our{" "}
            <Link href="/cookie-policy" className="text-[#0a9396] underline underline-offset-2 hover:text-[#005f73]">
              Cookie Policy
            </Link>{" "}
            for details.
          </p>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Manage
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={acceptNecessaryOnly}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Necessary only
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-bold text-white bg-[#0a9396] rounded-xl hover:bg-[#005f73] transition-colors"
            >
              Accept all
            </button>
            <button
              onClick={acceptNecessaryOnly}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Expanded preferences */}
        {expanded && (
          <div className="border-t border-gray-100 p-5 md:p-6 bg-gray-50/60">
            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Strictly necessary</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Required for login, session management, and security. Cannot be disabled.
                  </p>
                </div>
                <div className="shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-[#0a9396] bg-[#0a9396]/10 px-2 py-1 rounded-full">
                    Always on
                  </span>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Analytics</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Helps us understand how the platform is used so we can improve it.
                  </p>
                </div>
                <Toggle
                  checked={prefs.analytics}
                  onChange={v => setPrefs(p => ({ ...p, analytics: v }))}
                  label="Analytics cookies"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Marketing</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Used to personalise content and measure advertising effectiveness.
                  </p>
                </div>
                <Toggle
                  checked={prefs.marketing}
                  onChange={v => setPrefs(p => ({ ...p, marketing: v }))}
                  label="Marketing cookies"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={savePreferences}
                className="px-5 py-2 text-sm font-bold text-white bg-[#0a9396] rounded-xl hover:bg-[#005f73] transition-colors"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 mt-0.5 h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a9396]/50 ${
        checked ? "bg-[#0a9396]" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/** Hook — returns current consent state, updates on changes. */
export function useCookieConsent(): ConsentState | null {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(loadConsent());
    const handler = (e: Event) => {
      setConsent((e as CustomEvent<ConsentState>).detail);
    };
    window.addEventListener("cookie-consent-updated", handler);
    return () => window.removeEventListener("cookie-consent-updated", handler);
  }, []);

  return consent;
}
