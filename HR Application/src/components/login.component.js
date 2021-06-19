import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { userActionCreator } from "../redux/login";
// import { getUserInfo } from "../redux/login";
// import { downCounter, upCounter } from "../redux/actions/counter";
import { login } from "../redux/actions/user";
import loginuser from "./images/loginuser.png";
import loginpwd from "./images/loginpwd.png";
import loginlogo from "./images/loginlogo.png";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setMenu} from '../redux/actions/menu';


//../../redux/actions/menu

class Login extends Component {
  // documentData;
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state = {
      uName: "",
      pwd: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  validate = () => {
    const { data } = this.state;
      let errors = {};
      // if (data.Id === '') errors.Id = 'ID can not be blank.';
      if (this.state.uName === '') errors.uName = 'Depatment Name can not be blank.';
      if (this.state.pwd === '') errors.pwd = 'Status can not be blank.';
     
      return errors;
  }


  // on form submit...
  handleFormSubmit(e) {
    //debugger

    this.props.setMenu(0);
    
    e.preventDefault();
    this.setState({ isLoading: true });   
    const {errors} = this.validate();
  
    axios
      .get(
        `${axios.baseURL}/Login/GetUserLogin?username=` +
          this.state.uName +
          `&password=` +
          this.state.pwd
      )
      .then((response) => {
        //debugger
        let data = response.data;
        if (data) {
          //debugger;
          this.props.login({
            username: data.Data.UserName,
            EmpId: data.Data.EmpId,
            Type: data.Data.Type,
            status: data.Status,
            logindatetime: data.Data.LoginTime,
            CompanyId:"0",        
          });
          this.props.history.push("/LoginCompany");
          this.setState({ isLoading: false });
        } else {        
          toast.error("Please Enter Valid Login Detail",{position: "top-center",
          autoClose:2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,          
          pauseOnFocusLoss:true
        });
      }
    });          
      
  }
   

  render() {
   // debugger
    const { errors } = this.state;
    const { userId } = this.props;
    // console.log("User info --666");
    // console.log({ errors });
    // console.log({ props: this.props });
    
    return (
      <>      
   <div className="row bg-main h-100">
		<div className="d-flex justify-content-center h-100">
			<div className="user_card">
				<div className="d-flex justify-content-center">
					<div className="brand_logo_container">
          <img src={loginlogo} className="brand_logo"/>
						
					</div>
				</div>
				<div className="d-flex justify-content-center form_container">
					<form onSubmit={this.handleFormSubmit} autoComplete="off">
          <ToastContainer limit={1} />
						<div className="input-group mb-3">
							<div className="input-group-append">
								<span className="input-group-text"><img src={loginuser} className="liconwidth"/> </span>
							</div>
              <input 
                type="text"
                name="uName"
                className="form-control input_user" 
                placeholder="User Name"
                value={this.state.uName}
                onChange={this.handleChange}
              />
						</div>
            
						<div className="input-group mb-2">
							<div className="input-group-append">
								<span className="input-group-text"><img src={loginpwd} className="liconwidth"/></span>
							</div>
              <input 
                type="password" 
                name="pwd" 
                className="form-control input_pass" 
                placeholder="Enter password"
                value={this.state.pwd}
                onChange={this.handleChange}/>
						</div>						
							<div className="d-flex justify-content-center mt-3 login_container">
				 	<button type="submit" name="button" className="btn login_btn">Login</button>
				   </div>
					</form>
				</div>
		
				<div className="mt-4">
					<div className="d-flex justify-content-center links">
					Welcome to Kailash Hr Management System 
					</div>
					<div className="d-flex justify-content-center links">
						<a href="#">Forgot your password?</a>
					</div>
				</div>
			</div>
		</div>
	</div>
    </>   
    )
  }
}


export default connect((state) => ({
    user: state.user  
  }),
  { login,setMenu }
)(Login);


