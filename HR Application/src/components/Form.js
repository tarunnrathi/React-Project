import React, { useState } from "react";
import axios from 'axios'
import { useHistory } from "react-router-dom";

  const AddUser = () => {
  let history = useHistory();
  const [user, setUser] = useState({
    ParentID:"", 
    ParentName:"", 
    ChildID:"", 
    ChildPageName:"", 
    ChildName:"",
    DisplayYN:"Y",
    Level_Idx:"",
    Viwe_Index:"",
    Directory:"Y"
  });

  const headers = {
    'Content-Type':'application/json'
  }

  const { ParentID, ParentName, ChildID, ChildPageName, ChildName,DisplayYN,Level_Idx,Viwe_Index,Directory } = user;

  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    // console.log(user);
     axios.post("http://10.1.2.38:5252/api/hrapi/PostUserMaster", user,{headers:headers}
    );
    history.push("/");
    console.log(user);

// var data = JSON.stringify({"ParentID":"114","ParentName":"pqrs","ChildID":"115","ChildPageName":"WXYZ:.aspx","ChildName":"wxyz","DisplayYN":null,"Level_Idx":"5","Viwe_Index":null,"Directory":"HIS"});
// var config = {
//   method: 'post',
//   url: 'http://10.1.1.189:5252/api/HRAPI/PostUserMaster',
//   headers: { 
    
//     'Content-Type': 'application/json; charset=utf8'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

 };

    return (
            <div>
                <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <label>Parent ID </label>
                    <input type="text" className="form-control" placeholder="Enter Parent ID"  
                    name="ParentID" 
                    value={ParentID} 
                    onChange={e => onInputChange(e)} />
                </div>
                <div className="form-group">
                    <label>Parent Name</label>
                    <input type="text" className="form-control" placeholder="Enter Parent Name"
                    name="ParentName" 
                    value={ParentName} 
                    onChange={e => onInputChange(e)} />
                </div>
                <div className="form-group">
                    <label>Child ID</label>
                    <input type="text" className="form-control" placeholder="Enter Child ID"  
                    name="ChildID" 
                    value={ChildID} 
                    onChange={e => onInputChange(e)} />
                </div>
                <div className="form-group">
                    <label>Child Page Name</label>
                    <input type="text" className="form-control" placeholder="Enter Child Page Name"  
                    name="ChildPageName" 
                    value={ChildPageName} 
                    onChange={e => onInputChange(e)} />
                </div>
                <div className="form-group">
                    <label>Child Name</label>
                    <input type="text" name="childname" className="form-control" placeholder="Enter Child Name"  
                     name="ChildName" 
                     value={ChildName} 
                     onChange={e => onInputChange(e)} />
                </div>
                <div className="form-group">
                    <label>Level_Idx</label>
                    <input type="text" name="level_Idx" className="form-control" placeholder="Enter Level_Idx"  
                    name="Level_Idx" 
                    value={Level_Idx} 
                    onChange={e => onInputChange(e)} />
                </div>
                <div className="form-group">
                    <label>Viwe_Index</label>
                    <input type="text" name="viwe_index" className="form-control" placeholder="Enter Viwe_Index"  
                     name="Viwe_Index" 
                     value={Viwe_Index} 
                     onChange={e => onInputChange(e)} />
                </div>
                
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                
            </form>
            </div>
        )
    
  }
  export default AddUser;
