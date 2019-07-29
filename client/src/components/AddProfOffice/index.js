import React, { Component } from "react";
import { Form, Button, ToastMessage } from 'rimble-ui';
//import styles from './AddProfOffice.module.scss';

export default class AddProfOffice extends Component {

    constructor(props) {
        super(props);
        this.state = { validated: false, name: 'CrashTest', ownerAddress: '0x1Cc90033F594E93B915FEd4E310Df5Ab98ac9271', techAddress: '0x50eEd4799e3b963C45c122db3F22Fa67791722FE'};
    
        this.handleNameValidation = this.handleNameValidation.bind(this);
        this.handleOwnerAddressValidation = this.handleOwnerAddressValidation.bind(this);
        this.handleTechAddressValidation = this.handleTechAddressValidation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameValidation(event) {
        this.setState({name: event.target.value});
        event.target.parentNode.classList.add("was-validated");
    }
    
    handleOwnerAddressValidation(event) {
        this.setState({ownerAddress: event.target.value});
        event.target.parentNode.classList.add("was-validated");
    }

    handleTechAddressValidation(event) {
        this.setState({techAddress: event.target.value});
        event.target.parentNode.classList.add("was-validated");
    }

    handleSubmit(event) {
        event.preventDefault();
            this.props.add(this.props.web3.utils.stringToHex(this.state.name), [this.state.ownerAddress], [this.state.techAddress]).then((success) => {
                this.setState({ validated: true });
                window.toastProvider.addMessage("Adding new professionnal office", { secondaryMessage: "Successful", variant: "success" });
                this.props.refreshAll();
            }).catch((error) => {
                window.toastProvider.addMessage(error, { secondaryMessage: "Error", variant: "failure" });
            });
    }

    render()  {
        return (
            <div>
                <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
                <div>
                    <h2>New professional office</h2>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field label="Name" width={1}>
                            <Form.Input type="text" required width={1} 
                                value={this.state.name}
                                onChange={this.handleNameValidation}
                                placeholder="e.g. QuickFix Ltd" />
                        </Form.Field>
                        <Form.Field label="Owner address" width={1}>
                            <Form.Input type="text" required width={1} 
                                value={this.state.ownerAddress}
                                onChange={this.handleOwnerAddressValidation} 
                                placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A" />
                        </Form.Field>   
                        <Form.Field label="Owner address" width={1}>
                            <Form.Input type="text" required width={1} 
                                value={this.state.techAddress}
                                onChange={this.handleTechAddressValidation} 
                                placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A" />
                        </Form.Field>   
                        <Button type="submit" width={1}>Add</Button>
                    </Form>
                </div>
            </div>
            
        );
    }
}