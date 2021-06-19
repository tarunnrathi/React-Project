import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
//import TreeMenu from "./TreeMenu";
import TreeMenu_New from "./TreeMenu_New";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import { userInfo } from "../redux/actions/user";
import { persistor } from "../store";
import { setMenu } from "../redux/actions/menu";
import { ToastContainer, toast } from 'react-toastify';
import {setMenuPermission} from '../redux/actions/menuPermission';
import { compPerm } from "../redux/actions/companyPermission";
import Swal from 'sweetalert2';

class userperm extends Component {

  constructor(props) {
    //debugger;
    super(props);
    this.state = {
      users: [],
      menuNameArray: [],
      permissionArray: [],
      headerView: false,
      headerAdd: false,
      headerEdit: false,
      headerDelete: false,
      headerPrint: false,
      headerExport: false,
      userList: [],
      selectedUserId: "",
      companyList: [],
      selectedCompanyId: "",
      companyListFrom: [],
      companyListTo: [],
      selectedUserIdFrom: null,
      selectedCompanyIdFrom: "",
      selectedUserIdTo: null,
      selectedCompanyIdTo: "",
    }
    // this.changeHandler= this.changeHandler.bind(this);
  }


  componentDidMount() {
    //console.log("devender");
    //debugger;
    var url = `${axios.baseURL}/hrapi/MenuItem`
    axios.get(url).then((res) => {
      //debugger;
      this.setState({ users: res.data.Data.MainMenuList });
      // console.log("user---");
      // console.log(res.data.Data.MainMenuList);
    });

    // var url = 'http://localhost:52227/api/Login/GetUserList'

    var url1 = `${axios.baseURL}/Login/GetUserList`;

    axios.get(url1).then((res) => {
      //debugger;
      this.setState({ userList: res.data.Data });
    });


  }

  callBackMenuArray = (permission, arr) => {
    debugger;

    // var t=permission.filter(arr=>arr.ViewPermission==false).map(view=>{
    //   debugger;
    //   return true;
    // })[0]?false:true;

    //  var m = permission.filter(arr=>arr.ViewPermission==false).map(view=>{
    //   debugger;
    //   return true;
    // })[0]?!this.state.headerView:this.state.headerView;

    if (permission.length == 0) {
      this.setState({
        menuNameArray: arr,
        permissionArray: permission ? permission : [],
        headerView: false,
        headerAdd: false,
        headerEdit: false,
        headerDelete: false,
        headerPrint: false,
        headerExport: false,
      });
    }
    if (permission.length > 0) {
      this.setState({
        menuNameArray: arr,
        permissionArray: permission ? permission : [],
        headerView: permission.filter(arr => arr.ViewPermission == false).map(view => { return true; })[0] ? false : true,
        headerAdd: permission.filter(arr => arr.AddPermission == false).map(view => { return true; })[0] ? false : true,
        headerEdit: permission.filter(arr => arr.EditPermission == false).map(view => { return true; })[0] ? false : true,
        headerDelete: permission.filter(arr => arr.DeletePermission == false).map(view => { return true; })[0] ? false : true,
        headerPrint: permission.filter(arr => arr.PrintPermission == false).map(view => { return true; })[0] ? false : true,
        headerExport: permission.filter(arr => arr.ExportPermission == false).map(view => { return true; })[0] ? false : true,
      });
    }
    
  }

  checkBoxChange = (e) => {
    debugger;
    // to get the checked name
    const checkedName = e.target.name.split('_');
    //const checkedName = e.target;
    // to get the checked value
    const checkedValue = e.target.checked;

    var myInt = parseInt(checkedName[1]);

    var arr = this.setPermissionAgain(checkedName[0], myInt, checkedValue)

    this.setState({
      permissionArray: arr
    });
  }

