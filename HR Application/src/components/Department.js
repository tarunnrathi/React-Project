import React, { Component } from 'react';
import Header from './Header';
import Axios from 'axios';
import Bootstraptab from './DataGrid';

export default class Department extends Component {
  constructor(props){
    super(props)
    this.state= {
      DepartmentName:"", 
      IsActive:"",
      CreatedBy:"",
      CreatedDate:"",
      ModifyBy:"",
      ModifyDate:"",
      countries:[]
    }
  }
  changeHandler = (e) => {
    this.setState({[e.target.name]:e.target.value})
}
submitHandler = (e) => {
   
    e.preventDefault()
    console.log(this.state)

    //axios.post("http://10.1.2.38:5252/api/hrapi/PostUserMaster", this.state)
    //.then(response => {
     //   console.log(response);
   // })
   // .catch(error => {
     //   console.log(error)
    //})
}
    
    componentDidMount(){
        Axios.get('http://115.112.34.123:5252/api/hrapi/MenuItem').then((res) => {
            this.setState({countries:res.data.Data.MainMenuList});
        });
    }
    
    render() {
      const { DepartmentName, IsActive, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = this.state
        return (
          <>
            <Header />
            <main role="main">
                <ol className="ddhead mb-3">
                    <li className="breadcrumb-item active text-dark">
                    <h3>Department</h3>
                    </li>
                </ol>
                <div className="row">
                  <div className="container">
                    <div className="col-md-8 mx-auto">
                      <form  onSubmit={this.submitHandler} className="form-container mt-5">
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
    <label className="col-sm-4 col-form-label pt-2 col-form-label text-right">Department Name : </label>
    <div className="col-sm-6 pl-0">
      <input type="text" 
       className="form-control form-control-sm" 
       placeholder="Enter Department Name"   
       name="DepartmentName" 
       value={DepartmentName} 
       onChange={this.changeHandler} />
    </div>
</div>

<div className="form-group row">
    <label className="col-sm-4 col-form-label pt-2 col-form-label text-right">Is Active : </label>
    <div className="col-sm-6 pl-0">
        <input type="text" 
        className="form-control form-control-sm" 
        placeholder="Enter Department Name"   
        name="IsActive" 
        value={IsActive} 
        onChange={this.changeHandler} />
    </div>
</div>

<div className="form-group row">
    <label className="col-sm-4 col-form-label pt-2 col-form-label text-right text-right">Created By : </label>
    <div className="col-sm-2 pl-0">
      <input type="text" 
        className="form-control form-control-sm" 
        placeholder="Created By"   
        name="CreatedBy" 
        value={CreatedBy} 
        onChange={this.changeHandler} />
    </div>
    <label className="col-sm-2 col-form-label pt-2 col-form-label text-right text-right">Created Date : </label>
    <div className="col-sm-2 pl-0">
      <input type="date" 
        className="form-control form-control-sm" 
        placeholder="Created Date"   
        name="CreatedDate" 
        value={CreatedDate} 
        onChange={this.changeHandler} />
    </div>
</div>
<div className="form-group row mb-5">
    <label className="col-sm-4 col-form-label pt-2 col-form-label text-right text-right">Modify By : </label>
    <div className="col-sm-2 pl-0">
      <input type="text" 
        className="form-control form-control-sm" 
        placeholder="Modify By"   
        name="ModifyBy" 
        value={ModifyBy} 
        onChange={this.changeHandler} />
    </div>
    <label className="col-sm-2 col-form-label pt-2 col-form-label text-right text-right">Modify Date : </label>
    <div className="col-sm-2 pl-0">
    <input type="date" 
        className="form-control form-control-sm" 
        placeholder="Modify Date"   
        name="ModifyDate" 
        value={ModifyDate} 
        onChange={this.changeHandler} />
    </div>
</div>
<div className="form-group row form-bottum pt-2 pb-2">
    <div className="col-sm-2 mx-auto">
      <button type="submit" className="btn ddbtn"> Submit </button>
    </div>
</div>
                      </form>
                    </div>

                     <div className="col-md-8 mx-auto">
                    <div className="form-container mt-4">
                       <Bootstraptab/>
                    </div>
                    </div>
                  </div>
                </div>
            </main>
          </> 
            
        )
    }
}
