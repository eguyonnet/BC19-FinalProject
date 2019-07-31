var myStorage = artifacts.require("ProfessionalOfficesImpl");

module.exports = function(deployer) {
  deployer.deploy(myStorage);
};
