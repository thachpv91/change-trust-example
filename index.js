const TriamSDK = require("triam-sdk");
const triamConf = {
  port: 9080,
  passPhrase:
    "SAAK5654--ARM-NETWORK--BHC3SQOHPO2GGI--BY-B.A.P--CNEMJQCWPTA--RUBY-AND-BLOCKCHAIN--3KECMPY5L7W--THANKYOU-CS--S542ZHDVHLFV",
  horizonServer: "https://horizon.triamnetwork.com",
  minimumStartingBalance: "20",
  defaultFee: 10000
};

TriamSDK.Network.use(new TriamSDK.Network(triamConf.passPhrase));
const horizonServer = new TriamSDK.Server(triamConf.horizonServer, {
  allowHttp: true
}); //connect to horizon server

// Place your private key
const yourPriveKey = "SDRKCVK************************ZTMJ4NUD";

let keypair = TriamSDK.Keypair.fromSecret(yourPriveKey);

function trustTEC() {
  const tecAsset = new TriamSDK.Asset(
    "TEC",
    "GBPYVBZZYIIQ5SNUZJKXXTRCMMP23SEPFMR3IDMCYKEHUJJN35XLFDUU"
  );
  horizonServer
    .loadAccount(keypair.publicKey())
    .then(function(account) {
      let transaction = new TriamSDK.TransactionBuilder(account, {
        fee: triamConf.defaultFee
      });
      transaction.addOperation(
        TriamSDK.Operation.changeTrust({
          asset: tecAsset
          // limit: '1000' The limit for the asset, defaults to max int64. If the limit is set to "0" it deletes the trustline.
        })
      );
      transaction = transaction.build();
      transaction.sign(keypair);
      return horizonServer.submitTransaction(transaction); //then submit this transaction to horizon server
    })
    .then(transaction => {
      console.log("----- transaction success -----");
      console.log("------------------------------------");
      console.log("Data return from horizon server:", transaction);
    })
    .catch(err => {
      console.log("Error:");
      console.log(err);
    });
}

trustTEC();
