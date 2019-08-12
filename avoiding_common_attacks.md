## Re-entracy Attack
The Unit contract needs to call an external contract in order to approve a technician (address) how wants to register a new operation. In order to prevent rerouting (to a fake ProfessionalOfficesImpl contract) which for instance could lead to recursive calls, the ProfessionalOfficesImpl contract address is not known to the Unit contract (the Unit contract in fact calls the factory acting as a dispatcher and only authorized addresses can modify the ProfessionalOfficesImpl contract address).

## Integer Overflow and Underflow
In the ProfessionalOfficesImpl contract, the storage variable 'officeSequence' of type uint32 is incremented by 1 in the function 'addProfessionalOffice'. This function is accessible to authorized addresses only so there is no risk of overflow. So I have skipped the SafeMath overflow check (OpenZeppelin), thereby saving gas.

## Denial of Service by Block Gas Limit (or startGas)
In all my contracts, I have arrays :
```
    UnitFactory : address[] private units
    Unit : Operation[] private operations
    ProfessionalOfficesImpl : uint32[] internal officesIdList
```
But I am so far never iterating through this arrays, which could for sure (due to the success of the solution :)) cause a denial of service because of gas limit.

When there was a need for searching an item by one of its attributs then I have created a dedicated mapping. For instance :
```
    mapping(address => uint32) internal officeIdByActivTechnicianAddress
```
allows me to search for a technician address across all existing professional offices). Of course you need to update this variables...

In case I would need later to iterate through an array because for example, I have to render all the units (their address) created by the factory, then I would create a paginated function like :
```
    function getList(uint startPosition, uint length) external view returns (address[])
```
making sure that length is no exceeding 100 for instance.

Ah yes, ok in fact I forgot I iterate through input arrays (see code below from ProfessionalOfficesImpl contract). But here it would not make sense to add 10 000 owners or technicians at onces. First because of real life, second because the transaction would be expensive and finally because if it runs out of gas then only this transaction is rejected.

```
    function addProfessionalOffice(bytes32 _name, address[] calldata _owners, address[] calldata _technicians) external onlyWhitelistAdmin returns(uint32) {
        for (uint i = 0; i < _owners.length; i++) {
            require(_owners[i] != address(0), "Invalid owner address");
        }
        for (uint i = 0; i < _technicians.length; i++) {
            require(_technicians[i] != address(0), "Invalid technician address");
            // Check unicity across all offices
            require(officeIdByActivTechnicianAddress[_technicians[i]] == 0, "Technician address already activ in other professional office");
        }
        ...
```


  

