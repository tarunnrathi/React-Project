import React, { Component } from "react";
import axios from 'axios'
//import {  } from "react-router-dom";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import { isEmail, isNumeric } from 'validator';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class AddCompanyMaster extends Component {
     constructor() {
        super();
       
      this.state = this.getInitialState();
   }

   getInitialState = () => ({
        data: {
            CompanyCode:6,
            CompanyName:"",
            SName:"",
            StartDt:"",
            EndDt:"",
            CYear:"",
            Address1:"",
            Address2:"",
            City:"",
            Country:"",
            PIN:"",
            Phone:"",
            Fax:"",
            Email:"",
            Description:"test",
            PanNo:"",
            TinNo:"",
            TinDate:"",
            ParentComp_Code:2,
            GSTNO:"",
            IsActive:""
}, 
        errors: {}
    });

    changeHandler = (e) => {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            }
        });
    }
    
    validate = () => {
        debugger;
        const { data } = this.state;
        let errors = {};

        if (data.Id === '') errors.Id = 'ID can not be blank.';
        if (!isNumeric(data.CompanyCode)) errors.CompanyCode = 'Company Code Must Be Numeric.';
        if (data.CompanyCode ==="") errors.CompanyCode = 'Company Code can not be blank.';
        if (data.CompanyName === '') errors.CompanyName = 'Company Name can not be blank.';
        if (data.StartDt === '') errors.StartDt = 'Company Name can not be blank.';
        if (data.SName === '') errors.SName = 'Short Name Can Not be Blank';
        if (data.EndDt === '') errors.EndDt = 'Company Name can not be blank.';
        if (data.CYear === '') errors.CYear = 'Created Year Can Not be Blank';
        if (data.Address1 === '') errors.Address1 = 'Address Can Not be Blank';
        if (data.City === '') errors.City = 'City Can Not be Blank';
        if (data.Country === '') errors.Country = 'Country Can Not be Blank';
        if (data.PIN === '') errors.PIN = 'PIN Can Not be PIN';
        if (data.Phone === '') errors.Phone = 'Phone Can Not be Blank';
        if (data.Fax === '') errors.Fax = 'Fax Name Can Not be Blank';
        if (!isEmail(data.Email)) errors.Email = 'Email must be valid.';
        if (data.Email === '') errors.Email = 'Email Can Not be Blank';
        // if (data.Description === '') errors.Description = 'Description Can Not be Blank';
        if (data.PanNo === '') errors.PanNo = 'PanNo Can Not be Blank';
        if (data.TinNo === '') errors.TinNo = 'TinNo Can Not be Blank';
        if (!isNumeric(data.ParentComp_Code)) errors.ParentComp_Code = 'ParentComp_Code Must Be Numeric.';
        if (data.ParentComp_Code === '') errors.ParentComp_Code = 'ParentComp_Code Can Not be Blank';
        if (data.GSTNO === '') errors.GSTNO = 'GSTNO Can Not be Blank';
        if (data.TinDate === '') errors.TinDate = 'Company Name can not be blank.';
        if (data.IsActive === '') errors.IsActive = 'Status can not be blank.';
        
        // if (data.email === '') errors.email = 'Email can not be blank.';
        
              
        return errors;
    }

    submitHandler = (e) => {
        debugger;
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            console.log(data);
            axios.post(`${axios.baseURL}/CompanyMaster/PostCompanyMaster?ActionType=Add&EmpID=${this.props.user.info.EmpId}`, this.state.data)
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

              <FormGroup className="col-sm-4">
                <Label>Company Code :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Company Code"
                id="CompanyCode"
                name="CompanyCode"
                value={data.CompanyCode}
                invalid={errors.CompanyCode ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.CompanyCode}</FormFeedback>
              </FormGroup>
            
                <div className="col-sm-4">
                <Label>Company Name : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Company Name"
                id="CompanyName"
                name="CompanyName"
                value={data.CompanyName}
                invalid={errors.CompanyName ? true : false}
                onChange={this.changeHandler}
                />
                <FormFeedback>{errors.CompanyName}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>Store Name :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Store"
                id="SName"
                name="SName"
                value={data.SName}
                invalid={errors.SName ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.SName}</FormFeedback>
                </div>

            </div>

            <div className="row mb-2">

                <div className="col-sm-4">
                <Label>Start Date :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Start Date"
                id="StartDt"
                name="StartDt"
                value={data.StartDt}
                invalid={errors.StartDt ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.StartDt}</FormFeedback>
                
                </div>
            
                <div className="col-sm-4">
                <Label>End Date : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter End Date"
                id="EndDt"
                name="EndDt"
                value={data.EndDt}
                invalid={errors.EndDt ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.EndDt}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>Created Year :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Created Year"
                id="CYear"
                name="CYear"
                value={data.CYear}
                invalid={errors.CYear ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.CYear}</FormFeedback>
                </div>

            </div>

            <div className="row mb-2">

                <div className="col-sm-4">
                <Label>Address 1 :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Address 1"
                id="Address1"
                name="Address1"
                value={data.Address1}
                invalid={errors.Address1 ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.Address1}</FormFeedback>
                </div>
            
                <div className="col-sm-4">
                <Label>Address 2 : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Address 2"
                id="Address2"
                name="Address2"
                value={data.Address2}
                invalid={errors.Address2 ? true : false}
                onChange={this.changeHandler}
                />
                </div>

                <div className="col-sm-4">
                <Label>City :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Address 1"
                id="City"
                name="City"
                value={data.City}
                invalid={errors.City ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.City}</FormFeedback>
                </div>
            

            </div>

            <div className="row mb-2">

                <div className="col-sm-4">
                <Label>Country : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Address 2"
                id="Country"
                name="Country"
                value={data.Country}
                invalid={errors.Country ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.Country}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>PIN :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter PIN"
                id="PIN"
                name="PIN"
                value={data.PIN}
                invalid={errors.PIN ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.PIN}</FormFeedback>
                </div>
                
                <div className="col-sm-4">
                <Label>Phone :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Phone"
                id="Phone"
                name="Phone"
                value={data.Phone}
                invalid={errors.Phone ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.Phone}</FormFeedback>
                </div>

            </div>

            <div className="row mb-2">
            
                <div className="col-sm-4">
                <Label>Fax : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Fax"
                id="Fax"
                name="Fax"
                value={data.Fax}
                invalid={errors.Fax ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.Fax}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>Email :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter Email"
                id="Email"
                name="Email"
                value={data.Email}
                invalid={errors.Email ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.Email}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>Pan No :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter PanNo"
                id="PanNo"
                name="PanNo"
                value={data.PanNo}
                invalid={errors.PanNo ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.PanNo}</FormFeedback>
                </div>

            </div>

            <div className="row mb-2">
            
                <div className="col-sm-4">
                <Label>Tin No : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter TinNo"
                id="TinNo"
                name="TinNo"
                value={data.TinNo}
                invalid={errors.TinNo ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.TinNo}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>Tin Date :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter TinDate"
                id="TinDate"
                name="TinDate"
                value={data.TinDate}
                invalid={errors.TinDate ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.TinDate}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>ParentComp Code :</Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter ParentComp Code"
                id="ParentComp_Code"
                name="ParentComp_Code"
                value={data.ParentComp_Code}
                invalid={errors.ParentComp_Code ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.ParentComp_Code}</FormFeedback>
                </div>
            
                

            </div>

            <div className="row mb-2">

                <div className="col-sm-4">
                <Label>GST NO : </Label>
                <Input
                type="text"
                className="form-control"
                placeholder="Enter GSTNO"
                id="GSTNO"
                name="GSTNO"
                value={data.GSTNO}
                invalid={errors.GSTNO ? true : false}
                onChange={this.changeHandler} />
                <FormFeedback>{errors.GSTNO}</FormFeedback>
                </div>

                <div className="col-sm-4">
                <Label>Status :</Label>
                <select className="form-control"
                                name="IsActive" 
                                value={data.IsActive} 
                                //   invalid={errors.IsActive ? true : false}
                                onChange={this.changeHandler}>
                                <option placeholder="" value=''>Select Status</option>
                                <option kay="Y" value='Y'>Yes</option>
                                <option kay="N" value='N'>No</option>
                                </select>
                                {errors.IsActive && (
              <Label style={{ color: "#dc3545" }}>{errors.IsActive}</Label>
            )}
                </div>

            </div>  

            <Button className="btn btn-primary btn-block">Submit</Button>
                
        </Form>
      </>
  );
    }
};

export default connect((state) => ({
    user: state.user,
  }))(AddCompanyMaster);
//export default AddDepartmentcls;
