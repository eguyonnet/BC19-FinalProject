## Design choices
For managing **Professional Offices**, I have created two smart contracts in order to ease future developements :
* *ProfessionalOfficesStorage.sol*, the storage contract (the data)
* *ProfessionalOfficesImplV1.sol*, the business logic contract (modifiers, functions and events) which inherits from the storage contract

For managing **product units**, I was at first about to consider each unit as a non-fungible token by extending ERC721 to include additional data. But finally, I decided to go for a factory, *UnitFactory.sol* responsible for creating a contrat per unit. In my opinion, the second solution leads to more upgradability, lighter contracts and conveniently attaches an address to a unit (represented by a QR code sticked on the unit).

### Inheritance pattern
Inheritance is extensively used.

### Access Control pattern
Both the ProfessionalOfficesImplV1 and the UnitFactory contracts inherit from the *WhitelistAdminRole* from **OpenZeppelin** (https://docs.openzeppelin.com/openzeppelin/) in order to limit access to certain methods.
To ease the project setup for the reviewer (especially in developement environement), the OZ contracts are imported (instead of using EVM packages, see https://docs.openzeppelin.com/sdk/2.5/linking). Of course the EVM is preferred because it is more secure and greatly reduces the gas deployment costs (as contracts' code is already deployed in the Ethereum network).

### Emergency Stop pattern
The UnitFactory contract inherites from the Pausable contract from **OpenZeppelin**. Before creating a new Unit, a modifier checks if the contract has not been paused (by authorized addresses).

### Factory pattern
See a way to prevent from creating Unit instances outside the factory, the following could help :
http://eips.ethereum.org/EIPS/eip-1167 (This code (intended to be called from an implementor factory contract) will allow you to install a master copy of a contract, then easily (cheaply) create clones with separate state. The deployed bytecode just delegates all calls to the master contract address)

### Upgradability (PROXY through DELEGATE CALL)
transparent proxy pattern
 
 Project is built using Zepkit, a truffle box containing React, ZeppelinOS, OpenZeppelin, Truffle and Infura.
This brings :
- Upgradeable smart contracts with ZeppelinOS (using proxy pattern).
- React &  Rimble to build usable and friendly interfaces.


## Questions
- Does it make sence to use uint8, uint16, ... instead of uint32 to save space ?
- Is it better to use bytes32 instead of string is length if limited ?
- Should I manage Manufacturers and products with different contracts ? 
- I wish I could use pragma "experimental ABIEncoderV2;" in order to return structs !! but as far as I know, web3.js could not deal with it
