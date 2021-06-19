import React, { Component } from 'react';
import { connect } from "react-redux";
import { userInfo } from "../../redux/actions/user";
import { setMenu } from "../../redux/actions/menu";
import { compPerm } from "../../redux/actions/companyPermission";
import {setMenuPermission} from '../../redux/actions/menuPermission';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import TreeControl from "./TreeControl";
import TreeControl_New from "./TreeControl_New";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { persistor } from "../../store";

import Header from "../../components/Header";
import Swal from 'sweetalert2';



class ControlPermission extends Component {

  constructor(props) {
    //debugger;
    super(props);
    this.state = {
      users: [],
      menuNameArray: [],
      permissionArray: [],
      headerEnable: false,      
      userList: [],
      selectedUserId: "",
      companyList: [],
      selectedCompanyId: "",
      companyListFrom: [],
      companyListTo: [],
      selectedUserIdFrom: "",
      selectedCompanyIdFrom: "",
      selectedUserIdTo: "",
      selectedCompanyIdTo: "",
      menuList:[],
      permission:[]
    }
    // this.changeHandler= this.changeHandler.bind(this);
  }


  componentDidMount() {
    //aaaaaaa
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

  callBackMenuArray = (permission) => {
    debugger;   

    if (permission.length == 0) {
      this.setState({        
        permissionArray: permission ? permission : [],
        headerEnable:false        
      });
    }
    if (permission.length > 0) {
      this.setState({        
        permissionArray: permission ? permission : [],   
        headerEnable:permission.filter(arr => arr.Enable == false).map(view => { return true; })[0] ? false : true,     
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
      case "CheckBoxPermission":

        permissionArray[myInt].Enable = checkedValue;
        this.setState({
          headerEnable: permissionArray.filter(arr => arr.Enable == false).map(view => { return true; })[0] ? false : true,
        });
        return permissionArray;     
      default: return null;
    }
  }

  headerClick = (e) => {
    debugger;
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
        case "header_Enable": 
        permissionArray.map(arr => {
          debugger
          arr.Enable = checkedValue;
          return arr.Enable;
        });

          this.setState({
            headerEnable: checkedValue
          });

          return permissionArray;        
        default: return [];
      }
    }
  }

  editPermission = (e) => {
    debugger; 
   
    if (this.state.selectedUserId !== "" && this.state.selectedCompanyId !== "") {
        const { permissionArray } = this.state;
        permissionArray.map(arr => {
          debugger
        Object.assign(arr, { EmpId: this.state.selectedUserId });   
        Object.assign(arr, { CreatedBy: this.props.user.info.EmpId });        
        Object.assign(arr, { companyId: this.state.selectedCompanyId });

      });
      //var url = `http://localhost:52227/api/Application_Control/PostControlPermission_ById`;
       var url = `${axios.baseURL}/Application_Control/PostControlPermission_ById`
      axios.post(url, permissionArray)
        .then((res, err) => {
          debugger;
          if (res.data.Status==="1") {
            Swal.fire(
              res.data.Message +'\n Press OK to back',
            ).then(() => {
              window.location.reload(true);
            })
            //alert(res.data.Message);
            //toast.success(res.data.Message, { position: toast.POSITION.TOP_CENTER });
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
     // alert('Please Select the User first then Compnay');
     // toast.success('Please Select the User first then Compnay', { position: toast.POSITION.TOP_CENTER });
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
        menuList:[]
      });
    }
    if (e.target.name == "selectUser" && v == "") {
      this.setState({
        selectedUserId: "",
        selectedCompanyId: "",
        companyList: []
      });
    }
    if (e.target.name == "selectCompany"&& this.state.selectedUserId !== "") {    
      debugger;
      if (this.state.selectedUserId !== "" && v !== ""){
        //var url=`http://localhost:52227/api/Application_Control/GetGetControlPermissionById?EmpID=${this.state.selectedUserId}&companyId=${v}`;
        var url=`${axios.baseURL}/Application_Control/GetGetControlPermissionById?EmpID=${this.state.selectedUserId}&companyId=${v}`;
        axios.get(url)
        .then((response)=>{
          if(response.data.Status==="1"){
            debugger
            this.setState({
              menuList: response.data.Data,             
            });
          }
          else{
            toast.warn(response.data.Message, { position: toast.POSITION.TOP_CENTER });
          }
        })
        .catch(error=>{
          toast.error(error, { position: toast.POSITION.TOP_CENTER });
        });
  
      }
     

      this.setState({
        selectedCompanyId: e.target.value,
        permissionArray:[],        
      });
    }
    if (e.target.name == "selectCompany" && this.state.selectedUserId == "") {
      this.setState({
        selectedCompanyId: "",
        permissionArray: [],        
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
   // console.log("Menu id== for parent" + menuId);
   // this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };

  render() {
    debugger;
    const { user } = this.props;
    const { headerPerm } = this.state;

    if (this.props.user.info==null) {
      debugger
      return <Redirect to="/sign-in" />;
    }
    return (
      <>
      
      
        <div className="row">
          <div className="col-sm-2 pt-3 left-menu">
            {/* <TreeControl callMenuName={this.callBackMenuArray} selectedUserId={this.state.selectedUserId} selectedCompanyId={this.state.selectedCompanyId} menuClick={this.menuClick} menuList={this.state.menuList} /> */}

            <TreeControl_New callMenuName={this.callBackMenuArray} selectedUserId={this.state.selectedUserId} selectedCompanyId={this.state.selectedCompanyId} menuClick={this.menuClick} menuList={this.state.menuList} />            
          
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
                                value={this.state.selectedUserId}
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
                                name="selectCompany" value={this.state.selectedCompanyId} onChange={this.changeHandler}>
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
                                          name="selectUserFrom" value={this.state.selectedUserIdFrom} onChange={this.changeHandler}>

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
                                        <label>From Company:</label>
                                      </div>
                                      <div className="col-md-8">
                                        <select className="form-control"
                                          name="selectCompanyFrom" value={this.state.selectedCompanyIdFrom} onChange={this.changeHandler}>
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
                                          name="selectUserTo" value={this.state.selectedUserIdTo} onChange={this.changeHandler}>

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
                                          name="selectCompanyTo" value={this.state.selectedCompanyIdTo} onChange={this.changeHandler}>

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
                          <th>Control Name</th>
                          <th>Page Name</th>
                          <th> <input type="checkbox" name={"header_Enable"} checked={this.state.headerEnable} onChange={this.headerClick} 
                          />&nbsp;Enable/Disable</th>                          
                        </tr>
                      </thead>
                      <tfoot>
            <tr>
               <td colSpan="8"> 
               <Link className="btn btn-sm btn-primary mr-2" onClick={this.editPermission} to="/ControlPermission" >
                Save Permission
                </Link></td>
            </tr>
         </tfoot>
                      <tbody>
                        {this.state.permissionArray.length > 0 ?
                          this.state.permissionArray.map((hmenu, index) => {
                            debugger;
                            return (
                              <tr key={index + 1} id={index + 1}>  
                                    <>
                                      <td>{index + 1}</td>
                                      <td>{hmenu.ControlName}</td>
                                      <td>{hmenu.DisplayName}</td>
                                      {/* <td> {perm.ViewPermission ? <span name={"ViewPermission" + "_" + index} style={{ fontFamily: "Wingdings" }} onClick={this.checkBoxChange}>&#254;</span> : <span name={"ViewPermission" + "_" + index} style={{ fontFamily: "Wingdings" }} onClick={this.checkBoxChange}>&#253;</span>}</td> */}
                                      <td><input type="checkbox" name={"CheckBoxPermission_" + index}  onChange={this.checkBoxChange} checked={hmenu.Enable===true || hmenu.Enable==="1"?true:false} /></td>                                      
                                    </>                                  
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

export default connect(state=>({
  user: state.user,
  menuId:state.menuId,
  perm: state.menuPermission.perm,
  comp: state.companyPermission 
}),{ userInfo,setMenu,setMenuPermission,compPerm})(ControlPermission);