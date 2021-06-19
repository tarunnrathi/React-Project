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

class DocMasterform extends Component {
 constructor() {
    super();
    this.state = this.getInitialState();
  }
  getInitialState = () => ({
    data: {
      EmpId:"",
      CompanyId:"",
      IsActive: "",
    },
    company: [],
    EmployeeId: [],
    //Employeedata:[],
    imgSrc:"",
    file:[],
    files: [],
    //ImageBase64:null,
    isLoading: false,
    selectedDate: new Date,
  
    errors: {},
    isLoading: true,
    //genderData: [{ Id: "Male", GenderType: "Male" }, { Id: "Female", GenderType: "Female" }, { Id: "Other", GenderType: "Other" }]
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
    this.getEmployeeId();
    this.setState({
      ...this.state,
      isLoading:false
    })
  }

  getCompany() {
    axios
      .get(`${axios.baseURL}/CompanyMaster/CompanyMaster`)
      .then((response) => {
      console.log(response.data.Data);
      let data = response.data.Data;
      this.setState({
      company: data,
        });
      });
  }

  getEmployeeId() {
    axios
      .get(`${axios.baseURL}/EmployeeMaster/GetEmployees`)
      .then((response) => {
        let data = response.data.Data;
        this.setState({
          EmployeeId: data,
        });
      });
  }
 

  changeHandler = (e) => {
    //debugger;
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
    debugger;
    e.preventDefault();
    const { data } = this.state;
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      console.log(data);

      console.log("22211 line");
      console.log({ data: this.state.data });
      var imgbase64=this.state.imgSrc;
      var base64 = (imgbase64.split(';')[1]).split(',');

    var minArray=this.state.data;
     Object.assign(minArray, { DocImg: base64[1],CreatedBy:this.props.user.info.EmpId,IsActive:this.state.data.IsActive==true ? 'Y' :'N'});
     var  MinArray={
      "EmpId": `${minArray.EmpId}`,
      "IsActive": `${minArray.IsActive}`,
      "CompanyId": `${minArray.CompanyId}`,
      "CreatedBy": `${minArray.CreatedBy}`,
      "DocImg": minArray.DocImg
     }
     //debugger;
    const p=this.props;
     var urlAdd =`${axios.baseURL}/DocumentMaster/PostDocumentMaster?ActionType=Add&CreatedBy=${this.props.user.info.EmpId}`; 
    var urlEdit =`${axios.baseURL}/DocumentMaster/PostDocumentMaster?ActionType=Edit&CreatedBy=${this.props.user.info.EmpId}`;
     
     var MainUrl = this.props.DocID > 0 ? urlEdit : urlAdd
     axios      
        .post(
          MainUrl, MinArray   
        )
        .then((response) => {
          debugger;
          if(response.data.Status === '1') {
            this.props.DocID > 0 ? toast.success("Record Updated", { position: toast.POSITION.TOP_CENTER }) : 
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
        `${axios.baseURL}/DocumentMaster/GetDocumenById?DocID=`+id
    );
   

    let documentinfo = result.data.Data;
    debugger;
    console.log("infoo==");
    console.log({ documentinfo });
    
    this.setState(
      {
        data: {
          EmpId: documentinfo.EmpId,
          CompanyId: documentinfo.CompanyId,
          IsActive: documentinfo.IsActive=="Y" ? true : false,
          DocImg: documentinfo.DocImg
         },
        imgSrc:"data:image/jpeg;base64,"+documentinfo.DocImg,
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
      let DocID = nextProps.DocID;
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
        if (DocID >= 0) {
        this.loadUser(DocID);
      }
    }
  }

  render() {
    //debugger;
    const { data, errors } = this.state;
    const headers = { "Content-Type": "application/json" };
    return (
      <>
      {this.state.isLoading==false  ? (
        <Form onSubmit={this.submitHandler} className="px-3 py-2">
          <FormGroup>
            <div className="row">
            
            <Select id="EmpId" name="EmpId" value={`${data.EmpId}`}
                  onChange={this.changeHandler}><MenuItem value={data.EmpId}>Select Employee</MenuItem>
                  {
                    this.state.EmployeeId.map((hmenu) => (
                      <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.EmpName}</MenuItem>
                    ))
                  }
                </Select>
            
             
                <Select id="CompanyId" name="CompanyId" value={`${data.CompanyId}`}
                  onChange={this.changeHandler}><MenuItem value={data.Id}>Select Company</MenuItem>
                  {
                    this.state.company.map((hmenu) => (
                      <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.CompanyName}</MenuItem>
                    ))
                  }
                </Select>
              
              
              <FormControlLabel labelPlacement="start" label="Is Active"
            control={<Switch checked={data.IsActive}  onChange={this.changeHandlerIsActive} name="IsActive"
              color="primary" />}
          />
             
            </div>
          </FormGroup>
          <FormGroup>
            <div className="row">
            
            <input ref="file" type="file" name="file" 
            className="upload-file" 
            id="file"
            onChange={this.handleChangeImage}
            encType="multipart/form-data" 
            />
            
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
}))(DocMasterform);

