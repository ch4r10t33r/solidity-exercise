pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/EquityShare.sol";

contract TestEquityShare {

  function testInitialEquityUsingDeployedContract() {
    EquityShare equityShare = EquityShare(DeployedAddresses.EquityShare());

    uint expected = 0;

    Assert.equal(equityShare.getBalance(tx.origin), expected, "Owner should have 0 balance initially");
  }

  function testAddShareHolderUsingDeployedContract() {
    EquityShare equityShare = EquityShare(DeployedAddresses.EquityShare());
    uint expected = 100;
    Assert.equal(equityShare.getEquity(tx.origin),expected,"Owner should have 100 equity after adding a share holder");
  }
}
