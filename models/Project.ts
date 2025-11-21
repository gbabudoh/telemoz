import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  proId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  startDate: Date;
  endDate?: Date;
  budget?: number;
  milestones: {
    title: string;
    description: string;
    dueDate: Date;
    status: "pending" | "in-progress" | "completed";
    completedAt?: Date;
  }[];
  deliverables: {
    title: string;
    description: string;
    type: "report" | "document" | "design" | "other";
    fileUrl?: string;
    deliveredAt?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    proId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      default: "planning",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    budget: Number,
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        completedAt: Date,
      },
    ],
    deliverables: [
      {
        title: String,
        description: String,
        type: {
          type: String,
          enum: ["report", "document", "design", "other"],
        },
        fileUrl: String,
        deliveredAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;

