//var EquityLib = artifacts.require("./EquityLib.sol");
var EquityShare = artifacts.require("./EquityShare.sol");

module.exports = function(deployer) {
  //deployer.deploy(EquityLib);
  //deployer.link(EquityLib,EquityShare);
  deployer.deploy(EquityShare,"0xf187c7588b64ba80891ac5159317e5b41c052851",30);
};
