import React, { Component } from "react";
import axios from 'axios'
//import { } from "react-router-dom";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import { isEmail, isNumeric } from 'validator';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";


class Changepwd extends Component {
    constructor() {
        super();
      this.state = this.getInitialState();
   }

   getInitialState = () => ({
        data: {
            // Id:"",
            OldPassowrd:"", 
            ChangePassowrd:"" 
            //Cfmwpwd:"" ,
            //EmpId:"123"
        },
        errors: {},
    });

    changeHandler = (e) => {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            },
        });
    };
    
    validate = () => {
        const { data } = this.state;
        let errors = {};
        if (data.ChangePassowrd !== data.Cfmwpwd) errors.Cfmwpwd = 'Confirm Password not match';
        if (data.OldPassowrd === '') 
        errors.OldPassowrd = 'Old Passowrd can not be blank.';
        if (data.Cfmwpwd === '') 
        errors.Cfmwpwd = 'Confirmed Passowrd can not be blank.';
        if (data.ChangePassowrd === '') 
        errors.ChangePassowrd = 'New Passowrd can not be blank.';
        
        return errors;
    };
    
    // onLogout = () => {lo
    //     persistor.purge().then((response) => {
    //       this.props.login({
    //         username: null,
    //         EmpId: null,
    //         Type: null,
    //         status: null,
    //       });
    //       this.props.props.history.push("/sign-in");
    //     });
    //   };

    submitHandler = (e) => {
        e.preventDefault();
        const { data } = this.state;
        var errors = this.validate();

        if (Object.keys(errors).length === 0) {
            console.log(data);
             axios
             .post(
                 `${axios.baseURL}/Login/ChangePassword?EmpID=${this.props.user.info.EmpId}`,
                 this.state.data
                 )
                 .then(response => {
                 this.setState(this.getInitialState());  
                 window.location.reload(true);
                 console.log(response);
                // this.props.props.history.push("/sign-in");
             })
        } else {
            this.setState({ errors });
        }
    };
    
render(){
    const { data, errors } = this.state;
    const { user } = this.props;
    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
   // const { name, username, email, phone, website } = this.state
    const headers = { 'Content-Type':'application/json' }
    return (
        <>
        <Form onSubmit={this.submitHandler}>
               <FormGroup>
                    <Label>Old Password</Label>
                    <Input 
                    type="text" 
                    className="form-control mb-2" 
                    placeholder="Old Password" 
                    id="OldPassowrd"
                    name="OldPassowrd" 
                    value={data.OldPassowrd}
                    invalid={errors.OldPassowrd ? true : false}
                    onChange={this.changeHandler} />
                    <FormFeedback>{errors.OldPassowrd}</FormFeedback>
                </FormGroup>   

                <FormGroup>
                    <Label>New Password</Label>
                    <Input 
                    type="text" 
                    className="form-control mb-2" 
                    placeholder="New Password"
                    id="ChangePassowrd"
                    name="ChangePassowrd" 
                    value={data.ChangePassowrd} 
                    invalid={errors.ChangePassowrd ? true : false}
                    onChange={this.changeHandler} />
                    <FormFeedback>{errors.ChangePassowrd}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label>Confirm Password</Label>
                    <Input 
                    type="text" 
                    className="form-control " 
                    placeholder="Confirm Password"
                    id="Cfmwpwd"
                    name="Cfmwpwd" 
                    value={data.Cfmwpwd} 
                    invalid={errors.Cfmwpwd ? true : false}
                    onChange={this.changeHandler} />
                    <FormFeedback>{errors.Cfmwpwd}</FormFeedback>
                </FormGroup> 
                <Button className="btn btn-primary btn-block mt-3">Submit</Button>
                
          {/* <button type="submit" className="btn btn-primary btn-block">Add User</button> */}
        </Form>
      </>
  );
    }
};

export default connect((state) => ({
    user: state.user,
  }))(Changepwd);
//export default AddDepartmentcls;
