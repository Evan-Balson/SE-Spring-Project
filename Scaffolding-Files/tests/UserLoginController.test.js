const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app/app'); // Assuming app.js is the entry point of your application
const { expect } = chai;

chai.use(chaiHttp);

const server = http.createServer(app); // Wrap the app in an HTTP server

describe('UserLoginController', () => {
  it('should return an error for invalid login credentials', (done) => {
    chai
      .request(server) // Use the server instance
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
      .request(server) // Use the server instance
      .post('/login')
      .send({ email: 'liam.brown@sky.com', password: 'password123' }) // Replace with valid test credentials
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.include('/');
        done();
      });
  });
});
