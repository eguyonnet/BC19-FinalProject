let BN = web3.utils.BN
let ProfessionalOfficesImplV1 = artifacts.require('ProfessionalOfficesImplV1')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('ProfessionalOfficesImplV1', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const worker = accounts[3]
    const worker2 = accounts[4]

    let proOfficesInstance

    beforeEach(async () => {
        proOfficesInstance = await ProfessionalOfficesImplV1.new({from: owner})
        //await proOfficesInstance.initialize({ from: owner }); 
    })

    describe("Setup", async() => {
        it("owner should be a white listed admin", async() => {
            const isWhiteListAdmin = await proOfficesInstance.isWhitelistAdmin(owner)
            assert.equal(isWhiteListAdmin, true, "Owner is not a white listed admin")
        })
    })

    describe("Functions", async() => {
        it("addProfessionalOffice() - Revert when not authorized", async()=>{
            await catchRevert(proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: alice}))
        })
        it("addProfessionalOffice() - Expecting event", async()=>{
            const tx = await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            assert.equal((tx.logs[0].event == "ProfessionalOfficeCreated") && (tx.logs[0].args.id == Number(1)), true, 'Adding should emit a ProfessionalOfficeCreated event')
        })
        it("getProfessionalOfficeCount()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            const result = await proOfficesInstance.getProfessionalOfficeCount()
            assert.equal(result, Number(1), 'count should be 1')
        })
        it("getProfessionalOffice()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            const result = await proOfficesInstance.getProfessionalOffice(1)
            assert.equal(web3.utils.hexToString(result.name), "RepairMeGas", 'Wrong name')
        })
        it("setProfessionalOfficeActiv() - Expecting event", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            const tx = await proOfficesInstance.setProfessionalOfficeActiv(1, {from: owner})
            assert.equal(tx.logs[0].event == "ProfessionalOfficeActivated", true, 'Changing statut should emit a ProfessionalOfficeActivated event')
        })
        it("isActivTechnician()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            const result1 = await proOfficesInstance.isActivTechnician(alice)
            assert.equal(result1, false, 'alice should be a valid technician')
            const result2 = await proOfficesInstance.isActivTechnician(worker)
            assert.equal(result2, true, 'worker should be a valid technician')
        })
        it("addTechnician() - Revert when already activ in any office", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await catchRevert(proOfficesInstance.addTechnician(1, worker, {from: owner}))
        })
        it("addTechnician()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await proOfficesInstance.setProfessionalOfficeActiv(1, {from: owner})
            await proOfficesInstance.addTechnician(1, worker2, {from: alice})
            const result = await proOfficesInstance.isActivTechnician(worker2)
            assert.equal(result, true, 'worker2 should be a valid technician')
        })
        it("disableTechnician() - Revert when not found or not activ for this professional office", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await catchRevert(proOfficesInstance.disableTechnician(1, worker2, {from: owner}))
        })
        it("disableTechnician()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await proOfficesInstance.setProfessionalOfficeActiv(1, {from: owner})
            await proOfficesInstance.disableTechnician(1, worker, {from: alice})
            const result = await proOfficesInstance.isActivTechnician(worker)
            assert.equal(result, false, 'worker should not be a valid technician anymore')
        })
        it("addOwner() - Revert whent already activ for this professional office", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await catchRevert(proOfficesInstance.addOwner(1, alice, {from: owner}))
        })
        it("addOwner()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await proOfficesInstance.addOwner(1, bob, {from: owner})
        })
        it("disableOwner() - Revert when not activ for this professional office", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await catchRevert(proOfficesInstance.disableOwner(1, bob, {from: owner}))
        })
        it("disableOwner()", async()=>{
            await proOfficesInstance.addProfessionalOffice(web3.utils.stringToHex("RepairMeGas"), [alice], [worker], {from: owner})
            await proOfficesInstance.disableOwner(1, alice, {from: owner})
        })        
    })

});