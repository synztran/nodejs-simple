var mongoose = require('mongoose');
const utils = require('./../comon/utils'); 
const config = require('./../comon/config');
var Account = require('./../../db/model/account');
var Product  = require('./../../db/model/product');
const CountMiddleware = async (req, res, next) => {
    // Lấy thông tin mã token được đính kèm trong request
    console.log(req.body)
    const body = req.body;
    var uemail = req.decoded['email']
    console.log(uemail)
    // decode token
    if (body) {
      // Xác thực mã token và kiểm tra thời gian hết hạn của mã
      try {
        // const decoded = await utils.verifyJwtToken(token, config.secret);
        var account = await Account.findOne({email: uemail}).exec();
        var checkProduct = await Product.find({product_id: req.body.product_id}).exec();
        var totalPrice = 0;
        console.log(checkProduct.length);
        for(var key in req.body.quantity){
            console.log("i = " + key);
            // console.log(checkProduct);
            console.log(checkProduct[key].product_name);
            console.log(req.body.quantity[key]);
            console.log(checkProduct[key].price)
            totalPrice += (req.body.quantity[key] * checkProduct[key].price);
                    console.log(totalPrice)
                    return totalPrice
        }
        console.log(totalPrice)
        // Lưu thông tin giãi mã được vào đối tượng req, dùng cho các xử lý ở sau
        req.totalPrice = totalPrice;
        next();
      } catch (err) {
        // Giải mã gặp lỗi: Không đúng, hết hạn...
        console.error(err.message);
        // return res.status(401).json({
        //   message: 'Unauthorized access.',
        // });
        // return res.redirect('/');
      }
    } else {
      // Không tìm thấy token trong request
    //  return  res.status(403).send({
    //     message: 'No token provided.',
    //   });
        return res.redirect('/shop');
      


    }
}
module.exports = CountMiddleware;