# BC19-FinalProject
Sensitive products maintenance tracking solution

## Business case
For certain categories of products, keeping track of their proper maintenance is legally enforced or at least demanded by third parties (insurer, manufacturer, buyers for second hand usage, ...). This is especially true when these products can put in danger peoples'lives. Still providing a proven track is very challenging.

Let's take the example of gas boilers. nce a year, every owner of a gas boiler must have a professional checks its proper operation. The professional needs to follow a check list (of controls) which is specified by law. When all the controls are passed, the professional must deliver to the owner a certificate of control. Besides the fact that owners should be aware of the dangerousness of not maintaining regularly a gas boiler, this certificate is requested by manufacturers when an issue occurs during warranty period or by insurers when an incident occurs. Today, the system has lots of drawbacks  :
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
As we can consider that there is no trusted area between all actors involved, a public Ethereum blockchain would the natural choice. Now we can also consider being trutsful a consortium blockchain where nodes are run by enought parties having opposed objectivs (trust could be enforced by writting to a smart contract on the public blockchain, the blocks root hashes of the consortium blockchain).

The first version of the solution intends to solve the main issue: the registration of maintenance operations on unit by qualified technicians working for approved agencies. 

 **Professional Offices**, created by autorized parties, employ **technicians** that are identified by their address on the blockchain. These technicians use their unique address to sign transactions, each representing an operation on a unit. 
 wo contracts have been created (to ease later updates) :
* *ProfessionalOfficesStorage.sol*, the storage contract
* *ProfessionalOfficesImplV1.sol*, a the business logic contract. This contract inherits from the *WhitelistAdminRole* from **OpenZeppelin** in order to control access to certain methods.

For **product units** (maintained by technicians), we need to store a few properties that identifies a unit (manufacturer, product model and unique identifiers), how owns the unit, as well as the operations completed by technicians. For each **Operation**, we need to store its category (setup, repair, ...), the address of the technician who completed it, a hash of the report (an exploitable json file stored on IPFS/SWARM) and finally the statut in case of later control of the operation by a certified operator.
At first I was about to identify each unit as a non-fungible token, by extending ERC721 to include additional data. But finally, I decided to create a contrat per unit, created by a factory, *UnitFactory.sol*. In my opinion, the second solution leads to more evolutivity in the definition of a unit, lighter contracts and allows identifying a unit with an address.

## Implementation

Project is built using Zepkit, a truffle box containing React, ZeppelinOS, OpenZeppelin, Truffle and Infura.
This brings :
- Includes OpenZeppelin as an EVM package.
- Upgradeable smart contracts with ZeppelinOS (using proxy pattern).
- Includes Infura setup for easy deployments & connection.
- Truffle to compile & test smart contracts.
- React &  Rimble to build usable and friendly interfaces.


Storage contracts
Implementation contract


- Does it make sence to use uint8, uint16, ... instead of uint32 to save space ?
- Is it better to use bytes32 instead of string is length if limited ?
- Should I manage Manufacturers and products with different contracts ? 
- I wish I could use pragma "experimental ABIEncoderV2;" in order to return structs !! but as far as I know, web3.js could not deal with it




