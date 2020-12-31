var https   = require("https");
var fs      = require("fs");
var moment = require("moment");

function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname  : "invoice-generator.com",
        port      : 443,
        path      : "/",
        method    : "POST",
        headers   : {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    var file = fs.createWriteStream('invoice/'+filename);

    var req = https.request(options, function(res) {
        res.on('data', function(chunk) {
            file.write(chunk);
        })
        .on('end', function() {
            file.end();

            if (typeof success === 'function') {
                success();
            }
        });
    });
    req.write(postData);
    req.end();

    if (typeof error === 'function') {
        req.on('error', error);
    }
}

var invoice = {
    // logo: "http://invoiced.com/img/logo-invoice.png",
    // logo: "logo.png",
    logo: "https://drive.google.com/uc?export=view&id=1jtFwxaDyazQeytgNhsfqsXhGTFS5s-wG",
    from: "Invoiced\nNoobStore\nalley 4, 10 st, Hiep Binh Chanh ward, Thu Duc district\nHo Chi Minh, Vietnam 700000",
    to: "Khiem Le",
    currency: "vnd",
    number: "INV-0024",
    payment_terms: "Auto-Billed - Do Not Pay",
    // date : (new Date(Date.now()).toLocaleDateString()),
    // due_date: (new Date()).toLocaleDateString(),
    due_date: moment().add(1, 'M').format('MMM DD, YYYY'),
    items: [
        {
            name: "Assembled Service - PCB Canoe Gen 2",
            quantity: 1,
            unit_cost: 200000,
            description: "- Soldered Mill-max hotswap"
        },
        // {
        //     name: "Assembled Service - UTD 360C",
        //     quantity: 1,
        //     unit_cost: 400000,
        //     description: "- Soldered Switches (220) \n - Handle Stabilizer (180) \n - Soldered Cable"
        // },
        {
            name: "Lube Service - Mauve switches x70",
            quantity: 1,
            unit_cost: 570000,
            description: "- Housing/Stem w/ Ghv4 (420) \n - Film clear(white/pink) TX (150) \n - Spring w/ GPL 105"
        }
    ],
    fields: {
        tax: "%",
        discounts: true,
        shipping: true,
    },
    discounts: 0,
    shipping:0,
    tax: 0,
    amount_paid: 0,
    notes: "Thanks for being an awesome customer!",
    terms: "No need to submit payment. You will be auto-billed for this invoice."
};

console.log(invoice.number);

generateInvoice(invoice, invoice.number+'.pdf', function() {
    console.log("Saved invoice to invoice.pdf");
}, function(error) {
    console.error(error);
});
