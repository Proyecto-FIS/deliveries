const axios = require("axios");
const mongoose = require("mongoose");
const createCircuitBreaker = require("../CircuitBreaker").createCircuitBreaker;

/**
 * @typedef UserAuthError
 * @property {string} reason    - User-friendly reason message
 */

const usersAuthService = createCircuitBreaker({
  name: "usersAuthService",
  errorThreshold: 20,
  timeout: 8000,
  healthRequests: 5,
  sleepTimeMS: 100,
  maxRequests: 0,
  errorHandler: (err) => false,
  request: (token) => axios.get(`${process.env.USERS_MS}/auth/${token}`),
  fallback: (err, args) => {
      if(err && err.isAxiosError) throw err;
      throw ({
          response: {
              status: 503
          }
      });
  }
});

const AuthorizeJWT = (req, res, next) => {
  const token = req.body.userToken || req.query.userToken;
  console.log("Authorization processing, token=" + token);

  usersAuthService.execute(token)
    .then((response) => {
      const userId = mongoose.Types.ObjectId(response.data.account_id);
      if (req.body.userToken) {
        req.body.userId = userId;
      } else {
        req.query.userId = userId;
      }
      next();
    })
    .catch((err) => {
      if (err.response.status === 500 || err.response.status === 401) {
        res.status(401).json({ reason: "Authentication failed" });
      } else {
        res.status(err.response.status).json({ reason: "Users service is down" });
      }
    });
};

module.exports = AuthorizeJWT;