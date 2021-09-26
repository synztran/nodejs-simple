var mongoose = require('mongoose');
var db = mongoose.connection;

var Product = require('./../../db/model/product');
var Couter = require('./../../db/model/couter');
var Category = require('./../../db/model/category');

async function product(req, res) {
  Product.find({}, function (err, docs) {
    Category.find({}, function (err, docs2) {
      res.render('manager/product/productPage', {
        listProduct: docs,
        listCategory: docs2,
      });
    });
  });
}

async function getpid(req, res) {
  try {
    var check = await Product.findById(req.params.id).exec();
    res.send(check).status(200);
  } catch (err) {
    res.send(err).status(404);
  }
}

async function getcid(req, res) {
  try {
    var check = await Product.find({ category_url_name: req.params.id }).exec();
    res.send(check).status(200);
  } catch (err) {
    res.send(err).status(404);
  }
}
async function addGet(req, res) {
  await Category.find({}, function (err, docs) {
    res.render('manager/product/addPage', {
      title: 'Add new PRODUCT',
      listCategoryID: docs,
    });
  });
}

async function addPost(req, res) {
  try {
    await Category.findOne(
      { category_id: req.body.catid },
      async (err, CatData) => {
        var part = req.body.p_part;
        console.log(part);
        if (part == 0) {
          //for top case
          await Couter.findOne({ _id: 'p_top_case' }, function (err, docs) {
            var inc = docs['seq'] + 1;
            db.collection('products').insertOne({
              product_id: 'PTOP' + inc,
              product_name: req.body.pname,
              category_url_name: CatData.category_url_name,
              category_id: req.body.catid,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              k_top_color: req.body.top_color,
              k_top_material: req.body.top_material,
              price: req.body.top_case_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          await db.collection('couters').findAndModify(
            {
              _id: 'p_top_case',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(err);
            }
          );
        } else if (part == 1) {
          //for bot case
          await Couter.findOne({ _id: 'p_bottom_case' }, function (err, docs) {
            var inc = docs['seq'] + 1;
            db.collection('products').insertOne({
              product_id: 'PBOT' + inc,
              product_name: req.body.pname,
              category_id: req.body.catid,
              category_url_name: CatData.category_url_name,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              k_bot_color: req.body.bot_color,
              k_bot_material: req.body.bot_material,
              price: req.body.top_case_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'p_bottom_case',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(err);
            }
          );
        } else if (part == 2) {
          // for plate
          await Couter.findOne({ _id: 'p_plate' }, function (err, docs) {
            var inc = docs['seq'] + 1;
            db.collection('products').insertOne({
              product_id: 'PLATE' + inc,
              product_name: req.body.pname,
              category_id: req.body.catid,
              category_url_name: CatData.category_url_name,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              k_plate_option: req.body.bot_price,
              k_plate_material: req.body.plate_material,
              price: req.body.plate_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'p_plate',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(docs);
            }
          );
        } else if (part == 3) {
          // for frame
          await Couter.findOne({ _id: 'p_frame' }, function (err, docs) {
            var inc = docs['seq'] + 1;

            db.collection('products').insertOne({
              product_id: 'FRAME' + inc,
              product_name: req.body.pname,
              category_id: req.body.catid,
              category_url_name: CatData.category_url_name,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              k_top_color: req.body.top_color,
              k_top_material: req.body.top_material,
              price: req.body.top_case_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'p_frame',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(docs);
            }
          );
        } else if (part == 4) {
          // keycap
          await Couter.findOne({ _id: 'p_keycap' }, function (err, docs) {
            var inc = docs['seq'] + 1;

            db.collection('products').insertOne({
              product_id: 'KEYKIT' + inc,
              product_name: req.body.pname,
              replace_product_name: req.body.replace_product_name,
              category_id: req.body.catid,
              category_url_name: CatData.category_url_name,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              c_code_color: req.body.code_color,
              c_profile: req.body.c_profile,
              c_material: req.body.c_material,
              price: req.body.c_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'p_keycap',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(docs);
            }
          );
        } else if (part == 5) {
          // for swithces
          await Couter.findOne({ _id: 'p_switches' }, function (err, docs) {
            var inc = docs['seq'] + 1;

            db.collection('products').insertOne({
              product_id: 'SWPACK' + inc,
              product_name: req.body.pname,
              replace_product_name: req.body.replace_product_name,
              category_id: req.body.catid,
              category_url_name: CatData.category_url_name,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              price: req.body.sw_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'p_switches',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(docs);
            }
          );
        } else if (part == 7) {
          // for artisan
          await Couter.findOne({ _id: 'p_artisan' }, function (err, docs) {
            console.log(docs);
            console.log(docs['seq']);
            var inc = docs['seq'] + 1;
            console.log('incc' + inc);

            db.collection('products').insertOne({
              product_id: 'ARTACC' + inc,
              product_name: req.body.pname,
              replace_product_name: req.body.replace_product_name,
              category_id: req.body.catid,
              category_url_name: CatData.category_url_name,
              product_part: req.body.p_part,
              outstock: req.body.outstock,
              price: req.body.artisan_price,
              pic_product: {
                path: req.file.path,
                size: req.file.size,
              },
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'p_artisan',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(docs);
            }
          );
        }
      }
    );
    setTimeout(function () {
      res.redirect('/api/product');
    }, 1500);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function editGet(req, res) {
  try {
    // var unactive = await Category.findById(req.params.id);
    // console.log(unactive)

    Product.findById(req.params.id, function (err, docs) {
      console.log(docs);
      var type = docs.product_part;
      console.log(type);
      if (type == 0) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Keeb Top Case',
          product: docs,
          type: 0,
        });
      } else if (type == 1) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Keeb Bot case',
          product: docs,
          type: 1,
        });
      } else if (type == 2) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Keeb Plate',
          product: docs,
          type: 2,
        });
      } else if (type == 3) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Keeb Frame',
          product: docs,
          type: 3,
        });
      } else if (type == 4) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Keycap',
          product: docs,
          type: 4,
        });
      } else if (type == 5) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Switches',
          product: docs,
          type: 5,
        });
      } else if (type == 7) {
        res.render('manager/product/editPage', {
          title: 'Edit Product : Artisan',
          product: docs,
          type: 7,
        });
      }
    });
    // function(err, docs){
    // console.log(docs);
    // })
  } catch (err) {
    res.status(400).send(err);
  }
}

