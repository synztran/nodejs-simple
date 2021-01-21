var mongoose = require('mongoose');
var db = mongoose.connection;

var AdsProduct = require('./../../db/model/adsproduct');

// Get list Ads Product
async function adsproduct(req, res){
    AdsProduct.find({}, function(err, docs) {
        res.render('manager/ads_product/listPage', {
            "listAdsProduct": docs
        });
    });
}
async function addGet(req, res){
    res.render('manager/ads_product/addPage', {
        title: "Ads Product - Add New"
    })
}

async function addPost(req, res){
    try{
        db.collection('adsproducts').insertOne({
            product_name: req.body.adsproduct_name,
            author_name: req.body.adsproduct_author,
            status: req.body.adsproduct_status,
            specs: req.body.adsproduct_specs,
            pic_product: {
                path: req.file.path,
                size: req.file.size
            },
            date_add: new Date()
            
        })

        setTimeout(function(){
            res.redirect('/api/adsproduct');
        }, 1500)

    }catch(err){
        res.status(500).send(err)
    }
}

async function editGet(req, res){
    AdsProduct.findById(req.params.id,function(err, docs){
        res.render('manager/ads_product/editPage', {
            title: "Ads Product - Edit #" + req.params.id,
            'data': docs
        })
    })
}

async function editPost(req, res){
    console.log(req.body)
    try{
        var checkAdsProduct = await AdsProduct.findById(req.params
            .id).exec();
        if(req.file){
            checkAdsProduct.set({
                product_name: req.body.adsproduct_name,
                author_name: req.body.adsproduct_author,
                specs: req.body.adsproduct_specs,
                status: req.body.adsproduct_status,
                pic_product:{
                    path: req.file.path,
                    size: req.file.size,
                }
            })
        }else{
            checkAdsProduct.set({
                product_name: req.body.adsproduct_name,
                author_name: req.body.adsproduct_author,
                status: req.body.adsproduct_status,
                specs: req.body.adsproduct_specs,

            })
        }
        
        var result = await checkAdsProduct.save();
        return res.redirect('/api/adsproduct/');
    }catch(err){
        res.status(500).send(err)
    }
}

async function get(req, res){
    
    try{
        var checkAdsProduct = await AdsProduct.findById(req.params.id).exec();
        res.send(checkAdsProduct).status(200);
    }catch(err){
        res.send(err).status(404)
    }
}

async function Delete(req, res){
    console.log(req.params.id)
    try {
        var checkAdsProduct = await AdsProduct.findById(req.params.id).exec();
        console.log(checkAdsProduct)

        // if(checkAdsProduct)

        var deleteAdspProduct = await AdsProduct.deleteOne({ _id: req.params.id }).exec();
        res.send({ deleteAdspProduct });
       

    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {adsproduct, addGet, addPost, editGet, editPost, get, Delete};
