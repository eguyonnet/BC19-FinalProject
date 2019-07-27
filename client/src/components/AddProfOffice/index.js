import React, { Component } from "react";
import { Form, Button, ToastMessage } from 'rimble-ui';
//import styles from './AddProfOffice.module.scss';

export default class AddProfOffice extends Component {

    constructor(props) {
        super(props);
        this.state = { validated: false, name: '', ownerAddress: '', techAddress: ''};
    
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
        try {
            this.props.add(this.props.web3.utils.stringToHex(this.state.name), [this.state.ownerAddress], [this.state.techAddress]);
            this.setState({ validated: true });
            window.toastProvider.addMessage("Adding new professionnal office", {
                secondaryMessage: "Successful", variant: "success"
            });
        } catch (e) {
            console.log("ehhhhh");
        }
    }hhhh

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