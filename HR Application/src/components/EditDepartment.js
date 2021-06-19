import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { useHistory, useParams } from "react-router-dom";

function EditDepartment() {
  let history = useHistory();
  const { id } = useParams();
  //alert(id);
  const [user, setUser] = useState({
    Id: "",
    DeptName: "",
    IsActive: "",
  });
  const headers = {
    "Content-Type": "application/json",
  };

  const { Id, DeptName, IsActive } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    axios.post(
      `http://115.112.34.123:5252/api/HRAPI/PostDepartmentData?ActionType=Edit`,
      user,
      { headers: headers }
    );
    history.push("/DepartmentGrid");
  };

  const loadUser = async () => {
    const result = await axios.get(
      `http://115.112.34.123:5252/api/HRAPI/GetDepartmentDataById?id=${id}`
    );

    //const result = await axios.get("http://10.1.1.189:5252/api/HRAPI/GetDepartmentDataById?id=101");
    if (result.data.Status === "1") {
    }
    setUser(result.data.Data[0]);
    console.log(user);
    console.log(result.data.Data);
  };

  return (
    <>
      <Header />
      <div className="row">
        <div className="container">
          <div className="col-md-6 mx-auto">
            <div className="form-container-edit mt-5">
              <div className="col-md-12 edit-heading">
                <h4>Edit Department</h4>
              </div>
              <br />
              <form onSubmit={(e) => onSubmit(e)} className="px-2">
                {/* <div className="form-group">
                    <label>Department ID </label>
                    <input type="text" 
                    className="form-control" 
                    placeholder="Department Name"  
                    name="Id" 
                    value={user.Id}
                    onChange={e => onInputChange(e)} />
                </div> */}
                <div className="form-group">
                  <label>Department Name </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Department Name"
                    name="DeptName"
                    value={user.DeptName}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label>Is Active </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="IsActive"
                    name="IsActive"
                    value={user.IsActive}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <br />
                <button className="btn btn-primary btn-block">
                  Add Department
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditDepartment;
