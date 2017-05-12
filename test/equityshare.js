var EquityShare = artifacts.require("./EquityShare.sol");

contract('EquityShare', function(accounts) {
  it("should have 100 equity in contract", function() {
    return EquityShare.deployed().then(function(instance) {
      return instance.getEquity.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100, "100 wasn't in the first account");
    });
  });

  it("should allow addShareHolder",function() {
    var account_one = "0x0b2741e569349eb157d3cfb0fdc7e2f34fdc0f18";
    var account_two = "0x7a18bd408e524c21c89b2f25ea9cef833bf9f96f";
    var account_two_equity = 30;
    var instance;
    return EquityShare.deployed().then(
      function(instance) {
        //console.log(instance);
        //account_one = instance.owner;
        instance.addShareHolder(account_two,account_two_equity).then(
          function(result) {
            //console.log(result);
            instance.getEquity.call(account_two).then(
              function(equity) {
                //console.log(equity);
                assert.equal(equity.valueOf(),30,"30 wasn't in the second account");
              });
          });
      });
  });
});
