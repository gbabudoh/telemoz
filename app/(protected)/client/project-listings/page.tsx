"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function ProjectListingsPage() {
  const [showForm, setShowForm] = useState(false);

  // Mock project listings
  const listings = [
    {
      id: "1",
      title: "Social Media Management",
      description: "Looking for an experienced social media manager for our e-commerce brand",
      budget: "£2000-£4000/month",
      status: "open",
      applicants: 5,
      postedDate: "2024-01-20",
    },
    {
      id: "2",
      title: "SEO Audit & Optimization",
      description: "Need comprehensive SEO audit and optimization for our website",
      budget: "£3000-£5000",
      status: "in-progress",
      applicants: 3,
      postedDate: "2024-01-15",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Listings</h1>
          <p className="text-gray-400">Post new opportunities and manage your listings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Listing
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Listing</h2>
          <div className="space-y-4">
            <Input label="Project Title" placeholder="e.g., SEO Optimization Campaign" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all min-h-[120px]"
                placeholder="Describe your project requirements..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Budget Range" placeholder="e.g., £2000-£4000" />
              <Input label="Timeline" placeholder="e.g., 3 months" />
            </div>
            <div className="flex gap-2">
              <Button>Post Listing</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2">{listing.title}</CardTitle>
                  <p className="text-gray-400 mb-2">{listing.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Budget: {listing.budget}</span>
                    <span>•</span>
                    <span>Posted: {listing.postedDate}</span>
                    <span>•</span>
                    <span>{listing.applicants} applicants</span>
                  </div>
                </div>
                <Badge variant={listing.status === "open" ? "success" : "primary"}>
                  {listing.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Applicants</Button>
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="danger" size="sm">Close</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

