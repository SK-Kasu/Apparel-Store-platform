import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-session";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname");
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (pathname === "/admin/login") {
    if (session?.role === "ADMIN") {
      redirect("/admin");
    }

    return <>{children}</>;
  }

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
