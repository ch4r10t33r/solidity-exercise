// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
//import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import equityshare_artifacts from '../../build/contracts/EquityShare.json'


//var MetaCoin = contract(metacoin_artifacts);
var EquityShare = contract(equityshare_artifacts);
var deployedAt = "0xba6652a1580fcbfd9aebb5a52991d194fe9d3f3c";

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var account_1;
var account_2;
var equityShareContract;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the EquityShare abstraction for Use.
    //MetaCoin.setProvider(web3.currentProvider);
    EquityShare.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      account_1 = "0xc75204fb8e513e42d7c17d4c5071f43da7dd5d16";
      web3.eth.defaultAccount = account;

      var account1 = document.getElementById("account1");
      account1.innerHTML = accounts[0];

      var account2 = document.getElementById("account2");
      account2.innerHTML = account_1;

      var account3 = document.getElementById("account3");
      account3.innerHTML = accounts[2];

      var account1Vote = document.getElementById("account1Vote");
      account1Vote.disabled = true;
      var account2Vote = document.getElementById("account2Vote");
      account2Vote.disabled = true;
      var account3Vote = document.getElementById("account3Vote");
      account3Vote.disabled = true;

      var vote1 = document.getElementById("vote1");
      vote1.disabled = true;
      var vote2 = document.getElementById("vote2");
      vote2.disabled = true;
      var vote3 = document.getElementById("vote3");
      vote3.disabled = true;

      var meta;
      //console.log("Deployed EquityShare: " + EquityShare.deployed());
      equityShareContract = EquityShare.at(deployedAt).then(
        function(instance) {
          console.log(instance);

        });
      //console.log(equityShareContract);
      self.refreshBalance();
      self.initializeEquity();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  initializeEquity: function() {
      var self = this;
      var meta;
      EquityShare.at(deployedAt).then(
        function(instance) {
        meta = instance;
        return meta.getEquity.call(account);
      }).then(function(value) {
        var equity1_value = document.getElementById("equity1");
        equity1_value.innerHTML = value.valueOf();
        return meta.getEquity.call(account2.innerHTML);
      }).then(function(value) {
        var equity2_value = document.getElementById("equity2");
        equity2_value.innerHTML = value.valueOf();
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting equity; see log.");
      });
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    //EquityShare.deployed().then(function(instance) {
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account);
    }).then(function(value) {
      console.log("Balance of account: "+account+" value: "+value);
      var balance1 = document.getElementById("balance1");
      var profit_share1 = document.getElementById("profit_share1");
      profit_share1.innerHTML = value.valueOf();
      balance1.innerHTML = web3.eth.getBalance(account);
      return meta.getBalance.call(account_1);
    }).then( function(value) {
      console.log("Balance of account: "+account_1+" value: "+value);
      var balance2 = document.getElementById("balance2");
      var profit_share2 = document.getElementById("profit_share2");
      profit_share2.innerHTML = value.valueOf();
      balance2.innerHTML = web3.eth.getBalance(account_1);
      return meta.getBalance.call(accounts[2]);
    }).then(function(value) {
      console.log("Balance of account: "+accounts[2]+" value: "+value);
      var balance3 = document.getElementById("balance3");
      var profit_share3 = document.getElementById("profit_share3");
      profit_share3.innerHTML = value.valueOf();
      balance3.innerHTML = web3.eth.getBalance(accounts[2]);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  refreshEquities: function () {
    var self = this;
    var meta;
    //EquityShare.deployed().then(function(instance) {
    var founder3 = document.getElementById("founder3");
    if(founder3.innerHTML == "-") {
      EquityShare.at(deployedAt).then(function(instance) {
        meta = instance;
        return meta.getEquity.call(account);
      }).then(function(value) {
        var equity1_value = document.getElementById("equity1");
        equity1_value.innerHTML = value.valueOf();
        return meta.getEquity.call(account2.innerHTML);
      }).then(function(value) {
        var equity2_value = document.getElementById("equity2");
        equity2_value.innerHTML = value.valueOf();
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting equity; see log.");
      });
    }
    else {
      EquityShare.at(deployedAt).then(function(instance) {
        meta = instance;
        return meta.getEquity.call(account);
      }).then(function(value) {
        var equity1_value = document.getElementById("equity1");
        equity1_value.innerHTML = value.valueOf();
        return meta.getEquity.call(account2.innerHTML);
      }).then(function(value) {
        var equity2_value = document.getElementById("equity2");
        equity2_value.innerHTML = value.valueOf();
        return meta.getEquity.call(account3.innerHTML);
      }).then(function(value) {
        var equity3_value = document.getElementById("equity3");
        equity3_value.innerHTML = value.valueOf();
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting equity; see log.");
      });
    }
  },

  addProfit: function (value) {
    var self = this;
    var meta;
    //EquityShare.deployed().then(function(instance) {
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      console.log("Adding a profit of: " + value + " using account: " + web3.eth.defaultAccount);
      return meta.addProfit(value,{from: account, gas: 4000000});
    }).then(function(result) {
      console.log("Result of addProfit: " + result.valueOf());
      self.refreshBalance();
    }).catch(function(e){
      console.log(e);
      self.setStatus("Error adding profit; see log.");
    });
  },

  withdrawFrom: function(param,value) {
    var person = document.getElementById(param);
    var self = this;
    var meta;
    //EquityShare.deployed().then(function(instance) {
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      return meta.withdrawBalance(person.innerHTML,value,{from: person.innerHTML, gas: 4000000});
    }).then(function(result) {
      console.log("Result of withdrawBalance: " + result.valueOf());
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error withdrawing; see log.");
    });
  },
  toggleVoting: function() {
    var self = this;
    var votingText = document.getElementById("voting");

    var account1Vote = document.getElementById("account1Vote");
    var account2Vote = document.getElementById("account2Vote");
    var account3Vote = document.getElementById("account3Vote");
    var vote1 = document.getElementById("vote1");
    var vote2 = document.getElementById("vote2");
    var vote3 = document.getElementById("vote3");

    if(votingText.innerHTML == 'Enable Voting') {
      votingText.innerHTML = 'Disable Voting';
      account1Vote.disabled = false;
      account2Vote.disabled = false;
      account3Vote.disabled = false;
      vote1.disabled = false;
      vote2.disabled = false;
      vote3.disabled = false;
    } else {
        votingText.innerHTML = 'Enable Voting';
        account1Vote.disabled = true;
        account2Vote.disabled = true;
        account3Vote.disabled = true;
        vote1.disabled = true;
        vote2.disabled = true;
        vote3.disabled = true;
    }
    var meta;
    //EquityShare.deployed().then(function(instance) {
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      return meta.toggleStatus({from: account, gas: 4000000});
    }).then(function(result) {
      console.log("Result of toggleStatus: " + result.valueOf());
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error toggleStatus; see log.");
    });
  },

  voteOption: function(param,value) {
    var person = document.getElementById(param);
    var vote = document.getElementById(value);
    console.log(person.innerHTML + " has voted to " + vote.value);
    var voted;
    if(vote.value == "yes") {
      voted = 1;
    }
    else {
      voted = 2;
    }

    var meta;
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      return meta.vote(voted,{from: person.innerHTML, gas: 4000000});
    }).then(function(result) {
      console.log("Result of voting: " + result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error voting; see log.");
    });
  },

  purchaseStake: function(amount) {
    var person = document.getElementById("account3");
    var self = this;
    var meta;
    //EquityShare.deployed().then(function(instance) {
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      return meta.votingResult({from: account, gas: 4000000});
    }).then(function(result) {
      console.log("Voting Result: "+result);
      return meta.purchaseStake(person.innerHTML,amount,{from: person.innerHTML, gas: 4000000});
    }).then(function(result) {
      console.log("Result of purchaseStake: " + result.valueOf());
      document.getElementById("founder3").innerHTML = "Founder 3";
      self.refreshBalance();
      self.refreshEquities();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error purchaseStake; see log.");
    });
  },

  transferStake: function(param,value) {
    var source = document.getElementById(param);
    var dest;
    if(param == "account1") {
      dest = document.getElementById("account2");
    }
    else {
      dest = document.getElementById("account1");
    }
    console.log("Transfering "+value+"% stake from "+source.innerHTML+" to "+dest.innerHTML);
    var self = this;
    var meta;
    //EquityShare.deployed().then(function(instance) {
    EquityShare.at(deployedAt).then(function(instance) {
      meta = instance;
      return meta.transferStake(dest.innerHTML,value,{from: source.innerHTML, gas: 4000000});
    }).then(function(result) {
      console.log("Result of transferStake: " + result.valueOf());
      self.refreshBalance();
      self.refreshEquities();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error transferStake; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
