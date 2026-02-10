import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/dealer-session";

export default function OsIndexPage() {
  const session = getCurrentSession();
  if (session) {
    redirect("/os/dashboard");
  }

  redirect("/os/login");
}