  setPermissionAgain(text, myInt, checkedValue) {
    debugger;

    const { permissionArray } = this.state;

    switch (text) {
      case "ViewPermission":

        permissionArray[myInt].ViewPermission = checkedValue;
        this.setState({
          headerView: permissionArray.filter(arr => arr.ViewPermission == false).map(view => { return true; })[0] ? false : true,
        });
        if (permissionArray[myInt].ViewPermission == false) {
          permissionArray[myInt].AddPermission = false;
          permissionArray[myInt].EditPermission = false;
          permissionArray[myInt].DeletePermission = false;
          permissionArray[myInt].PrintPermission = false;
          permissionArray[myInt].ExportPermission = false;
          this.setState({
            headerAdd: false,
            headerEdit: false,
            headerDelete: false,
            headerPrint: false,
            headerExport: false,
          });
        }
        return permissionArray;

      case "AddPermission":
        //if (permissionArray[myInt].ViewPermission == true && checkedValue == true) {
        if (permissionArray[myInt].ViewPermission == true) {
          permissionArray[myInt].AddPermission = checkedValue;
          var i = permissionArray.filter(arr => arr.AddPermission == false).map(view => { return true; })[0] ? false : true;
          this.setState({
            headerAdd: permissionArray.filter(arr => arr.AddPermission == false).map(view => { return true; })[0] ? false : true,
          });

          return permissionArray;
        }
        else {
          permissionArray[myInt].AddPermission = !checkedValue
          alert('Without View Permission,you can not change Add Permission');
          return permissionArray;
        }

      case "EditPermission":
        if (permissionArray[myInt].ViewPermission == true) {
          permissionArray[myInt].EditPermission = checkedValue;
          var t= permissionArray.filter(arr => arr.EditPermission == false).map(view => { return true; })[0] ? false : true;
          this.setState({
            headerEdit: permissionArray.filter(arr => arr.EditPermission == false).map(view => { return true; })[0] ? false : true,
          });
          return permissionArray;
        }
        else {
          permissionArray[myInt].EditPermission = !checkedValue;
          alert('Without View Permission,you can not change Edit Permission');
          return permissionArray;
        }
      case "DeletePermission":
        if (permissionArray[myInt].ViewPermission == true) {
          permissionArray[myInt].DeletePermission = checkedValue;
          this.setState({
            headerDelete: permissionArray.filter(arr => arr.DeletePermission == false).map(view => { return true; })[0] ? false : true,
          });
          return permissionArray;
        }
        else {
          permissionArray[myInt].DeletePermission = !checkedValue;
          alert('Without View Permission,you can not change Delete Permission');
          return permissionArray;
        }

      case "PrintPermission":
        if (permissionArray[myInt].ViewPermission == true) {
          permissionArray[myInt].PrintPermission = checkedValue;
          this.setState({
            headerPrint: permissionArray.filter(arr => arr.PrintPermission == false).map(view => { return true; })[0] ? false : true,
          });
          return permissionArray;
        }
        else {
          permissionArray[myInt].PrintPermission = !checkedValue;
          alert('Without View Permission,you can not change Print Permission');
          return permissionArray;
        }

      case "ExportPermission":
        if (permissionArray[myInt].ViewPermission == true) {
          permissionArray[myInt].ExportPermission = checkedValue;
          this.setState({
            headerExport: permissionArray.filter(arr => arr.ExportPermission == false).map(view => { return true; })[0] ? false : true,
          });
          return permissionArray;
        }
        else {
          permissionArray[myInt].ExportPermission = !checkedValue;
          alert('Without View Permission,you can not change Export Permission');
          return permissionArray;
        }
      default: return null;
    }
  }

  headerClick = (e) => {
    //debugger;
    // to get the checked name
    //const { headerPerm } = this.state;
    const checkedName = e.target.name;

    // to get the checked value
    const checkedValue = e.target.checked;
    document.getElementsByName(checkedName).values(checkedValue);

    var arr = this.setHeaderPermission(checkedName, checkedValue);
    this.setState({
      permissionArray: arr
    });
  }

