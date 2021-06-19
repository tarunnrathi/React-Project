import React, { Component } from 'react';
import { connect } from "react-redux";
import { compPerm } from "../../redux/actions/companyPermission";
import {
  Form,
  Label,
  FormGroup,
} from "reactstrap";
import axios from "axios";
import TemporaryGrid from "./TemporaryGrid";
import { ToastContainer, toast } from 'react-toastify';

class EmployeeShiftUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      textInput: "",
      Mode: "",
      employeeSearch: [],
      selectOptions: false,
      openAllMenu: false,
      preSearchOption: "",
      shiftArray: [],
      saveData: [],
      SelectedRoster: "",
      editData: [],
      startDate: new Date(),
      saveData: [],
      shiftdetails: []
    };

  }

  onChangeHandler = (e) => {
    debugger
    this.setState({
      textInput: e.target.value,
      Mode: "",
      employeeSearch: [],
      shiftArray: [],
      shiftdetails: [],
    });
  }

  onKeyDownHandler = (e) => {
    debugger
    if (e.keyCode == 13) {
      debugger;
      e.preventDefault();
      this.props.changeAddOpened(true);
      this.setState({
        employeeSearch: [],
        shiftArray: [],
        Mode: "search",
        opened: true
      });

      if (this.state.textInput !== "") {
        // var url = `http://localhost:52227/api/EmployeeShift/SearchEmployee_ByEmpIdOrEmpNameAndCompanyId?EmpIdOrEmpName=${this.state.textInput}&CompanyId=${this.props.compId}`;

        var url = `${axios.baseURL}/EmployeeShift/SearchEmployee_ByEmpIdOrEmpNameAndCompanyId?EmpIdOrEmpName=${this.state.textInput}&CompanyId=${this.props.compId}`;

        // var url=`${axios.baseURL}/EmployeeShift/GetShift_ByEmpIdOrEmpNameAndDeptId?EmpIdOrEmpName=`+inputText;
        // var url = `${axios.baseURL}/EmployeeShift/SearchEmployee_ByEmpIdOrEmpNameAndCompanyId?EmpIdOrEmpName=` + this.state.textInput + `&CompanyId=` + this.props.compId;
        this.getGridData(url, this.state.textInput);
      }
    }
  }

  getGridData(url, inputText) {
    debugger
    axios.get(url)
      .then((res) => {
        debugger
        if (res.data.Status === "1") {
          this.inputText = inputText;
          this.setState({
            employeeSearch: res.data.Data.Table1,
            shiftdetails: res.data.Data.Table,
            Mode: "search",
          });

        }
      }).catch(error => {
        alert(error);
      })
  }

  
  componentDidUpdate(preProps, currentState) {
    debugger
    // console.log('addOpened=' + this.props.addOpened);
    // console.log('opened=' + this.state.opened);

    if (!this.state.opened) {
      if (this.props.addOpened === false) {
        this.setState({
          employeeSearch: [],
          shiftArray: [],
          opened: true,
          textInput: "",
          shiftdetails: []
        });
      }
    }
    if (this.props.addOpened === true & this.state.opened === true) {
      this.setState({
        opened: false
      })
    }
  }

  changeMode(mode) {
    debugger
    this.setState({
      Mode: mode
    })

  }
  changeHandler = (e) => {
    debugger
    e.preventDefault();
    var name = e.target.name;
    var v = e.target.value;
    this.setState({
      ...this.state,
      SelectedRoster: e.target.value
    })
  }
  render() {
    debugger
    const { s } = this.state;
    return (
      <div>
        {(this.state.Mode==="" || this.state.Mode==="search") && this.props.Mode!=="Edit"? 

        <Form onSubmit={this.submitHandler}>
          <div className="row">
            <FormGroup className="col-lg-3 col-md-2 col-sm-12 col-xs-12">
              <Label>Select Roster Type</Label>
            </FormGroup>
            <FormGroup className="col-lg-9" >
              <select className="form-control" name="rosterType" onChange={this.changeHandler}>
                <option placeholder="" value=''>Select</option>
                <option value='1'>Roster (R)</option>
                <option value='2'>Multi Roster (MR)</option>
                <option value='3'>Without Roster (WR)</option>
              </select>
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup className="col-lg-3 col-md-2 col-sm-12 col-xs-12">
              <Label>Employee Code</Label>
            </FormGroup>
            <FormGroup className="col-lg-9">
              <input
                type="text"
                className="form-control"
                value={this.state.textInput}
                onChange={this.onChangeHandler}
                onKeyDown={this.onKeyDownHandler}
              />
              {this.state.Mode === "search" && this.props.addOpened ?
                <TemporaryGrid Data={this.state.employeeSearch}  Mode={this.state.Mode}
                  changeMode={this.changeMode}  shiftdetails={this.state.shiftdetails}
                  SelectedRoster={this.state.SelectedRoster} key="add"
                />
                : null
              }
            </FormGroup>
          </div>          
        </Form>
        : this.props.Mode==="Edit" && this.props.addOpened ?

        <Form onSubmit={this.submitHandler}>
          <div className="row">
            <FormGroup className="col-lg-3 col-md-2 col-sm-12 col-xs-12">
              <Label>Select Roster Type</Label>
            </FormGroup>
            <FormGroup className="col-lg-9" >
              <select className="form-control" name="rosterType" value={this.props.employeeSearch.length>0?this.props.employeeSearch[0].RosterId:''}>
                <option placeholder="" value=''>Select</option>
                <option value='1'>Roster (R)</option>
                <option value='2'>Multi Roster (MR)</option>
                <option value='3'>Without Roster (WR)</option>
              </select>
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup className="col-lg-3 col-md-2 col-sm-12 col-xs-12">
              <Label>Employee Code</Label>
            </FormGroup>
            <FormGroup className="col-lg-9">
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.editObj.empId[0]}
                disabled={true}
                
              />
              {this.props.Mode === "Edit" && this.props.addOpened ?
                <TemporaryGrid Data={this.props.employeeSearch}  Mode={this.props.Mode} key="edit"
                  changeMode={this.changeMode}  shiftdetails={this.props.shiftdetails}
                  SelectedRoster={this.state.SelectedRoster} EmpId={this.props.editObj.empId[0]} selected={this.props.selected}
                />
                : null
              }
            </FormGroup>
          </div>
        </Form>
        :null
        }        
      </div>
    )
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}), { compPerm })(EmployeeShiftUI);