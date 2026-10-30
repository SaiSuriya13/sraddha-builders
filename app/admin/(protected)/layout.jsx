import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-brand-bg">
      <AdminNav />
      <main className="mx-auto max-w-8xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        {children}
      </main>
    </div>
  );
}
