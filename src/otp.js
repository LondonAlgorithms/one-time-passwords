const tokenLength = 10;

function HOTP(secret) {
  this.secret = secret;
}

HOTP.prototype.generate = function (counter) {
  return hmacSHA1(this.secret, counter).slice(-tokenLength);
};

HOTP.prototype.validate = function (token, counter, float = 50) {
  for (let i = counter; i < counter + float; i++) {
    if (this.generate(i) === token) {
      return true;
    }
  }

  return false;
};


function TOTP(secret) {
  this.hotp = new HOTP(secret);
}

TOTP.prototype.generate = function () {
  return this.hotp.generate(now());
};

TOTP.prototype.validate = function (token, float = 180) {
  const counter = now();

  for (let i = counter; i > counter - float; i--) {
    if (this.hotp.generate(i) === token) {
      return true;
    }
  }

  return false;
};


function now() {
  return Math.floor(Date.now() / 1000);
}



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