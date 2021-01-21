var mongoose = require('mongoose');
var db = mongoose.connection;

var PageContent = require('./../../db/model/mainpage_content');

// Content Page

async function oldcontent(req, res){
    PageContent.find({}, function(err, docs){
            res.render('manager/content/listPage', {
                'listContent': docs,
                title: 'Content',
            })
        })
}

async function content(req, res){
    
    // if(admin){
        PageContent.find({}, function(err, docs){
            res.render('manager/content/new_listPage', {
                fname: req.decoded['fname'],
                lname: req.decoded['lname'],
                mail: req.decoded['mail'],
                'listContent': docs,
                title: 'Content',
                lang: req.cookies.lang
            })
        })
    // }else{
        // return res.redirect('/api/signin');
    // }
    
}
async function addGet(req, res){

    // if(admin){
        res.render('manager/content/new_addPage', {
            title: 'Content - Add New',
            lang: req.cookies.lang,
            fname: req.decoded['fname'],
            lname: req.decoded['lname'],
            mail: req.decoded['mail'],
        })
    // }else{
         // return res.redirect('/api/signin');
    // }
    
}
async function addPost(req, res){
    console.log(req.body)
    try{
        db.collection('mainpage_contents').insertOne({
            content_type: req.body.content_type,
            status: req.body.content_status,
            specs: req.body.content_specs,
            date_add: new Date()
        })
        setTimeout(function(){
            res.redirect('/api/content');
        }, 1500)

    }catch(err){
        res.status(500).send(err)
    }
}
async function editGet(req,res){
    try{
        PageContent.findById(req.params.id, function(err,docs){
            res.render('manager/content/editPage', {
                title: 'Content - Edit #' + req.params.id,
                'data': docs
            })
        })
    }catch(err){
        res.status(500).send(err)
    }
}
async function get(req, res){
    
    try{
        var checkContent = await PageContent.findById(req.params.id).exec();
        res.send(checkContent).status(200);
    }catch(err){
        res.send(err).status(404)
    }
}
async function editPost(req, res){
    console.log(req.body)
    try{
        var checkContent = await PageContent.findById(req.params
            .id).exec();
        checkContent.set({
            content_type: req.body.content_type,
            status: req.body.content_status,
            specs: req.body.content_specs,
        })
        
        var result = await checkContent.save();
        return res.redirect('/api/content/');
    }catch(err){
        res.status(500).send(err)
    }
}

module.exports = {oldcontent, content, addGet, addPost, editGet, get, editPost};