import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import type { AdminRole } from "@/types/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/admin");
  }

  // Get admin profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, admin_role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminRole={profile.admin_role as AdminRole} />

      <div className="flex-1 flex flex-col">
        <AdminHeader
          adminName={profile.full_name || undefined}
          adminEmail={user.email || undefined}
        />

        <main className="flex-1 p-6">
          <AdminBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}

