import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: resolve(__dirname, '.env') });
loadEnv({ path: resolve(__dirname, '../.env') });

const TENANTS = [
  { businessName: 'Aura Boutique', slug: 'aura-boutique' },
  { businessName: 'Vanguard Threads', slug: 'vanguard-threads' }
] as const;

const CATEGORIES = [
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Outerwear', slug: 'outerwear' },
  { name: 'Tops', slug: 'tops' },
  { name: 'Accessories', slug: 'accessories' }
] as const;

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const COLORS = [
  { name: 'Onyx Black', code: 'ONX' },
  { name: 'Off-White', code: 'OFW' },
  { name: 'Crimson Red', code: 'CRM' },
  { name: 'Indigo Denim', code: 'IND' }
] as const;

const BASE_PRICE_BY_CATEGORY: Record<string, string> = {
  footwear: '180.00',
  outerwear: '320.00',
  tops: '95.00',
  accessories: '65.00'
};

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Populate database/.env or the root .env before seeding.'
    );
  }

  const { prisma } = await import('./client');

  try {
    const tenantRecords: Array<{ id: string; businessName: string; slug: string }> = [];
    const categoryRecords: Array<{ id: string; name: string; slug: string }> = [];

    for (const tenantData of TENANTS) {
      const tenant = await prisma.tenant.upsert({
        where: { slug: tenantData.slug },
        update: { businessName: tenantData.businessName },
        create: tenantData
      });
      tenantRecords.push(tenant);
    }

    for (const categoryData of CATEGORIES) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: { name: categoryData.name },
        create: categoryData
      });
      categoryRecords.push(category);
    }

    let productCount = 0;
    let variantCount = 0;

    for (const tenant of tenantRecords) {
      for (const category of categoryRecords) {
        const title = `${tenant.businessName} ${category.name} Capsule`;
        const description = `${category.name} essentials curated for ${tenant.businessName}.`;
        const basePrice = BASE_PRICE_BY_CATEGORY[category.slug] ?? '100.00';

        let product = await prisma.product.findFirst({
          where: { tenantId: tenant.id, title }
        });

        if (product) {
          product = await prisma.product.update({
            where: { id: product.id },
            data: {
              categoryId: category.id,
              description,
              basePrice,
              isArchived: false
            }
          });
        } else {
          product = await prisma.product.create({
            data: {
              tenantId: tenant.id,
              categoryId: category.id,
              title,
              description,
              basePrice,
              isArchived: false
            }
          });
        }

        productCount += 1;

        for (const [sizeIndex, size] of SIZES.entries()) {
          for (const [colorIndex, color] of COLORS.entries()) {
            const sku = ['SW', tenant.slug, category.slug, size, color.code]
              .join('-')
              .toUpperCase();
            const inventoryCount = 12 + sizeIndex * 2 + colorIndex;

            await prisma.productVariant.upsert({
              where: { sku },
              update: {
                productId: product.id,
                size,
                color: color.name,
                inventoryCount,
                variantPrice: basePrice
              },
              create: {
                productId: product.id,
                sku,
                size,
                color: color.name,
                inventoryCount,
                variantPrice: basePrice
              }
            });

            variantCount += 1;
          }
        }
      }
    }

    console.log(
      `Seed complete: ${tenantRecords.length} tenants, ${categoryRecords.length} categories, ` +
        `${productCount} products, ${variantCount} variants.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
