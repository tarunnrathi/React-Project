import React, { Component } from "react";
import Axios from "axios";
import CompanyTypeMasterGrid from "./CompanyTypeMasterGrid";
import { connect } from "react-redux";
import { setMenu } from "../../redux/actions/menu";

class CompanyTypeMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuId: 0, 
    };
  }

  menuClick = (menuId) => {
    alert("Menuid ",menuId);
    console.log("Menu id== for parent" + menuId);
    this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };
  render() {
    debugger;
    return (
      <>
        
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Company Type Master</h3>
            </li>
          </ol>
          <div className="row">
            <div className="container">
              <div className="col-md-12 mx-auto">
                <div className="form-container mt-2">
                   <CompanyTypeMasterGrid menuId={this.state.selectedMenuId} /> 
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
    menuId: state.menuId,
  }),
  { setMenu }
)(CompanyTypeMaster);
