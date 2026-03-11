import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      colors,
      inStock,
      sort
    } = req.query;

    let query = {};

    // 1. Text Search (regex for partial matching)
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } }
      ];
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // 3. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Color Filter (match by name, case-insensitive)
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : colors.split(',');
      query.colors = { $in: colorArray.map(c => new RegExp(`^${c.trim()}$`, 'i')) };
    }

    // 5. In-Stock Filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 6. Sorting Logic
    let sortOptions = { createdAt: -1 }; // Default: Latest
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'popular':
          sortOptions = { salesCount: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(skip)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      hasNextPage: Number(page) < Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

// Returns distinct categories and colors from the database for dynamic filter UI
export const getFilterOptions = async (req, res, next) => {
  try {
    const [categories, colors] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('colors')
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.filter(Boolean).sort(),
        colors: colors.filter(Boolean).sort()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category }).lean();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = await Product.find({ $text: { $search: q } }).lean();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
