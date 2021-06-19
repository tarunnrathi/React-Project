import React, { Component } from "react";
import axios from 'axios'
//import {  } from "react-router-dom";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import { isEmail, isNumeric } from 'validator';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { data } from "jquery";

class AddShiftMasterGrid extends Component {
     constructor() {
        super();
      this.state = this.getInitialState();
   }
   getInitialState = () => ({
        data: {
           // Id:0,
            FromTime:"", 
            ToTime:"", 
            TotalTiming:"",
            GracePeriod:"",
            IsActive:"",
            Remark:"",
            ShiftName:""
            //CreatedBy:"123",
        },
        errors: {}
    });

    changeHandler = (e) => {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value,               
            },           
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            }
        });
    }

    changeHandler2 = (e) => {
        debugger;
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
        if (!isNumeric(data.GracePeriod)) errors.GracePeriod = 'Grace Period must be Number.';
        return errors;
    }

    // componentDidUpdate(){
    //     debugger;
    //     const{thours}=this.state.data;
    //     const{ftime,totime}=this.state.data;
    //     if(thours==""){
    //         if(this.state.data.ftime!=0 && this.state.data.totime!=0){
    //             this.setState({
    //                 data:{
    //                     thours:totime-ftime
    //                 }
    //             })
    //         }
    //     }
    // }

    submitHandler = (e) => {
       
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            // console.log(this.props.user.info.username)
            // console.log("user data==" + JSON.stringify(this.props.user));
            console.log("Post Data");
            console.log(data);
            axios.post(`${axios.baseURL}/ShiftMaster/PostShiftMaster?ActionType=Add&EmpID=${this.props.user.info.EmpId}`, this.state.data)
            .then(response => {
                this.setState(this.getInitialState());  
                window.location.reload(false);
                console.log(response);
            })
           
        } else {
            this.setState({ errors });
        }
    }
    
render(){
    debugger;
    const { data, errors } = this.state;
    const { user } = this.props;
    //console.log('uname',this.state.data.CreatedBy) 
    //console.log(uname);
    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
   // const { name, username, email, phone, website } = this.state
    const headers = { 'Content-Type':'application/json' }
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
        
       // invalid={errors.FromTime ? true : false}
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
        //invalid={errors.ToTime ? true : false}
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

    <Label className="col-sm-2">GracePeriod  </Label>
    <div className="col-sm-4">
        <Input
        type="text"
        className="form-control"
        placeholder="Grace Period"
        id="GracePeriod"
        maxLength="2" size="4"
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
             // invalid={errors.IsActive ? true : false}
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
};

export default connect((state) => ({
    user: state.user,
  }))(AddShiftMasterGrid);
//export default AddDepartmentcls;
