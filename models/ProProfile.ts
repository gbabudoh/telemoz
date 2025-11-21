import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProProfile extends Document {
  userId: mongoose.Types.ObjectId;
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
  skills: {
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
  }[];
  certifications: {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      required: true,
    },
    specialties: [String],
    location: {
      type: String,
      required: true,
    },
    website: String,
    linkedIn: String,
    portfolio: String,
    hourlyRate: Number,
    monthlyRate: Number,
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
        },
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProProfile: Model<IProProfile> =
  mongoose.models.ProProfile || mongoose.model<IProProfile>("ProProfile", ProProfileSchema);

export default ProProfile;

