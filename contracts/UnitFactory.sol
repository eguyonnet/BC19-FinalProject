pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./Unit.sol";
import "./ProfessionalOfficesImpl.sol";

/**
 *	@title  Contract that instanciates Unit contracts and keeps a reference of the units created
 * 	@author E. Guyonnet
 *  @notice When the factory creates a new Unit, it provides the child with the msg.sender address that calls the factory and
 *          that will own the Unit (as the msg.sender for the Unit is the Factory contract address) 
 *          The address of the Professional Offices business logic contract is known by the factory which exposes
 *          a method to the child unit wukk call to verify technician for operation
 */
contract UnitFactory is WhitelistAdminRole, Pausable { 
    
    address[] private units;

    address private proOfficesContract;

    event UnitCreated(address indexed unitAddress, address indexed owner, bytes32 indexed modelNumber, bytes32 modelName, bytes32 manufacturerName);

    /// @notice constructor
    constructor() public { 
    }

    /// @notice returns number of units created
    function getUnitsCount() external view returns(uint) {
        return units.length;
    }

    /// @notice returns the unit address given its index
    function getUnit(uint256 _index) external view returns(address contractAddress) {
        require(_index >= 0 && _index < units.length, "Invalid index");
        return (units[_index]);
    }

    /// @notice create a new unit and append it's address to the index list - Use of an emergency stop pattern
    /// @param _modelNumber unit model identifier
    /// @param _modelName unit model name
    /// @param _manufacturerName unit manufacturer name
    function createUnit(bytes32 _modelNumber, bytes32 _modelName, bytes32 _manufacturerName) whenNotPaused() external {
        require(proOfficesContract != address(0), "Invalid ProfessionnalsOffices contract address");
        address child = address(new Unit(msg.sender, _modelNumber, _modelName, _manufacturerName));
        units.push(child);
        emit UnitCreated(child, msg.sender, _modelNumber, _modelName, _manufacturerName);
    }
    
    /// @notice set the ProfessionalOffices contrat address for checking validity of technicians doing operations
    /// @param _contractAddress address of the ProfessionnalsOffices deployed contract
    function setProfessionnalsOffices(address _contractAddress) external onlyWhitelistAdmin {
        proOfficesContract = _contractAddress;
    }

    /// @notice Check if a technician (who wants to sign a transaction when completing a maintainance operation) is a valid one
    /// @dev This function is called by the Units (created by the factory)
    /// @param _technicianAddress address of the technician 
    /// @return bool - 'true' if technician is activ an a professional office 
    function isActivTechnician(address _technicianAddress) external view returns(bool) {
        // Alternativ : bytes memory data = abi.encodeWithSignature("isActivTechnician(address)", msg.sender);
        // https://ethereum.stackexchange.com/questions/30383/difference-between-call-on-external-contract-address-function-and-creating-contr
        ProfessionalOfficesImpl po = ProfessionalOfficesImpl(proOfficesContract);
        return po.isActivTechnician(_technicianAddress);
    }

}

