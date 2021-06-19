import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
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
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";


class EditShiftMaster extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }
  getInitialState = () => ({
    data: {
      //Id:"",
      FromTime:"", 
      ToTime:"", 
      TotalTiming:"",
      GracePeriod:"",
      IsActive:"",
      Remark:"",
      ShiftName:""
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

  changeHandler2 = (e) => {
    
    if(this.state.data.FromTime!=0 && this.state.data.FromTime!='undefined' &&e.target.value!=0 && e.target.value!='undefined'){
        console.log("from time");
        console.log(this.state.data.FromTime);
        console.log("Totime time");
        console.log(e.target.value);
        const timeDifference =  e.target.value-this.state.data.FromTime
        console.log(timeDifference);
      this.setState({
        data:{
            ...this.state.data,
            [e.target.name]: e.target.value,    
            TotalTiming:timeDifference
            }
        })
}
}


  validate = () => {
    const { data } = this.state;
    let errors = {};
    if (data.ShiftName === '') errors.ShiftName = 'Shift Name can not be blank.';
    if (data.FromTime === '') errors.FromTime = 'From Time can not be blank.';
    if (data.ToTime === '') errors.ToTime = 'To Time can not be blank.';
    if (data.GracePeriod == '') errors.GracePeriod = 'Grace Period can not be blank.';
    if (data.IsActive === '') errors.IsActive = 'Status can not be blank.';
    //if (!isNumeric(data.GracePeriod)) errors.GracePeriod = 'Grace Period must be Number.';
    return errors;
  };

  submitHandler = (e) => {
    e.preventDefault();
    // console.log(e);
    if (this.state.isLoading) {
      return;
    }
    // e.preventDefault();
    const { data } = this.state;
    const errors = this.validate();
    
    if (Object.keys(errors).length === 0) {
      console.log(data);
      this.setState({ isLoading: true });
      console.log("22211 line");
      console.log({ data: this.state.data });
      axios
        .post(
          `${axios.baseURL}/ShiftMaster/PostShiftMaster?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&Id=` +
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
      `${axios.baseURL}/ShiftMaster/GetShiftMasterById?Id=${id}`
    );
    
    console.log("infoo==");

    console.log({ result });

    let ShiftMasterInfo = result.data.Data[0];
    this.setState(
      {
        data: {
          FromTime: ShiftMasterInfo.FromTime,
          ToTime: ShiftMasterInfo.ToTime,
          TotalTiming: ShiftMasterInfo.TotalTiming,
          GracePeriod: ShiftMasterInfo.GracePeriod,
          ShiftName: ShiftMasterInfo.ShiftName,
          Id: ShiftMasterInfo.Id,
          Remark: ShiftMasterInfo.Remark,
          IsActive: ShiftMasterInfo.IsActive === "NO" ? 'N' : 'Y'
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
      let ShiftMasterId = nextProps.ShiftMasterId;
      if (ShiftMasterId >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(ShiftMasterId);
      }
    }
  }

  render() {
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    const { data, errors } = this.state;
    const { ShiftMasterInfo } = this.props;
    const headers = { "Content-Type": "application/json" };

    console.log(data);
    console.log({ data });
    return (
      <>
      <Form onSubmit={this.submitHandler}>
      <div className="row mb-2">
    <Label className="col-sm-2">Shift Timing   </Label>
    <div className="col-sm-4">
        <Input
        type="text"
        className="form-control"
        placeholder="Shift Name"
        id="ShiftName"
        name="ShiftName"
        value={data.ShiftName}
        invalid={errors.ShiftName ? true : false}
        onChange={this.changeHandler} />
        <FormFeedback>{errors.ShiftName}</FormFeedback>
    </div>
</div>

        <div className="row mb-2">
        <Label className="col-sm-2">From Time   </Label>
        <div className="col-sm-4">
            <select 
            className="form-control"
            name="FromTime" 
            id="FromTime"
            name="FromTime"
            value={data.FromTime}
            invalid={errors.FromTime ? true : false}
            onChange={this.changeHandler}>
                <option placeholder="" >Select From Time</option>
                <option kay="1" value='1'>01:00</option>
                <option kay="2" value='2'>02:00</option>
                <option kay="3" value='3'>03:00</option>
                <option kay="4" value='4'>04:00</option>
                <option kay="5" value='5'>05:00</option>
                <option kay="6" value='6'>06:00</option>
                <option kay="7" value='7'>07:00</option>
                <option kay="8" value='8'>08:00</option>
                <option kay="9" value='9'>09:00</option>
                <option kay="10" value='10'>10:00</option>
                <option kay="11" value='11'>11:00</option>
                <option kay="12" value='12'>12:00</option>
                <option kay="13" value='13'>13:00</option>
                <option kay="14" value='14'>14:00</option>
                <option kay="15" value='15'>15:00</option>
                <option kay="16" value='16'>16:00</option>
                <option kay="17" value='17'>17:00</option>
                <option kay="18" value='18'>18:00</option>
                <option kay="19" value='19'>19:00</option>
                <option kay="20" value='20'>20:00</option>
                <option kay="21" value='21'>21:00</option>
                <option kay="22" value='22'>22:00</option>
                <option kay="23" value='23'>23:00</option>
                <option kay="24" value='24'>24:00</option>
            </select>
            {errors.FromTime && (
                <Label style={{ color: "#dc3545", fontWeight:"normal" }}>{errors.FromTime}</Label>
            )}
        </div>
    
        <Label className="col-sm-2">To Time  </Label>
        <div className="col-sm-4">
            <select 
            className="form-control"
            name="ToTime" 
            id="ToTime"
            name="ToTime"
            value={data.ToTime}
            invalid={errors.ToTime ? true : false}
            onChange={this.changeHandler2}>
            <option placeholder="" >Select To Time</option>
                <option kay="1" value='1'>01:00</option>
                <option kay="2" value='2'>02:00</option>
                <option kay="3" value='3'>03:00</option>
                <option kay="4" value='4'>04:00</option>
                <option kay="5" value='5'>05:00</option>
                <option kay="6" value='6'>06:00</option>
                <option kay="7" value='7'>07:00</option>
                <option kay="8" value='8'>08:00</option>
                <option kay="9" value='9'>09:00</option>
                <option kay="10" value='10'>10:00</option>
                <option kay="11" value='11'>11:00</option>
                <option kay="12" value='12'>12:00</option>
                <option kay="13" value='13'>13:00</option>
                <option kay="14" value='14'>14:00</option>
                <option kay="15" value='15'>15:00</option>
                <option kay="16" value='16'>16:00</option>
                <option kay="17" value='17'>17:00</option>
                <option kay="18" value='18'>18:00</option>
                <option kay="19" value='19'>19:00</option>
                <option kay="20" value='20'>20:00</option>
                <option kay="21" value='21'>21:00</option>
                <option kay="22" value='22'>22:00</option>
                <option kay="23" value='23'>23:00</option>
                <option kay="24" value='24'>24:00</option>
            </select>
            {errors.ToTime && (
                <Label style={{ color: "#dc3545", fontWeight:"normal" }}>{errors.ToTime}</Label>
            )}
            
        </div>
    </div>
    
    <div className="row mb-2">
        <Label className="col-sm-2">Total Hours   </Label>
        <div className="col-sm-4">
            <Input
            disabled
            type="text"
            className="form-control"
            placeholder="Total Hours"
            id="TotalTiming"
            name="TotalTiming"
            value={data.TotalTiming}
            //invalid={errors.TotalTiming ? true : false}
            onChange={this.changeHandler} />
        </div>
    
        <Label className="col-sm-2">Grace Period  </Label>
        <div className="col-sm-4">
            <Input
            type="text"
            className="form-control"
            placeholder="Total Hours"
            id="GracePeriod"
            name="GracePeriod"
            value={data.GracePeriod}
            invalid={errors.GracePeriod ? true : false}
            onChange={this.changeHandler} />
            <FormFeedback>{errors.GracePeriod}</FormFeedback>
        </div>
    </div>
    <div className="row mb-2">
    <Label className="col-sm-2">Remarks  </Label>
        <div className="col-sm-4">
            <Input
            type="text"
            className="form-control"
            placeholder="Remark"
            id="Remark"
            name="Remark"
            value={data.Remark}
            invalid={errors.Remark ? true : false}
            onChange={this.changeHandler} />
            <FormFeedback>{errors.Remark}</FormFeedback>
        </div>

        <Label className="col-sm-2">Status  </Label>
        <div className="col-sm-4">
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
        </div>
    </div>
                   
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
}))(EditShiftMaster);
//export default EditShiftMaster;
