const Crypto = require("crypto-js");
const basePath = process.env.VALUTODY_BASEURL
const EndPoints = require("../config/endpoints");
const fs = require("fs");
const axios = require("axios")

const secretKey = process.env.VALUTODY_APISECRET
const apiKey = process.env.VALUTODY_APIKEY
const passPhrase = process.env.VALUTODY_PASSPHRASE
const network = process.env.VALUTODY_ENVIRONMENT

const generateHeaders = (data,method,url,query)=>{
    const key = Crypto.enc.Base64.parse(secretKey)
    const timestamp = Math.floor(Date.now()/1000).toString()
    const message = timestamp + method + url + JSON.stringify(data) + JSON.stringify(query)
    const hmac = Crypto.HmacSHA256(message,key)
    const sign = Crypto.enc.Base64.stringify(hmac)
    const headers = {
        "x-api-sign" : sign,
        "x-api-key" : apiKey,
        "x-api-passphrase" : passPhrase,
        "x-api-timestamp" : timestamp
    }
    return headers
}

module.exports.generateWalletAddress = async (uid,coinCode,assetNetwork) =>{
   console.log(process.env.VALUTODY_VALUTID,coinCode,(assetNetwork ? assetNetwork : network),"CODE")
   const endpoint = EndPoints.valutodyEndpoint("gen-addr",[process.env.VALUTODY_VALUTID,coinCode,(assetNetwork ? assetNetwork : network)])
   let request = {type:"GENERATE_NEW_WALLET_ADDRESS",uid:uid,coinCode:coinCode}
   let context = `userid_`+uid+`_CB`
   const _data = {
    "context": context,
    "data": {
        "item": {
            "label": context+"_lbl"
        }
    }
 }
   const _headers = generateHeaders(_data,endpoint.method,endpoint.url,{})
   console.log(_headers)
    let response;
    try{
       console.log(endpoint.method,endpoint.url,"TEST")
       let result = await axios({
         method: endpoint.method,
         url: basePath + endpoint.url,
         data: _data,
         headers: _headers
       })
       //console.log(`${baseURL}/wallet-as-a-service/wallets/${walletId}/${coinCode}/${(asset_network ? asset_network : network)}/addresses?context=${context}`,"TEST")
       if(result.data){
        console.log(result.data)
         response = result.data
         return { error: false , data : result.data , req: request, resp: response}
       }else{
        console.log(result.response)
         response = result.response ? result.response.data : result
         return { error: true, req: request, resp: response }
       }
    }catch(e){
        console.log(e)
        response = e.response ? e.response.data : e
        return { error: true, req: request, resp: response }
    }
}

module.exports.saveLog = (req,resp,type) =>{
    try{
    let fileName;
    switch(type){
      case 'ADDR':
        fileName = "_new_addr_CryptoApiLogs.txt";
        break;
      case 'CB':
        fileName = "_new_cb_CryptoApiLogs.txt";
        break;
      case 'WITHDRAW':
        fileName = "_withdraw_transactionLogs.txt";
        break;
      default:
        fileName = "_CryptoApiLogs.txt";
        break;
    }
    let filePath = __dirname + "/../logs/";
    let fileData = {
        request : req,
        response: resp
    }
      fileData.logDate = new Date().toISOString();
      fs.appendFileSync(
        filePath +(new Date().toISOString().split("T")[0])+"_"+fileName,
        JSON.stringify(fileData) + "\n\n"
      );
    }catch(e){
        console.log(e,"WENT WRONT WHILE SAVING CRYPTOAPI LOG")
    }
  }

  module.exports.createTokenTransaction = async (payout,stationAddress,contractAddress) =>{
    //console.log(process.env.VALUTODY_VALUTID,coinCode,(assetNetwork ? assetNetwork : network),"CODE")
    const endpoint = EndPoints.valutodyEndpoint("token-transaction",[process.env.VALUTODY_VALUTID,payout.network,(assetNetwork ? assetNetwork : network),stationAddress])
    let request = {type:"INITIATE_TOKEN_TRANSACTION",uid:payout.uid,coin:payout.coin}
    let context = `userid_`+uid+`_withdraw`
    const _data = {
     "context": context,
     "data": {
         "item": {
             "amount" : payout.amount.toString(),
             "feePriority" : "standard",
             "recipientAddress" : payout.address,
             "tokenIdentifier" : contractAddress,
             "note": context+"_lbl"
         }
     }
  }
    const _headers = generateHeaders(_data,endpoint.method,endpoint.url,{})
    console.log(_headers)
     let response;
     try{
        console.log(endpoint.method,endpoint.url,"TEST")
        let result = await axios({
          method: endpoint.method,
          url: basePath + endpoint.url,
          data: _data,
          headers: _headers
        })
        //console.log(`${baseURL}/wallet-as-a-service/wallets/${walletId}/${coinCode}/${(asset_network ? asset_network : network)}/addresses?context=${context}`,"TEST")
        if(result.data){
         console.log(result.data)
          response = result.data
          return { error: false , data : result.data , req: request, resp: response}
        }else{
         console.log(result.response)
          response = result.response ? result.response.data : result
          return { error: true, req: request, resp: response }
        }
     }catch(e){
         console.log(e)
         response = e.response ? e.response.data : e
         return { error: true, req: request, resp: response }
     }
 }