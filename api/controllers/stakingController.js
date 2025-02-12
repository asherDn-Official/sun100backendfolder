const stakingService = require('../services/stakingService');

exports.createStake = async (req, res) => {
  try {
    const stake = await stakingService.createStake(req.body,req.params.auth);
    res.status(200).json(stake);
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

exports.getUserStakes = async (req, res) => {
  const auth = req.params.auth;
  const body = req.query;
  try {
    const stakes = await stakingService.getUserStakes(auth.uid,body);
    res.status(200).json(stakes);
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

exports.getPools = async (req, res) => {
  try {
    let pools = await stakingService.getPools(req.params.auth.uid);
    let dashboard = await stakingService.getDashboard(req.params.auth);
    res.status(200).json(pools.error ? pools : ((pools.dashboard = dashboard) ? pools : pools));
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

exports.getRewardAnalytics = async (req, res) => {
  try {
    let analytics = await stakingService.rewardAnalytics(req.params.auth);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

exports.redeemRewards = async (req, res) => {
  try {
    const auth = req.params.auth
    const body = req.body
    if(!body.amount || parseFloat(body.amount) <= 0){
      res.status(200).json({ error : true, message: "amount is required"})
    }else{
      let walletValidation = await stakingService.getRewardWallet(auth.uid)
      console.log(walletValidation)
      if(walletValidation.error || !walletValidation.result || walletValidation.result.balance < parseFloat(body.amount))
      {
        res.status(200).json({ error : true, message: "User doesn't have sufficient balance to redeem the rewards"})
      }else{
         let rewardRedeemEntry = {
          userId : auth.uid,
          type : "redeem",
          reward_amount : body.amount,
          coin_price : 0,
          totalValue : 0
         }

         let result = await stakingService.redeemRewardAmount(auth.uid,body.amount)
         if(result){
          rewardRedeemEntry.coin_price = result[2]
          rewardRedeemEntry.totalValue = body.amount * result[2]
          rewardRedeemEntry.status = "success"
          stakingService.createRewardRedeemLog(rewardRedeemEntry)
          res.status(200).json({error: false, message: "Redeemed successfully"});
         }else{
          rewardRedeemEntry.status = "failed"
          stakingService.createRewardRedeemLog(rewardRedeemEntry)
          res.status(200).json({error: true, message: "Unable to redeem"});
         }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(200).json({ error: true, message: error.message });
  }
};

exports.getFullStakes = async (req, res) => {
  const body = req.query;
  try {
    const stakes = await stakingService.getFullStakes(body);
    res.status(200).json(stakes);
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

exports.getFullRewards = async (req, res) => {
  const body = req.query;
  try {
    const stakes = await stakingService.getFullRewards(body);
    res.status(200).json(stakes);
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
}
