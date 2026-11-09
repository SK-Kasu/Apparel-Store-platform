import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: resolve(__dirname, '.env') });
loadEnv({ path: resolve(__dirname, '../.env') });

type TenantSeed = {
  businessName: string;
  slug: string;
  showroomAddress: string;
};

type CategorySeed = {
  name: string;
  slug: string;
};

type ProductSeed = {
  tenantSlug: string;
  categorySlug: string;
  title: string;
  description: string;
  basePrice: string;
  skuCode: string;
  sizes: readonly string[];
  colors: readonly { name: string; code: string }[];
  inventoryPerVariant: number;
};

const TENANTS: readonly TenantSeed[] = [
  {
    businessName: 'Aura Boutique Ltd',
    slug: 'aura-boutique',
    showroomAddress: 'The Alchemist, Westlands, Nairobi'
  },
  {
    businessName: 'Vanguard Luxury Regalia',
    slug: 'vanguard-regalia',
    showroomAddress: 'Imenti House, Nairobi CBD'
  }
];

const CATEGORIES: readonly CategorySeed[] = [
  { name: 'Khanga Wraps', slug: 'khanga-wraps' },
  { name: 'Kitenge Tailored Blazers', slug: 'kitenge-tailored-blazers' },
  { name: 'Urban Linen Tops', slug: 'urban-linen-tops' },
  { name: 'Premium Outerwear', slug: 'premium-outerwear' }
];

const PRODUCTS: readonly ProductSeed[] = [
  {
    tenantSlug: 'aura-boutique',
    categorySlug: 'premium-outerwear',
    title: 'Maasai Fleece Trim Trench Coat',
    description:
      'A statement trench in heavyweight fleece with hand-finished Maasai trim, tailored for cool-season layering in Nairobi.',
    basePrice: '6500.00',
    skuCode: 'MFT',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Onyx Black', code: 'BLK' },
      { name: 'Crimson Red', code: 'CRM' }
    ],
    inventoryPerVariant: 25
  },
  {
    tenantSlug: 'vanguard-regalia',
    categorySlug: 'urban-linen-tops',
    title: 'Handwoven Kikoy Summer Shirt',
    description:
      'A breathable handwoven kikoy shirt with a relaxed summer cut, finished for warm-weather dressing and coastal evenings.',
    basePrice: '3800.00',
    skuCode: 'HKS',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Indigo Denim', code: 'IND' },
      { name: 'Off-White', code: 'OFW' }
    ],
    inventoryPerVariant: 25
  }
];

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Populate database/.env or the root .env before seeding.'
    );
  }

  const { prisma } = await import('./client');

  try {
    const tenantRecords = new Map<string, { id: string; businessName: string; slug: string }>();
    const categoryRecords = new Map<string, { id: string; name: string; slug: string }>();

    for (const tenantData of TENANTS) {
      const tenant = await prisma.tenant.upsert({
        where: { slug: tenantData.slug },
        update: {
          businessName: tenantData.businessName,
          showroomAddress: tenantData.showroomAddress
        },
        create: tenantData
      });

      tenantRecords.set(tenant.slug, tenant);
    }

    for (const categoryData of CATEGORIES) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: { name: categoryData.name },
        create: categoryData
      });

      categoryRecords.set(category.slug, category);
    }

    let productCount = 0;
    let variantCount = 0;

    for (const productData of PRODUCTS) {
      const tenant = tenantRecords.get(productData.tenantSlug);

      if (!tenant) {
        throw new Error(`Tenant "${productData.tenantSlug}" was not seeded.`);
      }

      const category = categoryRecords.get(productData.categorySlug);

      if (!category) {
        throw new Error(`Category "${productData.categorySlug}" was not seeded.`);
      }

      const existingProduct = await prisma.product.findFirst({
        where: { tenantId: tenant.id, title: productData.title }
      });

      const product = existingProduct
        ? await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              categoryId: category.id,
              description: productData.description,
              basePrice: productData.basePrice,
              isArchived: false
            }
          })
        : await prisma.product.create({
            data: {
              tenantId: tenant.id,
              categoryId: category.id,
              title: productData.title,
              description: productData.description,
              basePrice: productData.basePrice,
              isArchived: false
            }
          });

      productCount += 1;

      for (const size of productData.sizes) {
        for (const color of productData.colors) {
          const sku = ['RAD', productData.skuCode, color.code, size].join('-').toUpperCase();

          await prisma.productVariant.upsert({
            where: { sku },
            update: {
              productId: product.id,
              size,
              color: color.name,
              inventoryCount: productData.inventoryPerVariant,
              variantPrice: productData.basePrice
            },
            create: {
              productId: product.id,
              sku,
              size,
              color: color.name,
              inventoryCount: productData.inventoryPerVariant,
              variantPrice: productData.basePrice
            }
          });

          variantCount += 1;
        }
      }
    }

    console.log(
      `Seed complete: ${tenantRecords.size} tenants, ${categoryRecords.size} categories, ` +
        `${productCount} products, ${variantCount} variants.`
    );

    for (const tenant of TENANTS) {
      console.log(`- ${tenant.businessName} (${tenant.slug}): ${tenant.showroomAddress}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
