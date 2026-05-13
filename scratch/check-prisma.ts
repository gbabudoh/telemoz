import prisma from "../lib/prisma";

async function main() {
  try {
    console.log("Checking reportShare accessibility...");
    const count = await prisma.reportShare.count();
    console.log("ReportShare count:", count);
  } catch (e) {
    console.error("ReportShare access failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
