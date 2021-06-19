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

class EditSanctionedPost extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      //Id:"",
      DepartmentId: "",
      DesignitionId: "",
      SanctionedPost: "",   
      IsActive: ""
    },
    isLoading: false,
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
    // if (data.Id === '') errors.Id = 'ID can not be blank.';
    // if (data.PageName === "") errors.PageName = "Page Name can not be blank.";
    // if (data.Viwe_Index === "") errors.Viwe_Index = "Viwe_Index can not be blank.";
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
          `${axios.baseURL}/SanctionedPost/PostSanctionedPost?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&Id=` +
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
      `${axios.baseURL}/SanctionedPost/GetSanctionedPostById?id=${id}`
    );

    let SanctionedPostinfo = result.data.Data[0];
    this.setState(
      {
        data: {
          Id: SanctionedPostinfo.Id,
          DepartmentId: SanctionedPostinfo.DepartmentId,
          DesignitionId:SanctionedPostinfo.DesignitionId,
          IsActive: SanctionedPostinfo.IsActive,
          SanctionedPost: SanctionedPostinfo.SanctionedPost,
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
      let EditSanctionedPost = nextProps.EditSanctionedPost;
      console.log("Edit Sanctioned Post Location id==" + EditSanctionedPost);
      if (EditSanctionedPost >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(EditSanctionedPost);
      }
    }
  }

  render() {
    const { data, errors } = this.state;
  //  const { SanctionedPostinfo } = this.props;
    const headers = { "Content-Type": "application/json" };
    console.log("new call");
    console.log({ props: this.props });
    console.log(data);
    console.log({ data });
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
  userEdit: state.userEdit.userInfo,
}))(EditSanctionedPost);

//export default EditWorkLocation;
