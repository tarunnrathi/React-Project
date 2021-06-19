import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Select, MenuItem, InputLabel, Switch, FormControlLabel } from '@material-ui/core'
import ImageUploader from 'react-images-upload';
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
//import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Moment from 'moment'

class DocumentForm extends Component {
 constructor() {
    super();
    this.state = this.getInitialState();
  }
  getInitialState = () => ({
    data: {
    EmpId: "",
    IsActive: "",
    CompanyID: "",
    CreatedBy: "",
    DocImg: ""
    },
    company: [],
    EmployeeType: [],
    Department: [],
    Designation: [],
    Employeedata:[],
    imgSrc:"",
    file:[],
    files: [],
    ImageBase64:null,
    isLoading: false,
    selectedDate: new Date,
    Phoneno: "",
    errors: {},
    genderData: [{ Id: "Male", GenderType: "Male" }, { Id: "Female", GenderType: "Female" }, { Id: "Other", GenderType: "Other" }]
  });

  handleChangeImage= (evt) => {
    debugger;
    console.log("Uploading");
    var self = this;
    var reader = new FileReader();
    var file = evt.target.files[0];

    reader.onload = function(upload) {
        self.setState({
          imgSrc: upload.target.result
        });
    };
    reader.readAsDataURL(file);
    console.log(this.state.imgSrc);
    console.log("Uploaded");
   
}

  componentDidMount() {
    // this.getCompany();
    // this.getEmployeeTypeMaster();
    // this.getDepartment();
    // this.getDesignation();
  }

  getCompany() {
    axios
      .get(`${axios.baseURL}/CompanyMaster/GetCompanyListByEmpId?EmpId=${this.props.user.info.EmpId}`)
      .then((response) => {
        console.log(response.data.Data);
        let data = response.data.Data;
        this.setState({
          company: data,
        });
      });
  }

  getEmployeeTypeMaster() {
    axios
      .get(`${axios.baseURL}/EmployeeTypeMaster/GetEmployeeTypeMaster`)
      .then((response) => {
        let data = response.data.Data;
        this.setState({
          EmployeeType: data,
        });
      });
  }

