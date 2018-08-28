# Design Pattern

## Circuit Breakers / Emergency Stop
Circuit breakers stop execution if certain conditions are met and can be valuable when new bugs are found. For instance, most activities might be suspended in a contract if a bug is found, and the main activity that is active now is a withdrawal.

In Rating contract the execution of the Rate function will stop if the admin has changed the stopped value to false.

```
// check if the contract is stopped
bool private stopped = false;

// Store owner's address
address private owner;

modifier isAdmin() {
    require(msg.sender == owner);
    _;
}

// Activate/Deactivate the contract by Admin
function toggleContractActive() isAdmin public{
    stopped = !stopped;
}

// modifiers for circuit breaker
modifier stopInEmergency { if (!stopped) _; }
modifier onlyInEmergency { if (stopped) _; }

function rate(uint _teacherId, uint value) stopInEmergency public{
  ....
}
```
