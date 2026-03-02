const { productPool: pool } = require('../config/db');
const fs = require('fs');
const path = require('path');
const { sendResponse } = require('../utils/response');

// Helper to format image URLs
const formatImageUrls = (req, products) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/home_page_products/`;

    return products.map((product) => {
        let imagePaths = [];
        if (product.images) {
            try {
                const parsed = JSON.parse(product.images);
                imagePaths = parsed.map((filename) => baseUrl + filename);
            } catch (err) {
                console.error('Image parse error:', err);
            }
        }

        return {
            ...product,
            imageUrls: imagePaths,
        };
    });
};

// Add New Product
const addProduct = async (req, res, next) => {
    try {
        const { name, category, quantity, price, details } = req.body;

        if (!name || !category || !quantity || !price) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        let images = null;

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            const imageFilenames = req.files.map((file) => file.filename);
            images = JSON.stringify(imageFilenames);
            console.log('Uploaded images:', imageFilenames);
        }

        // Insert product
        const [result] = await pool.query(
            `INSERT INTO home_page_products 
       (name, category, quantity, price, images, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [
                name.trim(),
                category.trim(),
                quantity.trim(),
                price,
                images,
                details ? details.trim() : null,
            ]
        );

        // Fetch inserted product
        const [newProductRows] = await pool.query('SELECT * FROM home_page_products WHERE id = ?', [
            result.insertId,
        ]);

        if (newProductRows.length === 0) {
            return sendResponse(res, 500, false, 'Failed to fetch the added product');
        }

        return sendResponse(res, 201, true, 'Product added successfully', newProductRows[0]);
    } catch (error) {
        console.error('Error adding product:', error);

        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }

        next(error);
    }
};

// Get all dairy products
const getProcessedProducts = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `
      SELECT 
        id,
        name,
        quantity,
        price,
        images,
        rating,
        rating_count
      FROM home_page_products
      WHERE category = 'ProcessedProducts'
      `
        );

        if (!rows.length) {
            return sendResponse(res, 404, false, 'No products found');
        }

        // Format images
        const formattedRows = formatImageUrls(req, rows);

        // Normalize numeric fields
        const normalizedRows = formattedRows.map((item) => ({
            ...item,
            rating: Number(item.rating) || 0,
            rating_count: Number(item.rating_count) || 0,
        }));

        return sendResponse(res, 200, true, 'Fruit products fetched successfully', normalizedRows);
    } catch (error) {
        next(error);
    }
};

// Get all Dry fruit products
const getDryFruitProducts = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `
      SELECT 
        id,
        name,
        quantity,
        price,
        images,
        rating,
        rating_count
      FROM home_page_products
      WHERE category = 'dryfruits'
      `
        );

        if (!rows.length) {
            return sendResponse(res, 404, false, 'No products found');
        }

        // Format images
        const formattedRows = formatImageUrls(req, rows);

        // Normalize numeric fields
        const normalizedRows = formattedRows.map((item) => ({
            ...item,
            rating: Number(item.rating) || 0,
            rating_count: Number(item.rating_count) || 0,
        }));

        return sendResponse(res, 200, true, 'Fruit products fetched successfully', normalizedRows);
    } catch (error) {
        next(error);
    }
};

// Get all fruit products
const getFruits = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `
      SELECT 
        id,
        name,
        quantity,
        price,
        images,
        rating,
        rating_count
      FROM home_page_products
      WHERE category = 'fruits'
      `
        );

        if (!rows.length) {
            return sendResponse(res, 404, false, 'No products found');
        }

        // Format images
        const formattedRows = formatImageUrls(req, rows);

        // Normalize numeric fields
        const normalizedRows = formattedRows.map((item) => ({
            ...item,
            rating: Number(item.rating) || 0,
            rating_count: Number(item.rating_count) || 0,
        }));

        return sendResponse(res, 200, true, 'Fruit products fetched successfully', normalizedRows);
    } catch (error) {
        next(error);
    }
};

