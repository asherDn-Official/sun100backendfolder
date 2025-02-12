const express = require("express");
const stakingController = require("../controllers/stakingController");

module.exports = (auth,admin_auth) => {
  const router = express.Router();

  //USER Routes
  router.post("/stake", auth, stakingController.createStake);
  router.get("/stakes", auth, stakingController.getUserStakes);
  router.get("/pools", auth, stakingController.getPools);
  router.get("/reward/analytics", auth, stakingController.getRewardAnalytics);
  router.post("/reward/redeem", auth, stakingController.redeemRewards);

  //ADMIN Routes
  const base = "/admin"
  router.get(base+"/stakes",admin_auth, stakingController.getFullStakes);
  router.get(base+"/rewards",admin_auth, stakingController.getFullRewards);
  
  return router;
};
