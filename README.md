# solidity-exercise
Sample solidity programming exercise using Truffle framework

The purpose of the contract is to allow an initial set of ‘shareholders’ to fairly distribute profits from an external source among themselves. 

The contract must be able to do the following:
1. Accept profits sent as ETH to the contract.
2. Allow shareholders to withdraw their fair portion of the profits based on their % ownership at the time of the profits being paid in.
3. Allow a shareholder to transfer his or her stake in the contract to someone else.
4. Allow all shareholders to hold a vote, which if passing 51% agreement, allows them to dilute all of their own shares and issue a % of new equity at a valuation that is equal to 100 multiplied by the profits accrued during the previous month.
5. Allow new users to buy the new equity at the offered price following a successful vote, to become shareholders themselves.
6. Allow all interaction with the smart contracts to occur via the browser, including letting shareholders check their balance of profits to be paid.

# To run the app:
1. clone the code your machine.
2. run test rpc
3. <cloned-location>/npm run dev
4. The application can be accessed from http://localhost:8080/

