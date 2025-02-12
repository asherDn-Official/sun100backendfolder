const db = require("../config/db");

// Fetch pool details by ID
exports.getPoolById = async (poolId) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("staking_pools")
      .where("spId", poolId)
      .then((result) => {
        if (result.length) {
          queryResponse.error = false;
          queryResponse.result = result[0];
        } else {
          queryResponse.error = true;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-1");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

// Create a new stake
exports.createStake = async (data) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_stakes_details")
      .insert(data)
      .then((result) => {
        console.log(result);
        if (result.length) {
          queryResponse.error = false;
          queryResponse.result = result[0];
        } else {
          queryResponse.error = true;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-2");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

// Get stakes for a user
exports.getUserStakes = async (userId,limit,offset) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db.raw(`select user_stakes_details.*,staking_pools.baseCoin,staking_pools.quoteCoin,staking_pools.baseCoinImg,staking_pools.quoteCoinImg,staking_pools.pool_name,staking_pools.apr,staking_pools.monthlyReturnsInPcnt,staking_pools.dailyReturnsInPcnt,staking_pools.lock_period_days,sum(user_reward_details.reward_amount) as reward_amount from user_stakes_details join staking_pools on staking_pools.spId = user_stakes_details.pool_id left join user_reward_details on user_reward_details.stakeId = user_stakes_details.id where user_stakes_details.userId='${userId}' group by user_stakes_details.id order by user_stakes_details.id desc limit ${limit} offset ${offset};`)
      .then((result) => {
        if (result.length) {
          queryResponse.error = false;
          queryResponse.result = result[0];
        } else {
          queryResponse.error = true;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-3");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

// Get all available pools
exports.getPools = async (uid) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    //db("staking_pools")
    db.raw(`select staking_pools.*,sum(user_stakes_details.amount) as totalAmount from staking_pools left join user_stakes_details on user_stakes_details.pool_id = staking_pools.spId and user_stakes_details.userId="${uid}" group by user_stakes_details.pool_id,staking_pools.spId`)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0];
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.updateUserWallet = async (userId, amount, coin, addOrMinus) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_wallet")
      .update({ balance: db.raw(`?? ${addOrMinus} ` + amount, ["balance"]) })
      .where({ uid: userId, typeId: coin })
      .then((result) => {
        if (result != 0) {
          queryResponse.error = false;
          queryResponse.result = result;
        } else {
          queryResponse.error = true;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.checkUserWallet = async (userId, amount, coin) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_wallet")
      .where({ uid: userId, typeId: coin })
      .then((result) => {
        if (result.length == 0 || result[0].balance < amount) {
          queryResponse.error = true;
          queryResponse.message = "Insufficient balance";
        } else {
          queryResponse.error = false;
          queryResponse.result = result;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getStakeCount = async (condition) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_stakes_details")
      .where(condition)
      .count("id as count")
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0].count;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getRewardTotal = async (condition) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_details")
      .where(condition)
      .sum("urdId as total")
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0].total;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getRewardList = async (userId,limit,offset) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_details")
      .where("userId",userId)
      .limit(limit)
      .offset(offset)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getReferredUser = async (userId) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_referred_by")
      .where("uid",userId)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.createRewardLog = async (data) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_details")
      .insert(data)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getTotalStakedAmount = async (condition) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_stakes_details")
      .where(condition)
      .sum("amount as amount")
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0].amount;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getRewardBalance = async (condition) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_wallet")
      .where(condition)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0];
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
}

exports.getRewardCalculation = async (uid) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db.raw(`select sum((amount * (apr/100))/365) as dailyReward, coins.current_price,coins.coin,coins.coinLogo from user_stakes_details join staking_pools on staking_pools.spId = user_stakes_details.pool_id join coins on coins.coin = staking_pools.baseCoin where userId = "${uid}";`)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0];
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
}

exports.updateUserRewardWallet = async (userId, amount, addOrMinus) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_wallet")
      .update({ balance: db.raw(`?? ${addOrMinus} ` + amount, ["balance"]) })
      .where({ uid: userId })
      .then((result) => {
        if (result != 0) {
          queryResponse.error = false;
          queryResponse.result = result;
        } else {
          queryResponse.error = true;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getCurrentCoinPrice = async (coin)=>{
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("coins")
      .where({"coin":coin})
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0];
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
}

exports.createRewardRedeemLog = async (data)=>{
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_redeem_details")
      .insert(data)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result[0];
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
}

// Get stakes for all user
exports.getUserFullStakes = async (limit,offset) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db.raw(`select users.firstName,users.email,users.phoneNumber,users.created_At,user_stakes_details.*,staking_pools.*,sum(user_reward_details.reward_amount) as reward_amount from user_stakes_details join users on users.uid = user_stakes_details.userId join staking_pools on staking_pools.spId = user_stakes_details.pool_id left join user_reward_details on user_reward_details.stakeId = user_stakes_details.id group by user_stakes_details.id order by user_stakes_details.id desc limit ${limit} offset ${offset};`)
      .then((result) => {
        if (result.length) {
          queryResponse.error = false;
          queryResponse.result = result[0];
        } else {
          queryResponse.error = true;
        }
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-3");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};

exports.getFullRewards = async (limit,offset) => {
  let queryResponse = {};
  return new Promise(function (resolve, reject) {
    db("user_reward_details")
      .select("user_reward_details.*","users.firstName","users.email","users.phoneNumber","users.created_At")
      .join("users","user_reward_details.userId","users.uid")
      .limit(limit)
      .offset(offset)
      .then((result) => {
        queryResponse.error = false;
        queryResponse.result = result;
        resolve(queryResponse);
      })
      .catch((error) => {
        console.log(error, "S-DAO-ERROR-4");
        queryResponse.error = true;
        resolve(queryResponse);
      });
  });
};