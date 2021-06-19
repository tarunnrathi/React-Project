import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
//import {  } from "react-router-dom";
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import { isEmail, isNumeric } from "validator";

class AddDesignation extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      // Id:"" Hello Dev Kumar,
      DesigName: "",
      IsActive: "",
      CreatedBy:"" 
    },
    errors: {}
  });

  changeHandler = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: ''
      }
    });
  }

  validate = () => {
    const { data } = this.state;
    let errors = {};
    // if (data.Id === '') errors.Id = 'ID can not be blank.';
    if (data.DesigName === "")
      errors.DesigName = "Designation Name can not be blank.";
    if (data.IsActive === "") errors.IsActive = "Status can not be blank.";

    return errors;
  }

  submitHandler = (e) => {
    e.preventDefault();
    const { data } = this.state;
    const errors = this.validate();

    if (Object.keys(errors).length === 0) {
         // this.setState({
            //     data:{
            //         CreatedBy:this.props.user.info.username
            //     }
        
            // })
      console.log(data);
      axios
        .post(
          `${axios.baseURL}/HRAPI/PostDesignationData?ActionType=Add&EmpID=${this.props.user.info.EmpId}`, this.state.data)
        .then((response) => {
          this.setState(this.getInitialState());
          window.location.reload(false);
          console.log(response);
        })
    } else {
      this.setState({ errors });
    }
  }

  render() {
    const { data, errors } = this.state;
    const { user } = this.props;
    // console.log(this.props.user.info);

    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    // const { name, username, email, phone, website } = this.state
    const headers = { "Content-Type": "application/json" };
    return (
      <>
        <Form onSubmit={this.submitHandler}>
          {/* <FormGroup>
                    <Label>Enter Dept ID</Label>
                    <Input type="text" className="form-control" placeholder="Enter Your Name" 
                    id="Id" 
                    name="Id" 
                    invalid={errors.Id ? true : false}
                    value={data.Id} 
                    onChange={this.changeHandler} />
                    <FormFeedback>{errors.Id}</FormFeedback>
                </FormGroup> */}

          <FormGroup>
            <Label>Designation name</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Enter Designation name"
              id="DesigName"
              name="DesigName"
              value={data.DesigName}
              invalid={errors.DesigName ? true : false}
              onChange={this.changeHandler} />
            <FormFeedback>{errors.DesigName}</FormFeedback>

            {/* {errors.DesigName && (
              <Label >{errors.DesigName}</Label>
            )} */}
            {/* <Label>{errors.DesigName}</Label> */}
          </FormGroup>

          <FormGroup className="mb-3">
            <Label>Is Active</Label>
            <select
              className="form-control"
              name="IsActive"
              value={data.IsActive}
              invalid={errors.IsActive ? true : false}
              onChange={this.changeHandler}
            >
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
              <Label style={{ color: "#dc3545", fontWeight:"normal" }}>{errors.IsActive}</Label>
            )}
          </FormGroup>

           <Button className="btn btn-primary btn-block">Submit</Button> 

          {/* <button type="submit" className="btn btn-primary btn-block">Add User</button> */}
        </Form>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
}))(AddDesignation);
//export default AddDesignation;
