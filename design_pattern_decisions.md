## General design decisions
For managing **Professional Offices**, I have created two smart contracts in order to ease future developements :
* *ProfessionalOfficesStorage.sol*, the storage contract (the data)
* *ProfessionalOfficesImplV1.sol*, the business logic contract (modifiers, functions and events) which inherits from the storage contract

For managing **product units**, I was at first about to consider each unit as a non-fungible token by extending ERC721 to include additional data. But finally, I decided to go for a factory :
* *UnitFactory.sol* is responsible for creating a *Unit.sol* contrat per unit
* Still the factory references all the units created

In my opinion, the second solution leads to more upgradability, lighter contracts and conveniently attaches an address to a unit (represented by a QR code sticked on the unit).

You will also see in the code that I am not using ENUM. Using ENUM, when upgrading your contract, you will not be able to insert new values, but just add new values to the existing ones, which could be a problem in some cases (when they need to follow a logical order).

## Inheritance pattern
Inheritance is extensively used.

## Access Control pattern
Both the ProfessionalOfficesImplV1 and the UnitFactory contracts inherit from the *WhitelistAdminRole* from **OpenZeppelin** (https://docs.openzeppelin.com/openzeppelin/) in order to limit access to certain methods. This allow to have multiple addresses instead of one owner only.
To ease the project setup for the reviewer (especially in developement environement), the OpenZeppelin contracts are imported (instead of using EVM packages, see https://docs.openzeppelin.com/sdk/2.5/linking). Of course the EVM is preferred because it is more secure and greatly reduces the gas deployment costs (as contracts' code is already deployed in the Ethereum network).

## Emergency Stop pattern
The UnitFactory contract inherites from the Pausable contract from **OpenZeppelin**. Before creating a new Unit, a modifier checks if the contract has not been paused (by authorized addresses).

## Factory pattern
The UnitFactory could be further improved :
- by preventing Unit creation outside the Factory by comparing in the Unit constructor the msg.sender with the hard-coded UnitFactory contract address (for this we would need to know the contract address before deployment). 
- maybe save some gas using EIP-1167 (http://eips.ethereum.org/EIPS/eip-1167

## Upgradability (PROXY through DELEGATE CALL)
UnitFactory contract and ProfessionalOfficesImpl contract should be upgradable. I have tested (but not commited) the transparent proxy pattern from OpenZeppelin (https://docs.openzeppelin.com/sdk/2.5/writing-contracts) by extending the *Initializable* base contract and moving the code from the actual constructor to a new *initialize* method. Be aware of the constraints for the futur updates of storage.
The Unit contract does not need to be upgradable of course (there will be millions of them :)).

## Dispatcher
Along the unit life cycle, Unit contracts need to call other contracts (for instance the technician who signs a transaction corresponding to a maintainance operation on a Unit, should be recognized by the ProfessionalOfficesImpl contract).
Instead of storing a reference (address) to each callable contract, the (millions of) Unit contracts request the Unit Factory which then act as a dispatcher. 
