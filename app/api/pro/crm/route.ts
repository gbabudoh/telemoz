import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.userType !== "pro") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proId = session.user.id;

    // Fetch unique clients who have projects with this pro
    const projects = await prisma.project.findMany({
      where: { proId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            country: true,
            city: true,
          },
        },
        invoices: {
          where: { status: "paid" },
          select: { total: true },
        },
      },
    });

    interface CRMClient {
      id: string;
      clientId: string;
      name: string;
      email: string;
      phone: string;
      company: string;
      status: string;
      value: number;
      projects: number;
      lastContact: string;
      nextFollowUp: string;
    }

    const clientsMap: Record<string, CRMClient> = {};

    projects.forEach((project) => {
      const client = project.client;
      if (!clientsMap[client.id]) {
        clientsMap[client.id] = {
          id: client.id,
          clientId: client.id,
          name: client.name,
          email: client.email,
          phone: "Not specified",
          company: client.name,
          status: "active",
          value: 0,
          projects: 0,
          lastContact: "Recent",
          nextFollowUp: "Not set",
        };
      }

      clientsMap[client.id].projects += 1;
      clientsMap[client.id].value += project.invoices.reduce((sum, inv) => sum + inv.total, 0);
    });

    return NextResponse.json({ clients: Object.values(clientsMap) });
  } catch (error) {
    console.error("Error fetching CRM clients:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // This is a bit tricky since clients are Users.
  // For a "Register Client" feature in CRM, we might want to look up an existing user by email
  // or return an error if they don't exist.
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.userType !== "pro") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const clientUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!clientUser) {
      return NextResponse.json({ error: "No user found with this email. Clients must have a Telemoz account." }, { status: 404 });
    }

    if (clientUser.userType !== "client") {
      return NextResponse.json({ error: "The specified user is not a client." }, { status: 400 });
    }

    // Create a dummy "lead" project or just return success if we are just "tracking" them
    // For now, let's just return the user info as a "found" client
    return NextResponse.json({ 
      client: {
        id: clientUser.id,
        clientId: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        phone: "Not specified",
        company: clientUser.name,
        status: "lead",
        value: 0,
        projects: 0,
        lastContact: "New",
        nextFollowUp: "Not set",
      }
    });
  } catch (error) {
    console.error("Error adding CRM client:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
