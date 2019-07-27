pragma solidity ^0.5.8;

/**
 *	@title  Storage data about professionals agencies
 * 	@author E. Guyonnet
 *  @notice Store the data about professionals agencies that maintain units
 *
 */
contract ProfessionalOfficesStorage {

	struct ProfessionalOffice {
		uint24 id;  				        	// Primary Key -> technical id (0 value used for testing existence)
		bytes32 name;				        	// Office name
		mapping(address => bool) owners; 		// Accounts that can manage data (not unique)
		mapping(address => bool) technicians;	// Identify an member that operates / maintain units (unique)
		uint8 status;				        	// Status
		uint statusTime;			        	// Status date (default = block datetime)
		//Document[] documents;             	// List of documents (ex. certifications, ...)
	}


	uint24 internal officeSequence = 0; // 0 is not a vaid id (zero value used to test existence)
	// Collection of ProfessionalOffice
	mapping(uint24 => ProfessionalOffice) internal offices;
	// Search technicians by address : make sure address is unique accross all ProfesionnalOffices and allow to find who (what agency) did maintain
	// When an technician changes office, he gets a new address
	mapping(address => uint24) internal officeIdByActivTechnicianAddress;
	// Iterate through ProfesionnalOffices
	uint24[] internal officesIdList;

	// Status of profesional offices
    uint8 constant STATUS_CREATED = 1;
    uint8 constant STATUS_ACTIV = 3;
    uint8 constant STATUS_LOCKED = 5;
    uint8 constant STATUS_CLOSED = 10;
	
}