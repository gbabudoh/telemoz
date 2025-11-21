"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, Shield, CheckCircle2, DollarSign, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <Badge variant="success" size="lg" className="bg-[#0a9396] text-white mb-4">
            FREE TO USE
          </Badge>
          <h1 className="text-5xl font-bold text-[#0a9396] mb-4">
            How Telemoz Works
          </h1>
          <p className="text-gray-900 text-lg max-w-2xl mx-auto font-medium">
            The digital marketplace is completely free to use for digital marketing professionals 
            and clients/businesses looking for digital marketing services.
          </p>
        </div>

        {/* Free to Use Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card variant="gradient" className="p-8 border-2 border-[#0a9396]/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Completely Free Marketplace
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                No sign-up fees, no hidden costs, no monthly subscriptions.
              </p>
              <p className="text-gray-700 font-semibold">
                Telemoz charges a <span className="text-[#0a9396]">10% commission</span> only 
                from the payment the digital marketing professional receives upon successful job completion.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>For clients:</strong> The marketplace is 100% free to use — no fees whatsoever.
              </p>
            </div>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            How the Process Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                    <span className="text-[#0a9396] font-bold text-xl">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Agree on Terms</h3>
                </div>
              </div>
              <p className="text-gray-700">
                Client and digital marketing professional connect and agree on contract terms, 
                scope of work, and pricing. Both parties have full transparency and control.
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#0a9396]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Set Project Timeline</h3>
                </div>
              </div>
              <p className="text-gray-700">
                The digital marketing professional uses the timeline/project feature bar to set 
                the duration for the task. Choose from:
              </p>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                  One-off task
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                  Continuous task
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                  Set date period
                </li>
              </ul>
            </Card>

            {/* Step 3 */}
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-[#0a9396]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                All payments are held securely by Telemoz to protect both parties. This ensures:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                  Client funds are safe until work is approved
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                  Professionals are guaranteed payment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                  Disputes are handled fairly
                </li>
              </ul>
            </Card>

            {/* Step 4 */}
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-[#0a9396]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Completion & Payment</h3>
                </div>
              </div>
              <p className="text-gray-700">
                Once the task/job is completed and approved by the client, Telemoz releases 
                payment to the digital marketing professional. Telemoz charges a 10% commission 
                from the professional's payment.
              </p>
            </Card>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-gradient-to-br from-[#0a9396]/5 to-[#94d2bd]/5 border-2 border-[#0a9396]/20">
            <div className="flex items-start gap-4">
              <DollarSign className="h-8 w-8 text-[#0a9396] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Commission Structure</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong className="text-gray-900">For Clients:</strong> The marketplace is 
                    <strong className="text-[#0a9396]"> completely free</strong> to use. No fees, no charges, no hidden costs.
                  </p>
                  <p>
                    <strong className="text-gray-900">For Digital Marketing Professionals:</strong> Telemoz charges a 
                    <strong className="text-[#0a9396]"> 10% commission</strong> only from the payment you receive upon 
                    successful job completion. No upfront fees, no monthly charges.
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg border border-[#0a9396]/20 mt-4">
                    <p className="font-semibold text-gray-900 mb-2">Example:</p>
                    <p className="text-gray-700">
                      If you agree on £1,000 for a project, the client pays £1,000 to Telemoz. 
                      Upon completion, you receive £900, and Telemoz retains £100 (10%) as commission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Choose Telemoz */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Telemoz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-[#0a9396]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-700 text-sm">
                All transactions are protected. Your money is safe until work is completed.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-[#0a9396]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-gray-700 text-sm">
                Connect with trusted, verified digital marketing experts.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-[#0a9396]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-700 text-sm">
                No hidden fees. Know exactly what you'll pay or earn.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card variant="gradient" className="p-8 max-w-2xl mx-auto border-2 border-[#0a9396]/30">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-700 mb-6">
              Join thousands of professionals and businesses using Telemoz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-[#0a9396] hover:bg-[#087579] text-white">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396]/10">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

