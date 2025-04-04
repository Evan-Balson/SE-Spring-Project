const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app/app'); // Assuming app.js is the entry point of your application
const { expect } = chai;

chai.use(chaiHttp);

const server = http.createServer(app); // Wrap the app in an HTTP server

describe('UserLoginController', function () {
  this.timeout(15000); // Set a timeout of 15 seconds for all tests in this suite

  before((done) => {
    server.listen(3000, () => {
      console.log('Server is running at http://127.0.0.1:3000/');
      setTimeout(done, 1000); // Wait 1 second to ensure the server is ready
    });
  });

  after((done) => {
    server.close(() => {
      console.log('Server closed');
      done();
    });
  });

  it('should return an error for invalid login credentials', function (done) {
    this.timeout(10000); // Set a timeout of 10 seconds for this test
    chai
      .request(server)
      .post('/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        if (err) return done(err);
        console.log('Response:', res.text); // Debug the response
        expect(res).to.have.status(200);
        expect(res.text).to.include('Invalid email or password');
        done();
      });
  });

  it('should redirect to home page for valid login credentials', function (done) {
    this.timeout(10000); // Set a timeout of 10 seconds for this test
    chai
      .request(server)
      .post('/login')
      .send({ email: 'liam.brown@sky.com', password: 'password123' }) // Replace with valid test credentials
      .end((err, res) => {
        if (err) return done(err);
        console.log('Response:', res.redirects); // Debug the response
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.include('/');
        done();
      });
  });
});
