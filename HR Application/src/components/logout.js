import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setMenu } from "../redux/actions/menu";
import { connect } from "react-redux";

class Logout extends Component {
    constructor(props){
        super(props)
        const token =  localStorage.removeItem("token")

    }
    render() {
        return (
            <div>
              <h1>You are LogOut</h1>  
              <Link to="/logout"> Logout</Link>
            </div>
        );
    }
}

//export default Logout;

export default connect((state) => ({
    user:""
  }),
  { setMenu }
)(Logout);
