"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { countriesByRegion, regions } from "@/lib/countries";

export default function RegisterPage() {
  const [userType, setUserType] = useState<"pro" | "client" | "admin">("pro");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    timezone: "Europe/London",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType,
          country: formData.country,
          city: formData.city,
          timezone: formData.timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Show success message
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#94d2bd]/10 to-white px-6 py-20">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-[#0a9396]/10 p-3">
                  <CheckCircle2 className="h-12 w-12 text-[#0a9396] cursor-pointer" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-[#0a9396] mb-2">Registration Successful!</h1>
              <p className="text-gray-900 font-medium mb-6">
                Your account has been created successfully. Redirecting to login...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-5 w-5 text-[#0a9396] animate-spin cursor-pointer" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#94d2bd]/10 to-white px-6 py-20">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0a9396] mb-2">Create Account</h1>
            <p className="text-gray-900 font-medium">Join Telemoz and start your journey</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType("pro")}
              className={`px-4 py-3 rounded-lg border transition-all font-medium cursor-pointer ${
                userType === "pro"
                  ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396]"
                  : "border-[#0a9396]/30 text-gray-900 hover:border-[#0a9396] hover:bg-[#0a9396]/5"
              }`}
            >
              Pro
            </button>
            <button
              type="button"
              onClick={() => setUserType("client")}
              className={`px-4 py-3 rounded-lg border transition-all font-medium cursor-pointer ${
                userType === "client"
                  ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396]"
                  : "border-[#0a9396]/30 text-gray-900 hover:border-[#0a9396] hover:bg-[#0a9396]/5"
              }`}
            >
              Client
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                  required
                >
                  <option value="">Select Country</option>
                  {regions.map((region) => (
                    <optgroup key={region} label={region}>
                      {countriesByRegion[region].map((country) => (
                        <option key={country.id} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                <Input
                  type="text"
                  placeholder="London"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                required
              >
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="Europe/Madrid">Europe/Madrid (CET)</option>
                <option value="Europe/Rome">Europe/Rome (CET)</option>
                <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
                <option value="Europe/Brussels">Europe/Brussels (CET)</option>
                <option value="Europe/Stockholm">Europe/Stockholm (CET)</option>
                <option value="Europe/Oslo">Europe/Oslo (CET)</option>
                <option value="Europe/Copenhagen">Europe/Copenhagen (CET)</option>
                <option value="Europe/Warsaw">Europe/Warsaw (CET)</option>
                <option value="Europe/Dublin">Europe/Dublin (GMT)</option>
                <option value="Europe/Lisbon">Europe/Lisbon (WET)</option>
                <option value="Europe/Zurich">Europe/Zurich (CET)</option>
                <option value="Europe/Vienna">Europe/Vienna (CET)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Chicago">America/Chicago (CST)</option>
                <option value="America/Denver">America/Denver (MST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="America/Toronto">America/Toronto (EST)</option>
                <option value="America/Vancouver">America/Vancouver (PST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
                <option value="Australia/Melbourne">Australia/Melbourne (AEDT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Asia/Hong_Kong">Asia/Hong_Kong (HKT)</option>
              </select>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                className="mt-1 rounded border-[#0a9396]"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                required
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-[#0a9396] hover:text-[#087579] hover:underline cursor-pointer">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#0a9396] hover:text-[#087579] hover:underline cursor-pointer">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0a9396] hover:bg-[#087579] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin cursor-pointer" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-900">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0a9396] hover:text-[#087579] font-semibold cursor-pointer">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

