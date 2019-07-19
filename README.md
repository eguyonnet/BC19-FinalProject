# BC19-FinalProject
Sensitive products maintenance tracking solution

## Business case
For certain categories of products, keeping track of their proper maintenance is legally enforced or at least demanded by third parties (insurer, manufacturer, buyers for second hand usage, ...). This is especially true when these products can put in danger peoples'lives. Still providing a proven track is very challenging.

Let's take the example of gas boilers. Once a year, every owner of a gas boiler must have a technician checks its proper operation. The technician needs to follow a check list (of controls) which is specified by law. When all the controls are passed, the technician must deliver to the owner a certificate of control. Besides the fact that owners should be aware of the dangerousness of not maintaining regularly a gas boiler, this certificate is requested by manufacturers when an issue occurs during warranty period or by insurers when an incident occurs. Today, the system has lots of drawbacks  :
* The owner is not willing to pay for the annual checkup (around 150 euros) and will request a backdated certificate from a dishonest professional when requested by the insurer or constructor
* Lot's of so call professionals do not fulfill a proper checkup (happened to me the past two years !), making a lucrative business but putting in risk the owners and scamming the insurers and constructors
* Several certification bodies evaluate the professionals' knowledge and good practices, but their task is probably difficult to accomplish (well) due lack of track record of day to day activities
* When a gas boiler is sold or when a property is sold (including its gas boiler), the sender should be able to show a proven track record of maintenance operations
* Constructors loose track of their devices

## The value
There is a need for a shared and unalterable track of the proper maintenance of each gas boiler. If the main objective is to bring transparency (and consequently remove dishonest actors), sharing data will also improve many existing processes.
* Owners can find a professional showing a sufficient track record (level of expertise) for the model they own or they want to acquire : make it easy for owners to find a qualified professional
* Honest professional are promoted whereas dishonest professionals are discouraged
* Certification bodies or even constructors can randomly verify the quality of the completed maintenance operations and consequently question the legitimacy of the certifications owned
* Insurers are more confident when they compensate. They could even offer lower prices due to lower risks.
* Constructors finally have access to data they can use for improving the quality of their products
* Government agencies would benefit from real statistics

## Description of the minimum viable product
The first version of the solution intends to solve the main issue: the registration of maintenance operations on units by qualified technicians working for approved agencies. 

**Professional Offices**, created by autorized parties, employ **technicians** that are identified by their address on the blockchain. These technicians use their unique address to sign transactions, each representing an operation on a unit. 

For **product units** (maintained by technicians), we need to store a few properties that identifies a unit (manufacturer, product model and unique identifiers), the owner of the unit, as well a list of operations completed by technicians. For each **Operation**, we first need verify that the technician's address (who signes the transaction) is known and valid, then store some data about the operation : category (setup, repair, ...) and a hash of the report (an exploitable json file stored on IPFS/SWARM). Finally, we should authorize a certified operator to set a status in case of later control of the operation.

## Implementation
For managing **Professional Offices**, I have created two smart contracts (to ease later upgrades) :
* *ProfessionalOfficesStorage.sol*, the storage contract
* *ProfessionalOfficesImplV1.sol*, the business logic contract which inherits from the storage contract

For managing **product units**, at first I was about to represent each unit as a non-fungible token, by extending ERC721 to include additional data. But finally, I decided to go for a factory, *UnitFactory.sol* responsible for creating a contrat per unit. In my opinion, the second solution leads to more upgradability, lighter contracts and conveniently attaches an address to a unit.

Both the ProfessionalOfficesImplV1 and the UnitFactory contracts inherit from the *WhitelistAdminRole* from **OpenZeppelin** (included as an EVM package) in order to limit access to certain methods.

As we can consider that there is no trusted area between all actors involved, a public Ethereum blockchain would the natural choice. Now we can also consider being trutsful a consortium blockchain where nodes are run by enought parties having opposed objectivs (trust could be enforced by writting to a smart contract on the public blockchain, the blocks root hashes of the consortium blockchain).

Project is built using Zepkit, a truffle box containing React, ZeppelinOS, OpenZeppelin, Truffle and Infura.
This brings :
- Upgradeable smart contracts with ZeppelinOS (using proxy pattern).
- React &  Rimble to build usable and friendly interfaces.

## Beyon this simple MVP
List of improvments :
* The certification bodies that control the quality of the maintainance operation, should be referenced in a smart contract in order to verify the addresses (msg.sender) exactely as it works for techicians.
* It would be convenient to reference Manufacturers and products, especially for manufacturers to gather statistics about their products.
* A scoring could be calculated for each unit as an indicator of the level of quality of the maintainance of a unit. The calculation rules would vary from one product to an other. This indicator could be used for instance by insurers/owners to negociate the insurance premium for a contract, or by buyers to estimate the value of a second hand unit.

## Questions
- Does it make sence to use uint8, uint16, ... instead of uint32 to save space ?
- Is it better to use bytes32 instead of string is length if limited ?
- Should I manage Manufacturers and products with different contracts ? 
- I wish I could use pragma "experimental ABIEncoderV2;" in order to return structs !! but as far as I know, web3.js could not deal with it




