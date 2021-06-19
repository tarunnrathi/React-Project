import React, { Component } from 'react';
import Header from './Header';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import TreeMenu from "./TreeMenu";

class UserPermition extends Component {

    state = {
        users: []
      }
      componentDidMount() {
        //console.log("devender");
         axios.get(`${axios.baseURL}/hrapi/MenuItem`).then((res) => {           
           this.setState({ users:res.data.Data.MainMenuList });
           console.log("user---");
           console.log(res.data.Data.MainMenuList); 
         });         
    }

    render() {
        const { user } = this.props;
         if (user.info && !user.info.username) {
           return <Redirect to="/sign-in" />;
         }
        return (
      <>
        <Header props={this.props} />
        <div className="row">
        <div className="col-sm-2 pt-3 left-menu">
           <TreeMenu />
        </div>
        <div className="col-sm-10">
        <main role="main">
                
                <div className="row">
                  <div className="container">
                    <div className="col-md-12 mx-auto form-container mt-2">
                    <table className="table text-center table-bordered">
                      <thead className="thead-dark">
                   
                        <tr>
                          <th>S.No.</th>
                          <th>Menu Name</th>
                          <th>View</th>
                          <th>Add</th>
                          <th>Edit</th>
                          <th>Delete</th>
                          <th>Print </th>
                          <th>Export</th>

                        </tr>
                      </thead>
                      <tbody>
                     
                        {
                         this.state.users.map((hmenu, index) =>  
                        <tr>
                                {/* <td>
                                  
                                  <Link class="btn btn-sm btn-primary mr-2" to={'editdepartment/'+ hmenu.ID}>
                    Edit                                 
                </Link> </td> */}
                                <td>{hmenu.ID}</td>
                                <td>{hmenu.MenuName}</td>
                                <td><input type="checkbox" /></td>
                                <td><input type="checkbox" /></td>
                                <td><input type="checkbox" /></td>
                                <td><input type="checkbox" /></td>
                                <td><input type="checkbox" /></td>
                                <td><input type="checkbox" /></td>
                                
                            </tr>
                        )}
                             <tr>
                            <td colSpan="8" className="text-center"> 
                            <Link class="btn btn-sm btn-primary mr-2" to="./adddepartment">
                    Save
                </Link>
                {/* <Link class="btn btn-sm btn-primary mr-2" to="/editdepartment/${hmenu.DeptId}">
                    Edit                                 
                </Link>
                <Link class="btn btn-sm btn-primary mr-2">
                    Delete
                </Link> */}
                            </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
            </main>
        </div>
        </div>
        </>
        )
    }
}
export default connect((state) => ({
    user: state.user,
  }))(UserPermition);