  changeHandler = (e) => {
    debugger;
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

  changeHandlerIsActive = (e) => {
    debugger;

    this.setState({
      data: {
        ...this.state.data,
        IsActive: e.target.checked==true ? "Y" : "N",
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
    });
  }

  validate = () => {
    const { data } = this.state;
    let errors = {};
    if (data.EmpId === '') errors.EmpId = 'Document Name can not be blank.';
    if (data.IsActive === '') errors.IsActive = 'Status should be blank.';
    return errors;
  }

  submitHandler = (e) => {
    debugger;
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
      var imgbase64=this.state.imgSrc;
      var base64 = (imgbase64.split(';')[1]).split(',');

      //this.state.Employeedata = this.state.data;
      var minArray=this.state.data;
      Object.assign(minArray, { EmpImage: base64[1]});
      //const p=minArray;
      var url =`${axios.baseURL}/EmployeeMaster/PostEmployeeMaster?ActionType=Add&EmpId=${this.props.user.info.EmpId}`; 
     
      axios      
        .post(
           url, minArray    
        )
        .then((response) => {
          debugger;

         setTimeout(() => {
          toast.success("Record Added", { position: toast.POSITION.TOP_CENTER }) 
          }, 1000);
          this.setState({ isLoading: false });
          this.setState(this.getInitialState());
          console.log(response);
         })
        .catch((error) => {
          console.log("Error==" + error);
          setTimeout(() => {
            alert("Record Failed..");
          }, 1000);
          this.setState({ isLoading: false });
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
        `${axios.baseURL}/EmployeeMaster/GetEmployeeById?EmpId=`+id
    );
    console.log("infoo==");
    console.log({ result });

    let employeeInfo = result.data.Data[0];
    
    this.setState(
      {
        data: {
          EmpId: employeeInfo.EmpId,
          Gender: employeeInfo.Gender,
          DOB: Moment(employeeInfo.DOB).format('YYYY-MM-DD'),
          PhoneNo: employeeInfo.PhoneNo,
          Email: employeeInfo.Email,
          Address1: employeeInfo.Address1,
          Address2: employeeInfo.Address2,
          DOJ: Moment(employeeInfo.DOJ).format('YYYY-MM-DD'),
          DepartmentId: employeeInfo.DepartmentId,
          DesignationId: employeeInfo.DesignationId,
          CompanyId: employeeInfo.CompanyId,
          EmployeeTypeId: employeeInfo.EmployeeTypeId,
          CreatedBy: employeeInfo.CreatedBy,
          IsActive: employeeInfo.IsActive=="Y" ? true : false,
          EmpImage:employeeInfo.EmpImage
         },
        isLoading: false,
      },
      () => {
        console.log("data===");
        console.log(this.state.data);
        }
    );
  };

  handleDateChange = (date) => {
    this.setState({
      ...this.state,
      selectedDate: date,
    })
  };

    componentWillReceiveProps(nextProps) {
  debugger;
      if (this.props !== nextProps) {
        let EmpID = nextProps.EmpId;
        let Mode = nextProps.Mode;
        if(Mode==="Add")
        {
            console.log('Add Incoming');
        }
        else
         if (EmpID >= 0) {
          console.log('Edit Incoming');
          console.log("Infoo=== 96");
          this.loadUser(EmpID);
        }
      }
    }



  render() {
    debugger;
    const { data, errors } = this.state;
    const headers = { "Content-Type": "application/json" };
    console.log("new call");
    console.log({ props: this.props });
    console.log(data);
    console.log({ data });
    return (
      <>
        <Form onSubmit={this.submitHandler} className="px-3 py-2">
          <FormGroup className="row"       >
            <div>
              <div className="col-md-6">
                <TextField id="EmpId" label="Enter name" name="EmpId" value={data.EmpId}  color="primary" onChange={this.changeHandler} />
                <FormFeedback>{errors.EmpId}</FormFeedback>
              </div>
              <div className="col-md-6">
                <Select defaultValue={'SelectGender'} id="selectGender" name="Gender" value={data.Gender}
                  onChange={this.changeHandler}><MenuItem value={"0"}>Select Gender</MenuItem>
                  {
                    this.state.genderData.map((hmenu) => (
                      <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.GenderType}</MenuItem>
                    ))
                  }
                </Select>
                <FormFeedback>{errors.Gender}</FormFeedback>
              </div>
            </div>
          </FormGroup>

          {/* <FormGroup>
            <div className="row">
              <div className="col-md-6">
                <TextField
                  id="Address1"
                  label="Address1"
                  name="Address1"
                  onChange={this.changeHandler}
                  value={data.Address1}
                  placeholder="Address1"
                  multiline
                />
              </div>
              <div className="col-md-6" >
                <TextField
                  id="Address2"
                  label="Address2"
                  name="Address2"
                  onChange={this.changeHandler}
                  value={data.Address2}
                  placeholder="Address2"
                  multiline
                />
              </div>
            </div>
          </FormGroup>
          
          <FormGroup>
            <div className="row">
              <div className="col-md-3">
                <TextField
                  id="dob"
                  label="Date of Birth"
                  name="DOB"
                  type="date"
                  //defaultValue={this.selectedDate}
                  value={data.DOB}
                  onChange={this.changeHandler}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="col-md-3">
                <TextField
                  id="doj"
                  label="Date of Joining"
                  name="DOJ"
                  type="date"
                  // defaultValue={this.selectedDate}
                  value={data.DOJ}
                  onChange={this.changeHandler}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <div className="col-md-3">
                <Select id="selectcompany" name="CompanyId" value={data.CompanyId}
                  onChange={this.changeHandler}><MenuItem value={data.CompanyId}>Select Company</MenuItem>
                  {
                    this.state.company.map((hmenu) => (
                      <MenuItem key={hmenu.CompanyCode} value={hmenu.CompanyCode}>{hmenu.CompanyName}</MenuItem>
                    ))
                  }
                </Select>
              </div>

              <div className="col-md-3">
                <Select id="selectEmployeeType" name="EmployeeTypeId" value={data.EmployeeTypeId}
                  onChange={this.changeHandler}><MenuItem value={data.EmployeeTypeId}>Select Document Type</MenuItem>
                  {
                    this.state.EmployeeType.map((hmenu) => (
                      <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.EmpTypeName}</MenuItem>
                    ))
                  }
                </Select>
              </div>
            </div>
          </FormGroup>
          <FormGroup>
            <div className="row">
              <div className="col-md-3">
                <Select id="selectDepartment" name="DepartmentId" value={data.DepartmentId}
                  onChange={this.changeHandler}><MenuItem value={data.DepartmentId}>Select Department</MenuItem>
                  {
                    this.state.Department.map((hmenu) => (
                      <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.DeptName}</MenuItem>
                    ))
                  }
                </Select>
              </div>
              <div className="col-md-3">
                <Select id="selectDesignation" name="DesignationId" value={data.DesignationId}
                  onChange={this.changeHandler}><MenuItem value={data.DesignationId}>Select Designation</MenuItem>
                  {
                    this.state.Designation.map((hmenu) => (
                      <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.DesigName}</MenuItem>
                    ))
                  }
                </Select>
              </div>
              <div className="col-md-3">
              <FormControlLabel labelPlacement="start" label="Is Active"
            control={<Switch checked={data.IsActive}  onChange={this.changeHandlerIsActive} name="IsActive"
              color="primary" />}
          />
              </div>
            </div>
          </FormGroup>
          <FormGroup>
            <div className="row">
            <div className="col-md-3">
            <input ref="file" type="file" name="file" 
            className="upload-file" 
            id="file"
            onChange={this.handleChangeImage}
            encType="multipart/form-data" 
            required/>
            </div>
            <div className="col-md-4">
            <div style={{width:"200px", height:"155px", border:"1px solid",float:"left" }}>
            <img src={this.state.imgSrc} width="200px" height="155px" />
            </div>
         </div>
            </div>
          </FormGroup> */}

          <Button className="btn btn-primary btn-block" type="submit">
            {this.state.isLoading ? "Saving..." : "Submit"}
          </Button>


        </Form>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(DocumentForm);

