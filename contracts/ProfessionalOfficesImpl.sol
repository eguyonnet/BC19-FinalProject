pragma solidity ^0.5.10;

//pragma experimental ABIEncoderV2;
import "openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import "./ProfessionalOfficesStorage.sol";

/**
 *	@title  Contract that holds the business logic for Professional Offices 
 * 	@author E. Guyonnet
 *  @notice Contains the methods / events / modifiers that interact with storage. 
 *          Storage is prohibited in this contract for later deployment through openzeppelin transparent proxy !!
 *  @dev TODO
 * 		- return struct when web3.js will be compatible with ABIEncoderV2 (or use ethers.js instead)
 */
contract ProfessionalOfficesImpl is ProfessionalOfficesStorage, WhitelistAdminRole { 

    // EVENTS
	event ProfessionalOfficeCreated(uint32 indexed id, bytes32 indexed name);
	event ProfessionalOfficeActivated(uint32 indexed id, bytes32 indexed name);
	event ProfessionalOfficeLocked(uint32 indexed id, bytes32 indexed name);
	event ProfessionalOfficeClosed(uint32 indexed id, bytes32 indexed name);

	/**
	 * For manufacturer updates :
	 *		- manufacturerId is valid and exists
	 *		- authorized for admin or manufacturer owners if manufacturer status is Activ 
	 */
	modifier onlyAuthorizedForUpdate(uint32 _id) {
		require(_id != 0 && _id <= officeSequence, "Invalid id");
		require(offices[_id].id != 0, "Not found");
		require(isWhitelistAdmin(msg.sender) || (offices[_id].owners[msg.sender] == true 
			&& offices[_id].status == STATUS_ACTIV), "Not authorized");
		_;
	}

	/**
	 * ManufacturerId is valid and exists
	 */
	modifier onlyExistingOffice(uint32 _id) {
		require(_id != 0 && _id <= officeSequence, "Invalid id");
		require(offices[_id].id != 0, "Not found");
		_;
	}

    /// @notice constructor
   	constructor() public { 
    }

    /// @notice Get the number of professionnal offices
    /// @return bool True if know and activ
    function getProfessionalOfficeCount() external view returns(uint) {
        return officesIdList.length;
    }

	/// @notice Get an office by its id
	/// @dev web3.js does not support yet structs returned for external call (Error: invalid solidity type!: tuple) 
	/// @param _id Professional office id (throw error if not exists)
	/// @return name
	/// @return status
	/// @return statusTime 
	function getProfessionalOffice(uint32 _id) external view onlyExistingOffice(_id) returns(bytes32 name, uint8 status, uint statusTime) {
		return (offices[_id].name, offices[_id].status, offices[_id].statusTime);
	}

    /// @notice Check if a professional (technician) is known and activ
    /// @param _address The technician address
    /// @return bool True if know and activ
    function isActivTechnician(address _address) external view returns(bool) {
        require(_address != address(0), "Invalid address");
        return officeIdByActivTechnicianAddress[_address] != 0;
    }

    /// @notice Add a professional office
    /// @param _name The office name
    /// @param _owners The owners addresses
    /// @param _technicians The technicians addresses
    /// @return uint32 id     
    function addProfessionalOffice(bytes32 _name, address[] calldata _owners, address[] calldata _technicians) external onlyWhitelistAdmin returns(uint32) {
        // TODO test name not empty
        for (uint i = 0; i < _owners.length; i++) {
            require(_owners[i] != address(0), "Invalid owner address");
		}
        for (uint i = 0; i < _technicians.length; i++) {
			require(_technicians[i] != address(0), "Invalid technician address");
            // Check unicity across all offices
            require(officeIdByActivTechnicianAddress[_technicians[i]] == 0, "Technician address already activ in other professional office");
		}

        officeSequence += 1;
        offices[officeSequence].id = officeSequence;
        offices[officeSequence].name = _name;
		for (uint i = 0; i < _owners.length; i++) {
			offices[officeSequence].owners[_owners[i]] = true;
		}	
        for (uint i = 0; i < _technicians.length; i++) {
			offices[officeSequence].technicians[_technicians[i]] = true;
			officeIdByActivTechnicianAddress[_technicians[i]] = officeSequence;
		}	
		offices[officeSequence].status = STATUS_CREATED;
		offices[officeSequence].statusTime = now;
        officesIdList.push(officeSequence);
        emit ProfessionalOfficeCreated(officeSequence, _name);
		return officeSequence;
    }

    /// @notice Activate professional office
    /// @param _id The professional office id
	function setProfessionalOfficeActiv(uint32 _id) external onlyWhitelistAdmin onlyExistingOffice(_id) {
		_changeOfficeStatus(_id, STATUS_ACTIV);
        emit ProfessionalOfficeActivated(_id, offices[_id].name);
	}

    /// @notice Lock professional office
    /// @param _id The professional office id
	function setProfessionalOfficeLocked(uint32 _id) external onlyWhitelistAdmin onlyExistingOffice(_id) {
		_changeOfficeStatus(_id, STATUS_LOCKED);
        emit ProfessionalOfficeActivated(_id, offices[_id].name);
	}

    /// @notice Close professional office
    /// @param _id The professional office id
    function setProfessionalOfficeClosed(uint32 _id) external onlyWhitelistAdmin onlyExistingOffice(_id) {
		_changeOfficeStatus(_id, STATUS_CLOSED);
        emit ProfessionalOfficeActivated(_id, offices[_id].name);
	}

    /// @notice Add a new owner address
    /// @param _officeId The professional office id
    /// @param _address The new owner address
    function addOwner(uint32 _officeId, address _address) external onlyAuthorizedForUpdate(_officeId) {
        require(_address != address(0), "Invalid address");
        require(offices[_officeId].owners[_address] != true, "Owner address already registered for this professional office");
        offices[_officeId].owners[_address] = true;
    }

    /// @notice Disable an existing owner address
    /// @param _officeId The professional office id
    /// @param _address The new owner address
    function disableOwner(uint32 _officeId, address _address) external onlyAuthorizedForUpdate(_officeId) {
        require(_address != address(0), "Invalid address");
        require(offices[_officeId].owners[_address] == true, "Address not known or already inactiv");
        offices[_officeId].owners[_address] = false;
    }

    /// @notice Add a new technician address
    /// @param _officeId The professional office id
    /// @param _address The new technician address
    function addTechnician(uint32 _officeId, address _address) external onlyAuthorizedForUpdate(_officeId) {
        require(_address != address(0), "Invalid address");
        require(officeIdByActivTechnicianAddress[_address] == 0, "Address already activ");
        offices[_officeId].technicians[_address] = true;
        officeIdByActivTechnicianAddress[_address] = _officeId;
    }

    /// @notice Disable an existing technician address
    /// @param _officeId The professional office id
    /// @param _address The new technician address
    function disableTechnician(uint32 _officeId, address _address) external onlyAuthorizedForUpdate(_officeId) {
        require(_address != address(0), "Invalid address");
        require(offices[_officeId].technicians[_address] == true, "Address not known or already inactiv");
        offices[_officeId].technicians[_address] = false;
        officeIdByActivTechnicianAddress[_address] = 0;
    }

    // -----------------------------------------------------------------------
	// PRIVATE
	// -----------------------------------------------------------------------
	
	function _changeOfficeStatus(uint32 _id, uint8 _newStatus) internal {
		require(_id != 0 && _id <= officeSequence, "Invalid professional office id");
		require(offices[_id].id != 0, "Professional office not found");
		uint8 _oldStatus = offices[_id].status;
		require (_oldStatus != _newStatus, "Status already as requested");
		offices[_id].status = _newStatus;
		offices[_id].statusTime = now;
	}

}