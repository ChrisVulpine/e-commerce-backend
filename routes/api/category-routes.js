const router = require('express').Router();
const { Category, Product } = require('../../models');

// --------------------The `/api/categories` endpoint --------------------

  // GET all categories
  // include associated products
router.get('/', async (req, res) => {


  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          as: 'products',
        }
      ],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Failed to retrieve categories'});
  }
});

  // GET one category by its `id` value
  // include associated products
router.get('/:id', async (req, res) => {

  try {
    const product = await Category.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Product,
          as: 'products',
        }
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'No category found with this id'});
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Failed to retrieve category.'});
  }
});

// POST or create a new category
router.post('/', async (req, res) => {

  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create category' });
  }
});

  // PUT or update a category by its `id` value
router.put('/:id', async (req, res) => {

  try {
    // Extract the category ID from the request parameters
    const { id } = req.params;

    // Update the category using the data from the request body
    const [affectedRows] = await Category.update(req.body, {
      where: { id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'No category found with this id' });
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

  // DELETE a category by its `id` value
router.delete('/:id', async (req, res) => {

  try {
    const { id } = req.params;

    const result = await Category.destroy({
      where: { id }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'No category found with this id' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
