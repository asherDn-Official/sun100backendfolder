var express = require("express");
var https = require("https");
var app = express();
var http = require("http").Server(app);
const bodyParser = require("body-parser");
var jwt = require("express-jwt");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/coins", express.static("coins"));
//app.use(bodyParser.raw({limit:'50mb',type: 'multipart/form-data'}))
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Orgin, X-Requested-With, Content-Type,Accept,Authorization"
  );
  next();
});

const m_db = require("./config/db.js");

/** Authorization */

async function validateLogin(uid, key) {
  return new Promise((resolve, reject) => {
    m_db("users")
      .where({ uid: uid, loginKey: key })
      .then((result) => {
        resolve(result.length ? true : false);
      })
      .catch((e) => {
        resolve(false);
      });
  });
}

async function auth(request, response, next) {
  var error = {};
  try {
    var auth = await this.getDataFromToken(
      request.headers.authorization,
      process.env.JWT_SECRET
    );
    if (auth.error) {
      error.error = true;
      error.msg = "Unauthorized";
      return response.send(error);
    } else {
      if (auth.data.admin) {
        request.params.auth = auth.data;
      } else {
        const validLogin = await validateLogin(
          auth.data.uid,
          auth.data.loginKey
        );
        if (validLogin) {
          request.params.auth = auth.data;
        } else {
          error.error = true;
          error.msg = "Unauthorized";
          return response.send(error);
        }
      }
    }
  } catch (e) {
    error.error = true;
    error.msg = "Unauthorized";
    return response.send(error);
  }
  next();
}

async function auth_admin(request, response, next) {
  var error = {};
  try {
    var auth = await this.getDataFromToken(
      request.headers.authorization,
      process.env.JWT_SECRET
    );
    if (auth.error) {
      error.error = true;
      error.msg = "Unauthorized";
      return response.send(error);
    } else {
      let authData = auth.data;
      if (authData.admin && authData.admin == true) {
        request.params.auth = authData;
      } else {
        error.error = true;
        error.msg = "Unauthorized";
        return response.send(error);
      }
    }
  } catch (e) {
    error.error = true;
    error.msg = "Unauthorized";
    return response.send(error);
  }
  next();
}

app.user_auth = auth;
app.admin_auth = auth_admin;
app.db = m_db;
require("./config/firebase.js");

/** ROUTES */

require("./routes/user.js")(app);
require("./routes/trade.js")(app);
require("./routes/admin.js")(app);
require("./routes/mobile.js")(app);
app.use("/staking", require("./routes/staking")(auth, auth_admin));
/** STARTING SERVER */

var server = http.listen(process.env.NODE_PORT, "0.0.0.0", () => {
  console.log("Server is running on port", server.address().port);
});
