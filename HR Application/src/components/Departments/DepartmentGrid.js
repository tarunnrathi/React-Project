import React, { Component } from "react";
import Axios from "axios";
import Bootstraptab from "./DataGrid";
import { connect } from "react-redux";
import { setMenu } from "../../redux/actions/menu";
import { Redirect } from "react-router-dom";

import { userInfo } from "../../redux/actions/user";
class DepartmentGrid extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuId: 0, 
    };
  }
componentWillUnmount() {
    this._isMounted = false;
  }
  menuClick = (menuId) => {
    console.log("Menu id== for parent" + menuId);
    this.props.setMenu(menuId);
  };
  render() {
    debugger
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    else{
      return (
        <>
         <main role="main">
            <ol className="ddhead mb-1">
              <li className="breadcrumb-item active text-dark">
                <h3>Department</h3>
              </li>
            </ol>
            <div className="row">
              <div className="container">
                <div className="col-md-12 mx-auto">
                  <div className="form-container mt-2">
                    <Bootstraptab menuId={this.state.selectedMenuId} />
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
  }),
  { setMenu }
)(DepartmentGrid);
