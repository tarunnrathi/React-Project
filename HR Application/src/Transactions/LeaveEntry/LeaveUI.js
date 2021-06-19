import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Select, MenuItem, InputLabel, FormHelperText, Switch, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel } from '@material-ui/core'
import 'react-toastify/dist/ReactToastify.css';
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import Moment from 'moment'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


class LeaveUI extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandlerIsHalfDay = this.changeHandlerIsHalfDay.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.changeHandlerdate = this.changeHandlerdate.bind(this);
  }
  getInitialState = () => ({
    data: {
      Id: 0,
      emp_id: "",
      f_date: "",
      t_date: "",
      reason: "",
      no_of_days: "",
      leave_type: ""
    },
    disp:"none",
    Employeedata: [],
    isLoading: true,
    IsHalfDay: false,
    errors: {},
  });

  componentDidMount() {
    debugger;
    if (this.props.Mode == "Add")
      this.setState({
        ...this.state,
        isLoading: false
      })

  
  }
  changeHandlerIsHalfDay = (e) => {
    debugger;
    var ffdate = this.state.data.f_date;
    var ttdate = this.state.data.t_date;
    var f_date = Moment(ffdate).format('YYYY-MM-DD')
    var t_date = Moment(ttdate).format('YYYY-MM-DD')
    var msDiff = new Date(t_date).getTime() - new Date(f_date).getTime();
    let Difference_In_Days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
    var Day = "";
    if (Difference_In_Days == "1" && e.target.checked === true) {
      Day = "0.5"
    }
    else {
      Day = "1"
    }
  this.setState({
      ...this.state,
      IsHalfDay: e.target.checked,
      data: {
        ...this.state.data,
        no_of_days: Day
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
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

  changeHandlerdate = (e) => {
    debugger;
    let Difference_In_Days = 0
    if (e.target.name == "f_date") {
      debugger;
      var ttdate = this.state.data.t_date;
      if (e.target.value !== "" && ttdate !== "") {
        var f_date = Moment(e.target.value).format('YYYY-MM-DD')
        var t_date = Moment(ttdate).format('YYYY-MM-DD')
        var msDiff = new Date(t_date).getTime() - new Date(f_date).getTime();
        Difference_In_Days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
        console.log('total days ' + Difference_In_Days);
        var halfDisplay;
        var IsHalfDayy=false;
        if (Difference_In_Days == "1") {
          halfDisplay="block";
          IsHalfDayy=false;
        }
        else {
          halfDisplay="none";
          
        }
        this.setState({
          ...this.state,
          disp:halfDisplay,
          IsHalfDay:IsHalfDayy
        })

      }
    }
    if (e.target.name == "t_date") {
      debugger;
      var ffdate = this.state.data.f_date;//document.getElementById('f_date');
      if (e.target.value !== "" && ffdate !== "") {
        var f_date = Moment(ffdate).format('YYYY-MM-DD')
        var t_date = Moment(e.target.value).format('YYYY-MM-DD')
        var msDiff = new Date(t_date).getTime() - new Date(f_date).getTime();
        Difference_In_Days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
        console.log('total days ' + Difference_In_Days);
        var halfDisplay;
        var IsHalfDayy=false;
        if (Difference_In_Days == "1") {
         
          halfDisplay="block";
          IsHalfDayy=false;
        }
        else {
         
          halfDisplay="none";
        }
        this.setState({
          ...this.state,
          disp:halfDisplay,
          IsHalfDay:IsHalfDayy
        })
      }
    }
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
        no_of_days: Difference_In_Days
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
    if (data.EmpId === '') errors.EmpName = 'Employee Id can not be blank.';
    if (data.f_date === '') errors.f_date = 'Please Enter From date';
    if (data.t_date === '') errors.t_date = 'Please Enter To Date';
    if (data.no_of_days === 0) errors.no_of_days = 'Please enter no of days';
    if (data.reason == '') errors.reason = 'Please enter reason';
    if (data.leave_type == '') errors.leave_type = 'Please Select Leave Type';

    return errors;
  }
  submitHandler = (e) => {
    debugger;
    e.preventDefault();
    const { data } = this.state;
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      var minArray = this.state.data;
      debugger;
      const p = this.props;
      var urlAdd = `${axios.baseURL}/Leave/PostLeave?ActionType=Add&EmpId=${this.props.user.info.EmpId}&Id=${this.props.Id}`;
      var urlEdit = `${axios.baseURL}/Leave/PostLeave?ActionType=Edit&EmpId=${this.props.user.info.EmpId}&Id=${this.props.Id}`;
      var MainUrl = this.props.Id > 0 ? urlEdit : urlAdd
      axios
        .post(
          MainUrl, minArray
        )
        .then((response) => {
          debugger;
          if (response.data.Status === '1') {
            this.props.EmpId > 0 ? toast.success("Record Updated", { position: toast.POSITION.TOP_CENTER }) :
              toast.success("Record Added", { position: toast.POSITION.TOP_CENTER })
            this.setState({ isLoading: false });
            this.setState(this.getInitialState());
            window.location.reload(false);
          }
          else {
            toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER })
          }
        })
        .catch(() => console.log("Can’t access " + MainUrl + " response. Blocked by browser?"))
      // .catch((error) => {
      //     toast.error('Server error', { position: toast.POSITION.TOP_CENTER })
      //   this.setState({ isLoading: false });
      // });
    } else {
      this.setState({ errors });
    }
  };
  loadUser = async (id) => {
    debugger;
    const result = await axios.get(
      `${axios.baseURL}/Leave/GetLeaveByEmpIdWithId?EmpId=${this.props.user.info.EmpId}&Id=${this.props.Id}`
    );
    console.log("infoo==");
    console.log({ result });
debugger;
    let LeaveInfo = result.data.Data[0];
    this.setState(
      {
        data: {
          Id: LeaveInfo.Id,
          EmpId: LeaveInfo.emp_id,
          f_date: Moment(LeaveInfo.f_date).format('YYYY-MM-DD'),
          t_date: Moment(LeaveInfo.t_date).format('YYYY-MM-DD'),
          reason: LeaveInfo.reason,
          no_of_days: LeaveInfo.no_of_days,
          leave_type: LeaveInfo.leave_type
        },
        IsHalfDay: LeaveInfo.no_of_days==0.5 ?  true : false,
        disp: LeaveInfo.no_of_days > 1 ? "none" : "block"
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
      let Id = nextProps.Id;
      let Mode = nextProps.Mode;
      if (Mode === "Add") {
        debugger;
        this.setState({
          ...this.state,
          isLoading: false,

        })
        console.log('Add Incoming');
      }
      else
        if (Id >= 0) {
          this.loadUser(Id);
        }
    }
  }

  render() {
    debugger;
    const { data, errors } = this.state;
    const headers = { "Content-Type": "application/json" };
    return (
      <>
        {/* {this.state.isLoading==false   ? ( */}
       <Form onSubmit={this.submitHandler} className="px-3 py-2"> 
          <div className="row">
            <div className="col-md-3">
              <TextField id="EmpId"
                label="EmpId"
                name="EmpId"
                value={data.EmpId = this.props.user.info.EmpId}
                InputProps={{ readOnly: true, }}
                color="primary"
                onChange={this.changeHandler} />

            </div>
            <div className="col-md-6">
              <FormLabel component="legend">Leave type</FormLabel>
              <FormHelperText style={{ color: 'red' }} >{errors.leave_type}</FormHelperText>
              <RadioGroup aria-label="leave_type" name="leave_type" value={data.leave_type} onChange={this.changeHandler} style={{ display: 'inherit' }}>
                <FormControlLabel value="El,CL" control={<Radio />} label="El,CL" />
                <FormControlLabel value="RH" control={<Radio />} label="RH" />
                <FormControlLabel value="OD" control={<Radio />} label="OD" />
                <FormControlLabel value="LWP" control={<Radio />} label="LWP" />
              </RadioGroup>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <TextField
                id="f_date"
                label="From Date"
                name="f_date"
                type="date"
                value={data.f_date}
                onChange={this.changeHandlerdate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormHelperText style={{ color: 'red' }} >{errors.f_date}</FormHelperText>
            </div>
            <div className="col-md-3">
              <TextField
                id="t_date"
                label="To Date"
                name="t_date"
                type="date"
                value={data.t_date}
                //helperText={errors.t_date}
                onChange={this.changeHandlerdate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormHelperText style={{ color: 'red' }} >{errors.t_date}</FormHelperText>
            </div>
            <div className="col-md-3" style={{ padding: "2% 1%", display: this.state.disp }} id="divHalfday">
              <FormControlLabel labelPlacement="start" label="Is HalfDay"
                control={<Switch checked={this.state.IsHalfDay} onChange={this.changeHandlerIsHalfDay} name="IsHalfDay"
                  color="primary" />}
              />
            </div>
            <div className="col-md-3">
              <TextField id="no_of_days"
                label="Enter no_of_days"
                value={data.no_of_days}
                name="no_of_days"
                color="primary"
                InputProps={{ readOnly: true, }}
                onChange={this.changeHandler} />
            </div>
          </div>
          <div className="col-md-6">
            <TextField id="reason"
              label="Enter reason"
              value={data.reason}
              name="reason" color="primary"
              //helperText={errors.reason}
              onChange={this.changeHandler}
              style={{ width: "75%" }} />
          </div>
          <FormHelperText style={{ color: 'red' }} >{errors.reason}</FormHelperText>
          <div style={{ padding: '8% 0% 0% 1%' }}>
            <Button className="btn btn-primary btn-block" type="submit">
              {/* {this.state.isLoading ? "Saving..." : "Submit"} */}
            Save
          </Button>
          </div>
        </Form>
        {/* ): 
      <Loader type="Puff" color="#00BFFF" height={100} width={100} /> 
      }  */}
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(LeaveUI);
