import Collection from '../models/Collection.js';

export const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find().lean();
    res.json({ success: true, data: collections });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a collection
// @route   POST /api/collections
export const createCollection = async (req, res, next) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a collection
// @route   PUT /api/collections/:id
export const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
export const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
