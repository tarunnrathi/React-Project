import React, { useState, Component } from "react";
import axios from 'axios'
import { useHistory } from "react-router-dom";


class AddUsercla extends Component {
    constructor(props){
      super(props)
      this.state= {
        ParentID:"", 
        ParentName:"", 
        ChildID:"", 
        ChildPageName:"", 
        ChildName:"",
        DisplayYN:"Y",
        Level_Idx:"",
        Viwe_Index:"",
        Directory:"Y"
      }
    }
    changeHandler = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }
    submitHandler = (e) => {
        
        e.preventDefault()
        
        axios.post("http://10.1.2.38:5252/api/hrapi/PostUserMaster", this.state)
        .then(response => {
            
            console.log(response);
        })
       // .catch(error => {
         //   console.log(error)
        //})
    } 
    
render(){
    const { ParentID, ParentName, ChildID, ChildPageName, ChildName,DisplayYN,Level_Idx,Viwe_Index,Directory } = this.state
    const headers = { 'Content-Type':'application/json' }
    return (
        <>
        <form onSubmit={this.submitHandler}>
          
          <div className="form-group">
                    <label>Parent ID </label>
                    <input type="text" className="form-control" placeholder="Enter Parent ID"  
                    name="ParentID" 
                    value={ParentID} 
                    onChange={this.changeHandler} />
                </div>

                <div className="form-group">
                    <label>Parent Name</label>
                    <input type="text" className="form-control" placeholder="Enter Parent Name"
                    name="ParentName" 
                    value={ParentName} 
                    onChange={this.changeHandler} />
                </div>
                <div className="form-group">
                    <label>Child ID</label>
                    <input type="text" className="form-control" placeholder="Enter Child ID"  
                    name="ChildID" 
                    value={ChildID} 
                    onChange={this.changeHandler} />
                </div>
                <div className="form-group">
                    <label>Child Page Name</label>
                    <input type="text" className="form-control" placeholder="Enter Child Page Name"  
                    name="ChildPageName" 
                    value={ChildPageName} 
                    onChange={this.changeHandler} />
                </div>
                <div className="form-group">
                    <label>Child Name</label>
                    <input type="text" name="childname" className="form-control" placeholder="Enter Child Name"  
                     name="ChildName" 
                     value={ChildName} 
                     onChange={this.changeHandler} />
                </div>
                {/*<div className="form-group">
                    <label>Display YN</label>
                    <input type="text" name="childname" className="form-control" placeholder="Enter Child Name"  />
                    </div>*/}
                <div className="form-group">
                    <label>Level_Idx</label>
                    <input type="text" name="level_Idx" className="form-control" placeholder="Enter Level_Idx"  
                    name="Level_Idx" 
                    value={Level_Idx} 
                    onChange={this.changeHandler} />
                </div>
                <div className="form-group">
                    <label>Viwe_Index</label>
                    <input type="text" name="viwe_index" className="form-control" placeholder="Enter Viwe_Index"  
                     name="Viwe_Index" 
                     value={Viwe_Index} 
                     onChange={this.changeHandler} />
                </div>
          <button type="submit" className="btn btn-primary btn-block">Add User</button>
        </form>
      </>
  );
    }
};

export default AddUsercla;
