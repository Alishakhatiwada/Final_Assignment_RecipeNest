const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addCategory = async (req, res) => {
  try {
    console.log('Incoming category data:', req.body);
    const { title, icon } = req.body;
    let category = await Category.findOne({ title });
    if (category) return res.status(400).json({ message: 'Category already exists' });

    category = new Category({ title, icon });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error('Error in addCategory:', err);
    res.status(500).send('Server Error');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { title } },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
