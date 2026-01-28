import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  params = await params;
  try {
    const userId = getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    const job = await prisma.application.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.userId !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  params = await params;
  try {
    const userId = getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    const job = await prisma.application.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.userId !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { companyName, jobTitle, status } = await request.json();

    const data = {};
    if (companyName) data.companyName = companyName;
    if (jobTitle) data.jobTitle = jobTitle;
    if (status) {
      const allowedStatuses = ["Applied", "Interview", "Rejected", "Offer"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { message: "Invalid status value" },
          { status: 400 }
        );
      }
      data.status = status;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
    }

    const updatedJob = await prisma.application.update({
      where: { id: jobId },
      data,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  params = await params;
  try {
    const userId = getUserFromRequest(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    const job = await prisma.application.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.userId !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    await prisma.application.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
