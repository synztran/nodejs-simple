const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'docs/upload/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

var mongoose = require('mongoose');
var db = mongoose.connection;

var Product = require('./../../db/model/product');
var Couter = require('./../../db/model/couter');
var Category = require('./../../db/model/category');

async function category(req, res) {
  Category.find({}, function (err, docs) {
    res.render('manager/category/categoryPage', {
      listCategory: docs,
    });
  });
}

async function mounting(req, res) {
  res.render('tips/mountingPage');
}

async function addGet(req, res) {
  res.render('manager/category/addPage', {
    title: 'Add new CATEGORY',
  });
}

async function addPost(req, res) {
  try {
    await Category.find({ category_id: req.body.catid }, async (err, docs) => {
      if (docs.length) {
        res.status(400).json({
          code: 400,
          message: 'category id already exists',
        });
      } else {
        var type = req.body.type;
        var cat_url_name = req.body.catname.replace(/ /g, '-');
        var lowerCat_url = cat_url_name.toLowerCase();
        // if type = keeb
        if (type == 0) {
          Couter.findOne({ _id: 'keeb' }, function (err, docs) {
            var inc = docs['seq'] + 1;
            db.collection('categories').insertOne({
              category_id: 'KEEB' + inc,
              category_url_name: lowerCat_url,
              category_name: req.body.catname,
              author: req.body.author,
              manufacturing: req.body.manufacturing,
              proxy_host: req.body.host,
              status_gb: req.body.status,
              k_color: req.body.k_color,
              type: req.body.type,
              flip: req.body.flip,
              k_layout: req.body.k_layout,
              k_degree: req.body.k_degree,
              k_mounting: req.body.k_mounting,
              k_plate_option: req.body.k_plate,
              date_start: req.body.date_start,
              date_end: req.body.date_end,
              date_payment: req.body.date_payment,
              min_price: req.body.min_price,
              max_price: req.body.max_price,
              tax: req.body.tax,
              handle: req.body.hns,
              specs: req.body.specs,
              pic_profile: {
                path: req.file.path,
                size: req.file.size,
              },
              product_belong: req.body.product_belong,
              summary_content: req.body.summary_content,
              price_content:  req.body.price_content,
              time_line: req.body.time_line,
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'keeb',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(docs);
            }
          );
          // if type = keyset
        } else if (type == 1) {
          Couter.findOne({ _id: 'keyset' }, function (err, docs) {
            var inc = docs['seq'] + 1;

            db.collection('categories').insertOne({
              category_id: 'KSET' + inc,
              category_url_name: lowerCat_url,
              category_name: req.body.catname,
              author: req.body.author,
              manufacturing: req.body.manufacturing,
              proxy_host: req.body.host,
              status_gb: req.body.status,
              c_code_color: req.body.code_color,
              type: req.body.type,
              c_profile: req.body.profile,
              c_material: req.body.c_material,
              date_start: req.body.date_start,
              date_end: req.body.date_end,
              date_payment: req.body.date_payment,
              min_price: req.body.min_price,
              max_price: req.body.max_price,
              tax: req.body.tax,
              handle: req.body.hns,
              specs: req.body.specs,
              pic_profile: {
                path: req.file.path,
                size: req.file.size,
              },
              product_belong: req.body.product_belong,
              summary_content: req.body.summary_content,
              price_content:  req.body.price_content,
              time_line: req.body.time_line,
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'keyset',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(err);
            }
          );
        } else {
          //for etc
          Couter.findOne({ _id: 'etc' }, function (err, docs) {
            var inc = docs['seq'] + 1;
            db.collection('categories').insertOne({
              category_id: 'ETC' + inc,
              category_url_name: lowerCat_url,
              category_name: req.body.catname,
              author: req.body.author,
              manufacturing: req.body.manufacturing,
              proxy_host: req.body.host,
              status_gb: req.body.status,
              type: req.body.type,
              date_start: req.body.date_start,
              date_end: req.body.date_end,
              date_payment: req.body.date_payment,
              min_price: req.body.min_price,
              max_price: req.body.max_price,
              tax: req.body.tax,
              handle: req.body.hns,
              specs: req.body.specs,
              pic_profile: {
                path: req.file.path,
                size: req.file.size,
              },
              product_belong: req.body.product_belong,
              summary_content: req.body.summary_content,
              price_content:  req.body.price_content,
              time_line: req.body.time_line,
            });
          });
          db.collection('couters').findAndModify(
            {
              _id: 'etc',
            },
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true },

            function (err, docs) {
              console.log(err);
            }
          );
        }
      }
    }).exec();
    setTimeout(function () {
      res.redirect('/api/category');
    }, 1500);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function editGet(req, res) {
  try {
    await Category.findById(req.params.id, function (err, docs) {
      var type = docs.type;
      if (type == 0) {
        res.render('manager/category/editPage', {
          title: 'Edit Category : Keeb',
          category: docs,
          type: 0,
        });
      } else if (type == 1) {
        res.render('manager/category/editPage', {
          title: 'Edit Category : Keyset',
          category: docs,
          type: 1,
        });
      } else {
        res.render('manager/category/editPage', {
          title: 'Edit Category : ETC',
          category: docs,
          type: 2,
        });
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
}

async function get(req, res) {
  try {
    var check = await Category.findById(req.params.id).exec();
    res.send(check).status(200);
  } catch (err) {
    res.send(err).status(404);
  }
}

async function getcid(req, res) {
  try {
    var checkCat = await Category.findOne({
      category_url_name: 'og-1800-keycap',
    }).exec();
    await Category.findOne({
      category_url_name: req.params.id.toString(),
    }).exec();
    res.send(checkCat).status(200);
  } catch (err) {
    res.send(err).status(404);
  }
}

async function editPost(req, res) {
  try {
    var check = await Category.findById(req.params.id).exec();
    var type = check.type;
    var cat_url_name = req.body.catname.replace(/ /g, '-');
    var lowerCat_url = cat_url_name.toLowerCase();
    // for keeb
    if (type == 0) {
      if (req.file == null) {
        check.set({
          category_url_name: lowerCat_url,
          category_name: req.body.catname,
          author: req.body.author,
          manufacturing: req.body.manufacturing,
          proxy_host: req.body.host,
          status_gb: req.body.status,
          k_color: req.body.k_color,
          flip: req.body.flip,
          k_layout: req.body.k_layout,
          k_degree: req.body.k_degree,
          k_mounting: req.body.k_mounting,
          date_start: req.body.date_start,
          date_end: req.body.date_end,
          date_payment: req.body.date_payment,
          min_price: req.body.min_price,
          max_price: req.body.max_price,
          tax: req.body.tax,
          handle: req.body.hns,
          specs: req.body.specs,
          product_belong: req.body.product_belong,
          summary_content: req.body.summary_content,
          price_content:  req.body.price_content,
          time_line: req.body.time_line,
        });
      } else {
        check.set({
          category_url_name: lowerCat_url,
          category_name: req.body.catname,
          author: req.body.author,
          manufacturing: req.body.manufacturing,
          proxy_host: req.body.host,
          status_gb: req.body.status,
          k_color: req.body.k_color,
          flip: req.body.flip,
          k_layout: req.body.k_layout,
          k_degree: req.body.k_degree,
          k_mounting: req.body.k_mounting,
          date_start: req.body.date_start,
          date_end: req.body.date_end,
          date_payment: req.body.date_payment,
          min_price: req.body.min_price,
          max_price: req.body.max_price,
          tax: req.body.tax,
          handle: req.body.hns,
          specs: req.body.specs,
          pic_profile: {
            path: req.file.path,
            size: req.file.size,
          },
          product_belong: req.body.product_belong,
          summary_content: req.body.summary_content,
          price_content:  req.body.price_content,
          time_line: req.body.time_line,
        });
      }
      await check.save();
      return res.redirect('/api/category');
    } else if (type == 1) {
      // for keyset
      if (req.file == null) {
        check.set({
          category_url_name: lowerCat_url,
          category_name: req.body.catname,
          author: req.body.author,
          manufacturing: req.body.manufacturing,
          proxy_host: req.body.host,
          status_gb: req.body.status,
          c_code_color: req.body.code_color,
          c_profile: req.body.profile,
          c_material: req.body.c_material,
          date_start: req.body.date_start,
          date_end: req.body.date_end,
          date_payment: req.body.date_payment,
          min_price: req.body.min_price,
          max_price: req.body.max_price,
          tax: req.body.tax,
          handle: req.body.hns,
          specs: req.body.specs,
          product_belong: req.body.product_belong,
          summary_content: req.body.summary_content,
          price_content:  req.body.price_content,
          time_line: req.body.time_line,
        });
      } else {
        check.set({
          category_url_name: lowerCat_url,
          category_name: req.body.catname,
          author: req.body.author,
          manufacturing: req.body.manufacturing,
          proxy_host: req.body.host,
          status_gb: req.body.status,
          c_code_color: req.body.code_color,
          c_profile: req.body.profile,
          c_material: req.body.c_material,
          date_start: req.body.date_start,
          date_end: req.body.date_end,
          date_payment: req.body.date_payment,
          min_price: req.body.min_price,
          max_price: req.body.max_price,
          tax: req.body.tax,
          handle: req.body.hns,
          specs: req.body.specs,
          pic_profile: {
            path: req.file.path,
            size: req.file.size,
          },
          product_belong: req.body.product_belong,
          summary_content: req.body.summary_content,
          price_content:  req.body.price_content,
          time_line: req.body.time_line,
        });
      }

      await check.save();
      return res.redirect('/api/category');
    } else if (type == 2) {
      if (req.file == null) {
        check.set({
          category_url_name: lowerCat_url,
          category_name: req.body.catname,
          author: req.body.author,
          manufacturing: req.body.manufacturing,
          proxy_host: req.body.host,
          status_gb: req.body.status,
          date_start: req.body.date_start,
          date_end: req.body.date_end,
          date_payment: req.body.date_payment,
          min_price: req.body.min_price,
          max_price: req.body.max_price,
          tax: req.body.tax,
          handle: req.body.hns,
          specs: req.body.specs,
          product_belong: req.body.product_belong,
          summary_content: req.body.summary_content,
          price_content:  req.body.price_content,
          time_line: req.body.time_line,
        });
      } else {
        check.set({
          category_url_name: lowerCat_url,
          category_name: req.body.catname,
          author: req.body.author,
          manufacturing: req.body.manufacturing,
          proxy_host: req.body.host,
          status_gb: req.body.status,
          date_start: req.body.date_start,
          date_end: req.body.date_end,
          date_payment: req.body.date_payment,
          min_price: req.body.min_price,
          max_price: req.body.max_price,
          tax: req.body.tax,
          handle: req.body.hns,
          specs: req.body.specs,
          pic_profile: {
            path: req.file.path,
            size: req.file.size,
          },
          product_belong: req.body.product_belong,
          summary_content: req.body.summary_content,
          price_content:  req.body.price_content,
          time_line: req.body.time_line,
        });
      }

      await check.save();
      return res.redirect('/api/category');
    }
  } catch (err) {
    res.status(200).send(err);
  }
}
// product have been deleted when deleting category
async function Delete(req, res) {
  try {
    var checkCategory = await Category.findById(req.params.id).exec();
    var deleteCategory = await Category.deleteOne({
      _id: req.params.id,
    }).exec();
    var deleteProduct = await Product.deleteMany({
      category_id: checkCategory.category_id,
    }).exec();

    res.send({ deleteCategory, deleteProduct });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  category,
  mounting,
  addGet,
  addPost,
  editGet,
  get,
  getcid,
  editPost,
  Delete,
};
