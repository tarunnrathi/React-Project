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
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Stamp from "../images/Approved_Stamp.png";



class EmployeeMasterUI extends Component {
 constructor() {
    super();
    this.state = this.getInitialState();
  }
  getInitialState = () => ({
    data: {
    EmpName: "",
    Gender: "0",
    DOB: "",
    PhoneNo: "",
    Email: "",
    Address1: "",
    Address2: "",
    DOJ: "",
    DepartmentId: "0",
    DesignationId: "0",
    CompanyId: "0",
    EmployeeTypeId: "0",
    CreatedBy: "0",
    IsActive: false,
    EmpImage:"",
    PunchingNo:"",
    ApprovedBy:null,
    ApprovedDatetime:null
    
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
    isLoading: true,
    selectedDate: new Date,
    Phoneno: "",
    errors: {},
    genderData: [{ Id: "Male", GenderType: "Male" }, { Id: "Female", GenderType: "Female" }, { Id: "Other", GenderType: "Other" }],
    // ApprovedEnable:this.props.ControlsList!==null?this.props.ControlsList.filter(x=>x.ControlName==="ApprovedBy").map(item=>{
    //   debugger
    //   return item.Enable==="1"?true:false
    // })[0]:false
    
  });

  handleChangeImage= (evt) => {
    //debugger;
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
    this.getCompany();
    this.getEmployeeTypeMaster();
    this.getDepartment();
    this.getDesignation();
    debugger;
    if(this.props.Mode=="Add")
    this.setState({
      ...this.state,
      isLoading:false
    })
  }

//   convertBase64 = (file) => {
//     //debugger;
// return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(file)
//       fileReader.onload = () => {
//         resolve(fileReader.result.base64);
//       }
//       fileReader.onerror = (error) => {
//         reject(error);
//       }
//     })
//   }

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
  getDepartment() {
    axios
      .get(`${axios.baseURL}/HRAPI/getdepartmentdata`)
      .then((response) => {
        let data = response.data.Data;
        this.setState({
          Department: data,
        });
      });
  }
  getDesignation() {
    axios
      .get(`${axios.baseURL}/HRAPI/GetDesignationData`)
      .then((response) => {
        let data = response.data.Data;
        this.setState({
          Designation: data,

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
    //debugger;

    this.setState({
      data: {
        ...this.state.data,
        IsActive: e.target.checked,
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
    if (data.EmpName === '') errors.EmpName = 'Employee Name can not be blank.';
    if (data.IsActive === '') errors.IsActive = 'Status should be blank.';
    return errors;
  }
  submitHandler = (e) => {
    //debugger;
    e.preventDefault();
    // console.log(e);
    // if (this.state.isLoading) {
    //   return;
    // }
    const { data } = this.state;
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      console.log(data);
     // this.setState({ isLoading: true });
      console.log("22211 line");
      console.log({ data: this.state.data });
      var imgbase64=this.state.imgSrc;
      var base64 = (imgbase64.split(';')[1]).split(',');
    //this.state.Employeedata = this.state.data;
    var minArray=this.state.data;
     Object.assign(minArray, { EmpImage: base64[1],CreatedBy:this.props.user.info.EmpId,IsActive:this.state.data.IsActive==true ? 'Y' :'N'});
     //debugger;
    const p=this.props;
     var urlAdd =`${axios.baseURL}/EmployeeMaster/PostEmployeeMaster?ActionType=Add&EmpId=${this.props.user.info.EmpId}`; 
     var urlEdit =`${axios.baseURL}/EmployeeMaster/PostEmployeeMaster?ActionType=Edit&EmpId=${this.props.EmpId}`; 
     var MainUrl = this.props.EmpId > 0 ? urlEdit : urlAdd
     axios      
        .post(
          MainUrl, minArray    
        )
        .then((response) => {
          if(response.data.Status === '1') {
            this.props.EmpId > 0 ? toast.success("Record Updated", { position: toast.POSITION.TOP_CENTER }) : 
            toast.success("Record Added", { position: toast.POSITION.TOP_CENTER })
          this.setState({ isLoading: false });
          this.setState(this.getInitialState());
          window.location.reload(false);
          }
          else
          {
            toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER })
          }
         })
        .catch((error) => {
            toast.error('Server error', { position: toast.POSITION.TOP_CENTER })
          this.setState({ isLoading: false });
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
          EmpName: employeeInfo.EmpName,
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
          EmpImage:employeeInfo.EmpImg,
          PunchingNo:employeeInfo.PunchingNo,
          ApprovedBy:this.props.user.info.username,
          ApprovedDatetime:employeeInfo.ApproveDataTime!==null?employeeInfo.ApproveDataTime.split('T')[0]+" "+employeeInfo.ApproveDataTime.split('T')[1]:null,
         },
        imgSrc:"data:image/jpeg;base64,"+employeeInfo.EmpImg,
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
  //debugger;
      if (this.props !== nextProps) {
        let EmpID = nextProps.EmpId;
        let Mode = nextProps.Mode;
        if(Mode==="Add")
        {
          this.setState({
            ...this.state,
            isLoading:false
          })
            console.log('Add Incoming');
        }
        else
         if (EmpID >= 0) {
         this.loadUser(EmpID);
        }
      }
    }

    approvedFun=(e)=>{
      debugger    
    const{u}=this.props; 
    const{p}=this.state; 
    if(this.state.data.PunchingNo!==null) {
      const today = new Date();  
      const convertedDate=today.getFullYear()+"-"+parseInt(today.getMonth()+1)+"-"+today.getDate()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()
    this.setState({
      data: {
        ...this.state.data,
        ApprovedBy:this.props.user.info.username,
        ApprovedDatetime: convertedDate
      },      
    });
    var approveData={
      Id:this.props.EmpId,
      PunchingNo:this.state.data.PunchingNo,
      ApprovedBy:this.props.user.info.EmpId,     
    }
    this.approvedBy(approveData);
    }else{
      toast.warn("Please Provide PunchingNo...", { position: toast.POSITION.TOP_CENTER });
    }
    }


   async approvedBy(approveData){
      debugger
      
      var approveURL=`${axios.baseURL}/EmployeeMaster/PostEmployeeApproved`;
     // var approveURL=`http://localhost:52227/api/EmployeeMaster/PostEmployeeApproved`;
     await axios.post(approveURL,approveData)
      .then(response=>{
        if(response.data.Status==="1"){
          toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });
        }else{
          toast.warn(response.data.Message, { position: toast.POSITION.TOP_CENTER });
        }
      })
      .catch(error=>{
        toast.error(error, { position: toast.POSITION.TOP_CENTER });
      });
    }



  render() {
    debugger;
    const { data, errors } = this.state;
    const { data1 } = this.props;
    const headers = { "Content-Type": "application/json" };
    var ApprovedEnable=false;

    if(this.props.Mode==="Edit"){
      debugger
      ApprovedEnable=this.props.ControlsList.filter(x=>x.ControlName==="ApprovedBy").map(item=>{
        debugger
        return item.Enable===true || item.Enable==="1"?false:true
      })[0]; 
    }   

    return (
      <>
      {this.state.isLoading==false   ? (
        <Form onSubmit={this.submitHandler} className="px-3 py-2">
          <FormGroup>
            <div className="row">
              <div className="col-md-3">
                <TextField id="EmpName" label="Enter name" name="EmpName" value={data.EmpName}  color="primary" onChange={this.changeHandler} />
                <FormFeedback>{errors.EmpName}</FormFeedback>
              </div>
              <div className="col-md-3"  >
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
              <div className="col-md-3">
                <TextField
                  id="phoneno"
                  label="PhoneNo"
                  type="number"
                  name="PhoneNo"
                  color="primary"
                  value={data.PhoneNo}
                  onChange={this.changeHandler}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="col-md-3">
                <TextField id="Email" label="Enter Email" value={data.Email} name="Email" color="primary" onChange={this.changeHandler} />
              </div>
            </div>
          </FormGroup>
          <FormGroup>
            <div className="row">
              <div className="col-md-3">
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

              <div className="col-md-3" >
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
                  onChange={this.changeHandler}><MenuItem value={data.EmployeeTypeId}>Select Employee Type</MenuItem>
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
              {this.props.Mode==="Edit"?
              
              <FormGroup style={{width:'500px', float:'right',position: 'absolute',left: '602px',top: '208px'}} >
            <div className="row" >
              <div className="col-md-12">
                <div className="col-md-4" >
                <TextField className="col-md-4" 
                  style={{width:'200px',}}
                  id="punchingNo"
                  label="PunchingNo"
                  name="PunchingNo"                  
                  placeholder="punchingNo" 
                  onChange={this.changeHandler} 
                  value={this.state.data.PunchingNo}                 
                />
                </div>
                <div className="col-md-8" style={{width:'600px',}}>
                <div className="row" >
                <TextField className="col-md-4"
                  id="ApprovedBy"
                  label="ApprovedBy"
                  name="ApprovedBy"                  
                  placeholder="ApprovedBy" 
                  value={ this.state.data.ApprovedBy===null && this.state.data.ApprovedDatetime===null?"":this.state.data.ApprovedBy+" "+ this.state.data.ApprovedDatetime}  
                  disabled={true}               
                />
                {/* <span>&nbsp;</span> */}
                 <Button className="col-md-2" 
                 onClick={this.approvedFun} 
                 disabled={ApprovedEnable } 
                 >
                   <img src={Stamp} alt="my image" style={{width:'50px'}}  />
                 </Button>  
              </div>
              </div>  
              </div>
            </div>
          </FormGroup>:null}
            </div>
          </FormGroup>
          <FormGroup>
            <div className="row">
            <div className="col-md-3">
            <input ref="file" type="file" name="file" 
            className="upload-file" 
            id="file"
            onChange={this.changeHandler}
            encType="multipart/form-data" 
            />
            </div>
            <div className="col-md-4">
            <div style={{width:"200px", height:"155px", border:"1px solid",float:"left" }}>
            <img src={this.state.imgSrc} width="200px" heught="155px" />
            </div>
         </div>
            </div>
          </FormGroup>         
        <Button className="btn btn-primary btn-block" type="submit">
            {this.state.isLoading ? "Saving..." : "Submit"}
          </Button>
        </Form>
      ): 
      
      <Loader type="Puff" color="#00BFFF" height={100} width={100} />
      }  

     </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(EmployeeMasterUI);

