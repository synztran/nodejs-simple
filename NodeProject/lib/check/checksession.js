var mongoose = require('mongoose');
const utils = require('./../comon/utils'); 
const config = require('./../comon/config');
const session = require('express-session');
const SessionCheckMiddleware = async (req, res, next) => {
    // Lấy thông tin mã token được đính kèm trong request
    const session = req.session.User;
    // decode token
    if (session) {
      // Xác thực mã token và kiểm tra thời gian hết hạn của mã
      try {
        // Lưu thông tin giãi mã được vào đối tượng req, dùng cho các xử lý ở sau
        next();
      } catch (err) {
        // Giải mã gặp lỗi: Không đúng, hết hạn...
        console.error(err.message);
        // return res.status(401).json({
        //   message: 'Unauthorized access.',
        // });
        return res.redirect('/');
      }
    } else {
      // Không tìm thấy token trong request
    //  return  res.status(403).send({
    //     message: 'No token provided.',
    //   });
        return res.redirect('/');
      


    }
}
module.exports = SessionCheckMiddleware;