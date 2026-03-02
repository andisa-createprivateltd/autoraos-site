import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/dealer-session";

export default async function OsIndexPage() {
  const session = await getCurrentSession();
  if (session) {
    redirect("/os/dashboard");
  }

  redirect("/os/login");
}
