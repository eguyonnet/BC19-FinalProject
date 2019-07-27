import React, { Component } from 'react';
import getWeb3, { getGanacheWeb3 } from './utils/getWeb3';
import Web3Info from './components/Web3Info/index.js';
import AddProfOffice from './components/AddProfOffice/index.js';
import DisplayProfOffice from './components/DisplayProfOffice/index.js';
import { Loader, Flex, Box } from 'rimble-ui';

import styles from './App.module.scss';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    listPO: [],
    route: window.location.pathname.replace('/', ''),
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  };

  componentDidMount = async () => {
    try {
      
      let ProfessionalOffices = {};
      ProfessionalOffices = require("../../contracts/ProfessionalOfficesImplV1.sol");

      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Les 10 comptes créés par Ganache :
        const ganacheAccounts = await this.getGanacheAddresses();
        // Use web3 to get the current user's accounts with just element[0] filled (if metamask not connected, Ganache accounts !!)
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        const isMetaMask = web3.currentProvider.isMetaMask;
        let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : web3.utils.toWei('0');
        balance = web3.utils.fromWei(balance, 'ether');

        let deployedNetwork = null;
        let instancePO = null;
        //console.log(ProfessionalOffices.networks);
        if (ProfessionalOffices.networks) {
          deployedNetwork = ProfessionalOffices.networks[networkId.toString()];
          if (deployedNetwork) {
            instancePO = new web3.eth.Contract(ProfessionalOffices.abi, deployedNetwork && deployedNetwork.address,);
          }
        }
        
        if (instancePO) {
          this.setState({ web3, ganacheAccounts, currentAccount: accounts[0], balance, networkId, networkType, isMetaMask, contractPO: instancePO });
          this.refreshValues(instancePO);
        } else {
          this.setState({ web3, ganacheAccounts, currentAccount: accounts[0], balance, networkId, networkType, isMetaMask });
        }

      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  refreshValues = (instancePO) => {
    if (instancePO) {
      this.getPOCount();
    }
  }

  getPOCount = async () => {
    // Get the value from the contract to prove it worked.
    const response = await this.state.contractPO.methods.getProfessionalOfficeCount().call();
    // Update state with the result.
    this.setState({ countPO: response });
  };

  getPOs = async () => {
    var array = [];
    for (var i = 0; i < this.state.countPO; i++) {
      const result = await this.state.contractPO.methods.getProfessionalOffice(i+1).call();
      console.log(result.name);
      array[i] = result;
    }
    console.log(array);
    this.setState({ listPO: array });
  }

  addPO = async (name, ownerAddress, techAddress) => {
    try {
      await this.state.contractPO.methods.addProfessionalOffice(name, ownerAddress, techAddress).send({ from: this.state.currentAccount });
      this.getPOCount();
      this.setState({ listPO: [] });
    } catch (e) {
      var str = "VM Exception while processing transaction: revert";
      var pos = e.message.search(str);
      if (pos >= 0) {
        console.log(e.message.substring((pos + str.length + 1), e.message.length));
      }
    }
  };

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  render() {
    if (!this.state.web3) {
      return this.renderLoader();
    }
    return (
      <div className={styles.App}>
        <Web3Info {...this.state} />
        <Flex>
          <Box p={3} width={1 / 2}>
            <DisplayProfOffice
              list={this.getPOs}
              {...this.state} />
          </Box>
          <Box p={3} width={1 / 2}>
            <AddProfOffice 
              add={this.addPO}
              {...this.state} />
          </Box>
        </Flex>
      </div>
    );
  }
}

export default App;