  setHeaderPermission(text, checkedValue) {
    //debugger;
    const { permissionArray } = this.state;
    if (permissionArray.length > 0) {
      switch (text) {
        case "header_view": 
        permissionArray.map(arr => {
          debugger
          arr.ViewPermission = checkedValue;
          return arr.ViewPermission;
        });

          this.setState({
            headerView: checkedValue
          });

          return permissionArray;

        case "header_add": permissionArray.map(arr => {
          //debugger;
          arr.ViewPermission ? arr.AddPermission = checkedValue : arr.AddPermission = false;
          return arr.AddPermission;
        });
          this.setState({

            headerAdd: checkedValue

          });
          return permissionArray;
        case "header_edit": permissionArray.map(arr => {
          arr.ViewPermission ? arr.EditPermission = checkedValue : arr.EditPermission = false;
          return arr.EditPermission;
        });
          this.setState({

            headerEdit: checkedValue

          });
          return permissionArray;

        case "header_delete": permissionArray.map(arr => {
          arr.ViewPermission ? arr.DeletePermission = checkedValue : arr.DeletePermission = false;
          return arr.DeletePermission;
        });
          this.setState({

            headerDelete: checkedValue

          });
          return permissionArray;
        case "header_print": permissionArray.map(arr => {
          arr.ViewPermission ? arr.PrintPermission = checkedValue : arr.PrintPermission = false;
          return arr.PrintPermission;
        });
          this.setState({

            headerPrint: checkedValue

          });
          return permissionArray;

        case "header_export": permissionArray.map(arr => {
          arr.ViewPermission ? arr.ExportPermission = checkedValue : arr.ExportPermission = false;
          return arr.ExportPermission;
        });
          this.setState({
            headerExport: checkedValue
          });

          return permissionArray;
        default: return [];
      }
    }
  }

  editPermission = (e) => {
    debugger; 
   // const {u}= this.props;

    
    if (this.state.selectedUserId != "" && this.state.selectedCompanyId != "") {
        const { permissionArray } = this.state;
        permissionArray.map(arr => {

        Object.assign(arr, { CreatedBy: this.props.user.info.EmpId });
        Object.assign(arr, { PageMastId: arr.ID });
        Object.assign(arr, { companyId: this.state.selectedCompanyId });

      });

      // var url ='http://localhost:52227/api/HRAPI/PostMenuByUserPermission_ById?EmpID='+ this.state.selectedUserId;
    //var url = `${axios.baseURL}/hrapi/PostMenuByUserPermission_ById?EmpID=` + this.state.selectedUserId;
    //var url = `${axios.baseURL}/hrapi/PostMenuByUserPermission_ById?EmpID=` + this.state.selectedUserId;

       var url = 'http://localhost:52227/api/HRAPI/PostMenuByUserPermission_ById?EmpID=' + this.state.selectedUserId;
      axios.post(url, permissionArray)
        .then((res, err) => {
          debugger;
          if (res.data.Status==="1") {
            //alert(res.data.Message);
            Swal.fire(
              res.data.Message +'\n Press OK to back',
            ).then(() => {
              window.location.reload(true);
            })
          }
          else {
            Swal.fire(res.statusText);
            return;
           // alert(res.data.Message);
           // toast.success(res.data.Message, { position: toast.POSITION.TOP_CENTER });
          }
        });
    } else {
      Swal.fire('Please Select the User first then Compnay');
      return;
    }

  }


