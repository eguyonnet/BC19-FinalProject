### Re-entracy Attack
The Unit contract needs to call an external contract in order to approve a technician (address) how wants to register a new operation. In order to prevent rerouting (to a fake ProfessionalOfficesImpl contract) which for instance could lead to recursive calls, the ProfessionalOfficesImpl contract address is not known to the Unit contract (the Unit contract in fact calls the factory acting as a dispatcher and only authorized addresses can modify the ProfessionalOfficesImpl contract address).

### Integer Overflow and Underflow
In the ProfessionalOfficesImpl contract, the storage variable 'officeSequence' of type uint32 is incremented by 1 in the function 'addProfessionalOffice'. This function is accessible to authorized addresses only so there is no risk of overflow. So I have skipped the SafeMath overflow check (OpenZeppelin), thereby saving gas.

