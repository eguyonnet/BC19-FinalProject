# BC19-FinalProject
Sensitive products maintenance tracking solution

## Business case
For certain categories of products, keeping track of their proper maintenance is legally enforced or at least demanded by third parties (insurer, manufacturer, buyers for second hand usage, ...). This is especially true when these products can put in danger peoples' lives. Still providing a proven track is very challenging.

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

As we can consider that there is no trusted area between all actors involved, a public Ethereum blockchain would the natural choice. Now we can also consider being trutsful a consortium blockchain where nodes are run by enought parties having opposed objectivs (trust could be enforced by writting to a smart contract on the public blockchain, the blocks root hashes of the consortium blockchain).

## Scope for the final project to complete the course
I have decided to focus on the main issue: the registration of maintenance operations on units by qualified technicians working for approved agencies. 

**Professional Offices**, created by autorized parties, employ **technicians** that are identified by their own public address on the blockchain. These technicians use their address to sign transactions, each representing an operation on a unit. 

For **product units** (maintained by technicians), we need to store a few properties that identifies a unit (manufacturer, product model and unique identifiers), the owner of the unit, as well a list of operations completed by technicians. For each **Operation**, we first need verify that the technician's address (who signes the transaction) is known and valid, then store some data about the operation : category (setup, repair, ...) and a hash of the report (an exploitable json file stored on IPFS/SWARM). Finally, we should authorize a certified operator to set a status in case of later control of the operation.

I have implemented a very simple client application (using React & Rimble) to demonstrate interactions through web3.js with the blockchain and one of my smart contracts (including read/write method calls as well as catching reverted calls for displaying proper error messages to users). I apologize for the simple client application but my background is more back-end development so I had to learn (a bit) React. For more convenience, the associated files (sources and configuration) are included the present GitHub repository (in the 'client' directory). 

## Setup environment

  ### Requirements
  ```
    npm install -g ganache-cli
    npm install -g truffle@5.0.4
    npm install -g solc@0.5.10
  ```
  Download my project to a local drive (https://github.com/eguyonnet/BC19-FinalProject.git)

  ### Smart contracts
  From the root of the project, install the dependencies (referenced in package-json) :
  ```
    npm install
  ```
  Once you have ganache running, you can test the smart contracts and migrate them :
  ```
    truffle test
    truffle migrate
  ```
  CI  available at https://travis-ci.org/eguyonnet/BC19-FinalProject/jobs/564684272/config

  ### Dapp
  From the client directory, install the dependencies (referenced in package-json) :
  ```
    npm install
  ```
  Start an http server and launch the Dapp (it will automatically open a browser window at URL http://localhost:3000):
  ```
    npm run start
  ```
## Beyond this scope
* The certification bodies that control the quality of the maintainance operation, should be referenced in a smart contract in order to verify the addresses (msg.sender) exactely as it works for techicians.
* It would be convenient to reference Manufacturers and products, especially for manufacturers to gather statistics about their products.
* A scoring could be calculated for each unit as an indicator of the level of quality of the maintainance of a unit. The calculation rules would vary from one product to an other. This indicator could be used for instance by insurers/owners to negociate the insurance premium for a contract, or by buyers to estimate the value of a second hand unit.
* Develop several DApp (for the different actors) with dedicated GIT repositories
* Integrate with IPFS and off-chain applications (legacy systems, data analysis, search functionalities, ...)
* Messaging protocol (Whisper) could be used by manufacturer to alert units owners about technical issues, or by insurer for different pruposes. 
