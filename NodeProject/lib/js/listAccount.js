const http = require('http'),
mongoClient = require('mongodb').MongoClient;

http.createServer(function (req,res) {

    mongoClient.connect('mongodb://127.0.0.1:27017/nodedb', function(err, db) {
        if (err) throw err;
        var products = db.collection('products');
        products.find({}).toArray(function (err,results) {
            if (err) throw err;
            data = '<table border="1" style="border-collapse:collapse" cellspacing="5" cellpadding="15">';
            data += '<tr><th>Name</th><th>Price</th><th>Category</th></tr>';
            results.forEach(function (row) {
                data += '<tr>';
                data += '<td>' + row.name + '</td>';
                data += '<td>' + row.price + '</td>';
                data += '<td>' + row.category + '</td>';
                data += '</tr>';
            });
            data += '</table>';
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        })
        db.close();
    });

}).listen(8000);