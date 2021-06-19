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

class EditCompanyTypeMaster extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      // Id:"",
      CompTypeCode:0 ,
      CompTypeName: "",
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

    if (data.CompTypeCode === "") errors.CompTypeCode = "Company Type Code can not be blank.";
    if (data.CompTypeName === "") errors.CompTypeName = "Company Type Name can not be blank.";
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
          `${axios.baseURL}/CompanyTypeMaster/PostCompanyTypeMaster?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&Id=` +
            this.state.data.Id,
          this.state.data
        )
        .then((response) => {
          // $("#myEditModal").modal("hide");
          this.props.closeModal();
           setTimeout(() => {
            alert("Record updated..");
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
      `${axios.baseURL}/CompanyTypeMaster/GetCompanyTypeMasterById?id=${id}`
    );

    let companytypemasterinfo = result.data.Data[0];
    this.setState(
      {
        data: {
          CompTypeCode: companytypemasterinfo.CompTypeCode,
          CompTypeName: companytypemasterinfo.CompTypeName,
          IsActive: companytypemasterinfo.IsActive,
          Id: companytypemasterinfo.Id
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
      let EditCompanyTypeMasterId = nextProps.EditCompanyTypeMasterId;
      console.log("Edit Employee Type Master Id==" + EditCompanyTypeMasterId);
      if (EditCompanyTypeMasterId >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(EditCompanyTypeMasterId);
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
            <Label>Company Type Code</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Company Type Code"
              id="CompTypeCode"
              name="CompTypeCode"
              value={data.CompTypeCode}
              invalid={errors.CompTypeCode ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.CompTypeCode}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label>Company Type Name</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Company Type Name"
              id="CompTypeName"
              name="CompTypeName"
              value={data.CompTypeName}
              invalid={errors.CompTypeName ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.CompTypeName}</FormFeedback>
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
}))(EditCompanyTypeMaster);

//export default EditWorkLocation;
