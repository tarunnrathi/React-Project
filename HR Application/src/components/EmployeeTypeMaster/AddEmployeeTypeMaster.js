import React, { Component } from "react";
import axios from "axios";
//import {  } from "react-router-dom";
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import { isEmail, isNumeric } from "validator";

class AddEmployeeTypeMaster extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      // Id:"",
      EmpTypeCode: "",
      EmpTypeName:"",
      IsActive: "",
    },
    errors: {},
  });

  changeHandler = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
    });
  };

  validate = () => {
    const { data } = this.state;
    let errors = {};

    // if (data.Id === '') errors.Id = 'ID can not be blank.';
    if (data.EmpTypeCode === "") errors.EmpTypeCode = "Employee Type Code can not be blank.";
    if (data.EmpTypeName === "") errors.EmpTypeName = "Employee Type Name can not be blank.";
    if (data.IsActive === "") errors.IsActive = "Status can not be blank.";

    return errors;
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { data } = this.state;
    var errors = this.validate();
    if (Object.keys(errors).length === 0) {
      console.log(data);
      axios
        .post(
          `${axios.baseURL}/EmployeeTypeMaster/PostEmployeeTypeMaster?ActionType=Add&EmpID=${this.props.user.info.EmpId}`,
          this.state.data
        )
        .then((response) => {
          this.setState(this.getInitialState());
          window.location.reload(true);
          console.log(response);
        });
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const { data, errors } = this.state;
    const headers = { "Content-Type": "application/json" };
    return (
      <>
        <Form onSubmit={this.submitHandler}>
        <FormGroup>
            <Label>Employee Type Code</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Employee Type Code"
              id="EmpTypeCode"
              name="EmpTypeCode"
              value={data.EmpTypeCode}
              invalid={errors.EmpTypeCode ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.EmpTypeCode}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label>Employee Type Name</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Employee Type Name"
              id="EmpTypeName"
              name="EmpTypeName"
              value={data.EmpTypeName}
              invalid={errors.EmpTypeName ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.EmpTypeName}</FormFeedback>
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
              <option key="Y" value="Y">
                Yes
              </option>
              <option key="N" value="N">
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
}))(AddEmployeeTypeMaster);
//export default AddWorkLocation;
