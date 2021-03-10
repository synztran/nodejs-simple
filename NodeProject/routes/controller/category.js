const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'docs/upload/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});

var mongoose = require('mongoose');
var db = mongoose.connection;

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1000
    },
    // fileFilter: fileFilter
});

var Product = require('./../../db/model/product');
var Couter = require('./../../db/model/couter')
var Category = require('./../../db/model/category');

async function category(req, res){
    Category.find({}, function(err, docs) {
        res.render('manager/category/categoryPage', {
            "listCategory": docs
        });
    });
}

async function mounting(req, res){
    res.render('tips/mountingPage')
}

async function addGet(req, res){
        res.render('manager/category/addPage', {
        title: "Add new CATEGORY"
    })
}




// upload.single('picture'),'

async function addPost(req, res){
    console.log((req.body));
    try {
        var check = await Category.find({ category_id: req.body.catid }, async (err, docs) => {
            if (docs.length) {
                res.status(400).json({
                    code: 400,
                    message: "category id already exists"
                })
            } else {

                var type = req.body.type;
                var cat_url_name = (req.body.catname).replace(/ /g, '-')
                var lowerCat_url = cat_url_name.toLowerCase();
                console.log(cat_url_name)
                // if type = keeb
                if (type == 0) {
                    Couter.findOne({ _id: "keeb" }, function(err, docs) {
                        console.log(docs);
                        console.log(docs['seq'])
                        var inc = docs['seq'] + 1;
                        console.log("incc"+inc)

                        // var uploader = fileuploader('files', { uploadDir: 'docs/upload/' }, req, res);
                        // uploader.upload(function(data) {
                        //     console.log(data.files);
                        //     console.log(data.files[0].size)
                        //     res.end(JSON.stringify(data, null, 4));
                        // });

                        db.collection('categories').insertOne({
                            category_id: "KEEB" + inc,
                            category_url_name: lowerCat_url,
                            category_name: (req.body.catname),
                            author: req.body.author,
                            manufacturing: req.body.manufacturing,
                            proxy_host: req.body.host,
                            status_gb: (req.body.status),
                            k_color: (req.body.k_color),
                            type: (req.body.type),
                            flip: (req.body.flip),
                            k_layout:  (req.body.k_layout),
                            k_degree: (req.body.k_degree),
                            k_mounting: (req.body.k_mounting),
                            k_plate_option: req.body.k_plate,
                            date_start:(req.body.date_start),
                            date_end: (req.body.date_end),
                            date_payment: (req.body.date_payment),
                            min_price: (req.body.min_price),
                            max_price: (req.body.max_price),
                            tax: req.body.tax,
                            handle: req.body.hns,
                            specs: req.body.specs,
                            pic_profile: {
                                // path: (data.files[0].file),
                                // size: (data.files[0].size2)
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "keeb"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                    // if type = keyset
                } else if (type == 1) {
                    Couter.findOne({ _id: "keyset" }, function(err, docs) {
                       console.log(docs);
                        console.log(docs['seq'])
                        var inc = docs['seq'] + 1;
                        console.log("incc"+inc)

                        db.collection('categories').insertOne({
                            category_id: "KSET" + inc,
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
                                size: req.file.size
                            }
                            
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "keyset"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                } else { //for etc
                    Couter.findOne({ _id: "etc" }, function(err, docs) {
                        console.log(docs);
                         console.log(docs['seq'])
                         var inc = docs['seq'] + 1;
                         console.log("incc"+inc)
 
                         db.collection('categories').insertOne({
                             category_id: "ETC" + inc,
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
                                 size: req.file.size
                             }
                             
                         })
 
                     })
                     db.collection("couters").findAndModify({
                             _id: "etc"
                         }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },
 
                         function(err, docs) {
                             console.log(docs);
                         }
                     )

                }
            }
        }).exec();
        setTimeout(function(){
            res.redirect('/api/category');
        }, 1500)
        
    } catch (err) {
        res.status(500).send(err);
    }
}

// router.get("/category/edit/:id", async (req, res) => {
//     try {
//         Category.findById(req.params
//             .id,
//             function(err, account) {
//                 res.render('editAccount', {
//                     title: 'Edit Account',
//                     account: account
//                 });
//             });
//     } catch (err) {
//         console.log(err);
//         res.status(200).send(err);
//     }
// });

// update db to mongo
// , upload.single('picture') 

async function editGet(req, res){
    // console.log(req.params.id)
    try{
        
        // var unactive = await Category.findById(req.params.id);
        // console.log(unactive)
        
        await Category.findById(req.params.id,function(err, docs){
            // console.log(docs);
            // console.log(docs.type);
            var type = docs.type;
            if(type == 0){
                res.render('manager/category/editPage',{
                    title: 'Edit Category : Keeb',
                    "category": docs,
                    type: 0
                })
            }else if(type == 1){
                res.render('manager/category/editPage',{
                    title: 'Edit Category : Keyset',
                    "category": docs,
                    type: 1
                })
            }else{
                res.render('manager/category/editPage',{
                    title: 'Edit Category : ETC',
                    "category": docs,
                    type: 2
                })

            }
            
               
        })
            // function(err, docs){
            // console.log(docs);
        // })
    }catch(err){
        res.status(400).send(err);
    }
}

async function get(req, res){
    
    try{
        var check = await Category.findById(req.params.id).exec();
        res.send(check).status(200);
    }catch(err){
        res.send(err).status(404)
    }
}

async function getcid(req, res){
    console.log("req.prams category "+ req.params.id)
    try{
        // var check = await Category.findOne({category_id: req.params.id}).exec();
        var checkCat = await Category.findOne({category_url_name:'og-1800-keycap'}).exec();
        var check = await Category.findOne({category_url_name: (req.params.id).toString()}).exec();
        console.log("this is category")
        console.log(checkCat)
        console.log(check);
        // res.send(check).status(200);
        res.send(checkCat).status(200);
    }catch(err){
        res.send(err).status(404)
    }
}

async function editPost(req, res){
    console.log(req.body);
    console.log(req.params.id)
    // console.log(req.file);
    try {
        var check = await Category.findById(req.params
            .id).exec();

            // console.log(check);
            var type = check.type;

            console.log("type = " + type);
            var cat_url_name = (req.body.catname).replace(/ /g, '-')
            var lowerCat_url = cat_url_name.toLowerCase();
            console.log(cat_url_name)
            // for keeb
            if(type == 0){
                if(req.file == null){
                    check.set({
                        category_url_name:   lowerCat_url,  
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        k_color: req.body.k_color,
                        flip: req.body.flip,
                        k_layout:  req.body.k_layout,
                        k_degree: req.body.k_degree,
                        k_mounting: req.body.k_mounting,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs
                    });
                }else{
                    check.set({
                        category_url_name:   lowerCat_url,
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        k_color: req.body.k_color,
                        flip: req.body.flip,
                        k_layout:  req.body.k_layout,
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
                            size: req.file.size
                        }
                    });

                }
                

                var result = await check.save();
                // res.status(200).send(result)
                return res.redirect('/api/category');

            }else if(type == 1){// for keyset
                if(req.file == null){
                    check.set({
                        category_url_name:   lowerCat_url,
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        c_code_color: req.body.code_color,
                        c_profile:  req.body.profile,
                        c_material: req.body.c_material,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs
                    });
                }else{
                    check.set({
                        category_url_name:   lowerCat_url,
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        c_code_color: req.body.code_color,
                        c_profile:  req.body.profile,
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
                            size: req.file.size
                        }
                    });
                }
                

                var result = await check.save();
                // res.status(200).send(result)
                return res.redirect('/api/category');

            }else if(type == 2){
                if(req.file == null){
                    check.set({
                        category_url_name:   lowerCat_url,
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
                        specs: req.body.specs
                    });
                }else{
                    check.set({
                        category_url_name:   lowerCat_url,
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
                            size: req.file.size
                        }
                    });
                }
                

                var result = await check.save();
                // res.status(200).send(result)
                return res.redirect('/api/category');

            }
       


    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
};
// product have been deleted when deleting category
async function Delete(req, res){
    console.log(req.params.id)
    try {
        // var deleteCategory = await Category.deleteOne({ _id: req.params.id }).exec();
        var checkCategory = await Category.findById(req.params.id).exec();
        console.log(checkCategory)
        console.log(checkCategory.category_id)
        var checkProduct = await Product.find({ category_id: checkCategory.category_id }).exec();
        console.log(checkProduct)


        var deleteCategory = await Category.deleteOne({ _id: req.params.id }).exec();
        var deleteProduct = await Product.deleteMany({ category_id: checkCategory.category_id }).exec();

        res.send({ deleteCategory, deleteProduct });
        // res.write(deleteCategory);
        // res.write(deleteProduct);

    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {category, mounting, addGet, addPost, editGet, get, getcid, editPost, Delete};