"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 py-20">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
            />

            <Button type="submit" className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

