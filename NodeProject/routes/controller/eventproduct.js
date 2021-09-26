const moment = require('moment');
var mongoose = require('mongoose');
var db = mongoose.connection;

var Product = require('./../../db/model/product');
var Category = require('./../../db/model/category');
var EventProduct = require('./../../db/model/eventproduct');
var urlProduct = 'https://noobstore.xyz/shop/product/';

// Event Product
async function eventproduct(req, res) {
  var getName, getId;
  EventProduct.find({}, function (err, docs) {
    EventProduct.findOne({}, function (err, data) {
      if (data) {
        getId = data.event_product_name;
      } else {
        getId = '';
      }

      Category.findOne({ category_id: getId }, function (err, cData) {
        if (cData) {
          getName = cData.category_name;
        } else {
          getName = '';
        }
        res.render('manager/event_product/new_listPage', {
          listEventProduct: docs,
          lang: req.cookies.lang,
          fname: req.decoded['fname'],
          lname: req.decoded['lname'],
          mail: req.decoded['email'],
          title: 'Event Product Management',
          cName: getName,
        });
      });
    });
  });
}
async function addGet(req, res) {
  Product.find({}, function (err, docs) {
    Category.find({}, function (err, docs2) {
      res.render('manager/event_product/new_addPage', {
        moment: moment,
        lang: req.cookies.lang,
        fname: req.decoded['fname'],
        lname: req.decoded['lname'],
        mail: req.decoded['email'],
        listProduct: docs,
        listCategory: docs2,
        title: 'Event Product - Add New',
      });
    });
  });
}

async function addPost(req, res) {
  try {
    var getCategoryName = await Category.findOne({
      category_id: req.body.event_product_name,
    }).exec();
    await db.collection('eventproducts').insertOne({
      event_product_name: req.body.event_product_name,
      date_create: new Date(),
      date_start: req.body.date_start.toString(),
      date_end: req.body.date_end.toString(),
      event_product_url_1: urlProduct + getCategoryName.category_url_name,
      status: parseInt(req.body.event_product_status),
      event_product_image: {
        path: req.file.path,
        size: req.file.size,
      },
    });
    setTimeout(function () {
      res.redirect('/api/eventproduct');
    }, 1500);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function editGet(req, res) {
  await EventProduct.findById(req.params.id, function (err, docs) {
    res.render('manager/event_product/new_editPage', {
      moment: moment,
      title: 'Event Product - Edit #' + req.params.id,
      lang: req.cookies.lang,
      fname: req.decoded['fname'],
      lname: req.decoded['lname'],
      mail: req.decoded['email'],
      data: docs,
    });
  });
}

async function get(req, res) {
  try {
    var checkEventProduct = await EventProduct.findById(req.params.id).exec();
    res.send(checkEventProduct).status(200);
  } catch (err) {
    res.send(err).status(404);
  }
}

async function editPost(req, res) {
  try {
    var checkEventProduct = await EventProduct.findById(req.params.id).exec();
    if (req.file) {
      await checkEventProduct.set({
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        status: parseInt(req.body.eventproduct_status),
        event_product_image: {
          path: req.file.path,
          size: req.file.size,
        },
      });
    } else {
      await checkEventProduct.set({
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        status: parseInt(req.body.eventproduct_status),
      });
    }

    await checkEventProduct.save();
    return res.redirect('/api/eventproduct/');
  } catch (err) {
    res.status(500).send(err);
  }
}

async function Delete(req, res) {
  try {
    var deleteEventProduct = await EventProduct.deleteOne({
      _id: req.params.id,
    }).exec();
    res.send({ deleteEventProduct });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  eventproduct,
  addGet,
  addPost,
  editGet,
  get,
  editPost,
  Delete,
};
