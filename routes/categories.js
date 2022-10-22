const express = require('express');
const { Types } = require('mongoose');
const router = express.Router();
const Category = require('../model/category');
const Course = require('../model/course');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const categories = await Category.find()
  res.render('categories', {
    title: 'Categories',
    name: req.session.admin.name,
    categories,
    admin: req.session.adm
  });
});

router.get('/create', function (req, res, next) {
  res.render('addCategory', {
    title: 'Add'
  });
});

router.post('/create', async function (req, res, next) {
  const { name, image } = req.body

  const category = new Category({
    name,
    image
  })

  await category.save()

  res.redirect('/categories')

});

router.get('/remove/:id', async (req, res) => {
  const id = req.params.id
  await Category.findByIdAndRemove(id)
  res.redirect('/categories')
})

router.get('/update/:id', async (req, res) => {
  const category = await Category.findById(req.params.id)
  res.render('updateCategory', {
    title: 'update',
    name: category.name,
    image: category.image,
    id: category.id,
  })
})

router.post('/update/', async (req, res) => {
  const { name, image, id } = req.body
  
  await Category.findByIdAndUpdate(id, { name, image })
  
  res.redirect('/categories')
})

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id)
  const courses = await Course.aggregate([
    {
      $match: {
        categoryId: Types.ObjectId(req.params.id)
      }
    }
  ])
  
  res.render('category', {
    title:  category.name,
    name: category.name,
    image: category.image,
    id: category.id,
    courses
  })
})

module.exports = router;
