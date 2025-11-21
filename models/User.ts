import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  userType: "pro" | "client" | "admin";
  image?: string;
  emailVerified?: Date;
  country?: string;
  city?: string;
  timezone?: string;
  stripeCustomerId?: string;
  subscriptionTier?: "starter" | "standard" | "pro";
  subscriptionStatus?: "active" | "canceled" | "past_due";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false, // Don't include password in queries by default
    },
    userType: {
      type: String,
      enum: ["pro", "client", "admin"],
      required: true,
      default: "client",
    },
    image: String,
    emailVerified: Date,
    country: String,
    city: String,
    timezone: {
      type: String,
      default: "Europe/London",
    },
    stripeCustomerId: String,
    subscriptionTier: {
      type: String,
      enum: ["starter", "standard", "pro"],
      default: "starter",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "canceled", "past_due"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

