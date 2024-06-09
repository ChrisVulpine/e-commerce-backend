const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// --------------------The `/api/products` endpoint --------------------

// GET all products
//include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Tag,
          as: 'tags',
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Failed to retrieve products'});
  }
});

// GET a single product by its `id`
// be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'No product found with this id'});
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Failed to retrieve product.'});
  }
});

// POST or create new product
router.post('/', (req, res) => {
  
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        res.status(200).json({ message: 'Product Created successfully' });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT or update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }
      res.status(200).json({ message: 'Product Updated successfully' });
      return res.json(product);
      
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

  // DELETE one product by its `id` value
router.delete('/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const result = await Product.destroy({
      where: { id }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'No product found with this id' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {

    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
  
});

module.exports = router;
