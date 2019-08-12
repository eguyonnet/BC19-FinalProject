import React, { Component } from "react";
import { Table } from 'rimble-ui';
//import styles from './DisplayProfOffice.module.scss';

export default class DisplayProfOffice extends Component {

    render()  {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>STATUS</th>
                            <th>STATUS DATE</th>
                        </tr>
                    </thead>
                    <tbody> 
                        { this.props.listPO.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{this.props.web3.utils.hexToString(item.name)}</td>
                                    <td>{item.status.replace("1","Created")}</td>
                                    <td>{new Date(item.statusTime*1000).toLocaleDateString()}</td>
                                </tr>
                            );
                        })} 
                    </tbody> 
                </Table>
                <p align='right'>Total count : {this.props.countPO}</p>
            </div>
        );
    }
}