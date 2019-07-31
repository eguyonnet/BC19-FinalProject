pragma solidity ^0.5.10;

/**
 *	@title  Contract that stores data about professionals agencies that maintain units
 * 	@author E. Guyonnet
 *  @notice Storage contract. The data is manupulated by implementation (holding business logic) 
 *
 */
contract ProfessionalOfficesStorage {

	struct ProfessionalOffice {
		uint24 id;  				        	// Primary Key -> technical id (0 value used for testing existence)
		bytes32 name;				        	// Office name
		mapping(address => bool) owners; 		// Addresses that can update the data of their profesional office (not unique)
		mapping(address => bool) technicians;	// Addresses representing technicians that operate / maintain units (unique across all profesional offices)
		uint8 status;				        	// Status
		uint statusTime;			        	// Status date (default = block datetime as precision is not an issue)
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
	// I do not use ENUM because first at the moment they are not visible outside the contracts
	// and second we can not insert (but dd) new values later
    uint8 constant STATUS_CREATED = 1;
    uint8 constant STATUS_ACTIV = 3;
    uint8 constant STATUS_LOCKED = 5;
    uint8 constant STATUS_CLOSED = 10;
	
}