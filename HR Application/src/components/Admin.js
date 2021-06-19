import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import Header from "./Header";
import Rightnav from "./Rightnav";
import Selectbox from "./Selectbox";
import Table from "./dataintable";

export default class Admin extends Component {
    constructor(props){
        super(props)
        const token = localStorage.getItem("token")
        let loggedIn = true
        if(token == null){
            loggedIn = false
        }
        this.state = {
            loggedIn
        }
    }
    render() {
        if(this.state.loggedIn === false){
             return <Redirect to="/" />
        }
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
<div className="col-md-12 mb-3">
  <form onSubmit={this.handleFormSubmit}  className="form-container">
    <div className="form-group row">
      <label className="col-sm-1 col-form-label pt-1 col-form-label">Department</label>
      <div className="col-sm-3">
        <select className="form-control form-control-sm">
          <option>Hr </option>
          <option>Hr </option>
          <option>Hr </option>
        </select>
      </div>

      <label  className="col-sm-1 col-form-label pt-1 col-form-label">Search</label>
      <div className="col-sm-3">
      <input type="text" name="search" className="form-control form-control-sm" placeholder="Search"  value={this.state.uName} onChange={this.handleChange} />
      </div>
      
      <div className="col-sm-4 px-0">
        <div className="container">
         <button type="button" className="btn btn-primary btn-sm col-sm-4  mr-2"> Upgrade Form  </button>
         <button type="button" className="btn btn-primary btn-sm col-sm-4  mr-2"> Update </button>
         <button type="button" className="btn btn-primary btn-sm col-sm-3"> Clear  </button>
      </div>
      </div>
    </div>
    
    <div className="form-group row">
      <label className="col-sm-1 col-form-label pt-1 col-form-label">Code</label>
      <div className="col-sm-1">
      <select className="form-control form-control-sm">
        <Selectbox />
        </select>
      </div>
      
      <label  className="col-sm-1 col-form-label pt-1 col-form-label">Name</label>
      <div className="col-sm-1">
      <input type="email" className="form-control form-control-sm" id="colFormLabelSm" placeholder="" />
      </div>
      <label className="col-sm-1 col-form-label pt-1 col-form-label">DOB</label>
      <div className="col-sm-1">
      <input type="email" className="form-control form-control-sm" id="colFormLabelSm" placeholder="" />
      </div>
      <label className="col-sm-2 col-form-label pt-1 col-form-label">I Card Issue Date</label>
      <div className="col-sm-1">
      <input type="email" className="form-control form-control-sm" id="colFormLabelSm" placeholder="" />
      </div>
      <button type="submit" className="btn btn-primary btn-block">Submit</button>
      
    </div>
  </form>
</div>
      <div className="col-md-12 mb-3">
                  <div className="form-container">

                    
          <table className="table">
                      <thead className="thead-dark">
              <tr>
                          <th className="success">ID</th>
                          <th>Main Menu</th>
                          <th>Sub Menu</th>
                          <th>Sub to Sub  Menu</th>
                        </tr>
            </thead>
                      <tbody>
              
                <Table />
             
              
            </tbody>
                    </table>
        </div>
                </div>
    </div>
            </div>
</main>
            </>
        );
    }
}









            