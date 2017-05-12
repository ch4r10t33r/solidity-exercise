//var EquityLib = artifacts.require("./EquityLib.sol");
var EquityShare = artifacts.require("./EquityShare.sol");

module.exports = function(deployer) {
  //deployer.deploy(EquityLib);
  //deployer.link(EquityLib,EquityShare);
  deployer.deploy(EquityShare);
};
