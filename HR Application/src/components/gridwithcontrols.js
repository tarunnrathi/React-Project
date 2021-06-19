import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./Header";

function GridControl(){
  const [users, setUser] = useState([]);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://10.1.1.189:5252/api/hrapi/getdepartmentdata");
    setUser(result.data.Data.reverse());
  };

  return (
    <>
            <Header />
            <main role="main">
                <ol className="ddhead mb-3">
                    <li className="breadcrumb-item active text-dark">
                    <h3>Crud Oparetion</h3>
                    </li>
                </ol>
                <div className="row">
                  <div className="container">
                    <div className="col-md-8 mx-auto form-container mt-5">
                    <table className="table text-center table-bordered">
                      <thead className="thead-dark">
                        <tr>
                            <td colSpan="4" className="text-right"> 
                            <Link class="btn btn-sm btn-primary mr-2" to="./adddepartment">
                    Add
                </Link>
                <Link class="btn btn-sm btn-primary mr-2" to="/editdepartment/${hmenu.DeptId}">
                    Edit                                 
                </Link>
                <Link class="btn btn-sm btn-primary mr-2">
                    Delete
                </Link>
                            </td>
                        </tr>
                        <tr>
                          <th></th>
                          <th className="success">ID</th>
                          <th>Main Menu</th>
                          <th>Sub Menu</th>
                        </tr>
                      </thead>
                      <tbody>
                     
                        {
                         users.map((hmenu, index) =>  
                        <tr>
                                <td>
                                  
                                  <Link class="btn btn-sm btn-primary mr-2" to={'editdepartment/'+hmenu.DeptId}>
                    Edit                                 
                </Link> </td>
                                <td>{hmenu.DeptId}</td>
                                <td>{hmenu.DeptName}</td>
                                <td>{hmenu.IsActive}</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
            </main>
         </>
         );
  };
  export default GridControl;