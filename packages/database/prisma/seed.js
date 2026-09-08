import { PrismaClient, Role, Gender, DiscountType } from '@prisma/client';
import * as crypto from 'crypto';
const prisma = new PrismaClient();
function hashPassword(password) {
    // Simple SHA-256 for seed script (bcrypt is used in NestJS AuthModule)
    return crypto.createHash('sha256').update(password).digest('hex');
}
async function main() {
    console.log('Seeding 11 11 Luxury Database...');
    // 1. Clean existing records (in reverse dependency order)
    await prisma.shipment.deleteMany({});
    await prisma.refund.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.orderStatusHistory.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.inventoryReservation.deleteMany({});
    await prisma.inventoryItem.deleteMany({});
    await prisma.warehouse.deleteMany({});
    await prisma.wishlistItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.collection.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.coupon.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.user.deleteMany({});
    // 2. Seed Users
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@eleven11atelier.com',
            passwordHash: hashPassword('AtelierAdmin2026!'),
            firstName: 'Alistair',
            lastName: 'Vance',
            role: Role.SUPER_ADMIN,
            phone: '+919876543210',
        },
    });
    const customerUser = await prisma.user.create({
        data: {
            email: 'client@eleven11atelier.com',
            passwordHash: hashPassword('ClientPassword123!'),
            firstName: 'Elena',
            lastName: 'Rostova',
            role: Role.CUSTOMER,
            phone: '+919812345678',
            addresses: {
                create: [
                    {
                        fullName: 'Elena Rostova',
                        phone: '+919812345678',
                        streetLine1: '42 Altamount Road, Cumballa Hill',
                        streetLine2: 'Penthouse B',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        postalCode: '400026',
                        country: 'IN',
                        isDefaultShipping: true,
                        isDefaultBilling: true,
                    },
                ],
            },
        },
    });
    // 3. Seed Warehouse
    const warehouse = await prisma.warehouse.create({
        data: {
            code: 'WH-MUMBAI-MAIN',
            name: 'Mumbai Central Atelier Fulfilment Hub',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'IN',
        },
    });
    // 4. Seed Collections
    const autumnWinter = await prisma.collection.create({
        data: {
            name: 'Autumn / Winter 2026: Noir Opulence',
            slug: 'autumn-winter-2026',
            description: 'Architectural silhouettes crafted in raw mulberry silk, double-faced cashmere, and tailored wool.',
            season: 'Autumn/Winter',
            year: 2026,
            coverImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        },
    });
    const rawSilkCapsule = await prisma.collection.create({
        data: {
            name: 'The Raw Silk Capsule',
            slug: 'raw-silk-capsule',
            description: 'Unbleached natural slub textures meeting fluid modern eveningwear cuts.',
            season: 'Resort',
            year: 2026,
            coverImageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
        },
    });
    // 5. Seed Categories
    const outerwear = await prisma.category.create({
        data: {
            name: 'Tailored Outerwear',
            slug: 'tailored-outerwear',
            description: 'Sculpted coats, double-breasted blazers, and trench capes.',
            imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
            gender: Gender.WOMEN,
        },
    });
    const eveningwear = await prisma.category.create({
        data: {
            name: 'Eveningwear & Gowns',
            slug: 'eveningwear-gowns',
            description: 'Bias-cut column gowns and dramatic evening silhouettes.',
            imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
            gender: Gender.WOMEN,
        },
    });
    const silkAtelier = await prisma.category.create({
        data: {
            name: 'Handcrafted Silk',
            slug: 'handcrafted-silk',
            description: 'Lustrous mulberry and organza shirts, pleated skirts, and draped wraps.',
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
            gender: Gender.WOMEN,
        },
    });
    // 6. Seed Luxury Products
    const productsData = [
        {
            title: 'The Sovereign Silk Organza Trench',
            slug: 'sovereign-silk-organza-trench',
            description: 'A masterpiece of sheer architectural tailoring. Cut from translucent mulberry silk organza with exaggerated storm flaps, horn buttons, and a belted waist.',
            details: 'Storm flap detailing. Double-breasted closure with genuine horn buttons. Raglan sleeves with adjustable buckle cuffs. French seams throughout.',
            material: '100% Mulberry Silk Organza (45 Momme)',
            careInstructions: 'Dry clean only by luxury garment specialist. Cool iron with pressing cloth.',
            gender: Gender.WOMEN,
            isFeatured: true,
            categoryId: outerwear.id,
            collectionId: autumnWinter.id,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
                    storageKey: 'products/trench-01.jpg',
                    altText: 'Sovereign Silk Organza Trench in Onyx Black',
                    sortOrder: 1,
                    isPrimary: true,
                    colorName: 'Onyx Black',
                },
                {
                    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
                    storageKey: 'products/trench-02.jpg',
                    altText: 'Sovereign Silk Organza Trench - Back drape detail',
                    sortOrder: 2,
                    isPrimary: false,
                    colorName: 'Onyx Black',
                },
            ],
            variants: [
                { sku: '1111-TRN-BLK-S', colorName: 'Onyx Black', colorHex: '#111111', size: 'S', price: 48500, compareAtPrice: 54000, stock: 8 },
                { sku: '1111-TRN-BLK-M', colorName: 'Onyx Black', colorHex: '#111111', size: 'M', price: 48500, compareAtPrice: 54000, stock: 12 },
                { sku: '1111-TRN-BLK-L', colorName: 'Onyx Black', colorHex: '#111111', size: 'L', price: 48500, compareAtPrice: 54000, stock: 6 },
                { sku: '1111-TRN-IVR-S', colorName: 'Ivory Cream', colorHex: '#F7F5F0', size: 'S', price: 48500, compareAtPrice: 54000, stock: 5 },
                { sku: '1111-TRN-IVR-M', colorName: 'Ivory Cream', colorHex: '#F7F5F0', size: 'M', price: 48500, compareAtPrice: 54000, stock: 7 },
            ],
        },
        {
            title: 'Crepe de Chine Pleated Column Gown',
            slug: 'crepe-de-chine-pleated-column-gown',
            description: 'Floor-skimming columnar silhouette hand-pleated in heavy silk crepe. Features an asymmetric shoulder drape and discreet side slit.',
            details: 'Hand-pressed accordion pleats. Concealed side zip closure with hook-and-eye. Fully lined in silk habotai.',
            material: '100% Silk Crepe de Chine',
            careInstructions: 'Specialist dry clean only. Store hung on padded hanger.',
            gender: Gender.WOMEN,
            isFeatured: true,
            categoryId: eveningwear.id,
            collectionId: autumnWinter.id,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
                    storageKey: 'products/gown-01.jpg',
                    altText: 'Crepe de Chine Pleated Column Gown in Champagne Gold',
                    sortOrder: 1,
                    isPrimary: true,
                    colorName: 'Champagne Gold',
                },
            ],
            variants: [
                { sku: '1111-GWN-GLD-XS', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'XS', price: 62000, compareAtPrice: null, stock: 4 },
                { sku: '1111-GWN-GLD-S', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'S', price: 62000, compareAtPrice: null, stock: 9 },
                { sku: '1111-GWN-GLD-M', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'M', price: 62000, compareAtPrice: null, stock: 11 },
                { sku: '1111-GWN-GLD-L', colorName: 'Champagne Gold', colorHex: '#E5D3B3', size: 'L', price: 62000, compareAtPrice: null, stock: 3 },
            ],
        },
        {
            title: 'Sculpted Double-Faced Cashmere Coat',
            slug: 'sculpted-double-faced-cashmere-coat',
            description: 'Hand-stitched double-faced Mongolian cashmere unlined coat. Unsurpassed softness and weightless insulation with a dramatic lapel and kimono sleeve.',
            details: 'Hand-sewn edges. Self-tie cashmere belt. Deep patch pockets. Unlined for natural thermal drape.',
            material: '100% Grade-A Mongolian Cashmere (750 GSM)',
            careInstructions: 'Professional furrier/cashmere clean only.',
            gender: Gender.WOMEN,
            isFeatured: true,
            categoryId: outerwear.id,
            collectionId: autumnWinter.id,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
                    storageKey: 'products/coat-01.jpg',
                    altText: 'Sculpted Double-Faced Cashmere Coat in Camel',
                    sortOrder: 1,
                    isPrimary: true,
                    colorName: 'Camel Melange',
                },
            ],
            variants: [
                { sku: '1111-COT-CML-S', colorName: 'Camel Melange', colorHex: '#C19A6B', size: 'S', price: 89000, compareAtPrice: 98000, stock: 6 },
                { sku: '1111-COT-CML-M', colorName: 'Camel Melange', colorHex: '#C19A6B', size: 'M', price: 89000, compareAtPrice: 98000, stock: 8 },
                { sku: '1111-COT-CML-L', colorName: 'Camel Melange', colorHex: '#C19A6B', size: 'L', price: 89000, compareAtPrice: 98000, stock: 4 },
            ],
        },
        {
            title: 'Raw Silk Draped Atelier Tunic',
            slug: 'raw-silk-draped-atelier-tunic',
            description: 'Fluid artisanal tunic featuring a cowl collar and stepped hemline. Woven on traditional handlooms preserving natural slubs.',
            details: 'Handwoven raw silk texture. Extended side vents. Hand-rolled hems.',
            material: '100% Wild Tussar Silk',
            careInstructions: 'Dry clean recommended. Gentle hand wash in cold water using silk detergent.',
            gender: Gender.WOMEN,
            isFeatured: false,
            categoryId: silkAtelier.id,
            collectionId: rawSilkCapsule.id,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
                    storageKey: 'products/tunic-01.jpg',
                    altText: 'Raw Silk Draped Atelier Tunic in Chalk White',
                    sortOrder: 1,
                    isPrimary: true,
                    colorName: 'Chalk White',
                },
            ],
            variants: [
                { sku: '1111-TNC-WHT-S', colorName: 'Chalk White', colorHex: '#EAE6DF', size: 'S', price: 29500, compareAtPrice: null, stock: 15 },
                { sku: '1111-TNC-WHT-M', colorName: 'Chalk White', colorHex: '#EAE6DF', size: 'M', price: 29500, compareAtPrice: null, stock: 18 },
                { sku: '1111-TNC-WHT-L', colorName: 'Chalk White', colorHex: '#EAE6DF', size: 'L', price: 29500, compareAtPrice: null, stock: 10 },
            ],
        },
    ];
    for (const p of productsData) {
        const createdProduct = await prisma.product.create({
            data: {
                title: p.title,
                slug: p.slug,
                description: p.description,
                details: p.details,
                material: p.material,
                careInstructions: p.careInstructions,
                gender: p.gender,
                isFeatured: p.isFeatured,
                categoryId: p.categoryId,
                collectionId: p.collectionId,
                images: {
                    create: p.images.map((img) => ({
                        url: img.url,
                        storageKey: img.storageKey,
                        altText: img.altText,
                        sortOrder: img.sortOrder,
                        isPrimary: img.isPrimary,
                        colorName: img.colorName,
                    })),
                },
            },
        });
        for (const v of p.variants) {
            const variant = await prisma.productVariant.create({
                data: {
                    productId: createdProduct.id,
                    sku: v.sku,
                    colorName: v.colorName,
                    colorHex: v.colorHex,
                    size: v.size,
                    price: v.price,
                    compareAtPrice: v.compareAtPrice,
                },
            });
            // Stock in warehouse
            await prisma.inventoryItem.create({
                data: {
                    variantId: variant.id,
                    warehouseId: warehouse.id,
                    quantityOnHand: v.stock,
                    reservedQuantity: 0,
                },
            });
        }
    }
    // 7. Seed Coupons
    await prisma.coupon.create({
        data: {
            code: 'WELCOME11',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 15, // 15% off
            minOrderAmount: 20000,
            maxDiscount: 10000,
            usageLimit: 1000,
            isActive: true,
        },
    });
    await prisma.coupon.create({
        data: {
            code: 'ATELIER5000',
            discountType: DiscountType.FIXED_AMOUNT,
            discountValue: 5000, // ₹5000 flat off
            minOrderAmount: 40000,
            isActive: true,
        },
    });
    console.log('Seed completed successfully! 11 11 database ready.');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
