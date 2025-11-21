export interface ProProfile {
  id: string;
  userId: string;
  bio: string;
  specialties: string[];
  location: string;
  website?: string;
  linkedIn?: string;
  portfolio?: string;
  hourlyRate?: number;
  monthlyRate?: number;
  availability: "available" | "busy" | "unavailable";
  rating: number;
  reviewCount: number;
  verified: boolean;
  skills: Skill[];
  certifications: Certification[];
}

export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  proId: string;
  clientId: string;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  startDate: Date;
  endDate?: Date;
  budget?: number;
  milestones: Milestone[];
  deliverables: Deliverable[];
}

export interface Milestone {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  completedAt?: Date;
}

export interface Deliverable {
  id?: string;
  title: string;
  description: string;
  type: "report" | "document" | "design" | "other";
  fileUrl?: string;
  deliveredAt?: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  proId: string;
  clientId: string;
  projectId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: Date;
  paidAt?: Date;
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

