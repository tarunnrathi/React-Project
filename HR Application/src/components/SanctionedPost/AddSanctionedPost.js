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

class AddWorkLocation extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      DepartmentId: "",
      DesignitionId: "",
      SanctionedPost: "",   
      IsActive: ""
    },
    DepartmentID:[],
    DesignationID:[],
    errors: {},
  });

 componentDidMount() {
    //console.log("devender");
    let DepartmentID, DesignationID;
     axios.get(`${axios.baseURL}/HRAPI/getdepartmentdata`).then((res) => {           
       this.setState({ DepartmentID:res.data.Data});
       //return DepartmentID;
      console.log({DepartmentID}); 
     });  
     axios.get(`${axios.baseURL}/HRAPI/GetDesignationData`).then((res) => {           
      this.setState({ DesignationID:res.data.Data});
      //return DesignationID;
     console.log({DesignationID}); 
    });        
}


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
    if (data.DepartmentId === "") errors.DepartmentId = "Department Id can not be blank.";
    if (data.DesignitionId === "") errors.DesignitionId = "Designition Id can not be blank.";
    if (data.SanctionedPost === "") errors.SanctionedPost = "Sanctioned Post can not be blank.";
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
          `${axios.baseURL}/SanctionedPost/PostSanctionedPost?ActionType=Add&EmpID=${this.props.user.info.EmpId}`,
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
          
          <FormGroup className="mb-2">
            <Label>Department Id</Label>
              <select 
              value={data.DepartmentId}
              className="form-control"
              name="DepartmentId"
              invalid={errors.DepartmentId ? true : false}
              onChange={this.changeHandler}
              >
              <option value={0}> Select Department Id .... </option> 
              { 
              this.state.DepartmentID.map((hmenu) =>(
              <option key={hmenu.Id} value={hmenu.Id}> {hmenu.DeptName}</option>
              )
              )}
              </select>
            {errors.DepartmentId && (
              <Label style={{ color: "#dc3545", fontWeight:"normal" }}>{errors.DepartmentId}</Label>
            )}
          </FormGroup>

          <FormGroup className="mb-2">
            <Label>Designation ID</Label>
              <select 
              className="form-control"
              name="DesignitionId"
              value={data.DesignitionId}
              invalid={errors.DesignitionId ? true : false}
              onChange={this.changeHandler}
              >
              <option placeholder="" value=""> 
              Select Department Id .... 
              </option> 
              { 
              this.state.DesignationID.map((desigID) =>(
              <option key={desigID.Id} value={desigID.Id}> {desigID.DesigName}</option>
              )
              )}
              </select>
            {errors.DesignitionId && (
              <Label style={{ color: "#dc3545", fontWeight:"normal" }}>{errors.DesignitionId}</Label>
            )}
          </FormGroup>

          <FormGroup className="mb-2">
            <Label>Sanctioned Post</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Enter Sanctioned Post"
              id="SanctionedPost"
              name="SanctionedPost"
              value={data.SanctionedPost}
              invalid={errors.SanctionedPost ? true : false}
              onChange={this.changeHandler} />
            <FormFeedback>{errors.SanctionedPost}</FormFeedback>
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
}))(AddWorkLocation);
//export default AddWorkLocation;
