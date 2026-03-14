import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("Document ID is required", { status: 400 });
    }

    // Add authentication check here if available in the codebase
    // e.g., const session = await getServerSession(authOptions);
    // if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const deletedDocument = await prisma.document.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedDocument);
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
