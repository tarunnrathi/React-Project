import React, { Component } from "react";

import { connect } from "react-redux";

import Designation from "./Designations/Designation";

const Components = {
  Designation: Designation,
};
var intervalId = "";
class main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    if (this.props.perm && this.props.perm.length == 0) {
      return;
    }
    let index = 0;
    console.log("perms=2222");
    console.log({ pe: this.props.perm });

    let selectedMenuIndex = this.props.perm.findIndex(
      (menu) => parseInt(menu.PageID) === this.props.menuId
    );
    let menu = this.props.perm[selectedMenuIndex];
    console.log({ menu });
    let MyCompoent = Components[menu["PageName"]];
    return <MyCompoent />;
  }
}
export default connect((state) => ({
  user: state.user,
  perm: state.menuPermission.perm,
  menuId: state.menu.menuId,
}))(main);
