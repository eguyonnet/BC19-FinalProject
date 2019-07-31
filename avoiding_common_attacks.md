### Re-entracy Attack
The Unit contract needs to call an external contract in order to approve a technician (address) how wants to register a new operation. In order to prevent rerouting (to a fake ProfessionalOfficesImpl contract) which for instance could lead to recursive calls, the ProfessionalOfficesImpl contract address is not known to the Unit contract (the Unit contract in fact calls the factory acting as a dispatcher and only authorized addresses can modify the ProfessionalOfficesImpl contract address).

### Integer Overflow and Underflow
