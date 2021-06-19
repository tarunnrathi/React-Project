import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setMenu } from "../../redux/actions/menu";
import { Redirect } from "react-router-dom";
import { setMenuPermission } from '../../redux/actions/menuPermission';
import { userInfo } from "../../redux/actions/user";
import loginlogo from "../images/loginlogo.png";
import { getMenuList } from '../../redux/actions/menuList'
import { Modal } from "react-responsive-modal";
import { getDate } from "date-fns";
//import {controlPermission} from '../../redux/actions/controlPermission';
//import { ToastContainer, toast } from 'react-toastify';

class UserDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      persons: []
    
    }

  }
 
  componentWillMount() {
    this.getMenu();
  //  this.getControlsPermission();    
   }
   
  getMenu() {
    if (this.props.user.info != null) {
      debugger;
      const co = this.props.comp.compperm.CompanyId
      var url = `${axios.baseURL}/hrapi/HeaderMenuItemByEmpId?EmpId=` + this.props.user.info.EmpId + `&companyId=` + co;
      axios
        .get(url)
        .then((res) => {
          debugger;
          if (res.data.Status === "1") {
            debugger;
            this.props.getMenuList(res.data.Data.MainMenuList);

          }
          else if (res.data.Status === "0") {
            debugger;
            this.props.getMenuList(res.data.Data);
          }

        })
        .catch(error => {
        //  alert("", error);
        })
        
    }
  }

//   getControlsPermission=()=>{
//     debugger
//     if (this.props.user.info!==null) {
//           var url=`http://localhost:52227/api/Application_Control/GetControlPermission_Redux?EmpID=${this.props.user.info.EmpId}&companyId=${this.props.comp.compperm.CompanyId}`;
//           axios.get(url)
//           .then(response=>{
//             debugger
//               if(response.data.Status==="1"){
//                   debugger
//                   this.props.controlPermission(response.data.Data);
//               }
//               else{
//                toast.warn(response.data.Message, { position: toast.POSITION.TOP_CENTER });
//               }
//           })
//           .catch(error=>{
//            toast.error(error, { position: toast.POSITION.TOP_CENTER });
//           });

//     } 
//  }

  
 
  render() {
    debugger
    if (this.props.user.info == null) {
      return <Redirect to="/sign-in" />;
    }
    else {
      return (
        <>
          <main role="main">
           <div className="row">
              <div className="container">
                <div className="col-md-10 mx-auto" style={{ padding: "1%" }}>
                  <p key="P1" style={{ textAlign: 'center' }}><img src={loginlogo} className="brand_logo" /></p>
                  <div className="form-container mt-4">
                    <h1 key="h1" style={{ textAlign: 'center' }}>WELCOME TO HR APPLICATION</h1>
                    <h3 key="h3" style={{ textAlign: 'center' }}>{this.props.comp.compperm.companyName}</h3>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      );
    }
  }
}
export default connect(
  (state) => ({
    user: state.user,
    menuId: state.menuId,
    comp: state.companyPermission,
    menus: state.menuList,
  //  controlsList:state.controls
  }),
  { setMenu, setMenuPermission, getMenuList }
)(UserDashboard);