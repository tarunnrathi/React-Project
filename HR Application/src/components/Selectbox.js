import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from 'react-router-dom';
import './Style.css';
import Axios from 'axios'

class FlavorForm extends React.Component {
  state = {
    countries: []
   }
   componentDidMount() {
       //console.log("devender");
        Axios.get(`http://115.112.34.123:5252/api/hrapi/MenuItem`).then((res) => {           
          this.setState({ countries:res.data.Data.MainMenuList });
         //console.log(res.data.Data); 
        });         
   }

render() {

    return (
      <>
        
    <datalist id="browsers">
          {
            this.state.countries.map((hmenu) =>
            <option key={hmenu.id} value={hmenu.id}> {hmenu.MenuName}</option>
          )}
          </datalist>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
}))(FlavorForm);