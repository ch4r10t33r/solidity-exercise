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
var deployedAt = "0x7000a7ac64b0ad57764a483f5d88f72682ff764a";

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
      account_1 = "0xf187c7588b64ba80891ac5159317e5b41c052851";
      web3.eth.defaultAccount = account;

      var account1 = document.getElementById("account1");
      account1.innerHTML = accounts[0];

      var account2 = document.getElementById("account2");
      account2.innerHTML = account_1;

      var account3 = document.getElementById("account3");
      account3.innerHTML = accounts[2];

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
      balance1.innerHTML = value.valueOf();
      return meta.getBalance.call(account_1);
    }).then( function(value) {
      console.log("Balance of account: "+account_1+" value: "+value);
      var balance2 = document.getElementById("balance2");
      balance2.innerHTML = value.valueOf();
      return meta.getBalance.call(accounts[2]);
    }).then(function(value) {
      console.log("Balance of account: "+accounts[2]+" value: "+value);
      var balance3 = document.getElementById("balance3");
      balance3.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  refreshEquities: function () {
    var self = this;
    var meta;
    //EquityShare.deployed().then(function(instance) {
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
      return meta.withdrawBalance(person.innerHTML,value,{from: account, gas: 4000000});
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
    if(votingText.innerHTML == 'Enable Voting') {
      votingText.innerHTML = 'Disable Voting';
    } else {
        votingText.innerHTML = 'Enable Voting';
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
