

const crypto = require('crypto');
module.exports = {
  generateSalt: () => {
      //128 числа в диапазон 0-255 и ги превръща в 64-битови
      let salt = crypto.randomBytes(128).toString('base64');
      return salt;
  },
  hashPassword: (password, salt) => {
      //дай ми криптиращ алгоритам "sha256" като първо хешира солта след нея паролата и да стане в 16-бит
      let passwordHash = crypto.createHmac('sha256', salt).update(password).digest('hex');
      return passwordHash;
  }
};



