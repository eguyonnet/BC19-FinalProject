import React, { Component } from 'react';
import { PublicAddress, Blockie } from 'rimble-ui';
import styles from './Web3Info.module.scss';

export default class Web3Info extends Component {
  render() {
    const { networkId, networkType, currentAccount, balance, isMetaMask } = this.props;
    return (
      <div className={styles.web3}>
        <div className={styles.onefourth} align="left">
          <p>Network: <b>{networkId} - {networkType}</b></p>          
          <p>Using Metamask: <b>{isMetaMask ? 'YES' : 'NO'}</b></p>
        </div>
        <div className={styles.half}>
          <div>
            <PublicAddress address={currentAccount} />
            </div>
            <div>
              <Blockie opts={{ sefed: currentAccount, size: 15, scale: 3 }} className={styles.qrcode} />
            </div>
        </div>
        <div className={styles.onefourth} align="right">
          <p>ETH balance: <b>{balance}</b></p>
        </div>
      </div>

    );
  }
}
