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
    // logo: "https://drive.google.com/uc?export=view&id=1jtFwxaDyazQeytgNhsfqsXhGTFS5s-wG",
    logo: "https://noobstore.xyz/favicon/big_logo.png",
    from: "NoobStore\nalley 4, 10 st, Hiep Binh Chanh ward, Thu Duc district\nHo Chi Minh, Vietnam 700000",
    to: "Kiên Lê",
    currency: "vnd",
    number: "INV-0036",
    payment_terms: "Auto-Billed - Do Not Pay",
    // date : (new Date(Date.now()).toLocaleDateString()),
    // due_date: (new Date()).toLocaleDateString(),
    due_date: moment().add(1, 'M').format('MMM DD, YYYY'),
    items: [
        // {
        //     name: "Buy - Stabilizer Pack",
        //     quantity: 1,
        //     unit_cost: 150000,
        //     description: ""
        // },
        {
            name: "Assembled Service - Filco MJ2 ",
            quantity: 1,
            unit_cost: 450000,
            description: "- De-Soldered (220) \n - Soldered (250)"
        },
        // {
        //     name: "Support Service - Asus Claymore",
        //     quantity: 1,
        //     unit_cost: 120000,
        //     description: "- Handle position 'X' and 'Left Shift' \n - Replace Switch"
        // },
        // {
        //     name: "Cable Service - 5.Coil with Connector 2",
        //     quantity: 1,
        //     unit_cost: 450000,
        //     description: "- Length: 35cm base + 17cm coiling \n - Jack Host: L \n - Jack Device: N/a \n - Colorway : Techflex Black \n - Connector: YC-8 \n - Position USB Hub: Middle \n - Type Connection: C - C"
        // },
        {
            name: "Clean Service - Cherry red switch x87",
            quantity: 1,
            unit_cost: 250000,
            description: "- Clean Housing + Stem w/ ultrasonic washing machine"
        },
        {
            name: "Lube Service - Cherry red switch x87",
            quantity: 1,
            unit_cost: 425000,
            description: "- Housing/Stem w/ Ghv4 (425) \n - Spring w/ GPL 105"
        }
    ],
    fields: {
        tax: "%",
        discounts: '%',
        shipping: true,
    },
    discounts: 10,
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
