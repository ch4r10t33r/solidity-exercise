//var EquityLib = artifacts.require("./EquityLib.sol");
var EquityShare = artifacts.require("./EquityShare.sol");

module.exports = function(deployer) {
  //deployer.deploy(EquityLib);
  //deployer.link(EquityLib,EquityShare);
  deployer.deploy(EquityShare,"0xc75204fb8e513e42d7c17d4c5071f43da7dd5d16",30);
};
