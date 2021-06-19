import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Header from "./Header";
import Rightnav from "./Rightnav"


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
            <ol class="ddhead mb-0">
                  <li class="breadcrumb-item active text-dark"><h3>User Permission</h3></li>
              </ol>
            <div className="row">
            
            <div className="col-md-2 px-0 bg-dark"><Rightnav /></div>
             <div className="col-md-10 mt-3">
                <div className="col-md-12 mb-3">
                <form className="form-container">
                    <div class="row g-2">
                <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>
        <div class="col-4">
                <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Enter email" name="email" />
        </div></div>

  </div>
                </form>
              </div>
                <div className="col-md-12 mb-3">
              <div className="form-container">
                <table class="table">
    <thead class="thead-dark">
      <tr>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Email</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
    <tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
        <td>Noida</td>
      </tr><tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
        <td>Noida</td>
      </tr><tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
        <td>Noida</td>
      </tr><tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
        <td>Noida</td>
      </tr>
      
    </tbody>
  </table></div>
              </div>
             </div>
              
             </div> 
           
            
            
            </>
        );
    }
}









            