  changeHandler = (e) => {
    debugger
    var name = e.target.name;
    var v = e.target.value;
    if (e.target.name == "selectUser" && v != "") {
      var val = this.selectCompanyListByEmpId(e.target.value, "selectUser");
      this.setState({
        selectedUserId: e.target.value,
        selectedCompanyId: "",
        permissionArray: [],
        headerView: false,
        headerAdd: false,
        headerEdit: false,
        headerDelete: false,
        headerPrint: false,
        headerExport: false,
      });
    }
    if (e.target.name == "selectUser" && v == "") {
      this.setState({
        selectedUserId: "",
        selectedCompanyId: "",
        companyList: []
      });
    }
    if (e.target.name == "selectCompany") {    
      debugger;
      // var t= this.selectMainMenuByEmpId_And_CompanyId();

      this.setState({
        selectedCompanyId: e.target.value,
        permissionArray:[],
        headerView: false,
        headerAdd: false,
        headerEdit: false,
        headerDelete: false,
        headerPrint: false,
        headerExport: false,
      });
    }
    if (e.target.name == "selectCompany" && this.state.selectedUserId == "") {
      this.setState({
        selectedCompanyId: "",
        permissionArray: [],
        headerView: false,
        headerAdd: false,
        headerEdit: false,
        headerDelete: false,
        headerPrint: false,
        headerExport: false,
        companyList: []
      });
    }
    if (e.target.name == "selectUserFrom") {
      var val = this.selectCompanyListByEmpId(e.target.value, "selectUserFrom");
      this.setState({
        selectedUserIdFrom: e.target.value,
        selectedCompanyIdFrom: ""
      });

    }
    if (e.target.name == "selectCompanyFrom") {
      this.setState({
        selectedCompanyIdFrom: e.target.value,
        // permissionArray: [],
        headerView: false,
        headerAdd: false,
        headerEdit: false,
        headerDelete: false,
        headerPrint: false,
        headerExport: false,
      });
    }


    if (e.target.name == "selectUserTo") {
      var val = this.selectCompanyListByEmpId(e.target.value, "selectUserTo");
      this.setState({
        selectedUserIdTo: e.target.value,
        selectedCompanyIdTo: ""
      });

    }
    if (e.target.name == "selectCompanyTo") {
      this.setState({
        selectedCompanyIdTo: e.target.value,
        //permissionArray: [],
        headerView: false,
        headerAdd: false,
        headerEdit: false,
        headerDelete: false,
        headerPrint: false,
        headerExport: false,
      });
    }
  }

  selectCompanyListByEmpId(empId, text) {
    //debugger;
    //var url = 'http://localhost:52227/api/CompanyMaster/GetCompanyListByEmpId?EmpId=' + empId;
    // var url=`${axios.baseURL}/Login/GetUserList`;
    var url = `${axios.baseURL}/CompanyMaster/GetCompanyListByEmpId?EmpId=` + empId;
    switch (text) {
      case "selectUser":
        return (axios.get(url).then((res, err) => {
          //debugger;
          res.data.Status === "1" ? this.setState({ companyList: res.data.Data }) : this.setState({ companyList: [] });
        }));

      case "selectUserFrom":
        return (axios.get(url).then((res, err) => {
          //debugger;
          res.data.Status === "1" ? this.setState({ companyListFrom: res.data.Data }) : this.setState({ companyListFrom: [] });
        }));

      case "selectUserTo":
        return (axios.get(url).then((res, err) => {
          //debugger;
          res.data.Status === "1" ? this.setState({ companyListTo: res.data.Data }) : this.setState({ companyListTo: [] });
        }));

      default: return [];
    }
  }


  componentDidUpdate(preProp, preState) {
    debugger;
    // console.log("userperm  preProp= ", preProp);
    // console.log("userperm preState= ", preState);
   // console.log(this.state);

    if (preState.selectedUserId !== this.state.selectedUserId) {
      this.setState({
        permissionArray: [],
        selectedCompanyId: ""
      });
    }
    // if(preState.selectedUserId == this.state.selectedUserId){
    //   this.selectMainMenuByEmpId_And_CompanyId();
    //   this.setState({
    //     selectedUserId=""
    //   })
    // }

    // if(preProp.selectedUserId!=this.props.selectedUserId){
    // 	this.props.selectedUserId=null;
    // }

    // if (preState.selectedCompanyId !== this.state.selectedCompanyId) {
    //   this.setState({

    //   });
    // }
    if(preProp.menuId!==undefined){
      this.getGridPermission(preProp.user.info.EmpId,preProp.comp.compperm.CompanyId);
    }
  }

