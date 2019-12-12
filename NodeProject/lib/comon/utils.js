const jwt = require('jsonwebtoken');
module.exports = {
  verifyJwtToken: (token, secretKey) => {
    // console.log(token);console.log(secretKey);
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  },
}
