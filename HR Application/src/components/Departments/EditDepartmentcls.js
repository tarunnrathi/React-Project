import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

class EditDepartmentcls extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      Id:"",
      DeptName: "",
      IsActive: "",
    },
    isLoading: false,
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
      if (data.DeptName === '') errors.DeptName = 'Depatment Name can not be blank.';
      if (data.IsActive === '') errors.IsActive = 'Status can not be blank.';
     
      return errors;
  }

  submitHandler = (e) => {
    e.preventDefault();
    // console.log(e);
    if (this.state.isLoading) {
      return;
    }
    const { data } = this.state;
    const errors = this.validate();

    if (Object.keys(errors).length === 0) {
      console.log(data);

      this.setState({ isLoading: true });
      console.log("22211 line");
      console.log({ data: this.state.data });
      axios
          .post(
            `${axios.baseURL}/HRAPI/PostDepartmentData?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&Id=` +
              this.state.data.Id,
            this.state.data
          )
        .then((response) => {
          // $("#myEditModal").modal("hide");
          this.props.closeModal();
          setTimeout(() => {
            toast.error("Record Updated",{position:toast.POSITION.TOP_CENTER});
          }, 1000);

          this.setState({ isLoading: false });

          // this.setState(this.getInitialState());
          // window.location.reload(false);
          console.log(response);
          // window.$("#myEditModal").modal("hide");
          // window.location.reload();
        })
        .catch((error) => {
          console.log("Error==" + error);
          setTimeout(() => {
            alert("Record Failed..");
          }, 1000);
          this.props.closeModal();
          // window.$("#myEditModal").modal("hide");
          // window.location.reload();
        });
    } else {
      this.setState({ errors });
    }
  };

  loadUser = async (id) => {
   debugger;
    const result = await axios.get(
      `${axios.baseURL}/HRAPI/GetDepartmentDataById?id=${id}`
    );
    console.log("infoo==");
    console.log({ result });

    let departmentInfo = result.data.Data[0];
    this.setState(
      {
        data: {
          DeptName: departmentInfo.DeptName,
          //IsActive: departmentInfo.IsActive,
          Id: departmentInfo.Id,
          IsActive: departmentInfo.IsActive === 'N' ? 'N' : 'Y'
        },
        isLoading: false,
      },
      () => {
        console.log("data===");
        console.log(this.state.data);
        console.log(this.state);
      }
    );
  };

  componentWillReceiveProps(nextProps) {
debugger;
    if (this.props !== nextProps) {
      let departmentId = nextProps.departmentId;
      if (departmentId >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(departmentId);
      }
    }
  }

  render() {
    const { data, errors } = this.state;
    const { departmentInfo } = this.props;
    const headers = { "Content-Type": "application/json" };
    console.log("new call");
    console.log({ props: this.props });
    console.log(data);
    console.log({ data });
    return (
      <>
        <Form onSubmit={this.submitHandler} className="px-3 py-2">
          <FormGroup>
            <Label>Department name</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Enter Department name"
              id="DeptName"
              name="DeptName"
              value={data.DeptName}
              // invalid={errors.DeptName ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.DeptName}</FormFeedback>
          </FormGroup>

          <FormGroup className="mb-3">
            <Label>Is Active</Label>
            <select
              className="form-control"
              name="IsActive"
              value={data.IsActive}
              //   invalid={errors.IsActive ? true : false}
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
            <FormFeedback>{errors.IsActive}</FormFeedback>
          </FormGroup>

          <Button className="btn btn-primary btn-block" type="submit">
            {this.state.isLoading ? "Loading..." : "Submit"}
          </Button>

          {/* <button type="submit" className="btn btn-primary btn-block">Add User</button> */}
        </Form>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(EditDepartmentcls);
//export default EditDepartmentcls;
