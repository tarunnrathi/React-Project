import React, { Component, redirect, isHidden } from "react";
import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import { compPerm } from "../redux/actions/companyPermission";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setMenuPermission} from '../redux/actions/menuPermission';
import {logout} from  '../redux/actions/logout';

class Gridcontrolbtn extends Component {
  state = {
    AddPer: false,
    EditPer: false,
    DeletePer: false,
    PrintPer: false,
    ExportPer: false,
    menuId: 1,
    menus: [],
  };
  handleBtnClick = () => {   
    const seletedstate = 'data-toggle="modal" data-target="#EditModal"';   
    //handleBtnClick 
  };

  handleSubmit = (props) => {
    debugger;
    if(this.props.pageName!=="CompanyUserMapping"){

      if (this.state.EditPer) {
        this.props.edit();
      }
    }
    else{
      if(props.target.innerHTML==="Edit"){
        let selectedRow= this.props.selectedRow;
        if(selectedRow.EmpId!=null){
          this.props.edit(selectedRow);
        }
        else{         
          toast.error("Please Select Row",{position:toast.POSITION.TOP_CENTER});
        }
      }
      else{
        const {opened}=this.props.open;
       this.props.add(!opened);
      }     
    }
    
  };

  // handleSubmit = (props) => {
  //   debugger
  //   if(this.props.sendidtoeditbtn==""){
  //     toast.error("Please Select Row",{position:toast.POSITION.TOP_CENTER});
  //   }
  //   else{
  //     let selectedRow= this.props.selectedRow;
  //     if(selectedRow!=null && this.state.EditPer){
  //       this.props.edit(selectedRow);
  //     }
  //     else{
  //       if( this.state.EditPer){
  //         this.props.edit();
  //       }
  //     }      
  //   } 
  // };

  

  handleDelete = () => {   
   // debugger    

    if (this.state.DeletePer) {
      // if(window.confirm("Do you really want to Delete!! ?"))
      // {
       this.props.delete(this.props.sendidtoeditbtn);
      //}
    }
  };

  componentDidMount() {
    debugger   
    if (this.props.user.info!=null) { 
    this.getGridPermission();
    }
  }

  componentWillReceiveProps(nextProps) {
    //debugger
    if (this.props !== nextProps) {
     // console.log("props change==");     
    }
  }

  getGridPermission() {
    debugger;
    const co=this.props.comp.compperm.CompanyId
    var url =`${axios.baseURL}/HRAPI/User_Pagewise_HeaderPermission?id=`+this.props.user.info.EmpId+`&companyId=`+co;
    axios
      .get(
        url
      )
      .then((response) => {
        //debugger;
        this.props.setMenuPermission(response.data.Data);
        this.setState({ menus: response.data.Data }, () => {
          // console.log("Menus -====");
          // console.log({ menus: this.state.menus });    
          this.setPermission();      
        });
      });
  }


  setPermission() {
    //debugger;
    if (this.state.menus.length == 0) {
      return;
    }
    // console.log("Menus===>>");
    // console.log({ menus: this.state.menus });
    let index = 0;
    let selectedMenuIndex = this.state.menus.findIndex(
      (menu) => menu.PageID === this.props.menuId
    );

   
    let permissionLevel =selectedMenuIndex!="-1"?this.state.menus[selectedMenuIndex]: this.state.menus["4"];
    this.setState({
      AddPer: permissionLevel.AddPermission,
      EditPer: permissionLevel.EditPermission,
      DeletePer: permissionLevel.DeletePermission,
      PrintPer: permissionLevel.PrintPermission,
      ExportPer: permissionLevel.ExportPermission,
    });

    
  }

  exportExcel = () => {
    this.props.exportToExcle();
  };

  printExcel = () => {
    this.props.printTable();
  };

  render() {
    debugger; 
    // console.log("permission dtat");
    // console.log(this.props.perm);
    // console.log("Permission===");
    // console.log({ state: this.state });
    const { AddPer, EditPer, DeletePer, PrintPer, ExportPer } = this.state;
    

   // console.log("Delete==" + DeletePer);
    return (
      <>         
         { this.props.pageName==="CompanyUserMapping"?<button
          style={
             this.state.AddPer && this.props.sendidtoeditbtn != null
            //this.state.EditPer
              ? { opacity: 1 }
              : { opacity: 0.6, cursor: "not-allowed" }
          }
          className="btn btn-sm btn-primary-grid mr-2"
          onClick={this.state.AddPer ?this.handleSubmit:null}
        >
          Add
        </button>
        : (
          <button
          style={
            this.state.AddPer
           //this.state.EditPer
             ? { opacity: 1 }
             : { opacity: 0.6, cursor: "not-allowed" }
         }
            data-toggle={this.state.AddPer?"modal":null}
            data-target="#myModal"
            className="btn btn-sm btn-primary-grid mr-2"          
          >
            Add
          </button>
        )}
        

        <button
          style={
            // this.state.EditPer && this.props.sendidtoeditbtn != null
            this.state.EditPer
              ? { opacity: 1 }
              : { opacity: 0.6, cursor: "not-allowed" }
          }
          className="btn btn-sm btn-primary-grid mr-2"
          onClick={this.state.EditPer?this.handleSubmit:null}
        >
          Edit
        </button>

        <button
          style={
            // this.state.DeletePer && this.props.sendidtoeditbtn != null
            this.state.DeletePer
              ? { opacity: 1 }
              : { opacity: 0.6, cursor: "not-allowed" }
          }
          className="btn btn-sm btn-primary-grid mr-2"
          onClick={this.state.DeletePer?this.handleDelete:null}
        >
          Delete
        </button>

        <button
          style={
            this.state.ExportPer
              ? { opacity: 1 }
              : { opacity: 0.6, cursor: "not-allowed" }
          }
          className="btn btn-sm btn-primary-grid mr-2"
          onClick={this.state.ExportPer?this.exportExcel:null}
        >
          Export
        </button>

        <button
          style={
            this.state.PrintPer
              ? { opacity: 1 }
              : { opacity: 0.6, cursor: "not-allowed" }
          }
          className="btn btn-sm btn-primary-grid mr-2"
          onClick={this.state.PrintPer?this.printExcel:null}
        >
          Print
        </button>

        {/* <Button onClick={()=>this.props.add("/" + this.props.sendpid + '/' + this.props.sendidtoeditbtn)}>Hello</Button>
            <Button onClick={()=>this.props.edit('hi')}>Hi</Button> */}
      </>
    );
  }
}

// const mapStateToProps=(state)=>{
//   debugger
//   return{
//     perm:state.menuReducerPermission
//   }
// }

// export default connect(mapStateToProps,{compPerm,setMenuPermission})(Gridcontrolbtn);

export default connect((state) => ({
  
  user: state.user,
  menuId: state.menu.menuId,
  perm: state.menuPermission.perm,
  comp: state.companyPermission 
}),{compPerm,setMenuPermission})(Gridcontrolbtn);


