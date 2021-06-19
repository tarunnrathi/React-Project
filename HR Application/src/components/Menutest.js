import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import './Style.css';
import Axios from 'axios'


export default class Menutest extends Component {
  state = {
    persons: []
  }
  componentDidMount() {
    //console.log("devender");
     Axios.get(`http://115.112.34.123:5252/api/usermasters/munuitem`).then((res) => {           
       this.setState({ persons:res.data.Data.MainMenuList });
      console.log(res.data.Data); 
     });         
     
}
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark topbg">
  <a className="navbar-brand logobg" href="#">HR Management System</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav ml-auto">
      {/* <li className="nav-item active">
        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Link</a>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </li> */}
      <li className="nav-item">
        <a className="nav-link" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
      </li>
    </ul>
    <div className="form-inline my-2 my-lg-0">
     
     
      <Link to="/logout" className="btn btn-primary my-2 my-sm-0">Logout</Link>
    </div>
  </div>
</nav>

                
          
    <nav className="ddNav">
      <ul className="ddnav-menu">
       {/* <li><a href="#">HIS </a></li>
        <li><a href="#" className="nav-active">Document</a>
          <ul>
            <li><a href="#">Sub Nav Link</a></li>
            <li><a href="#">Sub Nav Link</a>
              <ul>
                <li><a href="#">Sub Sub Nav Link</a></li>
                <li><a href="#">Sub Sub Nav Link</a></li>
                <li><a href="#">Sub Sub Nav Link</a>
                  <ul>
                    <li><a href="#">Sub Sub Nav Link</a></li>
                    <li><a href="#">Sub Sub Nav Link</a></li>
                    <li><a href="#">Sub Sub Nav Link</a>
                    <ul>
                    <li><a href="#">Sub Sub Nav Link</a></li>
                    <li><a href="#">Sub Sub Nav Link</a></li>
                    <li><a href="#">Sub Sub Nav Link</a></li>
                  </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="#">Sub Nav Link</a></li>
            <li><a href="#">Sub Nav Link</a></li>
          </ul>
    </li>

        <li><a href="#">Insurance</a></li>
        <li><a href="#">Pharmacy</a></li>
        <li><a href="#">System Control</a></li>
        <li><a href="#">Store</a></li>
        <li><a href="#">Nursing Station</a></li>
        <li><a href="#">Gate</a></li>
        <li><a href="#">Machine</a></li>*/}
        {
           this.state.persons.map((number) =>
        <li key ={number.ID}> <a href="#">{number.MenuName}</a>
            <ul>{
                 number.SubMenu.map((sub)=>
               <li key ={sub.ID}><a href="#">{sub.MenuName}</a>
                <ul>{
                 sub.SubMenu.SubMenu.map((ssub)=>
               <li key ={ssub.ID}><a href="#">{ssub.MenuName}</a>
               </li>
              )}
             
            </ul>
               
               </li>
              )}
             
            </ul>
        </li>
          )
        }
        
      </ul>
    </nav>
  
</div>
        );
    }
}



