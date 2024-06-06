const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
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

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
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

router.post('/', async (req, res) => {
  // create a new category
  try {
    // Create the category using the data from the request body
    const category = await Category.create(req.body);

    // Respond with the created category
    res.status(200).json(category);
  } catch (err) {
    // If there was an error, log it and return a 400 status
    console.error(err);
    res.status(400).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    // Extract the category ID from the request parameters
    const { id } = req.params;

    // Update the category using the data from the request body
    const [affectedRows] = await Category.update(req.body, {
      where: { id }
    });

    // If no rows were affected (i.e., no category was found with that ID), return a 404 status
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'No category found with this id' });
    }

    // If the update was successful, respond with a success message
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    // If there was an error, log it and return a 500 status
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    // Extract the category ID from the request parameters
    const { id } = req.params;

    // Attempt to delete the category from the database
    const result = await Category.destroy({
      where: { id }
    });

    // If no rows were affected (i.e., no category was found with that ID), return a 404 status
    if (result === 0) {
      return res.status(404).json({ message: 'No category found with this id' });
    }

    // If the deletion was successful, return a success message
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    // If there was an error, log it and return a 500 status
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
