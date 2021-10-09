var mongoose = require('mongoose');
var db = mongoose.connection;

var BlogCategory = require('./../../db/model/blogCategory');
var BlogPost = require('./../../db/model/blogPost')

async function blogCategory(req, res){
	BlogCategory.find({}, function (err, docs) {
		res.render('manager/blog/listCategory', {
			listBlogCategory: docs
		})
	})
}

async function blogPost(req, res){
	BlogPost.find({}, function (err, docs) {
		res.render('manager/blog/listPost', {
			listBlogPost: docs
		})
	})
}

async function viewBlogCategory(req, res){
	res.render('manager/blog/addCategory', {
		title: 'Blog - Add new category'
	})
}

async function addBlogCategory(req, res) {
	try{
		await db.collection('blog_categories').insertOne({
			blogCategory_name: req.body.category_name,
			author: 'Admin',
			status: req.body.status,
			date_created: new Date()
		})
		res.redirect('/api/blog/category')
	}catch(err){
		res.status(500).send(err)
	}
}

async function addBlogPost(req, res) {
	res.render('manager/blog/addPost', {
		title: 'Blog - Add new post'
	})
}

module.exports = {
	blogCategory,
	blogPost,
	viewBlogCategory,
	addBlogCategory,
	addBlogPost
}