import { updateShortlinkUser } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const link = searchParams.get("link");

  if (link) {
    const session = await auth();
    if (session?.user) {
      await updateShortlinkUser(link, session.user.id);
    }
  }

  redirect("/");
}
