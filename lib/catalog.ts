import { Prisma, Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AROMAS, CATEGORIES, PER_PAGE, ProductDTO } from "@/lib/types";

const categoryValues = CATEGORIES.map((item) => item.value);
const aromaValues = AROMAS.map((item) => item.value);

export type ProductQuery = {
  category?: string;
  aroma?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  sort?: string;
  page?: string;
};

function asImages(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function serializeProduct(product: Product): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    aroma_group: product.aromaGroup,
    top_notes: product.topNotes,
    middle_notes: product.middleNotes,
    base_notes: product.baseNotes,
    volume_ml: product.volumeMl,
    stock: product.stock,
    is_featured: product.isFeatured,
    is_new: product.isNew,
    images: asImages(product.images),
    created_at: product.createdAt.toISOString(),
  };
}

function buildWhere(query: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (query.category && categoryValues.includes(query.category as (typeof categoryValues)[number])) {
    where.category = query.category as (typeof categoryValues)[number];
  }

  if (query.aroma && aromaValues.includes(query.aroma as (typeof aromaValues)[number])) {
    where.aromaGroup = query.aroma as (typeof aromaValues)[number];
  }

  const price: Prisma.DecimalFilter = {};
  const min = Number(query.minPrice);
  const max = Number(query.maxPrice);
  if (query.minPrice && Number.isFinite(min)) price.gte = min;
  if (query.maxPrice && Number.isFinite(max)) price.lte = max;
  if (Object.keys(price).length > 0) where.price = price;

  const q = query.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { topNotes: { contains: q } },
      { middleNotes: { contains: q } },
      { baseNotes: { contains: q } },
    ];
  }

  return where;
}

function buildOrder(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "popular":
      return [{ orderItems: { _count: "desc" } }, { isFeatured: "desc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function listProducts(query: ProductQuery) {
  const page = Math.max(1, Number(query.page) || 1);
  const where = buildWhere(query);
  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: buildOrder(query.sort),
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ]);

  return {
    data: rows.map(serializeProduct),
    meta: { total, page, per_page: PER_PAGE },
  };
}

export async function getFeaturedProducts() {
  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const rows =
    featured.length > 0
      ? featured
      : await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 4 });
  return rows.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return null;

  const related = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return {
    product: serializeProduct(product),
    related: related.map(serializeProduct),
  };
}