  getGridPermission(empId,companyId) {
    debugger;
    //const co=this.props.comp.compperm.CompanyId;
    var url =`${axios.baseURL}/HRAPI/User_Pagewise_HeaderPermission?id=`+empId+`&companyId=`+companyId;
    axios
      .get(
        url
      )
      .then((response) => {
        //debugger;
        this.props.setMenuPermission(response.data.Data);        
      });
  }

  handleSubmit = (e) => {
    //debugger;
    e.preventDefault();
    if (this.state.selectedUserIdFrom == null || this.state.selectedCompanyIdFrom == "" || this.state.selectedUserIdTo == null || this.state.selectedCompanyIdTo == "") {
      alert("Please select proper values");
    }
    else {
      var inputData = {
        SelectedUserIdFrom: this.state.selectedUserIdFrom,
        SelectedCompanyIdFrom: this.state.selectedCompanyIdFrom,
        SelectedUserIdTo: this.state.selectedUserIdTo,
        SelectedCompanyIdTo: this.state.selectedCompanyIdTo,
        CreatedBy: this.props.user.info.EmpId
      }

      // var url = `${axios.baseURL}/CompanyMaster/GetCompanyListByEmpId?EmpId=` + empId;
      var url = `${axios.baseURL}/HRAPI/PostCopyPermissionFromUserToToUser`;
      //var url = `http://localhost:52227/api/HRAPI/PostCopyPermissionFromUserToToUser`;
      axios.post(url, inputData)
        .then((res, err) => {
          if (res.data.Status === "1") {
            alert(res.data.Message);
          } else {
            alert(res.data.Message);
          }
        })
    }

  }
  

  menuClick = (menuId) => {    
    debugger   
    this.props.setMenu(menuId);
  };

//    shouldComponentUpdate(nextProps, nextState){
//    debugger;
//    const {p}= this.props;
//    const {s}= this.state;
//   //  if(this.state.selectedMenuId!==nextState.selectedMenuId){
//   //    return false;
//   //  }
//   //  return true;

//  }




