const axios = require("axios");
const mongoose = require("mongoose");

/**
 * @typedef UserAuthError
 * @property {string} reason    - User-friendly reason message
 */

const AuthorizeJWT = (req, res, next) => {
  const token = req.body.userToken || req.query.userToken;
  console.log("Authorization processing");
  axios
    .get(`${process.env.USERS_MS}/auth/${token}`)
    .then((response) => {
      const userId = mongoose.Types.ObjectId(response.data.account_id);
      const isCustomer = response.data.isCustomer;
      console.log(req.body);
      if (isCustomer)
        // throw {response:{status: 403}}
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