var mongoose = require('mongoose');
const utils = require('./../comon/utils'); 
const config = require('./../comon/config');
var AdmAccount = require('./../../db/model/accadmin');
const TokenCheckMiddleware = async (req, res, next) => {
    // Lấy thông tin mã token được đính kèm trong request
    const token = req.cookies['x-token'];
    // decode token
    if (token) {
      // Xác thực mã token và kiểm tra thời gian hết hạn của mã
      try {
        const decoded = await utils.verifyJwtToken(token, config.secret);
        var checkAdmAccount = await AdmAccount.findOne({email: decoded.email}).exec();
        var checkActiveAdmAccount = await AdmAccount.findOne({ $and : [{email: decoded.email}, {active: true}] });
        if(!checkAdmAccount){
            // res.send('aloha').status(401)
           // return res.status(401).err('Unauthorized account')
            res.status(500).send({status:500, message: 'internal error', type:'internal'}); 
            // return res.redirect('/api/signin');
        }
        if(!checkActiveAdmAccount){
            return res.redirect('/api/signin');
        }
        // Lưu thông tin giãi mã được vào đối tượng req, dùng cho các xử lý ở sau
        req.decoded = decoded;
        next();
      } catch (err) {
        // Giải mã gặp lỗi: Không đúng, hết hạn...
        // return res.status(401).json({
        //   message: 'Unauthorized access.',
        // });
        return res.redirect('/api/signin');
      }
    } else {
      // Không tìm thấy token trong request
    //  return  res.status(403).send({
    //     message: 'No token provided.',
    //   });
        return res.redirect('/api/signin');
      


    }
}
module.exports = TokenCheckMiddleware;