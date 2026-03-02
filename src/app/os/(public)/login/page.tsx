import { redirect } from "next/navigation";
import { LoginForm } from "@/components/os/login-form";
import { resolvePostLoginPath } from "@/lib/dealer-auth";
import { getCurrentSession } from "@/lib/dealer-session";

function normalizeNext(value?: string | string[]) {
  if (Array.isArray(value)) return "/os/dashboard";
  if (!value || !value.startsWith("/os/")) return "/os/dashboard";
  if (value === "/os/login" || value.startsWith("/os/login?")) return "/os/dashboard";
  return value;
}

export default async function OsLoginPage({
  searchParams
}: {
  searchParams: Promise<{
    next?: string | string[];
    denied?: string;
  }>;
}) {
  const params = await searchParams;
  const nextPath = normalizeNext(params.next);
  const session = await getCurrentSession();
  if (session) {
    redirect(resolvePostLoginPath(session.role, nextPath));
  }

  return (
    <div className="mx-auto mt-10 grid w-full max-w-4xl gap-6 md:grid-cols-[1.1fr_1fr]">
      <div className="rounded-3xl border border-steel/12 bg-white p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">AUTORA OS</p>
        <h2 className="mt-2 text-3xl font-semibold text-coal">Revenue governance access</h2>
        <p className="mt-3 text-sm text-steel">
          Authorized account access for platform and dealership teams.
        </p>

        <div className="mt-5 rounded-2xl border border-steel/10 bg-mist/35 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-tide">Access Notice</p>
          <p className="mt-2 text-sm text-coal">
            Contact your AUTORA admin if you need credentials or role updates.
          </p>
        </div>

        {params.denied ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Your role does not have access to the requested screen.
          </p>
        ) : null}
      </div>

      <LoginForm nextPath={nextPath} />
    </div>
  );
}
