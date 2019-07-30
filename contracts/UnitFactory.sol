pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./ProfessionalOfficesImplV1.sol";

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
        ProfessionalOfficesImplV1 po = ProfessionalOfficesImplV1(proOfficesContract);
        return po.isActivTechnician(_technicianAddress);
    }

}

/**
 *	@title  Track a unit with associated operations 
 * 	@author E. Guyonnet 
 *  @notice Created by factory
 */
contract Unit {

    address private parentFactory;      // address of the factory that created this Unit instance
    address private owner;
    bytes32 private modelNumber;
    bytes32 private modelName;
    bytes32 private manufacturerName;
    uint8 private status;               // { Created = 1, InUse = 5, Destroyed = 10 } -> no ENUM !

    struct Operation {
        uint time;
        uint16 categoryId;              // { Setup = 1, Check = 2, Repair = 3 }
        address technician;             // technician who
        bytes32 reportHash; 		    // IPFS hash (company informations - Json format)
        uint8 statusCtrl;               // { OK = 1, WARN = 2, KO = 3}
    }

    Operation[] private operations;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event SetupOperationCompleted(uint256 operationIndex, address technician, bytes32 reportHash);
    event CheckOperationCompleted(uint256 operationIndex, address technician, bytes32 reportHash);
    event RepairOperationCompleted(uint256 operationIndex, address technician, bytes32 reportHash);
    event OperationControlledOk(uint256 operationIndex);
    event OperationControlledWarn(uint256 operationIndex);
    event OperationControlledKo(uint256 operationIndex);
    event UnitDestroyed();


    /**
     * @dev TODO Throws if the factory is not the msg.sender (used in constructor).
     *      That would request to store the factory contract address as a hard coded constant ?
    modifier onlyFactory() {
        require(factoryAddr == msg.sender, "The Unit can only be created by the factory");
        _;
    }
     */

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /// @notice constructor
    /// @param _owner Owner address is provided because msg.sender is the factory contract address
    /// @param _modelNumber unit model identifier 
    /// @param _modelName unit model name 
    /// @param _manufacturerName unit manufacturer name 
    constructor(address _owner, bytes32 _modelNumber, bytes32 _modelName, bytes32 _manufacturerName) public {
        parentFactory = msg.sender;
        owner = _owner;
        manufacturerName = _manufacturerName;
        modelNumber = _modelNumber;
        modelName = _modelName;
        status = 1;
    }

    // --------------------------------------------------
    // EXTERNAL VIEW
    // --------------------------------------------------

    /// @notice version of the contract
    /// @return string version
    function getVersion() public pure returns (string memory) {
        return "1.0";
    }

    /// @notice returns the owner of the unit
    /// @return address
    function getOwner() external view returns(address) {
        return owner;
    }

    /// @notice returns the manufacturer name
    /// @return bytes32
    function getManufacturerName() external view returns(bytes32) {
        return manufacturerName;
    }

    /// @notice returns the product model number (unique)
    /// @return bytes32
    function getModelNumber() external view returns(bytes32) {
        return modelNumber;
    }

    /// @notice returns model 'commercial' name
    /// @return bytes32
    function getModelName() external view returns(bytes32) {
        return modelName;
    }

    /// @notice returns true if unit is in use
    /// @return bool
    function isInUse() external view returns(bool) {
        return status == 5;
    }

    /// @notice returns true is unit does not work anymore
    /// @return bool
    function isDestroyed() external view returns(bool) {
        return status == 10;
    }

    /// @notice returns number of operations completed
    /// @return uint
    function getOperationsCount() external view returns(uint) {
        return operations.length;
    }

    /// @notice returns the details of an given operation
    /// @param _index Index of the operation
    /// @return time Operation datetime
    /// @return categoryId Operation category id
    /// @return technician Address of the professional who operated
    /// @return reportHash IPFS hash of the JSon report
    /// @return statusCtrl Status of the control
    function getOperation(uint256 _index) external view returns(uint time, uint16 categoryId, address technician, bytes32 reportHash, uint8 statusCtrl) {
        require(_index >= 0 && _index < operations.length, "Invalid index");
        Operation storage myOp = operations[_index];
        return (myOp.time, myOp.categoryId, myOp.technician, myOp.reportHash, myOp.statusCtrl);
    }

    // --------------------------------------------------
    // EXTERNAL UPDATE
    // --------------------------------------------------

    /// @notice transfers ownership of a unit to an other address (only the current owner can do so)
    /// @param _newOwner Address of the new owner
    function transferOwnership(address _newOwner) external onlyOwner {
        _transferOwnership(_newOwner);
    }

    /// @notice updates the current status (only the current owner can do so)
    function changeToDestroyed() external onlyOwner {
        require(status != 10, "Unit already destroyed");
        status = 10;
        emit UnitDestroyed();
    }

    /// @notice Add a setup operation (must be completed by a professional)
    /// @param _reportHash IPFS hash of the JSon report
    function setup(bytes32 _reportHash) external {
        uint index =_operate(1, _reportHash);
        emit SetupOperationCompleted(index, msg.sender, _reportHash);
    }

    /// @notice Add a check operation (must be completed by a professional)
    /// @param _reportHash IPFS hash of the JSon report
    function check(bytes32 _reportHash) external {
        uint index =_operate(2, _reportHash);
        emit CheckOperationCompleted(index, msg.sender, _reportHash);
    }

    /// @notice Add a repair operation (must be completed by a professional)
    /// @param _reportHash IPFS hash of the JSon report
    function repair(bytes32 _reportHash) external {
        uint index = _operate(3, _reportHash);
        emit RepairOperationCompleted(index, msg.sender, _reportHash);
    }

    /// @notice Updates the control status of an operation to OK (must be completed by a certification body)
    /// @param _index Index of the operation controlled
    function controlOperationOk(uint256 _index) external {
        _controlOperation(_index, 1);
        emit OperationControlledOk(_index);
    }

    /// @notice Updates the control status of an operation to wARN (must be completed by a certification body)
    /// @param _index Index of the operation controlled
    function controlOperationWarn(uint256 _index) external {
        _controlOperation(_index, 2);
        emit OperationControlledWarn(_index);
    }

    /// @notice Updates the control status of an operation to KO (must be completed by a certification body)
    /// @param _index Index of the operation controlled
    function controlOperationKo(uint256 _index) external {
        _controlOperation(_index, 3);
        emit OperationControlledKo(_index);
    }

    // --------------------------------------------------
    // PRIVATE UPDATE
    // --------------------------------------------------

    /// @dev Transfers ownership of the contract to a new account (`newOwner`)
    function _transferOwnership(address _newOwner) private {
        require(_newOwner != address(0), "Ownable: new owner is the zero address");
        owner = _newOwner;
        emit OwnershipTransferred(owner, _newOwner);
    }

    /// @dev Create a new operation
    function _operate(uint16 _categoryId, bytes32 _reportHash) private returns (uint) {
        UnitFactory po = UnitFactory(parentFactory);
        require(po.isActivTechnician(msg.sender) == true, "Unknown or inactiv professional");

        operations.push(Operation({time: now, categoryId: _categoryId, technician: msg.sender, reportHash: _reportHash, statusCtrl: 0}));
        // Update unit status
        if (status != 5) 
            status = 5;
        return operations.length - 1;
    }

    /// @dev Updates the control status of an operation
    // TODO later improvment : msg.sender should be a well known certification body
    function _controlOperation(uint256 _index, uint8 _statusCtrl) private {
        require(_index >= 0 && _index < operations.length, "Invalid operation index");
        require(operations[_index].statusCtrl == 0, "Operation already controlled");
        operations[_index].statusCtrl = _statusCtrl;
    }

}