import React, { Component,useState,useEffect } from 'react';
import "../collapse.css";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { ToastContainer, toast } from 'react-toastify';
import { userInfo } from "../../redux/actions/user";
import { connect } from "react-redux";

const useStyles = makeStyles(theme=> ({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 400,     
    },
    // root: {
    //     background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    //     border: 0,
    //     borderRadius: 3,
    //     boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    //     color: "white",
    //     height: '100%',
    //     padding: "0 30px"
    //   }
    highlight: {
        backgroundColor: 'red',
      }
  }));


  const TreeControl_New=(props)=>{ 
    const classes = useStyles();  

    function toggleSubMenu(e, val, id, nameArray,text, PageMastId){
        debugger
        if(props.selectedUserId != "" && props.selectedCompanyId != ""){              
            getPermission(PageMastId);
        }
        else {
			alert('Please Select the User first then Compnay');   
           // setViewEnable(true);         
		}
    }

   function getPermission(PageMastId){
        debugger;;
       //  var url= `http://localhost:52227/api/Application_Control/GetControlPermissionByParentId?EmpID=${this.props.selectedUserId}&companyId=${this.props.selectedCompanyId}&ParentId=${PageMastId}`;

        var url= `${axios.baseURL}/Application_Control/GetControlPermissionByParentId?EmpID=${props.selectedUserId}&companyId=${props.selectedCompanyId}&ParentId=${PageMastId}`;

        axios.get(url)
        .then(response=>{
            if(response.data.Status==="1"){
             props.callMenuName(response.data.Data);
            }
            else{
             toast.warn(response.data.Message, { position: toast.POSITION.TOP_CENTER });
            }
        }).catch(error=>{
         toast.error(error, { position: toast.POSITION.TOP_CENTER });
        });
   } 
   return(       
    <>
     <TreeView className={classes.root}
         defaultCollapseIcon={<ExpandMoreIcon />}
         defaultExpandIcon={ <ChevronRightIcon />}         
     >
         { props.menuList.length > 0 ? props.menuList.map((hmenu, i) =>{
             return(
                 <TreeItem key={hmenu.PageMastId} nodeId={`${hmenu.PageMastId}`} label={hmenu.DisplayName} onClick={(e) => toggleSubMenu(e, hmenu.PageMastId, hmenu.PageMastId, hmenu.SubMenu, i + " ",hmenu.PageMastId)} >
                     {hmenu.SubMenu.length>0?hmenu.SubMenu.map((submenu,j)=>{
                                         debugger
                                         return(
                                             <div key={submenu.PageMastId}>
                                                 <TreeItem  key={submenu.PageMastId} nodeId={submenu.PageMastId}  label={submenu.DisplayName}   onClick={(e) => toggleSubMenu(e, submenu.PageMastId, submenu.PageMastId, submenu.SubMenu, i + " " + j,submenu.PageMastId)}>
                                                     {submenu.SubMenu.length>0?submenu.SubMenu.map((sub_submenu, k) =>{
                                                             debugger
                                                             return(
                                                                 <div key={sub_submenu.PageMastId} >
                                                                    <TreeItem key={sub_submenu.PageMastId} nodeId={sub_submenu.PageMastId} label={sub_submenu.DisplayName}></TreeItem>
                                                                 </div>
                                                             )
                                                         }):null}

                                                 </TreeItem>
                                             </div>
                                         )
                                     }):null}
                 </TreeItem>
             )             
         }):null}   
 </TreeView>
    </>
)
}

export default connect((state) => ({
	user: state.user,
}),{userInfo})(TreeControl_New);




