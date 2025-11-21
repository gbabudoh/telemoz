"use client";

import { Card } from "@/components/ui/Card";
import { Zap, Users, Target, Shield } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "We leverage cutting-edge technology to provide the best tools for digital marketing professionals.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a trusted marketplace where professionals and clients can connect and collaborate.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Committed to delivering enterprise-grade solutions that drive real business results.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Your data and client information is protected with industry-leading security measures.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0a9396] mb-4">About Telemoz</h1>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            We're building the future of digital marketing collaboration, empowering professionals 
            and agencies with powerful tools and seamless client connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title}>
                <Card className="h-full text-center">
                  <div className="rounded-lg bg-[#0a9396]/10 p-3 w-fit mx-auto mb-4">
                    <Icon className="h-6 w-6 text-[#0a9396]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </Card>
              </div>
            );
          })}
        </div>

        <div>
          <Card variant="gradient" className="p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Mission</h2>
            <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto">
              To empower digital marketing professionals and agencies with the tools they need 
              to succeed, while creating a trusted marketplace that connects them with clients 
              who need their expertise. We believe in making professional-grade marketing tools 
              accessible to everyone, regardless of their business size.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

