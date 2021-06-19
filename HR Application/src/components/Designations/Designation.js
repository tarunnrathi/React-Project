import React, { Component } from "react";
import axios from "axios";
import DesignationGrid from "./DesignationGrid";
import { connect } from "react-redux";
import { setMenu } from "../../redux/actions/menu";
import { Redirect } from "react-router-dom";
import { userInfo } from "../../redux/actions/user";

class Designation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuId: 0,
    };
  }

  menuClick = (menuId) => {
    console.log("Menu id== for parent" + menuId);
    this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };
  
  render() {
    debugger
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    return (
      <>
        
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Designation</h3>
            </li>
          </ol>
          <div className="row">
            <div className="container">
              <div className="col-md-12 mx-auto">
                <div className="form-container mt-2">
                  <DesignationGrid menuId={this.state.selectedMenuId} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default connect(
  (state) => ({
    user: state.user,
    menuId: state.menuId,
  }),
  { setMenu }
)(Designation);
 