async function editPost(req, res) {
  console.log(req.body);
  // console.log(req.file);
  try {
    var check = await Product.findById(req.params.id).exec();
    console.log(check);
    var part = check.product_part;
    console.log(part);
    if (part == 0) {
      // top case
      if (req.file == null) {
        check.set({
          product_name: req.body.product_name,
          outstock: req.body.outstock,
          k_top_color: req.body.top_color,
          k_top_material: req.body.top_material,
          price: req.body.price,
        });
      } else {
        check.set({
          product_name: req.body.product_name,
          outstock: req.body.outstock,
          k_top_color: req.body.top_color,
          k_top_material: req.body.top_material,
          price: req.body.price,
          pic_product: {
            path: req.file.path,
            size: req.file.size,
          },
        });
      }
    } else if (part == 1) {
      // for bot case
      if (req.file == null) {
        check.set({
          product_name: req.body.product_name,
          outstock: req.body.outstock,
          k_bot_color: req.body.bot_color,
          k_bot_material: req.body.bot_material,
          price: req.body.price,
        });
      } else {
        check.set({
          product_name: req.body.product_name,
          outstock: req.body.outstock,
          k_bot_color: req.body.bot_color,
          k_bot_material: req.body.bot_material,
          price: req.body.price,
          pic_product: {
            path: req.file.path,
            size: req.file.size,
          },
        });
      }
    } else if (part == 2) {
      // for plate
      if (req.file == null) {
        check.set({
          product_name: req.body.product_name,
          outstock: req.body.outstock,
          k_plate_option: req.body.plate_option,
          k_plate_material: req.body.plate_material,
          price: req.body.price,
        });
      } else {
        check.set({
          product_name: req.body.product_name,
          outstock: req.body.outstock,
          k_plate_option: req.body.plate_option,
          k_plate_material: req.body.plate_material,
          price: req.body.price,
          pic_product: {
            path: req.file.path,
            size: req.file.size,
          },
        });
      }
    } else if (part == 3) {
      // for frame
      if (req.file == null) {
      } else {
      }
    } else if (part == 4) {
      // keycap
      console.log('for keycap');
      if (req.file == null) {
        check.set({
          product_name: req.body.product_name,
          replace_product_name: req.body.replace_product_name,
          outstock: req.body.outstock,
          c_code_color: req.body.code_color,
          c_profile: req.body.c_profile,
          c_material: req.body.c_material,
          price: req.body.c_price,
        });
      } else {
        check.set({
          product_name: req.body.product_name,
          replace_product_name: req.body.replace_product_name,
          outstock: req.body.outstock,
          c_code_color: req.body.code_color,
          c_profile: req.body.c_profile,
          c_material: req.body.c_material,
          price: req.body.c_price,
          pic_product: {
            path: req.file.path,
            size: req.file.size,
          },
        });
      }
      var result = await check.save();
      // res.status(200).send(result)
      return res.redirect('/api/product');
    } else if (part == 5) {
      console.log('for switches');
      if (req.file == null) {
        check.set({
          product_name: req.body.product_name,
          replace_product_name: req.body.replace_product_name,
          outstock: req.body.outstock,
          price: req.body.sw_price,
        });
      } else {
        check.set({
          product_name: req.body.product_name,
          replace_product_name: req.body.replace_product_name,
          outstock: req.body.outstock,
          price: req.body.sw_price,
          pic_product: {
            path: req.file.path,
            size: req.file.size,
          },
        });
      }
      var result = await check.save();
      // res.status(200).send(result)
      return res.redirect('/api/product');
    } else if (part == 7) {
      console.log('for artisan');
      if (req.file == null) {
        check.set({
          product_name: req.body.product_name,
          replace_product_name: req.body.replace_product_name,
          outstock: req.body.outstock,
          price: req.body.sw_price,
        });
      } else {
        check.set({
          product_name: req.body.product_name,
          replace_product_name: req.body.replace_product_name,
          outstock: req.body.outstock,
          price: req.body.sw_price,
          pic_product: {
            path: req.file.path,
            size: req.file.size,
          },
        });
      }
      var result = await check.save();
      // res.status(200).send(result)
      return res.redirect('/api/product');
    }

    // check.set({
    //     product_name: req.body.product_name,
    //     price: req.body.price,
    //     outstock: req.body.outstock,
    //     color: req.body.color,
    // });
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
}
// product have been deleted when deleting category
async function Delete(req, res) {
  console.log(req.params.id);
  try {
    var deleteProduct = await Product.deleteOne({ _id: req.params.id }).exec();

    res.status(200).send(deleteProduct);
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  product,
  getpid,
  getcid,
  addGet,
  addPost,
  editGet,
  editPost,
  Delete,
};
