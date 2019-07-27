import React, { Component } from 'react';
import { PublicAddress, Blockie } from 'rimble-ui';
import styles from './Web3Info.module.scss';

export default class Web3Info extends Component {
  render() {
    const { networkId, networkType, currentAccount, balance, isMetaMask } = this.props;
    return (
      <div className={styles.web3}>
        <div className={styles.dataPoint}>
          <div className={styles.label}>Network:</div>
          <div className={styles.value}>{networkId} - {networkType}</div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.label}>Your address:</div>
          <div className={styles.value}>
            <PublicAddress address={currentAccount} />
            <Blockie opts={{ seed: currentAccount, size: 15, scale: 3 }} />
          </div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.label}>Your ETH balance:</div>
          <div className={styles.value}>{balance}</div>
        </div>
        <div className={styles.dataPoint}>
          <div className={styles.label}>Using Metamask:</div>
          <div className={styles.value}>{isMetaMask ? 'YES' : 'NO'}</div>
        </div>
      </div>
    );
  }
}
