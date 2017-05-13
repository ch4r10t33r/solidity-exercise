pragma solidity ^0.4.5;
/**
* EquityShare smart contract holds the equity holding pattern of a company
*/
contract EquityShare {
  address owner;
  uint[] profits;
  struct ShareHolder {
		address person;
		uint equity;
    uint profitShare;
    /*
    * votingStatus = 1, Approve Dilution
    * votingStatus = 2, Disapprove Dilution
    * votingStatus = 0, no voting.
    */
		uint votingStatus;
	}
	ShareHolder[] shareHolders;
  mapping(address => uint) balances;
  /*
  * status = 1 means that the EquityShare contract is still valid
  * status = 2 means voting in progress
  * status = 3 means dilution approved
  */
  uint status;

  event aborted(string msg);
  event voted(string msg);

  //List of functions used for functionality
  /*
  function EquityShare() {
    owner = msg.sender;
    shareHolders.push(ShareHolder(msg.sender,100,0));
    status = 1;
  }
  */
  function EquityShare(address person,uint equity) payable {
    owner = msg.sender;
    uint ownerEquity = 100 - equity;
    shareHolders.push(ShareHolder(msg.sender,ownerEquity,0,0));
    shareHolders.push(ShareHolder(person,equity,0,0));
    status = 1;
  }

  function toggleStatus() payable returns (bool){
    if(msg.sender != owner) return false;
    if(status == 1) {
      status = 2;
    }
    else {
      status = 1;
    }
    return true;
  }

  //add a new shareholder
  function addShareHolder(address person,uint equity) payable returns (bool) {
    if(msg.sender != owner) {
      return false;
    }
    if(status == 1) {
      uint diluted = 100 - equity;
  		for(uint i=0;i<shareHolders.length;i++) {
  			shareHolders[i].equity -= (diluted)/shareHolders.length;
  		}
  		shareHolders.push(ShareHolder(person,equity,0,0));
      return true;
    }
    return false;
  }

  //function to transfer stake to another.
  function transferStake(address target,uint stake) payable returns (bool){
    if(status == 1) {
      for(uint i=0;i<shareHolders.length;i++) {
        if(shareHolders[i].person == msg.sender) {
            for(uint j=0;j<shareHolders.length;j++) {
              shareHolders[i].equity -= stake;
              if(shareHolders[j].person == target) {
                shareHolders[j].equity += stake;
                return true;
              }
            }
            shareHolders.push(ShareHolder(target,stake,0,0));
            return true;
        }
      }
      return false;
    }
    return false;
  }

  //method of splitting the profit amongst the share holders
  function addProfit(uint profit) payable returns (uint){
    profits.push(profit);
    uint share = 0;
    for(uint i=0; i< shareHolders.length ; i++ ) {
       share = (profit * shareHolders[i].equity)/100;
       //balances[shareHolders[i].person] += share;
       shareHolders[i].profitShare += share;
    }
    return profits.length;
  }

  //method to withdraw balance from an account
  function withdrawBalance(address person,uint amount) payable returns (bool) {
    for(uint i=0;i<shareHolders.length;i++) {
      if(person == shareHolders[i].person) {
        if(shareHolders[i].profitShare >= amount) {
          shareHolders[i].profitShare -= amount;
          return person.send(amount);
        }
      }
    }
    return false;
  }

  //method to fetch balance from an account
  function getBalance(address person) returns (uint) {
    for(uint i=0; i< shareHolders.length ; i++ ) {
      if(shareHolders[i].person == person) {
        return shareHolders[i].profitShare;
      }
    }
    return 0;
  }

  //method that returns the current equity for a person
  function getEquity(address person) returns (uint) {
    for(uint i=0;i<shareHolders.length;i++) {
      if(person == shareHolders[i].person) {
        return shareHolders[i].equity;
      }
    }
    return 0;
  }

  function vote(uint voted) payable returns (bool) {
    if(status != 2)
      return false;

    for(uint i=0;i<shareHolders.length;i++) {
      if(shareHolders[i].person == msg.sender) {
        shareHolders[i].votingStatus = voted;
        return true;
      }
    }
    return false;
  }

  function votingResult() payable returns (uint) {
    if(status == 2) {
      uint approved = 0;
      uint disapproved = 0;
      for(uint i=0;i<shareHolders.length;i++) {
        if(shareHolders[i].votingStatus == 1) {
          approved++;
        }
        else {
          disapproved++;
        }
        shareHolders[i].votingStatus = 0;
      }
      uint percent = (approved*100/shareHolders.length);
      if(percent > 50) {
        status = 3;
      }
      else {
        status = 1;
      }
    }
    return status;
  }

  function purchaseStake(uint amount) payable returns (bool) {
    if(status == 3) {
      uint valuation = 0;
      for(uint i=0;i<profits.length;i++) {
        valuation += profits[i];
      }
      valuation *= 100;
      uint equity = (amount*100)/valuation;
      uint dilution = 100 - equity;
      for(i=0;i<shareHolders.length;i++) {
        shareHolders[i].equity -= (dilution/shareHolders.length);
      }
      shareHolders.push(ShareHolder(msg.sender,equity,0,0));
    }
    return false;
  }
}
