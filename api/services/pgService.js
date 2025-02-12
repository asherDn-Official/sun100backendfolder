const PayU = require("payu-websdk");

/*const payuClient = new PayU(
  {
    key: process.env.PG_KEY,
    salt: process.env.PG_SALT,
  },
  process.env.PG_ENVIRONMENT
);*/
module.exports.initiatePayment = async (user) => {
    console.log(user)
  return new Promise((resolve) => {
   const result = payuClient
      .paymentInitiate(user)
      resolve(result)
  });
};
