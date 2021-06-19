import React, { Component } from "react";
import axios from 'axios'
//import {  } from "react-router-dom";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import { isEmail, isNumeric } from 'validator';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class AddDepartmentcls extends Component {
     constructor() {
        super();
      this.state = this.getInitialState();
   }
   getInitialState = () => ({
        data: {
            // Id:"",
            DeptName:"", 
            IsActive:"", 
            CreatedBy:"" 
            //CreatedBy:{user.info.username}
        },
        data1: {
            // Id:"",
            DeptName:"", 
            IsActive:"", 
            CreatedBy:"" 
            //CreatedBy:{user.info.username}
        },
        errors: {}
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
            }
        });
    }
    
    validate = () => {
      debugger;
        const { data } = this.state;
        let errors = {};
        debugger;
        // if (data.Id === '') errors.Id = 'ID can not be blank.';
        if (data.DeptName === '') errors.DeptName = 'Depatment Name can not be blank.';
        if (data.IsActive === '') errors.IsActive = 'Status can not be blank.';
        // if (!isEmail(data.email)) errors.email = 'Email must be valid.';
        // if (data.email === '') errors.email = 'Email can not be blank.';
        // if (!isNumeric(data.phone)) errors.phone = 'Phone no must be valid.';
        // if (data.phone === '') errors.phone = 'Phone no is Empty.';
        // if (data.website === '') errors.website = 'Password must be valid.';
        return errors;
    }

    submitHandler = (e) => {
      debugger;
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            console.log(data);
            // console.log(this.props.user.info.username)
            // console.log("user data==" + JSON.stringify(this.props.user));
            // var url = `http://localhost:3000/api//HRAPI/PostDepartmentData?ActionType=Add&EmpID=${this.props.user.info.EmpId}`;
            // axios.post(url, this.state.data)

            axios.post(`${axios.baseURL}/HRAPI/PostDepartmentData?ActionType=Add&EmpID=${this.props.user.info.EmpId}`, this.state.data)
            .then(response => {
                this.setState(this.getInitialState());  
                window.location.reload(false);
                console.log(response);
            })
           
        } else {
            this.setState({ errors });
        }
       
    }
    
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
                    <Label>Department name</Label>
                    <Input 
                    type="text" 
                    
                    className="form-control" 
                    placeholder="Enter Department Name"
                    id="DeptName"
                    name="DeptName" 
                    value={data.DeptName} 
                    invalid={errors.DeptName ? true : false}
                    onChange={this.changeHandler} />
                    <FormFeedback>{errors.DeptName}</FormFeedback>
                </FormGroup>
                
                <FormGroup className="mb-3">
                    <Label>Is Active</Label>
                    <select
                    className="form-control"
                    name="IsActive"
                    value={data.IsActive}
                   // invalid={errors.IsActive ? true : false}
                   // onInvalid={errors.IsActive ? true : false}
                    onChange={this.changeHandler}>
                    <option placeholder="" value="">
                    Select Status
                    </option>
                    <option kay="Y" value="Y">
                    Yes
                    </option>
                    <option kay="N" value="N">
                    No
                    </option>
                    </select>
                    {errors.IsActive && (
                    <Label style={{ color: "#dc3545" }}>{errors.IsActive}</Label>
                    )}
                </FormGroup>
               
                <Button className="btn btn-primary btn-block">Submit</Button>
                
          {/* <button type="submit" className="btn btn-primary btn-block">Add User</button> */}
        </Form>
      </>
  );
    }
};

export default connect((state) => ({
    user: state.user,
  }))(AddDepartmentcls);
//export default AddDepartmentcls;
