const stakingDao = require('../dao/stakingDao');

exports.createStake = async (data,auth) => {
  const pool = await stakingDao.getPoolById(data.poolId);
  if (pool.error) {
    throw new Error('Invalid pool ID');
  }

  const lockedUntil = new Date();
  lockedUntil.setDate(lockedUntil.getDate() + pool.result.lock_period_days);

  /** UPDATE WALLET */
  let checkWallet = await stakingDao.checkUserWallet(auth.uid,data.amount,pool.result.baseCoin)
  if(checkWallet.error){
   throw new Error(checkWallet.message || "Unable to validate balance")
  }

  let wallet = await stakingDao.updateUserWallet(auth.uid,data.amount,pool.result.baseCoin,'-')
  if(wallet.error){
    throw new Error('Unable to process the stake amount')
  }
  let stakeData = {
    'userId' : auth.uid,
    'pool_id' : data.poolId,
    'amount' : data.amount,
    'locked_until' : lockedUntil.toISOString().slice(0, 19).replace('T', ' '),
    'status' : 'active'
  }

  const stake = await stakingDao.createStake(stakeData);
  if(stake.error){
    wallet = await stakingDao.updateUserWallet(auth.uid,data.amount,pool.result.baseCoin,'+')
    throw new Error('Unable to process the stake')
  }else{
    /** CREDIT AMOUNT TO REFERRED PERSON */
    const referredUser = await stakingDao.getReferredUser(auth.uid)
    if(!referredUser.error && referredUser.length > 0)
    {
      let referralBonusAmount = (data.amount * (10/100))
      let rewardEntry = {
        userId : referredUser[0].refferedBy_uid,
        stakeId : stake.result,
        type : "referral_reward",
        reward_amount : referralBonusAmount,
        walletId : "",
        status : "credited"
      } 
      const entry = stakingDao.createRewardLog(rewardEntry)
      wallet = await stakingDao.updateUserWallet(referredUser[0].refferedBy_uid,referralBonusAmount,pool.result.baseCoin,'+')
    }
  }
  return stake;
};

exports.getUserStakes = async (userId,body) => {
  const limit = body.limit ? parseInt(body.limit) : 10;
  const offset = body.pageNo ? (limit * (parseInt(body.pageNo)-1)) : 0;
  const stakeList = await stakingDao.getUserStakes(userId, limit, offset);
  const rewardList =await stakingDao.getRewardList(userId,10,0)
  return {error: false, stakeList : stakeList.error ? [] : stakeList.result, rewardList : rewardList.error ? [] : rewardList.result };
};

exports.getPools = async (uid) => {
  return stakingDao.getPools(uid);
};

exports.getDashboard = async (auth) =>{
    let result = {total : 0, active :0, reward : 0, totalAmount : 0}
    let condition = { userId : auth.uid }
    let count = await stakingDao.getStakeCount(condition)
    if(!count.error){
        result.total = count.result
    }
    condition = { userId : auth.uid, status : "active" }
    count = await stakingDao.getStakeCount(condition)
    if(!count.error){
        result.active = count.result
    }
    condition = { userId : auth.uid, type : "stake_reward" }
    count = await stakingDao.getRewardTotal(condition)
    if(!count.error){
        result.reward = count.result
    }
    condition = { userId : auth.uid }
    let totalAmount =await stakingDao.getTotalStakedAmount(condition)
    if(totalAmount){
       result.totalAmount = totalAmount.result ? totalAmount.result : 0
    }
    return result
};

exports.rewardAnalytics = async (auth) =>{
   let result = { balance : 0, daily: 0, estimatedValue : 0, coinPrice: 0}
   let condition = { uid : auth.uid }
    let amount = await stakingDao.getRewardBalance(condition)
    if(!amount.error && amount.result){
        result.balance = amount.result.balance
    }
    let reward = await stakingDao.getRewardCalculation(auth.uid)
    if(!reward.error && reward.result.length){
        result.daily = reward.result[0].dailyReward
        result.estimatedValue = result.daily * reward.result[0].current_price
        result.coinPrice = reward.result[0].current_price
        result.coin = reward.result[0].coin
        result.baseCoinImg = reward.result[0].coinLogo
    }
    return {error:false, result : result}
}

exports.getRewardWallet = async (uid) => {
  const wallet = await stakingDao.getRewardBalance({"uid" : uid})
  return wallet;
};

exports.redeemRewardAmount = async (uid,amount) => {
  let coinPrice = await stakingDao.getCurrentCoinPrice("SUN100")
  if(coinPrice.error || !coinPrice.result){
    return null
  }
  coinPrice = coinPrice.result.current_price
  const rewardWallet = await stakingDao.updateUserRewardWallet(uid,amount,'-')
  if(rewardWallet.error){
    console.log(rewardWallet)
    return null
  }
  const spotWallet = await stakingDao.updateUserWallet(uid,(amount * coinPrice),"USDT",'+')
  if(spotWallet.error){
    console.log(spotWallet)
    return null
  }
  return [rewardWallet,spotWallet,coinPrice];
};

exports.createRewardRedeemLog = async (data) => {
  const wallet = await stakingDao.createRewardRedeemLog(data)
  return wallet;
};

exports.getFullStakes = async (body) => {
  const limit = body.limit ? parseInt(body.limit) : 10;
  const offset = body.pageNo ? (limit * (parseInt(body.pageNo)-1)) : 0;
  const stakeList = await stakingDao.getUserFullStakes(limit, offset);
  return {error: false, stakeList : stakeList.error ? [] : stakeList.result};
};

exports.getFullRewards = async (body) => {
  const limit = body.limit ? parseInt(body.limit) : 10;
  const offset = body.pageNo ? (limit * (parseInt(body.pageNo)-1)) : 0;
  const rewardList = await stakingDao.getFullRewards(limit, offset);
  return {error: false, rewardList : rewardList.error ? [] : rewardList.result};
};