// Get specific product by id
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            'SELECT id, name, category, quantity, price, images, details, rating, rating_count FROM home_page_products WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return sendResponse(res, 404, false, 'Product not found');
        }

        const product = rows[0];

        const baseUrl = `${req.protocol}://${req.get('host')}/uploads/home_page_products/`;

        // Parse and format images
        let imageUrls = [];
        let imageFilenames = [];

        if (product.images) {
            try {
                imageFilenames = JSON.parse(product.images);
                imageUrls = imageFilenames.map((filename) => `${baseUrl}${filename}`);
            } catch (e) {
                console.error('Failed to parse images:', e);
                imageFilenames = [];
                imageUrls = [];
            }
        }

        // Return product with both imageUrls
        const formattedProduct = {
            id: product.id,
            name: product.name,
            category: product.category || null,
            quantity: product.quantity,
            price: product.price,
            images: imageFilenames,
            imageUrls: imageUrls,
            details: product.details,
            rating: Number(product.rating) || 0,
            rating_count: Number(product.rating_count) || 0,
        };

        return sendResponse(res, 200, true, 'Product fetched successfully', formattedProduct);
    } catch (error) {
        next(error);
    }
};

// Search products by name
const searchProducts = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length === 0) {
            console.log('No query provided');
            return sendResponse(res, 400, false, 'Search query is required');
        }

        console.log('Searching for:', query);

        const searchTerm = `%${query.trim()}%`;
        const startsWithTerm = `${query.trim()}%`;

        const [rows] = await pool.query(
            `SELECT id, name, category, quantity, price, images 
       FROM home_page_products 
       WHERE name LIKE ? OR category LIKE ?
       ORDER BY 
         CASE 
           WHEN name LIKE ? THEN 1
           WHEN name LIKE ? THEN 2
           ELSE 3
         END,
         name ASC
       LIMIT 20`,
            [
                searchTerm,
                searchTerm,
                startsWithTerm, // Starts with priority
                searchTerm, // Contains priority
            ]
        );

        if (rows.length === 0) {
            return sendResponse(res, 200, true, 'No products found', []);
        }

        const formattedRows = formatImageUrls(req, rows);

        return sendResponse(res, 200, true, 'Products found', formattedRows);
    } catch (error) {
        console.error('Error searching products:', error);
        next(error);
    }
};

// Get similar products by category (excluding current product)
const getSimilarProducts = async (req, res, next) => {
    try {
        const { category, excludeId } = req.query;

        if (!category) {
            return sendResponse(res, 400, false, 'Category is required');
        }

        let query =
            'SELECT id, name, quantity, price, images, rating, rating_count FROM home_page_products WHERE category = ?';
        const params = [category];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        // Remove LIMIT to get all products in category

        const [rows] = await pool.query(query, params);

        if (rows.length === 0) {
            return sendResponse(res, 200, true, 'No similar products found', []);
        }

        const formattedRows = formatImageUrls(req, rows);

        return sendResponse(res, 200, true, 'Similar products fetched successfully', formattedRows);
    } catch (error) {
        next(error);
    }
};

// Rate a product
const rateProduct = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { prodId } = req.params;
        const { rating } = req.body;
        const user_id = req.user.user_id;
        const product_id = Number(prodId);

        if (!product_id || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Invalid data' });
        }

        await conn.beginTransaction();

        // Lock product row
        const [[product]] = await conn.query(
            'SELECT rating, rating_count FROM home_page_products WHERE id = ? FOR UPDATE',
            [product_id]
        );

        if (!product) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check existing rating
        const [[existing]] = await conn.query(
            'SELECT rating FROM product_ratings WHERE product_id = ? AND user_id = ?',
            [product_id, user_id]
        );

        let newAvg = product.rating;
        let newCount = product.rating_count;

        if (existing) {
            // Update rating
            newAvg =
                (product.rating * product.rating_count - existing.rating + rating) /
                product.rating_count;

            await conn.query(
                'UPDATE product_ratings SET rating = ? WHERE product_id = ? AND user_id = ?',
                [rating, product_id, user_id]
            );
        } else {
            // Insert rating
            newAvg = (product.rating * product.rating_count + rating) / (product.rating_count + 1);
            newCount += 1;

            await conn.query(
                'INSERT INTO product_ratings (product_id, user_id, rating) VALUES (?, ?, ?)',
                [product_id, user_id, rating]
            );
        }

        await conn.query(
            'UPDATE home_page_products SET rating = ?, rating_count = ? WHERE id = ?',
            [Number(newAvg.toFixed(1)), newCount, product_id]
        );

        await conn.commit();

        return res.json({
            success: true,
            avg_rating: Number(newAvg.toFixed(1)),
            rating_count: newCount,
        });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        return res.status(500).json({ success: false, message: 'Rating failed' });
    } finally {
        conn.release();
    }
};

module.exports = {
    addProduct,
    getProcessedProducts,
    getDryFruitProducts,
    getFruits,
    getProductById,
    getSimilarProducts,
    searchProducts,
    rateProduct,
};
