## Design decisions & patterns
For managing **Professional Offices**, I have created two smart contracts in order to ease future developements :
* *ProfessionalOfficesStorage.sol*, the storage contract (the data)
* *ProfessionalOfficesImplV1.sol*, the business logic contract (modifiers, functions and events) which inherits from the storage contract

For managing **product units**, I was at first about to represent each unit as a non-fungible token, by extending ERC721 to include additional data. But finally, I decided to go for a factory, *UnitFactory.sol* responsible for creating a contrat per unit. In my opinion, the second solution leads to more upgradability, lighter contracts and conveniently attaches an address to a unit (represented by a QR code).

### Inheritance
Both the ProfessionalOfficesImplV1 and the UnitFactory contracts inherit from the *WhitelistAdminRole* from **OpenZeppelin** (https://docs.openzeppelin.com/openzeppelin/) in order to limit access to certain methods.

### Access control

### EVM package

we will use the one provided by the OpenZeppelin Contracts Ethereum Package. An Ethereum Package is a set of contracts set up to be easily included in an OpenZeppelin SDK project, with the added bonus that the contracts' code is already deployed in the Ethereum network. 
This is a more secure code distribution mechanism and greatly reducing your gas deployment costs

### Factory
See a way to prevent from creating Unit instances outside the factory

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