import { auth } from "@/auth";
import { deleteTask } from "@/lib/tasks";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Неавторизований" }, { status: 401 });
  }

  const { id } = await params;
  await deleteTask(id, session.user.id);
  return NextResponse.json({ success: true });
}
