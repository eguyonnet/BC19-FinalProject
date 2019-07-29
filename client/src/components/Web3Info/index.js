import React, { Component } from 'react';
import { PublicAddress, Blockie } from 'rimble-ui';
import styles from './Web3Info.module.scss';

export default class Web3Info extends Component {
  render() {
    const { networkId, networkType, currentAccount, balance, isMetaMask } = this.props;
    return (
      <div className={styles.web3}>
        <div width="25%" align="left">
          <p>Network: <b>{networkId} - {networkType}</b></p>          
          <p>Using Metamask: <b>{isMetaMask ? 'YES' : 'NO'}</b></p>
        </div>
        <div width="50%">
          <div className={styles.sub}>
            <PublicAddress address={currentAccount} />
            <Blockie opts={{ seed: currentAccount, size: 15, scale: 3 }} />
          </div>
        </div>
        <div width="25%" align="right">
          <p>ETH balance: <b>{balance}</b></p>
        </div>
      </div>

    );
  }
}
