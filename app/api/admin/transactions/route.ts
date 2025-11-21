import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import Invoice from "@/models/Invoice";

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// GET /api/admin/transactions - Get all transactions/invoices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const invoices = await Invoice.find({})
      .populate("proId", "name email")
      .populate("clientId", "name email")
      .populate("projectId", "name")
      .sort({ createdAt: -1 });

    // Calculate commission (13% of total)
    const transactions = invoices.map((invoice) => ({
      _id: invoice._id.toString(),
      invoiceNumber: invoice.invoiceNumber || `INV-${invoice._id.toString().slice(-6)}`,
      proId: invoice.proId,
      clientId: invoice.clientId,
      projectId: invoice.projectId,
      total: invoice.total || 0,
      commission: (invoice.total || 0) * 0.13,
      status: invoice.status,
      createdAt: invoice.createdAt,
      paidAt: invoice.paidAt,
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

