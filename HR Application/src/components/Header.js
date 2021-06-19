import React, { Component } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import "./Style.css";
import axios from "axios";
import { persistor } from "../store";
import Changepwd from "./changepwd"
import { connect } from "react-redux";
import { login } from "../redux/actions/user";
import usericon from "./images/usericon.png";
import logouticon from "./images/logout.png";
import changepwd from "./images/changepwd.png";
import { userInfo } from "../redux/actions/user";
import logoheader from "./images/logo_header.png";
import { setMenu } from '../redux/actions/menu';
import { logout } from '../redux/actions/logout';
import { setMenuPermission } from '../redux/actions/menuPermission';
import { getMenuList } from '../redux/actions/menuList'
import { controlPermission } from '../redux/actions/controlPermission';
import { ToastContainer, toast } from 'react-toastify';
import DateFormatComponent from '../components/DateFormat/DateFormatComponent';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      selectedMenuId: 0,
      SelectedMenu: "",
      loggedCompanyName: "",
      showhide: "block",
      open: false,
      sMenuItem: [],
    };
    this.clickOnMenu = this.clickOnMenu.bind(this);
  }
  componentWillMount() {
    debugger;
    if (this.props.perm.length == 0) {
      var dashpage = new Array();
      dashpage = [{ PageID: '0', PageName: 'userdashboard', ViewPermission: true, AddPermission: false, EditPermission: false, DeletePermission: false, PrintPermission: false, ExportPermission: false }];
      this.props.setMenuPermission(dashpage);
    }
    debugger
    this.setState({ persons: this.props.menus.menuitem, loggedCompanyName: this.props.comp.compperm.companyName });
    this.getControlsPermission();
  }
  onLogout = () => {
    debugger
    this.props.logout();
    localStorage.clear();
    this.props.history.push("/sign-in");
    //on logout 
  };
  clickOnMenu(menuId) {
    debugger;
    if (menuId != null && isNaN(menuId) ) {
      this.setState({ ...this.state, showhide: "block", selectedMenuId: menuId, open: !this.state.open }, () => {
        console.log("menuid    " + this.state.selectedMenuId);
      });
    }
    else {
      this.setState({ ...this.state, showhide: "none", selectedMenuId: menuId, open: !this.state.open }, () => {
        console.log("menuid    " + this.state.selectedMenuId);
      });
    }
    this.props.setMenu(menuId);
  }
  changeCompany = () => {
    this.props.history.push("/LoginCompany");
  }
  getControlsPermission = () => {
    debugger
    if (this.props.user.info !== null) {
      debugger
     var url = `${axios.baseURL}/Application_Control/GetControlPermission_Redux?EmpID=${this.props.user.info.EmpId}&companyId=${this.props.comp.compperm.CompanyId}`;
     axios.get(url)
        .then(response => {
          debugger
          if (response.data.Status === "1") {
            debugger
            this.props.controlPermission(response.data.Data);
          }
          else {
      
          }
        })
        .catch(error => {
          debugger
          toast.error(error, { position: toast.POSITION.TOP_CENTER });
        });
    }
  }
  render() {
    debugger
    const { showhide } = this.state
    if (this.props.user.isLogged === false) {
      localStorage.clear();
    }
    if (window.location.pathname === '/') return null;
    if (window.location.pathname === '/sign-in') return null;
    if (window.location.pathname === '/LoginCompany') return null;
    if (this.props.perm != null) {
      return this.props.perm.filter(x => x.PageName === this.props.location.pathname.split('/')[1]).map(item => {
        if (item.ViewPermission == false) {
          this.onLogout();
          return <Redirect to="/sign-in" />;
        }
        else {
          if (this.props.user.info == null) {
            return <Redirect to="/sign-in" />;
          }
          else {
            return (
              <>
                <div className="modal fade" id="changepwd" role="dialog" >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4>Change Password</h4>
                        <button type="button" className="close" data-dismiss="modal">
                          &times;
                      </button>
                      </div>
                      <div className="modal-body">
                        <Changepwd />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="navbar-fixed-top">
                  <nav className="navbar navbar-expand-lg navbar-dark topbg">
                    <a className="navbar-brand logobg" href="#">
                      <img src={logoheader} /> HR Management System
                  </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent"    >
                      <div id="compname">{this.state.loggedCompanyName}</div>
                      <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown login_top">
                          <a className="nav-link dropdown-toggle user_panel" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={usericon} className="header_icon" /> {this.props.user.info.username}
                          </a>
                          <div className="dropdown-menu dropdown-menu-right " aria-labelledby="navbarDropdown">
                            <p className="dropdown-item text-center"><strong>Login Time </strong> <br />
                              <DateFormatComponent dateFormatString="dd/MM/yyyy hh:mm:ss" dateObj={new Date(this.props.user.info.logindatetime)} /></p>
                            <div className="dropdown-divider"></div>
                            <div style={{ padding: "1px 5px" }}>{this.state.loggedCompanyName} </div>
                            <div className="dropdown-divider"></div>
                            <button onClick={this.changeCompany} className="companyLog"> Change Company</button>
                            <div className="dropdown-divider"></div>
                            <button className="changepwd" data-toggle="modal" data-target="#changepwd"><img src={changepwd} className="logout_sub" /> Change Password</button>
                            <div className="dropdown-divider"></div>
                            <button onClick={this.onLogout} className="logout"><img src={logouticon} className="logout_sub" /> Logout</button>
                          </div>
                        </li>
                      </ul>
                      <div className="form-inline my-2 my-lg-0">
                      </div>
                    </div>
                  </nav>
                  <nav className="ddNav">
                    <ul className="ddnav-menu">
                      {this.props.menus.menuitem !== null ? this.props.menus.menuitem.map((hmenu,hindex) => (
                        <li key={hindex} style={{ color: "#FFF" }}>
                          {" "}
                          {
                            hmenu.SubMenu.length > 0 ?
                              <Link to="#"
                                onClick={() => {
                                  this.clickOnMenu(hmenu.PageName);
                                }}>
                                {" "}
                                {hmenu.MenuName}
                              </Link> :
                              <Link to={hmenu.PageName}
                                onClick={() => {
                                  this.clickOnMenu(hmenu.PageName);
                                }}>
                                {" "}
                                {hmenu.MenuName}
                              </Link>
                          }
                          <ul style={{ display: showhide }}>
                            {hmenu.SubMenu.map((sub,index) => (
                              <li key={index}>
                                <Link key={sub.PageName} to={sub.PageName}
                                  onClick={() => {
                                    this.clickOnMenu(sub.ID);
                                  }}
                                >
                                  {sub.MenuName}
                                </Link>
                                <ul>
                                  {sub.SubMenu.map((ssub,index1) => (
                                    <li key={index1}>
                                      <Link key={ssub.PageName} to={ssub.PageName}
                                        onClick={() => {
                                          this.clickOnMenu(ssub.ID);
                                        }}
                                      >
                                        {ssub.MenuName}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )) : null}
                    </ul>
                  </nav>
                </div>
              </>
            );
          }
        }
      })
    }
    else {
      return null
    }
  }
}
Header = withRouter(Header);
export default connect(
  (state) => ({
    user: state.user,
    comp: state.companyPermission,
    menuId: state.menu,
    perm: state.menuPermission.perm,
    menus: state.menuList,
    controlsList: state.controls.controlsItem
  }),
  { login, setMenu, logout, getMenuList, setMenuPermission, controlPermission })(Header);



