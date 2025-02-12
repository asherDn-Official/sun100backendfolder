require("dotenv").config();

var db = require("../config/db.js");

const makeUniqueID = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function getUserListDao() {
  var queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("users")
      .select([
        "firstName",
        "lastName",
        "email",
        "email_verified",
        "uid",
        "passwordReset_enabled",
        "profileImage",
        "referalCode",
        "enableTwoFactor",
        "is_Suspended",
        "is_Baned",
        "suspend_Till",
        "signature",
        "metaMaskWallet",
      ])
     // .where({ userType: 3 })
      .then(async (result) => {
        for (let ind = 0; ind < result.length; ind++) {
         console.log(result[ind].uid,"UID")
          let insertQuery = [{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "LTC",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          },{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "DASH",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          },{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "ETC",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          },{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "XRP",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          },{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "ZEC",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          },{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "BNB",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          },{
            walletId: makeUniqueID(20, null),
            uid: result[ind].uid,
            type: "COIN",
            typeId: "TRX",
            balance: 0,
            active: 1,
            walletAddress: "",
            accountId: "",
          }];
          inserNewWalletForUserDao(insertQuery);
        }
        resolve("1")
      })
      .catch((error) => {
       console.log(error,"ERR")
      });
  });
}

function inserNewWalletForUserDao(data) {
  var queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_wallet")
      .insert(data)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error, "ERROR");
      });
  });
}

async function run(){
    let result = await getUserListDao()
    console.log(result)
}

run()