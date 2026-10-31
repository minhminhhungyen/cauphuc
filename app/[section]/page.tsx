import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { PLACEHOLDERS, placeholderBySlug } from "@/lib/placeholders";

// Chỉ dựng đúng các trang trong danh sách; đường dẫn khác ra trang 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PLACEHOLDERS.map((item) => ({ section: item.slug }));
}

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const item = placeholderBySlug(section);
  return item ? { title: item.label, description: item.description } : {};
}

export default async function SectionPlaceholderPage({ params }: Props) {
  const { section } = await params;
  const item = placeholderBySlug(section);
  if (!item) notFound();
  return <PagePlaceholder title={item.label} description={item.description} status={item.status} />;
}
