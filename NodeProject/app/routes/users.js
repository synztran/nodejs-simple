// var {app, Account} = require("./index.js");

function showListAccount() {
    app.get("/people", async (req, res) => {
        try {
            var result = await Account.find().exec();
            res.send(result);
        } catch (err) {
            res.status(500).send(err);

        }
    });
};

module.exports = {showListAccount}

	