  render() {
    debugger;
    const { user } = this.props;
    const { headerPerm } = this.state;

    if (this.props.user.info==null) {
      debugger
      return <Redirect to="/sign-in" />;
    }
    else{
    return (
      <>
      
        <div  className="row">
          <div className="col-sm-2 pt-3 left-menu">
            {/* <TreeMenu callMenuName={this.callBackMenuArray} selectedUserId={this.state.selectedUserId} selectedCompanyId={this.state.selectedCompanyId} menuClick={this.menuClick} /> */}
            
            <TreeMenu_New callMenuName={this.callBackMenuArray} selectedUserId={this.state.selectedUserId} selectedCompanyId={this.state.selectedCompanyId} menuClick={this.menuClick} />
            
            {/* <TreeMenu callMenuName={this.callBackMenuArray} selectedUserId={this.state.selectedUserId} changeHandler={this.changeHandler} /> */}
          </div>
          <div className="col-sm-10" style={{ padding: 5 }}>
            <main role="main">

              <div className="row">
                <div className="container">
                  <div className="col-md-12 mx-auto form-container mt-2" >
                    <div style={{ padding: 10 }}>
                      <div className="row">
                        <div className="col-md-3 card bg-green">
                          <div className="row">

                            <div className="col-md-12 mt-3">
                            
                              <Label>Select User</Label>
                              <select className="form-control"
                                name="selectUser"
                                value={this.state.selectedUserId || ''}
                                onChange={this.changeHandler}>
                                <option placeholder="" value=''>Select</option>
                                {this.state.userList.length > 0 ? this.state.userList.map(arr => (
                                  <option key={arr.EmpId} kay={arr.EmpId} value={arr.EmpId}>{arr.Name}</option>
                                )) : []}
                              </select>

                            </div>
                            <div className="col-md-12">

                              <Label>Select Company</Label>
                              <select className="form-control"
                                name="selectCompany" value={this.state.selectedCompanyId || ''} onChange={this.changeHandler}>
                                <option placeholder="" value={""}>Select</option>
                                {this.state.companyList.length > 0 ? this.state.companyList.map(arr => (
                                  <option key={arr.CompanyCode} kay={arr.CompanyCode} value={arr.CompanyCode}>{arr.CompanyName}</option>
                                )) : []}
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-9 flex-row flex-wrap">
                          <form onSubmit={this.handleSubmit} autoComplete="off">
                            <div className="card">
                              <div className="card-header text-center">
                                <strong>Copy Permission</strong>
                              </div>

                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="row mb-2">
                                      <div className="col-md-4">
                                        <label>From User:</label>
                                      </div>
                                      <div className="col-md-8">
                                        <select className="form-control" 
                                          name="selectUserFrom" value={this.state.selectedUserIdFrom || ''} onChange={this.changeHandler}>

                                          <option placeholder="" value='select'>Select</option>
                                          {this.state.userList.length > 0 ? this.state.userList.map(arr => (
                                            <option key={arr.EmpId} kay={arr.EmpId} value={arr.EmpId}>{arr.Name}</option>
                                          )) : []}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <label>From Company:</label>
                                      </div>
                                      <div className="col-md-8">
                                        <select className="form-control"
                                          name="selectCompanyFrom" value={this.state.selectedCompanyIdFrom || ''} onChange={this.changeHandler}>
                                          <option placeholder="" value={""}>Select</option>
                                          {this.state.companyListFrom.length > 0 ? this.state.companyListFrom.map(arr => (
                                            <option kay={arr.CompanyCode} value={arr.CompanyCode}>{arr.CompanyName}</option>
                                          )) : []}
                                        </select>
                                      </div>

                                    </div>


                                  </div>

                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <label>To User:</label>
                                      </div>
                                      <div className="col-md-8">
                                        <select className="form-control"
                                          name="selectUserTo" value={this.state.selectedUserIdTo || ''} onChange={this.changeHandler}>

                                          <option placeholder="" value=''>Select</option>
                                          {this.state.userList.length > 0 ? this.state.userList.map(arr => (
                                            <option key={arr.EmpId} kay={arr.EmpId} value={arr.EmpId}>{arr.Name}</option>
                                          )) : []}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <label>To Company:</label>
                                      </div>
                                      <div className="col-md-8">
                                        <select className="form-control" style={{ width: '100%' }}
                                          name="selectCompanyTo" value={this.state.selectedCompanyIdTo || ''} onChange={this.changeHandler}>

                                          <option placeholder="" value={""}>Select</option>
                                          {this.state.companyListTo.length > 0 ? this.state.companyListTo.map(arr => (
                                            <option kay={arr.CompanyCode} value={arr.CompanyCode}>{arr.CompanyName}</option>
                                          )) : []}
                                        </select>
                                      </div>

                                    </div>


                                  </div>

                                </div>
                              </div>
                              <div className="card-footer text-center">
                                <button type="submit" className="btn btn-sm btn-primary">Save</button>
                              </div>
                            </div>
                          </form>

                        </div>
                      </div>

                    </div>

                  <div className="col-md-12 mt-2" >
                    <table className="table text-center table-bordered">
                      <thead className="thead_dark">
                        <tr>
                          <th>S.No.</th>
                          <th>Menu Name</th>
                          <th>
                          View &nbsp;  <input type="checkbox" name={"header_view"} checked={this.state.headerView} onChange={this.headerClick} />
                            
                          </th>
                          <th>
                              Add &nbsp;
                            {/* <span style={{ fontFamily: "Wingdings" }}>&#168;</span> */}
                              <input type="checkbox" name={"header_add"} checked={this.state.headerAdd} onChange={this.headerClick}
                                />
                           
                          </th>
                          <th>
                              Edit &nbsp;
                            {/* <span style={{ fontFamily: "Wingdings" }}>&#168;</span> */}
                              <input type="checkbox" name={"header_edit"} checked={this.state.headerEdit} onChange={this.headerClick} />
                          </th>
                          <th>
                              Delete &nbsp;
                            {/* <span style={{ fontFamily: "Wingdings" }}>&#168;</span> */}
                              <input type="checkbox" name={"header_delete"} checked={this.state.headerDelete} onChange={this.headerClick} />
                          </th>
                          <th>
                              Print &nbsp;
                            {/* <span style={{ fontFamily: "Wingdings" }}>&#168;</span> */}
                              <input type="checkbox" name={"header_print"} checked={this.state.headerPrint} onChange={this.headerClick} />
                          </th>
                          <th>
                              Export &nbsp;
                            {/* <span style={{ fontFamily: "Wingdings" }}>&#168;</span> */}
                              <input type="checkbox" name={"header_export"} checked={this.state.headerExport} onChange={this.headerClick} />
                          </th>
                        </tr>
                      </thead>
                      <tfoot>
            <tr>
               <td colSpan="8"> 
               <Link className="btn btn-sm btn-primary mr-2" onClick={this.editPermission} to="/userperm" >
                Save Permission
                </Link></td>
            </tr>
         </tfoot>
                      <tbody>
                        {this.state.permissionArray.length > 0 ?
                          this.state.menuNameArray.map((hmenu, index) => {
                            //debugger;
                            return (
                              <tr key={index + 1} id={index + 1}>
                                {
                                  this.state.permissionArray.filter(id => id.ID == hmenu.ID).map(perm => (
                                    <>
                                      <td>{index + 1}</td>
                                      <td>{hmenu.MenuName}</td>
                                      {/* <td> {perm.ViewPermission ? <span name={"ViewPermission" + "_" + index} style={{ fontFamily: "Wingdings" }} onClick={this.checkBoxChange}>&#254;</span> : <span name={"ViewPermission" + "_" + index} style={{ fontFamily: "Wingdings" }} onClick={this.checkBoxChange}>&#253;</span>}</td> */}
                                      <td><input type="checkbox" name={"ViewPermission_" + index} checked={perm.ViewPermission} onChange={this.checkBoxChange} /></td>
                                      <td><input type="checkbox" name={"AddPermission_" + index} checked={perm.AddPermission} onChange={this.checkBoxChange} /></td>
                                      <td><input type="checkbox" name={"EditPermission_" + index} checked={perm.EditPermission} onChange={this.checkBoxChange} /></td>
                                      <td><input type="checkbox" name={"DeletePermission_" + index} checked={perm.DeletePermission} onChange={this.checkBoxChange} /></td>
                                      <td><input type="checkbox" name={"PrintPermission_" + index} checked={perm.PrintPermission} onChange={this.checkBoxChange} /></td>
                                      <td><input type="checkbox" name={"ExportPermission_" + index} checked={perm.ExportPermission} onChange={this.checkBoxChange} /></td>
                                    </>
                                  )
                                  )

                                }
                              </tr>
                            )
                          }
                          ) : null
                        }
                        <tr >
                          <td colSpan="8">
                           
                            {/* <Link class="btn btn-sm btn-primary mr-2" onClick={this.savePermission} >
                              Save Permission
                            </Link> */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }
  }
}
export default connect((state) => ({
  user: state.user,
  menuId:state.menuId,
  perm: state.menuPermission.perm,
  comp: state.companyPermission 
}),{ userInfo,setMenu,setMenuPermission,compPerm})(userperm);

