import express from 'express';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
    try {
        const products = await Product.find({}, '_id updatedAt');
        const collections = await Collection.find({}, 'category updatedAt');

        const baseUrl = process.env.FRONTEND_URL || 'https://moderatestextile.com';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/wholesale</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

        // Dynamic Product Pages
        products.forEach(product => {
            xml += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${product.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        // Dynamic Collection/Category Pages
        collections.forEach(collection => {
            xml += `
  <url>
    <loc>${baseUrl}/products?category=${encodeURIComponent(collection.category)}</loc>
    <lastmod>${collection.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        xml += `
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
