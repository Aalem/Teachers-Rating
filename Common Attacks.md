# Common Attacks

## Integer Overflow and Underflow
When a balance reach to the maximum uint value, then its value will change back to zero. We need to make sure that the right users have the authority to change that value, because if all users can call that function which updates the uint value, then it will become vulnerable to attack.
In order to avoid the attack we can let the admin has that authority to change the uint value, and also can let users to increment the value only by 1.
We can apply the same rule for underflow as well, so that it won't get its maximum value.

```
function transfer(address _to, uint256 _value) {
    /* Check if sender has balance and for overflows */
    require(balanceOf[msg.sender] >= _value && balanceOf[_to] + _value >= balanceOf[_to]);

    /* Add and subtract new balances */
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
}
```

## Timestamp Dependence
The timestamp can be manipulated by the miner, therefore when using timestamp we should be careful and consider the followings:

### 30-second Rule
If the contract function can tolerate a 30-second drift in time, it is safe to use block.timestamp
It is safe to use timestamp, if the scale of your time-dependent event can vary by 30-seconds and maintain integrity. This includes things like ending of auctions, registration periods, etc.

### Multiple Inheritance Caution¶
When utilizing multiple inheritance in Solidity, it is important to understand how the compiler composes the inheritance graph. As the compiler will linearize the inheritance from left to right.

## Forcibly Sending Ether to a Contract
Forcibly sending ether to a contract is possible and this is important how to put our important logic in the fallback function or when making calculations based on a contract's balance.

Take the following example:

```
contract Vulnerable {
    function () payable {
        revert();
    }

    function somethingBad() {
        require(this.balance > 0);
        // Do something bad
    }
}
```
The contract does not allow "something bad" to happen by not allowing payment to the contract.
`Contract developers should be aware that Ether can be forcibly sent to a contract and should design contract logic accordingly. Generally, assume that it is not possible to restrict sources of funding to your contract.`

## DoS with Block Gas Limit
You may run into the Block Gas Limit when you try to pay everyone at once. Because each Ethereum block can process a certain maximum amount of computation. The transaction will fail you try to pass that limitation.

If you don't have a choice but to loop over an array of unknown size, then you should take multiple blocks, and therefore require multiple transactions.
You should also track how far you have gone and should be able to resume for that point. Like following example:

```
struct Payee {
    address addr;
    uint256 value;
}

Payee[] payees;
uint256 nextPayeeIndex;

function payOut() {
    uint256 i = nextPayeeIndex;
    while (i < payees.length && msg.gas > 200000) {
      payees[i].addr.send(payees[i].value);
      i++;
    }
    nextPayeeIndex = i;
}
```
You need to make sure that nothing will happen during the process of transaction and iteration in payOut function. This is a good pattern to follow in such situations.
