import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Header from "./Header";
import Axios from 'axios';
//import Rightnav from "./Rightnav";
import Selectbox from "./Selectbox";

export default class MenuCreation extends Component {
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
            <Header />
            <main role="main">
  <ol className="ddhead mb-3">
              <li className="breadcrumb-item active text-dark">
      <h3>Dashboard</h3>
    </li>
            </ol>
  <div className="row">
              <div className="container">
<div className="col-md-10 mx-auto">
  <form className="form-container mt-5">
    <div className="form-group row">
      <label className="col-sm-2 col-form-label pt-2 col-form-label text-right">ParentID : </label>
      <div className="col-sm-4">
       
      <input list="browsers" name="browser" id="browser" className="form-control form-control-sm" />
      <datalist id="browsers">
        {
            this.state.countries.map((hmenu) =>
            <option key={hmenu.id} value={hmenu.id}> {hmenu.MenuName}</option>
          )}
       </datalist>  
        
      </div>

      <label  className="col-sm-2 col-form-label pt-2 col-form-label text-right">Parent Name : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Parent Name" />
      </div>
    </div>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label pt-2 col-form-label text-right">ChildID : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Child ID" />
      </div>

      <label  className="col-sm-2 col-form-label pt-2 col-form-label text-right">Child Page Name : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Child Page Name" />
      </div>
    </div>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label pt-2 col-form-label text-right">Child Name : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Child Name" />
      </div>

      <label  className="col-sm-2 col-form-label pt-2 col-form-label text-right">Display YN : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Display YN" />
      </div>
    </div>
    <div className="form-group row mb-5">
      <label className="col-sm-2 col-form-label pt-2 col-form-label text-right">Level_IDX : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Level_IDX" />
      </div>

      <label  className="col-sm-2 col-form-label pt-1 col-form-label text-right">Viwe_Index : </label>
      <div className="col-sm-4">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Viwe_Index" />
      </div>
    </div>
    <div className="form-group row form-bottum pt-2 pb-2">
      <div className="col-sm-2 mx-auto">
        <input type="button" className="btn ddbtn" value="Submit" />
      </div>
    </div>
    
    
  </form>
</div>
{/* 
  <div className="col-md-12 mb-3">
    <div className="form-container">
      
    </div>
  </div>
*/}
    </div>
            </div>
</main>
            </>
        );
    }
}









            