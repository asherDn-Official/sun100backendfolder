module.exports.getEndpoint = (type)=>{
    let endpoint;
    switch(type){
        case 'place-order':
         endpoint = {"method":"POST","url":"/v5/order/create"}
        break;
        case 'coinpair-info':
         endpoint = {"method":"GET","url":"/v5/market/instruments-info"}
        break;
        case 'withdraw-asset':
         endpoint = {"method":"POST","url":"/v5/asset/withdraw/create"}
         break;
        case 'coin-info':
         endpoint = {"method":"GET","url":"/v5/asset/coin/query-info"}
         break;
        case 'cancel-order':
         endpoint = {"method":"POST","url":"/v5/order/cancel"}
         break;
        case 'instrument-info':
         endpoint = {"method":"GET","url":"/v5/market/tickers"}
         break;
        default :
         endpoint = null
        break;
    }
    return endpoint
}

module.exports.valutodyEndpoint = (type,params)=>{
    let endpoint;
    switch(type){
        case 'gen-addr':
         endpoint = {"method":"POST","url":`/vaults/${params[0]}/${params[1]}/${params[2]}/addresses`}
         break;
        case 'token-transaction':
         endpoint = {"method":"POST","url":`/vaults/${params[0]}/${params[1]}/${params[2]}/addresses/${params[3]}/token-transaction-requests`}
         break;
        default :
         endpoint = null
        break;
    }
    return endpoint
}