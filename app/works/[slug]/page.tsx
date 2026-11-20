import ArticleReader from "../../components/ArticleReader";
import { notFound } from "next/navigation";
import { getRelatedWorks, getWorkBySlug, getWorks } from "../../../lib/works";

export function generateStaticParams() {
  return getWorks().map(({ slug }) => ({ slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  return (
    <ArticleReader
      work={work}
      relatedWorks={getRelatedWorks(work.slug)}
    />
  );
}
