import { getAdminStatus } from "@/lib/admin-auth";
import { getAdminBook, getAdminEpisodes, getAdminAuthors, episodesToManuscript } from "@/lib/admin-db";
import { AdminDenied } from "@/components/admin/AdminDenied";
import { BookForm } from "@/components/admin/BookForm";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function AdminBookPage({ searchParams }: Props) {
  const status = await getAdminStatus();
  if (!status.isAdmin) return <AdminDenied email={status.email} />;

  const { id } = await searchParams;
  const authors = await getAdminAuthors();
  const book = id ? await getAdminBook(id) : null;
  const manuscript = book ? episodesToManuscript(await getAdminEpisodes(book.id)) : "";

  return (
    <BookForm
      authors={authors.map((a) => ({ id: a.id, name: a.name }))}
      initial={
        book
          ? {
              id: book.id,
              title: book.title,
              authorId: book.author_id || "",
              authorName: book.author || "",
              logline: book.logline || "",
              description: book.description || "",
              category: book.category || "소설",
              totalEpisodes: book.total_episodes,
              sortOrder: book.sort_order || 0,
              coverPalette: book.cover_palette || "rose",
              coverPattern: book.cover_pattern || "grid",
              coverImageUrl: book.cover_image_url,
              manuscript,
            }
          : null
      }
    />
  );
}
