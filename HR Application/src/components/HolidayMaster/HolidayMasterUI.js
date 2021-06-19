import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { connect } from "react-redux";
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


class HolidayMasterUI extends Component {
 constructor() {
    super();
    this.state = this.getInitialState();
  }
  getInitialState = () => ({
    data: {
    HolidayName: "",
    HolidayDate: "",
    HolidayType: 0,
    IsActive: "",
    },
    company: [],
    isLoading: false,
    selectedDate: new Date,
    errors: {},
    isLoading: true,
  
  });

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

  validate = () => {
    const { data } = this.state;
    let errors = {};
    if (data.HolidayName === '') errors.HolidayName = 'Holiday Name can not be blank.';
    if (data.HolidayDate === '') errors.HolidayDate = 'Holiday Date can not be blank.';
    if (data.HolidayType === '') errors.HolidayType = 'Holiday Type can not be blank.';
    if (data.IsActive === '') errors.IsActive = 'Status should be blank.';
    return errors;
  }

  submitHandler = (e) => {
    e.preventDefault();
    const { data } = this.state;
    console.log(data);
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
    //this.state.Employeedata = this.state.data;
    var minArray=this.state.data;
    console.log("minArray----------------------");
   // console.log(minArray);
     //Object.assign(minArray, { EmpImage: base64[1],CreatedBy:this.props.user.info.HolidayId,IsActive:this.state.data.IsActive==true ? 'Y' :'N'});
     debugger;
    const p=this.props;
     var urlAdd =`${axios.baseURL}/HolidayMaster/PostHolidayMaster?ActionType=Add&HolidayId=0&EmpId=${this.props.user.info.EmpId}`;
     var urlEdit =`${axios.baseURL}/HolidayMaster/PostHolidayMaster?ActionType=Edit&HolidayId=${this.props.HolidayId}&EmpId=${this.props.user.info.EmpId}`; 
     
    // var urlEdit =`${axios.baseURL}/HolidayMaster/PostHolidayMaster?ActionType=Edit&HolidayId=${this.props.HolidayId}`; 
     var MainUrl = this.props.HolidayId > 0 ? urlEdit : urlAdd
     axios      
        .post(
          MainUrl, minArray    
        )
        .then((response) => {
          if(response.data.Status === '1') {
            this.props.HolidayId > 0 ? toast.success("Record Updated", { position: toast.POSITION.TOP_CENTER }) : 
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
    const result = await axios.get(
        `${axios.baseURL}/HolidayMaster/GetHolidayMasterById?id=`+id
    );
    console.log("infoo==");
    console.log({ result });

    let holidayInfo = result.data.Data[0];
    this.setState(
      {
        data: {
          HolidayName: holidayInfo.HolidayName,
          HolidayDate: holidayInfo.HolidayDate,
          IsActive: holidayInfo.IsActive === "NO" ? 'N' : 'Y',
          HolidayType: holidayInfo.HolidayType === "RH" ? '1' : '2',
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
  //debugger;
      if (this.props !== nextProps) {
        let HolidayId = nextProps.HolidayId;
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
         if (HolidayId >= 0) {
         this.loadUser(HolidayId);
        }
      }
  }
  render() {
    debugger;
    const { data, errors } = this.state;
    const headers = { "Content-Type": "application/json" };
    return (
      <>
      <Form onSubmit={this.submitHandler}>
        <div className="row">
          <FormGroup className="col-lg-6">
            <Label>Holiday Name</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="Enter Holiday Name"
              id="HolidayName"
              name="HolidayName"
              value={data.HolidayName}
              invalid={errors.HolidayName ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.HolidayName}</FormFeedback>
          </FormGroup>

          <FormGroup className="col-lg-6">
            <Label>Holiday Date</Label>
            <Input
              type="date"
              className="form-control datepicker"
              placeholder="Enter Holiday Date"
              id="HolidayDate"
              name="HolidayDate"
              value={data.HolidayDate}
              invalid={errors.HolidayDate ? true : false}
              onChange={this.changeHandler}
            />
            <FormFeedback>{errors.HolidayDate}</FormFeedback>
          </FormGroup>
        </div>
        <div className="row">
          <FormGroup className="col-lg-6">
            <Label>Holiday Type</Label>
            <select
            className="form-control"
            id="HolidayType"
            name="HolidayType"
            value={data.HolidayType}
            invalid={errors.HolidayType ? true : false}
            onChange={this.changeHandler}
          >
            <option placeholder="" value="">
              Select Status
            </option>
            <option key="2" value="2">
             WH
            </option>
            <option key="1" value="1">
              RH
            </option>
          </select>
          {errors.HolidayType && (
             
             <Label style={{ color: "#dc3545", fontWeight:"normal" }}>{errors.HolidayType}</Label>
           )}
            
          </FormGroup>
          <FormGroup className="col-lg-6 mb-3">
          <Label>Is Active</Label>
          <select
            className="form-control"
            id="IsActive"
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
      </div>
        <div className="row">
        <Button className="btn btn-primary col-lg-2 mx-auto">Submit</Button>
      </div>
        
      </Form>
    </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(HolidayMasterUI);

