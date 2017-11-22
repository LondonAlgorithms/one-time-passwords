function HOTP(secret) {
}

HOTP.prototype.generate = function (counter) {
};

HOTP.prototype.validate = function (token, counter, float = 50) {
};


function TOTP(secret) {
}

TOTP.prototype.generate = function () {
};

TOTP.prototype.validate = function (token, float = 180) {
};




/******************
 * UTIL FUNCTIONS *
 ******************/

function hmacSHA1(phrase, key) {
  const words = CryptoJS.HmacSHA1(phrase, key.toString()).words;
  return words.map((word) => {
    if (word < 0) {
      return (4294967296 + word).toString(16);
    } else {
      return word.toString(16);
    }
  }).join('');
}