import React, { Component,useState,useEffect } from 'react';
import "./collapse.css";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { red } from '@material-ui/core/colors';
import Swal from 'sweetalert2';

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


const TreeMenu_New=(props)=>{  
    debugger
    const [menuList, setMenuList] = React.useState([]);
    const [id, setId] = React.useState('');
    const [arrIndex, setArrIndex] = React.useState([]);
    const [viewEnable, setViewEnable] = React.useState(true);
    const [nameArray, setNameArray] = React.useState([]);
    const [permission, setPermission] = React.useState([]);

    const classes = useStyles();
    
   
    
    useEffect(()=>{
        debugger
        if(props.selectedCompanyId!=null && props.selectedUserId!=null){
            const url= `${axios.baseURL}/hrapi/MenuItem`;
        axios.get(url).then((res, err) => {
            //debugger;;
           if (res.data.Status === "1") {
                debugger;;

               const { updatedArray } = res.data.Data.MainMenuList.length > 0 ?
                   res.data.Data.MainMenuList.sort((a, b) => { return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1 }).map((item0, i) => {
                       
                       Object.assign(item0, { Index: i });
                       if (item0.SubMenu.length > 0) {
                           item0.SubMenu.sort((a, b) => { return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1 }).map((item1, j) => {
                               Object.assign(item1, { Index: i + "" + j });
                               if (item1.SubMenu.length > 0) {
                                   item1.SubMenu.sort((a, b) => { return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1 }).map((item2, k) => {
                                       Object.assign(item2, { Index: i + "" + j + "" + k });
                                   });
                               }
                           })
                       }
                   }) : [];                  
               
               setMenuList(res.data.Data.MainMenuList)
           }
           if (err) {
               console.log(err);
           }           
       });

        }else{
            if(props.selectedCompanyId==="" && props.selectedUserId!==""){
                setMenuList([]);  
                setViewEnable(true);
            }
            else{
                setMenuList([]);  
                setViewEnable(false);
            }
              
        }
        
    },[props.selectedCompanyId, props.selectedUserId]);

    function toggleSubMenu(e, val, id, nameArray, text){
        debugger
        if(props.selectedUserId != "" && props.selectedCompanyId != ""){       

            setViewEnable(false);
            setNameArray(nameArray);
            getPermission(id, props.selectedUserId, props.selectedCompanyId);

        }
        else {
			//alert('Please Select the User first then Compnay');   
            setViewEnable(true);    
            Swal.fire('Please Select the User first then Compnay');
            return;     
		}

    }

   function getPermission(id, empid, companyId){
        debugger;
       var url = `${axios.baseURL}/HRAPI/GetMenuByUserPermission_ById?EmpID=` + empid + `&MenuID=` + id + `&companyId=` + companyId;
       //var url = `http://localhost:52227/api/HRAPI/GetMenuByUserPermission_ById?EmpID=` + empid + `&MenuID=` + id + `&companyId=` + companyId;

       axios.get(url)
           .then((res, err) => {
                debugger;;
               if (res.data.Status === "1") {
                setPermission(res.data.Data);
                props.callMenuName(permission, nameArray);                  
               }
               else {
                setPermission([]);
               }

           });
   }
   
   

   return(
       
    <>
     <TreeView className={classes.root}
         defaultCollapseIcon={viewEnable===true?null:<ExpandMoreIcon />}
         defaultExpandIcon={ viewEnable===true?null:<ChevronRightIcon />}         
     >
         { menuList.length > 0 ? menuList.map((hmenu, i) =>{
             return(
                 <TreeItem key={hmenu.Index} nodeId={`${hmenu.Index}`} label={hmenu.MenuName} onClick={(e) => toggleSubMenu(e, hmenu.ID, hmenu.ID, hmenu.SubMenu, i + " ")} >
                     {hmenu.SubMenu.length>0?hmenu.SubMenu.sort((a, b) => {
                                         return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
                                     }).map((submenu,j)=>{
                                         //debugger
                                         return(
                                             <div key={submenu.Index}>
                                                 <TreeItem  key={submenu.Index} nodeId={submenu.Index}  label={submenu.MenuName} hidden={viewEnable}  onClick={(e) => toggleSubMenu(e, submenu.ID, submenu.ID, submenu.SubMenu, i + " " + j)}>
                                                     {submenu.SubMenu.length>0?submenu.SubMenu.sort((a, b) => {
                                                             return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
                                                         }).map((sub_submenu, k) =>{
                                                            // debugger
                                                             return(
                                                                 <div key={sub_submenu.Index}>
                                                                    <TreeItem key={sub_submenu.Index} nodeId={sub_submenu.Index} label={sub_submenu.MenuName}></TreeItem>
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

export default TreeMenu_New;