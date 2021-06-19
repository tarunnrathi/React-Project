import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import { isEmail, isNumeric } from "validator";

class EditDesignation extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      // Id:"",
      DesigName: "",
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

    if (data.DesigName === "")
      errors.DesigName = "Depatment Name can not be blank.";
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
          `${axios.baseURL}/HRAPI/PostDesignationData?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&Id=`+
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
          this.props.closeModal();
        })
        .catch((error) => {
          console.log("Error==" + error);
          setTimeout(() => {
            toast.error("Record Failed..",{position:toast.POSITION.TOP_CENTER});
           
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
      `${axios.baseURL}/HRApi/GetDesignationById?id=${id}`
    );
  

    let departmentInfo = result.data.Data[0];
    this.setState(
      {
        data: {
          DesigName: departmentInfo.DesigName,
        
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
  // componentWillMount() {
  //   this.props.load();
  // }

  componentWillReceiveProps(nextProps) {
    debugger
    if (this.props !== nextProps) {
      let designationId = nextProps.designationId;
      console.log("Designation id==" + designationId);
      if (designationId >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(designationId);
       //this.loadUser(18);
      }
    }
  }
  
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   debugger
  //   if (prevState !== nextProps) {
  //     let designationId = nextProps.designationId;
  //     console.log("getDerivedStateFromProps  Designation id==" + designationId);
  //     if (designationId >= 0) {
  //       console.log("Infoo=== 96");
  //       this.loadUser(designationId);
  //     }
  //   }
  // }

  render() {
   
    const { data, errors } = this.state;
    //const { user } = this.props;
    //const { departmentInfo } = this.props;
    const headers = { "Content-Type": "application/json" };
    console.log("new call");
    console.log({ props: this.props });
    console.log(data);
    console.log({ data });

    return (
      <>
        <Form onSubmit={this.submitHandler}>
          <FormGroup>
            <Label>Designation</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Enter Dept Name"
              id="DesigName"
              name="DesigName"
              value={data.DesigName}
              // invalid={errors.DesigName ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.DesigName}</FormFeedback>
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
 }))(EditDesignation);
//export default EditDesignation;
