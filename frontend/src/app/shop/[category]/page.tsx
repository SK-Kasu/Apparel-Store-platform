import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryShop } from "@/components/category-shop";
import { CATEGORY_CATALOG } from "@/lib/category-catalog";
import { CATEGORY_SLUGS, isCategorySlug } from "@/lib/categories";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const normalized = category.toLowerCase();

  if (!isCategorySlug(normalized)) {
    return {
      title: "Category not found"
    };
  }

  const catalog = CATEGORY_CATALOG[normalized];

  return {
    title: catalog.label,
    description: `${catalog.description} All under one roof at Radiant Regalia Collection.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const normalized = category.toLowerCase();

  if (!isCategorySlug(normalized)) {
    notFound();
  }

  return <CategoryShop catalog={CATEGORY_CATALOG[normalized]} />;
}
