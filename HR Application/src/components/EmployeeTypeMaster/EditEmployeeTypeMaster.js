import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import { isEmail, isNumeric } from "validator";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class EditEmployeeTypeMaster extends Component {
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

    if (data.EmpTypeCode === "") errors.EmpTypeCode = "Employee Type Code can not be blank.";
    if (data.EmpTypeName === "") errors.EmpTypeName = "Employee Type Name can not be blank.";
    if (data.IsActive === "") errors.IsActive = "Status can not be blank.";

    return errors;
  };

  submitHandler = (e) => {
    e.preventDefault();
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
          `${axios.baseURL}/EmployeeTypeMaster/PostEmployeeTypeMaster?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&Id=` +
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
    const result = await axios.get(
      `${axios.baseURL}/EmployeeTypeMaster/GetEmployeeTypeMasterById?id=${id}`
    );

    let employeetypemasterinfo = result.data.Data[0];
    this.setState(
      {
        data: {
          EmpTypeCode: employeetypemasterinfo.EmpTypeCode,
          EmpTypeName: employeetypemasterinfo.EmpTypeName,
          //IsActive: employeetypemasterinfo.IsActive,
          Id: employeetypemasterinfo.Id,
          IsActive: employeetypemasterinfo.IsActive === "N" ? 'N' : 'Y'
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
    if (this.props !== nextProps) {
      let EditEmployeeTypeMasterId = nextProps.EditEmployeeTypeMasterId;
      console.log("Edit Employee Type Master Id==" + EditEmployeeTypeMasterId);
      if (EditEmployeeTypeMasterId >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(EditEmployeeTypeMasterId);
      }
    }
  }

  render() {
    const { data, errors } = this.state;
    //const { workinglocationinfo } = this.props;
    const headers = { "Content-Type": "application/json" };
    console.log("new call");
    console.log({ props: this.props });
    console.log(data);
    console.log({ data });
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
        </Form>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(EditEmployeeTypeMaster);

//export default EditWorkLocation;
