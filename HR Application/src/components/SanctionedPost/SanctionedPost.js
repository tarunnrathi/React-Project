import React, { Component } from "react";
import { connect } from "react-redux";
import { setMenu } from "../../redux/actions/menu";
import SanctionedPostGrid from "./SanctionedPostGrid";

class SanctionedPost extends Component {
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
    return (
      <>
        
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Senctioned Post</h3>
            </li>
          </ol>
          <div className="row">
            <div className="container">
              <div className="col-md-12 mx-auto">
                <div className="form-container mt-2">
                 
                   <SanctionedPostGrid menuId={this.state.selectedMenuId} /> 
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
)(SanctionedPost);
