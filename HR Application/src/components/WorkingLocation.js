import React, { Component } from 'react';
import Header from './Header';
import Axios from 'axios';

export default class WorkingLocation extends Component {
    state = {
        countries:[]
    }
    componentDidMount(){
        Axios.get('http://115.112.34.123:5252/api/hrapi/MenuItem').then((res) => {
            this.setState({countries:res.data.Data.MainMenuList});
        });
    }
    render() {
        return (
          <>
            <Header />
            <main role="main">
                <ol className="ddhead mb-3">
                    <li className="breadcrumb-item active text-dark">
                    <h3>Working Location</h3>
                    </li>
                </ol>
                <div className="row">
                  <div className="container">
                    <div className="col-md-8 mx-auto">
                      <form className="form-container mt-5">
                        {/*<div className="form-group row">
                          <label className="col-sm-2 col-form-label pt-2 col-form-label">ParentID </label>
                          <div className="col-sm-4 pl-0">
                            <select className="form-control form-control-sm">
                                <option>Select Parent ID .... </option>
                                {
                                this.state.countries.map((hmenu) =>
                                <option key={hmenu.id} value={hmenu.id}> {hmenu.MenuName}</option>
                                )}
                            </select>
                          </div>
                            </div>*/}

                        <div className="form-group row  mt-3">
                            <label className="col-sm-4 col-form-label pt-2 col-form-label text-right">Working Location Name : </label>
                            <div className="col-sm-6 pl-0">
                            <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Child ID" />
                            </div>
                        </div>

                        <div className="form-group row  mt-3">
                            <label className="col-sm-4 col-form-label pt-2 col-form-label text-right">Working Location Name : </label>
                            <div className="col-sm-6 pl-0">
                            <input list="browsers" name="browser" id="browser" className="form-control form-control-sm" />
                            <datalist id="browsers">
                                <option value="Edge"> Edge</option> 
                                <option value="Firefox"> Firefox</option> 
                                <option value="Chrome"> Chrome</option> 
                                <option value="Opera"> Opera</option> 
                                <option value="Safari"> Safari</option> 
                            </datalist>
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label pt-2 col-form-label text-right">Is Active : </label>
                            <div className="col-sm-6 pl-0">
                            <input type="text" name="search" className="form-control form-control-sm" placeholder="Enter Child Name" />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label pt-2 col-form-label text-right text-right">Created By : </label>
                            <div className="col-sm-2 pl-0">
                            <input disabled type="text" name="search" className="form-control form-control-sm" placeholder="Enter Created By" />
                            </div>
                            <label className="col-sm-2 col-form-label pt-2 col-form-label text-right text-right">Created Date : </label>
                            <div className="col-sm-2 pl-0">
                            <input disabled type="date" name="search" className="form-control form-control-sm" placeholder="Enter Created Date" />
                            </div>
                        </div>
                        <div className="form-group row mb-5">
                            <label className="col-sm-4 col-form-label pt-2 col-form-label text-right text-right">Modify By : </label>
                            <div className="col-sm-2 pl-0">
                            <input disabled type="text" name="search" className="form-control form-control-sm" placeholder="Enter Modify By" />
                            </div>
                            <label className="col-sm-2 col-form-label pt-2 col-form-label text-right text-right">Modify Date : </label>
                            <div className="col-sm-2 pl-0">
                            <input disabled type="date" name="search" className="form-control form-control-sm" placeholder="Enter Modify Date" />
                            </div>
                        </div>

                        
                        
                        <div className="form-group row form-bottum pt-2 pb-2">
                           
                        <div className="col-sm-2 mx-auto">
                        <input type="button" className="btn ddbtn" value="Submit" />
                        </div>
                        </div>
                      </form>
                    </div>
                    {/* <div className="col-md-12 mb-3">
                    <div className="form-container">

                    </div>
                    </div>*/}
                  </div>
                </div>
            </main>
          </> 
            
        )
    }
}
