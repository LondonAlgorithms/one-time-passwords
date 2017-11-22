const secret = '3d52fa1e8569fc472374745b5a183a64c1a75d747e';

describe('HOTP', () => {
  it('should be initiable', () => {
    const hotp = new HOTP(secret);

    expect(hotp).to.be.an(HOTP);
  });

  it('should generate tokens', () => {
    const hotp = new HOTP(secret);

    expect(hotp.generate(0)).to.equal('91e224439e');
    expect(hotp.generate(1511373851)).to.equal('91e224439e');
    expect(hotp.generate(50)).to.equal('df9c7b0dec');
    expect(hotp.generate(1000)).to.equal('e9fcab7662');
  });

  it('should generate different tokens with a different secret', () => {
    const localSecret = '4d6bef7f4560ec4d6bef7f4560ec';

    const hotp = new HOTP(localSecret);

    expect(hotp.generate(50)).to.equal('47742a572d');
  });

  it('should validate tokens', () => {
    const hotp = new HOTP(secret);

    expect(hotp.validate('df9c7b0dec', 50)).to.equal(true); // from counter = 50
    expect(hotp.validate('b5953f2197', 50)).to.equal(true); // from counter = 51
    expect(hotp.validate('e9fcab7662', 50)).to.equal(false); // from counter = 1000
    expect(hotp.validate('e9fcab7662', 990)).to.equal(true); // from counter = 1000
  });

  it('should have a configurable float', () => {
    const hotp = new HOTP(secret);

    expect(hotp.validate('df9c7b0dec', 50, 1)).to.equal(true); // from counter = 50
    expect(hotp.validate('b5953f2197', 50, 1)).to.equal(false); // from counter = 51
    expect(hotp.validate('e9fcab7662', 50, 1000)).to.equal(true); // from counter = 1000
    expect(hotp.validate('e9fcab7662', 990, 9)).to.equal(false); // from counter = 1000
  });

  it('should work with a complete random secret', () => {
    const secret = (Math.random() * 1e17).toString(16) + (Math.random() * 1e17).toString(16);

    const hotp = new HOTP(secret);

    const token = hotp.generate(50);

    expect(hotp.validate(token, 50)).to.equal(true);
    expect(hotp.validate(token, 40)).to.equal(true);
    expect(hotp.validate(token, 60)).to.equal(false);
  });
});

describe('TOTP', () => {
  it('should be initiable', () => {
    const totp = new TOTP(secret);

    expect(totp).to.be.an(TOTP);
  });

  it('should generate tokens', () => {
    const totp = new TOTP(secret);

    expect(totp.generate().length).to.equal(10);
  });

  it('should validate tokens', () => {
    const totp = new TOTP(secret);

    const token = totp.generate();

    expect(totp.validate(token)).to.equal(true);
  });

  it('should validate old tokens', (done) => {
    const totp = new TOTP(secret);

    const token = totp.generate();

    setTimeout(() => {
      expect(totp.validate(token)).to.equal(true);
      done();
    }, 1050);
  });

  it('should not validate tokens that are too old', (done) => {
    const totp = new TOTP(secret);

    const token = totp.generate();

    // The token is only valid for one second, but we've paused for two seconds
    setTimeout(() => {
      expect(totp.validate(token, 1)).to.equal(false);
      done();
    }, 2050);
  }).timeout(5000);
});