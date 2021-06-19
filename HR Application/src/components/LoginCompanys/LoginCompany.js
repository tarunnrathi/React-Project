import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Table } from 'reactstrap';
import axiosConfig from '../axiosconfig';
import axios from "axios";
import { connect } from "react-redux";
import { Redirect,withRouter  } from "react-router-dom";
import { userInfo } from "../../redux/actions/user";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from "../../redux/actions/user";
import { persistor } from "../../store";
import { compPerm } from "../../redux/actions/companyPermission";
import {setMenu} from '../../redux/actions/menu';
import {setMenuPermission} from '../../redux/actions/menuPermission';
import {getMenuList} from '../../redux/actions/menuList'
import {logout} from '../../redux/actions/logout';


class LoginCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            selected: null,
            ComId:"",
            companyName:"",
            company: [],
            persons: [],
            menus:[],
            columns: [
                {
                    dataField: "CompanyCode",
                    text: "Id",
                },
                {
                    dataField: "CompanyName",
                    text: "Company Name",
                },
                // {
                //     dataField: "CYear",
                //     text: "CYear"
                // },
            ]
        }
        this.handleSubmitClick=this.handleSubmitClick.bind(this);
     }
     handleRowSelect = (row, isSelect, rowIndex, e) => {
        debugger;
        this.setState(
            {
                ...this.state.data,
                selected: isSelect,
                selectedIndex: rowIndex,
                ComId:row.CompanyCode,
                companyName:row.CompanyName
            },
            () => {
                //alert(this.state.selected);
               // console.log(this.state.selected);
            }
        );
    };
     handleSubmitClick =(e)=> {
       // debugger  comment
        e.preventDefault();
        if(this.state.ComId > 0){
            if (
                this.props.user &&
                this.props.user.info &&
                this.props.user.info.username
              ) {
                this.props.compPerm({
                    CompanyId:this.state.ComId,
                    companyName:this.state.companyName,
                    });
                    this.getMenu();  
                    this.getGridPermission();                   
                   this.props.history.push("/userdashboard");  
                   window.location.reload();
              }
        }
        else{
            toast.error("Please select compnay!",{position:toast.POSITION.TOP_CENTER});
        }
    }
    componentDidMount() {
      //  debugger
        if (this.props.user.info!=null) {
        axios
            .get(`${axios.baseURL}/CompanyMaster/GetCompanyListByEmpId?EmpId=${this.props.user.info.EmpId}`)
            .then((response) => {
                let data = response.data.Data;
                this.setState({
                    company: data,
                    ComId:data[0].CompanyCode,
                    companyName:data[0].CompanyName,
                });
            });
            var reCompid=this.props.comp.compperm.CompanyId==undefined ? "" : this.props.comp.compperm.CompanyId
            var reCompanyName=this.props.comp.compperm.companyName==undefined ? "" : this.props.comp.compperm.companyName
            this.setState({
                ComId:reCompid,
                companyName:reCompanyName
            })
        }
    }
    getGridPermission() {
        debugger;
        var dashpage = new Array();
        dashpage = { PageID: '0', PageName: 'userdashboard', ViewPermission: true, AddPermission: false, EditPermission: false, DeletePermission: false, PrintPermission: false, ExportPermission: false };
        const co = this.state.ComId
        var url = `${axios.baseURL}/HRAPI/User_Pagewise_HeaderPermission?id=` + this.props.user.info.EmpId + `&companyId=` + co;
        axios
          .get(
            url
          )
          .then((response) => {
            debugger;
            if (response.data.Status === "1") {
              debugger;
              if (response.data.Data != null) {
                response.data.Data.push(dashpage);
              }
              this.props.setMenuPermission(response.data.Data);
            
            }
            else if (response.data.Status === "0") {
              debugger;
              var obj =  JSON.parse(dashpage);
              response.data.Data = obj;
              this.props.setMenuPermission(response.data.Data);
             
            }
          })
          .catch(error => {
            debugger;
            var obj =  JSON.parse(dashpage);
            this.props.setMenuPermission(obj);
            alert("",error);
          })
    
      }
    
   getMenu(){
    if (this.props.user.info!=null) {
        debugger;
        const co=this.state.ComId
        var url = `${axios.baseURL}/hrapi/HeaderMenuItemByEmpId?EmpId=`+this.props.user.info.EmpId+`&companyId=`+co; 
        axios
        .get(url)
        .then((res) => {
          debugger;
          if(res.data.Status==="1"){
            //debugger;
            this.props.getMenuList(res.data.Data.MainMenuList);
          }
          else if(res.data.Status==="0"){
           // debugger;
            this.props.getMenuList(res.data.Data);
          }
        })
        .catch(error=> {
           alert('Error', error);
        })
      }
     
   }
   onLogout = () => {    
  this.props.logout();   
  localStorage.clear(); 
  window.localStorage.clear(); 
  this.props.history.push("/sign-in");
  };
    render() {
        if (this.props.user.info==null) {
            return <Redirect to="/sign-in" />;
        }
        const selectRow = {
            mode: "radio",
            bgColor: "#00BFFF",
            selected:[this.state.ComId], 
            onSelect: (row, isSelect, rowIndex, e) => {
                if (isSelect) {
                    debugger;
                    this.handleRowSelect(row, isSelect, rowIndex, e);
                    return true; // return false to deny current select action}
                }
            },
        };
        return (
            <div className="Container bg-main h-100">
                
                <ToastContainer />
               
                <div className="d-flex justify-content-center mt-10" >
                    <div className="col-md-6 lcomd">
                        <BootstrapTable
                            id="tableData"                                             
                            striped
                            keyboardnav                           
                            hover
                            keyField="CompanyCode"
                            data={this.state.company}
                            columns={this.state.columns}
                           selectRow={selectRow}
                            ></BootstrapTable>
                        <button className="btn btn-primary mr-2" onClick={this.handleSubmitClick}>Submit</button>
                        <button onClick={this.onLogout} className="btn btn-danger">Close</button> 
                       
                    </div>
                   </div>
           </div>
        );
    }
}
LoginCompany=withRouter(LoginCompany)
export default connect((state) => ({
    user: state.user,
    comp: state.companyPermission,
    controlsItem:state.controls

}),{compPerm,userInfo,setMenu,setMenuPermission,getMenuList,logout})(LoginCompany)
