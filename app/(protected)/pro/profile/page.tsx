"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Save, Plus, X, Award, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

// Popular certifications
const popularCertifications = [
  { name: "Google Ads Certification", issuer: "Google" },
  { name: "Google Analytics Certification", issuer: "Google" },
  { name: "Meta (Facebook) Certified", issuer: "Meta" },
  { name: "Meta (Instagram) Certified", issuer: "Meta" },
  { name: "HubSpot Content Marketing", issuer: "HubSpot" },
  { name: "HubSpot Inbound Marketing", issuer: "HubSpot" },
  { name: "Hootsuite Social Media Marketing", issuer: "Hootsuite" },
  { name: "SEMrush SEO Toolkit", issuer: "SEMrush" },
  { name: "Microsoft Advertising Certified", issuer: "Microsoft" },
  { name: "LinkedIn Marketing Solutions", issuer: "LinkedIn" },
  { name: "Twitter Flight School", issuer: "Twitter" },
  { name: "Amazon Ads Certification", issuer: "Amazon" },
];

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export default function ProProfilePage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
    linkedIn: "",
    specialties: [] as string[],
    hourlyRate: 0,
    monthlyRate: 0,
  });
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showCertForm, setShowCertForm] = useState(false);
  const [newCert, setNewCert] = useState<Certification>({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch profile data from API
    setFormData({
      bio: "With over 8 years of experience in digital marketing...",
      location: "London, UK",
      website: "https://example.com",
      linkedIn: "https://linkedin.com/in/example",
      specialties: ["SEO", "Content Marketing", "Analytics"],
      hourlyRate: 75,
      monthlyRate: 1500,
    });
  }, [session]);

  const handleAddCertification = () => {
    if (newCert.name && newCert.issuer && newCert.issueDate) {
      setCertifications([...certifications, { ...newCert }]);
      setNewCert({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
      });
      setShowCertForm(false);
    }
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSelectPopularCert = (cert: { name: string; issuer: string }) => {
    setNewCert({
      ...newCert,
      name: cert.name,
      issuer: cert.issuer,
    });
    setShowCertForm(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Implement API call to save profile
    console.log("Saving profile...", { formData, certifications });
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your professional profile and marketplace visibility</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all min-h-[120px]"
              placeholder="Tell potential clients about yourself..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <Input
            label="LinkedIn"
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#0a9396]" />
            Certifications & Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-[#0a9396]" />
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Issued by: {cert.issuer}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Issued: {cert.issueDate}
                      </span>
                      {cert.expiryDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expires: {cert.expiryDate}
                        </span>
                      )}
                      {cert.credentialId && (
                        <span>Credential ID: {cert.credentialId}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCertification(index)}
                    className="p-1 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Popular Certifications */}
          {!showCertForm && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Popular Certifications:</p>
              <div className="flex flex-wrap gap-2">
                {popularCertifications.map((cert, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPopularCert(cert)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 hover:border-[#0a9396] transition-all"
                  >
                    {cert.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Certification Form */}
          {showCertForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-lg border-2 border-[#0a9396]/30 bg-[#0a9396]/5 space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Add Certification</h4>
                <button
                  onClick={() => setShowCertForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Certification Name"
                  placeholder="e.g., Google Ads Certification"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                />
                <Input
                  label="Issuer"
                  placeholder="e.g., Google, Meta, HubSpot"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                />
                <Input
                  label="Issue Date"
                  type="date"
                  value={newCert.issueDate}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                />
                <Input
                  label="Expiry Date (Optional)"
                  type="date"
                  value={newCert.expiryDate}
                  onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                />
                <Input
                  label="Credential ID (Optional)"
                  placeholder="e.g., ABC123456"
                  value={newCert.credentialId}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCertification}
                  className="bg-[#0a9396] hover:bg-[#087579] text-white"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Certification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCertForm(false);
                    setNewCert({
                      name: "",
                      issuer: "",
                      issueDate: "",
                      expiryDate: "",
                      credentialId: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowCertForm(true)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Certification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.specialties.map((specialty) => (
              <Badge key={specialty} variant="primary">
                {specialty}
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      specialties: formData.specialties.filter((s) => s !== specialty),
                    })
                  }
                  className="ml-2 hover:text-gray-900"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add a specialty..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const input = e.currentTarget as HTMLInputElement;
                if (input.value && !formData.specialties.includes(input.value)) {
                  setFormData({
                    ...formData,
                    specialties: [...formData.specialties, input.value],
                  });
                  input.value = "";
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hourly Rate (£)"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
            />
            <Input
              label="Monthly Rate (£)"
              type="number"
              value={formData.monthlyRate}
              onChange={(e) => setFormData({ ...formData, monthlyRate: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#0a9396] hover:bg-[#087579] text-white"
          size="lg"
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
