const BN = web3.utils.BN
const ProfessionalOffices = artifacts.require('./ProfessionalOfficesImplV1.sol')
const UnitFactory = artifacts.require('UnitFactory')
const Unit = artifacts.require("Unit")
const catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('Unit', function(accounts) {

    const owner = accounts[0]
    const admin = accounts[1]
    const poOwner = accounts[2]
    const professional = accounts[3]
    const fakeProf = accounts[4]
    const certifier = accounts[5]
    const buyer = accounts[6]

    let proOfficesInstance
    let factoryInstance
    let unitInstance

    beforeEach(async () => {
        //proOfficesInstance = await ProfessionalOffices.deployed({from: admin})
        proOfficesInstance = await ProfessionalOffices.new({from: admin})
        // Add a valid professional office with associated worker
        await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [poOwner], [professional], {from: admin})
        //console.log(proOfficesInstance.address)
        factoryInstance = await UnitFactory.new({from: owner})
        await factoryInstance.setProfessionnalsOffices(proOfficesInstance.address)
        await factoryInstance.createUnit( web3.utils.stringToHex("VBA2428RT"), web3.utils.stringToHex("VIVADENS 24/28"), web3.utils.stringToHex("DE DIETRICH"), {from: owner})
        const childAddress = await factoryInstance.getUnit(0)
        unitInstance = await Unit.at(childAddress)
    })

    describe("Unit", async() => {
        describe("getVersion()", async() => {
            it("Should return version of Unit contract", async()=>{
                const result = await unitInstance.getVersion()
                assert.equal(result, '1.0', 'Unit contract version should be 1')
            })
        })
        describe("getManufacturerName()", async() => {
            it("Should return Manufacturer name", async()=>{
                const result = await unitInstance.getManufacturerName()
                assert.equal(web3.utils.hexToString(result), "DE DIETRICH", 'Manufacturer name should be DE DIETRICH')
            })
        })
        describe("isInUse()", async() => {
            it("Should return false", async()=>{
                const result = await unitInstance.isInUse()
                assert.equal(result, false, 'Should return false')
            })
        })
        describe("transferOwnership() to buyer", async() => {
            it("New owner is buyer, generates an event ", async()=>{
                const tx = await unitInstance.transferOwnership(buyer, {from: owner})
                assert.equal(tx.logs[0].event == "OwnershipTransferred", true, 'Transfering ownership should emit a OwnershipTransferred event')
            })
        })
        describe("Operations", async() => {
            it("Prevent an unknown professional from registering operations", async()=>{
                await catchRevert(unitInstance.setup(web3.utils.stringToHex("IPFSHash"), {from: fakeProf}))
            })
            it("Complete a setup operation", async()=>{
                const countStart = await unitInstance.getOperationsCount()
                assert.equal(countStart, Number(0), 'Operations count should be 0')
                const tx = await unitInstance.setup(web3.utils.stringToHex("IPFSHash"), {from: professional})
                assert.equal(tx.logs[0].event == "SetupOperationCompleted", true, 'Adding a setup operation should emit a SetupOperationCompleted event')
                const countEnd = await unitInstance.getOperationsCount()
                assert.equal(countEnd, Number(1), 'Operations count should be 1')
            })
            it("Control an repair operation", async()=>{
                const tx = await unitInstance.repair(web3.utils.stringToHex("IPFSHash"), {from: professional})
                assert.equal(tx.logs[0].event == "RepairOperationCompleted", true, 'Adding a repair operation should emit a RepairOperationCompleted event')
                const tx2 = await unitInstance.controlOperationOk(0)
                assert.equal(tx2.logs[0].event == "OperationControlledOk", true, 'Controlling an operation OK should emit a OperationControlledOk event')
                const result = await unitInstance.getOperation(0)
                assert.equal(result.statusCtrl, Number(1), 'statusCtrl should be 1 - OK')
            })
            it("Get an check operation", async()=>{
                const tx = await unitInstance.check(web3.utils.stringToHex("IPFSHash"), {from: professional})
                assert.equal(tx.logs[0].event == "CheckOperationCompleted", true, 'Adding a check operation should emit a CheckOperationCompleted event')
                const result = await unitInstance.getOperation(0)
                assert.equal(web3.utils.hexToString(result.reportHash), "IPFSHash", 'reportHash should be IPFSHash')
            })
        })
    })

})