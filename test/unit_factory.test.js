const BN = web3.utils.BN
const ProfessionalOffices = artifacts.require('./ProfessionalOfficesImplV1.sol')
const UnitFactory = artifacts.require('UnitFactory')
const Unit = artifacts.require("Unit")
const catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('UnitFactory', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]

    let proOfficesInstance;
    let factoryInstance

    beforeEach(async () => {
        proOfficesInstance = await ProfessionalOffices.deployed()
        //console.log(proOfficesInstance.address);
        factoryInstance = await UnitFactory.new({from: owner})
        await factoryInstance.setProfessionnalsOffices(proOfficesInstance.address, {from: owner})
        //await factoryInstance.initialize({ from: owner })
    })

    describe("UnitFactory", async() => {
        describe("createUnit", async() => {
            it("Should emit event", async()=>{
                const tx = await factoryInstance.createUnit(web3.utils.stringToHex("VBA2428RT"), web3.utils.stringToHex("VIVADENS 24/28"), web3.utils.stringToHex("DE DIETRICH"), {from: alice})
                //console.log(tx.logs[0])
                assert.equal(tx.logs[0].event == "UnitCreated", true, 'Creating a Unit should emit a UnitCreated event')
            })
        })
        describe("getUnitsCount", async() => {
            it("Increment Units count", async()=>{
                await factoryInstance.createUnit(web3.utils.stringToHex("VBA2428RT"), web3.utils.stringToHex("VIVADENS 24/28"), web3.utils.stringToHex("DE DIETRICH"), {from: alice})
                const result1 = await factoryInstance.getUnitsCount()
                assert.equal(result1, Number(1), 'Units count should be 1')
            })
        })
        describe("getUnit", async() => {
            it("Returns the unit contract address", async()=>{
                await factoryInstance.createUnit(web3.utils.stringToHex("VBA2428RT"), web3.utils.stringToHex("VIVADENS 24/28"), web3.utils.stringToHex("DE DIETRICH"), {from: alice})
                const childAddress = await factoryInstance.getUnit(0)
                assert.equal(childAddress != "0x0", true, 'Contract address should be valid')
            })
        })
    })

})