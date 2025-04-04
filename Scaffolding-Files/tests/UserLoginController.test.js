const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app/app'); // Assuming app.js is the entry point of your application
const { expect } = chai;

chai.use(chaiHttp);

describe('UserLoginController', () => {
  it('should return an error for invalid login credentials', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('Invalid email or password');
        done();
      });
  });

  it('should redirect to home page for valid login credentials', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'valid@example.com', password: 'correctpassword' }) // Replace with valid test credentials
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.include('/');
        done();
      });
  });
});
