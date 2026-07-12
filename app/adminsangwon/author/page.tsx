import { getAdminStatus } from "@/lib/admin-auth";
import { getAdminAuthors } from "@/lib/admin-db";
import { AdminDenied } from "@/components/admin/AdminDenied";
import { AuthorForm } from "@/components/admin/AuthorForm";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function AdminAuthorPage({ searchParams }: Props) {
  const status = await getAdminStatus();
  if (!status.isAdmin) return <AdminDenied email={status.email} />;

  const { id } = await searchParams;
  const author = id ? (await getAdminAuthors()).find((a) => a.id === id) || null : null;

  return (
    <AuthorForm
      initial={
        author
          ? {
              id: author.id,
              name: author.name,
              bio: author.bio || "",
              snsUrl: author.sns_url || "",
              blogUrl: author.blog_url || "",
              imageUrl: author.image_url,
            }
          : null
      }
    />
  );
}
