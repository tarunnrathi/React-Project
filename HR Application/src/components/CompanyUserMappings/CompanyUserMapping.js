import React, { Component,Suspense } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Header from '../Header';
import Gridcontrolbtn from "../gridcontrolbtn";
import { Modal } from "react-responsive-modal";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filterFactory, {
  textFilter,
  dateFilter,
  FILTER_TYPES,
  customFilter,
  PriceFilter
} from "react-bootstrap-table2-filter";
import Select from 'react-select';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import { setMenu } from "../../redux/actions/menu";
import paginationFactory from "react-bootstrap-table2-paginator";

import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                      ];





class CompanyUserMapping extends Component {

  // static propTypes = {
  //   column: PropTypes.object.isRequired,
  //   onFilter: PropTypes.func.isRequired
  // }

  constructor(props){
    debugger;
    super(props);
    this.state={    
      userList: [],
      selectedUserId: "", 
      open:false, 
      columns: [
        
        {
          dataField: "Id",
          text: "Id",
          sort: true,
          hidden:true,
          filter: textFilter(),
        },
        // {
        //   dataField: "CompanyCode",
        //   text: "Company Code",
        //   sort: true,
        //   filter: textFilter(),
        // },
        {
          dataField: "CompanyCode",
          text: "Company Code",
          sort:false,
          filter:customFilter(),
          filterRenderer:()=>{      
            return(
              <input 
              className="form-control" style={{width:'100%'}}
              key="input"
              ref={myinput => (this.companycode = myinput)}
              type="text"
              placeholder="Enter CompanyCode..."
              onKeyDown={ this.filter}
              
              ></input>
            )
          }
          // <PriceFilter onFilter={ onFilter } column={ column } />
        },
        // {
        //   dataField: "CompanyName",
        //   text: "CompanyName",
        //   sort: true,
        //   filter: textFilter(),
        // },
        {
          dataField: "CompanyName",
          text: "CompanyName",
          sort: true,
          filter:customFilter(),
          filterRenderer:()=>{
        
            return(
              <input 
              className="form-control" style={{width:'100%'}}
              key="inputcompanyname"
              ref={myinput => (this.companyname = myinput)}
              type="text"
              placeholder="Enter Company Name..."
              onKeyDown={ this.filter}

              ></input>
            )
          }
        },
        // {
        //   dataField: "Name",
        //   text: "User Name",
        //   sort: true,
        //   filter: textFilter(),
        // },
        {
          dataField: "Name",
          text: "User Name",
          sort: true,
          filter:customFilter(),
          filterRenderer:()=>{
        
            return(
              <input 
              className="form-control" style={{width:'100%'}}
              key="inputusername"
              ref={myinput => (this.username = myinput)}
              type="text"
              placeholder="Enter User Name..."
              onKeyDown={ this.filter}
              defaultValue=""
              
              ></input>
            )
          }
        },

        // {
        //   dataField: "IsActive",
        //   text: "Status",
        //   sort: true,
        //   filter: textFilter(),
        // },

        {
          dataField: "IsActive",
          text: "Status",
          sort: true,
          filter:customFilter(),
          filterRenderer:()=>{
        
            return(
              <input 
              className="form-control" style={{width:'100%'}}
              key="inputisactive"
              ref={myinput => (this.isactive = myinput)}
              type="text"
              placeholder="Enter Status Name..."
              onKeyDown={ this.filter}
              defaultValue=""
              
              ></input>
            )
          }
        },
        {
          dataField: "CreatedBy",
          text: "Created By",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CreatedDate",
          text: "Created Date",          
          sort: true,                   
          filter: dateFilter({             
            onFilter: this.myOwnCreatedDateFilter,
          }),
          
          formatter: (cell) => {
            debugger
            let dateObj = cell;
            if (typeof cell !== "object") {
              dateObj = new Date(cell);               
              return(
                <DateFormatComponent dateFormatString="dd/MM/yyyy hh:mm:ss"  dateObj={dateObj}/>
              )             
            } 
          }
        },
      ],
      columns1: [
        
        {
          dataField: "Id",
          text: "Id",
          sort: true,
          hidden:true,
          filter: textFilter(),
        },        
        {
          dataField: "CompanyCode",
          text: "Company Code",
          sort:false,
          filter:textFilter()
        },        
        {
          dataField: "CompanyName",
          text: "CompanyName",
          sort: true,
          filter: textFilter(),
        },        
        {
          dataField: "Name",
          text: "User Name",
          sort: true,
          filter: textFilter(),
        },  
        {
          dataField: "IsActive",
          text: "Status",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CreatedBy",
          text: "Created By",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CreatedDate",
          text: "Created Date",
          sort: true,
          alignItems: "top",
          filter: dateFilter(),
          formatter: (cell) => {
            let dateObj = cell;
            if (typeof cell !== "object") {
              dateObj = new Date(cell);
            }
            //return `${ dateObj.toUTCString()} `;
            if (dateObj !== null) {
            return `${("0" + dateObj.getDate()).slice(-2)}/${(
              "0" +
              (dateObj.getMonth() + 1)
            ).slice(-2)}/${dateObj.getFullYear()} 
          ${dateObj.getHours()}:${dateObj.getMinutes()}`;
        } else {
          return "";
        }
          },
        },
      ],
      Data:[],      
      pageName:"CompanyUserMapping",
      addData:[],
      selectRow:[],
      selectedRow:{},
      headerText:"",
      selectOptions :[],
      defaultOptions:[
        {
          label:"Select",value:""
        }
      ],
      sendidtoeditbtn:"",
    }    
    this.filter=this.filter.bind(this);
    this.menuClick=this.menuClick.bind(this);
  }

  myOwnCreatedDateFilter=(filterVal, data)=>{
    debugger   
    if(filterVal.date!=="" && filterVal.comparator!==""){
      switch(filterVal.comparator){
        case "=":
          return filterVal.comparator!==""?
           data.filter(x=>`${('0' + new Date(x.CreatedDate).getDate()).slice(-2)}/${('0' + ( new Date(x.CreatedDate).getMonth() + 1)).slice(-2)}/${ new Date( x.CreatedDate).getFullYear()}`===`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
           :null

        case ">":
          return filterVal.comparator!==""?
          data.filter(item =>new Date(`${("0" + new Date(item.CreatedDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.CreatedDate).getMonth()] )}/${ new Date(item.CreatedDate).getFullYear()}`)>new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))  
           :null 

           case "<":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.CreatedDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.CreatedDate).getMonth()] )}/${ new Date(item.CreatedDate).getFullYear()}`)<new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case ">=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.CreatedDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.CreatedDate).getMonth()] )}/${ new Date(item.CreatedDate).getFullYear()}`)>=new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "!=":
                  return filterVal.comparator!==""?
                  data.filter(x=>`${('0' + new Date(x.CreatedDate).getDate()).slice(-2)}/${('0' + ( new Date(x.CreatedDate).getMonth() + 1)).slice(-2)}/${ new Date( x.CreatedDate).getFullYear()}`!==`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
                  :null 

                  case "<=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.CreatedDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.CreatedDate).getMonth()] )}/${ new Date(item.CreatedDate).getFullYear()}`)<= new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "LIKE":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.CreatedDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.CreatedDate).getMonth()] )}/${ new Date(item.CreatedDate).getFullYear()}`)<=null )
                  :null 

          default :return null;
      }
    }
  }

  filter(e) {    
    if (e.key === 'Enter') {
      debugger
      var inputData={
        companycode:this.companycode.value,
        companyname:this.companyname.value,
        empname:this.username.value,
        isactive:this.isactive.value
      } 

      var url=`${axios.baseURL}/CompanyUserMapping/GetCustomSearch`;
      this.GetCompanyUserMapping(url,inputData);    

    // axios.post(url,inputData).then((res,err) => {
    //   debugger;
    //   res.data.Status==="1"?this.setState({ Data: res.data.Data }):this.setState({ Data: [] });      
    // });    
    } 
      
  }

  onCloseModal = () => {
    debugger;
    this.setState({ open: false,
      addData:[],
      defaultOptions:[
        {
          label:"Select",
          value:""
        }
      ]

    });
    var url=`${axios.baseURL}/CompanyUserMapping/GetCustomSearch`;
    var inputData={
     companycode:"",
     companyname:"",
     empname:"",
     isactive:""
    }

    this.GetCompanyUserMapping(url,inputData);
    

  };

  componentDidMount() {
   debugger;
   if(this.props.user.info!=null)
   {
    var url=`${axios.baseURL}/CompanyUserMapping/GetCustomSearch`;
    var inputData={
     companycode:"",
     companyname:"",
     empname:"",
     isactive:""
    }
    this.GetCompanyUserMapping(url,inputData);
   }   
   // var url=`${axios.baseURL}/Login/GetUserList`;
    
    
    // var Companyurl=`${axios.baseURL}/CompanyMaster/CompanyMaster`;
    // axios.get(Companyurl).then((res, err) => {
    //   if (res)
    //     this.setState({ companyList: res.data.Data });
    //   if (err)
    //     console.log("GetCompanyMaster Api err", err);
    // });
  }

  GetCompanyUserMapping=(url,inputData)=>{
    debugger
    //var url='http://localhost:52227/api/CompanyUserMapping/GetCompanyUserMapping';
   // var url=`${axios.baseURL}/CompanyUserMapping/GetCompanyUserMapping`;
  //  var url='http://localhost:52227/api/CompanyUserMapping/GetCustomSearch';
  //  var inputData={
  //   companycode:"",
  //   companyname:"",
  //   empname:"",
  //   isactive:""
  //  }
    // axios.get(url).then((res,err) => {
    //   debugger;
    //   res.data.Status==="1"?this.setState({ Data: res.data.Data }):this.setState({ Data: [] });      
    // });

    axios.post(url,inputData).then((res,err) => {
      debugger;
      res.data.Status==="1"?this.setState({ Data: res.data.Data }):this.setState({ Data: [] });      
    });

  }

  handlerClickCleanFiltered(e) {
    debugger;
    this.companycode.value="";
    this.companyname.value="";
    this.username.value="";
    this.isactive.value="";     
  }



  add = (open) => {  
    debugger  
    this.setState({           
      open: open,
      headerText:"add"
     });  
      //var url=`${axios.baseURL}/Login/GetUserList`;
      // var url='http://localhost:52227/api/CompanyUserMapping/GetUserListNotMapWithAnyCompany';
      var url=`${axios.baseURL}/CompanyUserMapping/GetUserListNotMapWithAnyCompany`;
    axios.get(url).then((res,err) => {
      debugger;
      res.data.Status==="1"?this.setState({  ...this.state, userList: res.data.Data ,selectOptions:res.data.Data.map(item=>({

              "label":item.Name,
              "value":item.EmpId
            }))}):this.setState({  ...this.state, userList: [],selectOptions:[] });      
    });
      
  };

  edit=(row)=>{
    
    this.setState({           
      open: !this.state.open,
      headerText:"edit"
     }); 

     var url=`${axios.baseURL}/Login/GetUserList`;
    // var url='http://localhost:52227/api/CompanyUserMapping/GetUserListNotMapWithAnyCompany';
     axios.get(url).then((res,err) => {
       
       res.data.Status==="1"?this.setState({  
         ...this.state, 
         userList: res.data.Data.filter(arr=>arr.EmpId===row.EmpId) ,
         selectOptions:res.data.Data.filter(arr=>arr.EmpId===row.EmpId).map(item=>({
 
               "label":item.Name,
               "value":item.EmpId
             })),
         defaultOptions:res.data.Data.filter(arr=>arr.EmpId===row.EmpId).map(item=>({
 
          "label":item.Name,
          "value":item.EmpId
        })),
        }):this.setState({  ...this.state, userList: [],selectOptions:[] });      
     });
     this.setState({
       selectOptions:[]
     });

     var empId=row.EmpId;

     var url1=`${axios.baseURL}/CompanyUserMapping/GetCompanyListWithActivePermissionByEmpId?EmpId=`+empId;

     //var url='http://localhost:52227/api/CompanyUserMapping/GetCompanyListWithActivePermissionByEmpId?EmpId='+empId;
     axios.get(url1).then((res,err) =>{
       debugger
       if(res.data.Status==="1"){
         this.setState({
          addData: res.data.Data,
          selectedUserId:empId
         });
       }
     });


  }

  delete=(row)=>{
    debugger
    if(row!=null && row!=""){
      var url = `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=Company_User_Table&ID=`+row.Id;
      axios.post(url)
      .then((res,err)=>{
        debugger
        if(res.data.Status==="1"){
          alert(res.data.Message);
          this.GetCompanyUserMapping();
        }
        else{
          alert(res.data.Message);
        }
      });
    }
    else{
      alert("Please select atleast one recodr");
    }
  }

  exportToExcle = () => {
    debugger
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let fileName = "Company User Mapping/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.Data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  printTable = () => {
    let table = "";
    table += "<html><head></head><body><style>";
    table += "table , th, td {border: 1px solid black;} </style>";

    table +=
      "<table> <tr><th>CompanyCode</th><th>CompanyName</th><th>Name</th><th>Created By</th><th>Created Date</th><th>IsActive</th></tr>";

    for (let i = 0; i < this.state.Data.length; i++) {
      let employee = this.state.Data[i];
      table +=
        "<tr><td>" +
        employee.CompanyCode+
        "</td><td>" +
        employee.CompanyName +
        "</td><td>" +
        employee.Name +
        "</td><td>" +
        employee.CreatedBy +
        "</td><td>" +
        employee.CreatedDate +
        "</td><td>" +
        employee.IsActive;
    }

    table += "</table></body></html>";

    console.log("Print==" + table);
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(table);
    printWin.document.close();
    printWin.print();
    // window.print(this.state.employee);
  };

  changeHandler=(e)=>{
    debugger
    // const empId=e.target.value; 
     
    const empId=e.value;    
    if(empId!=null){

      var url=`${axios.baseURL}/CompanyUserMapping/GetCompanyListWithActivePermissionByEmpId?EmpId=`+empId;

     // var url='http://localhost:52227/api/CompanyUserMapping/GetCompanyListWithActivePermissionByEmpId?EmpId='+empId;
     // var url=`${axios.baseURL}/CompanyUserMapping/GetCompanyListWithActivePermissionByEmpId?EmpId=`+empId;

     //var url='http://localhost:52227/api/CompanyUserMapping/GetCompanyListNotMapWithAnyUserById?EmpId='+empId;

    //var url=`${axios.baseURL}/CompanyUserMapping/GetCompanyListWithActivePermissionByEmpId?EmpId=`+empId;
    axios.get(url).then((res,err) => {
      debugger;
      // this.setState({
      //   Data:[]
      // });
      if(res.data.Data.length>0){        
        res.data.Data.map(item=>{
            Object.assign(item,{CompanySelected:false});  
        });
      }

      res.data.Status==="1"?this.setState({  ...this.state,addData: res.data.Data,selectedUserId:empId }):this.setState({  ...this.state, addData: [],selectedUserId:empId });  
    });
    } 
  }

  saveHandler=()=>{
    debugger
    if(this.state.addData.length>0){
     // var url="http://localhost:52227/api/CompanyUserMapping/PostCompanyUserMapping";
      var url=`${axios.baseURL}/CompanyUserMapping/PostCompanyUserMapping`;
      var array=this.state.addData.filter(arr=>arr.CompanySelected==true);
      axios.post(url,array)
      .then((res,err)=>{
        if(res.data.Status==="1"){
          alert(res.data.Message);
        }
        else{
          alert(res.data.Message);
        }

      });
    }
  }

  menuClick = (menuId) => {    
    debugger
    console.log("Menu id== for parent" + menuId);
   // this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };

  render() {
    debugger;
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    const { user } = this.props;
    const { headerPerm } = this.state;
    var open=this.state.open;
    const options = {
      onSearchChange: this.handleSearchChange,
      page: 1,
      sizePerPageList: [
        {
          text: "5",
          value: 5,
        },
        {
          text: "10",
          value: 10,
        },
        {
          text: "20",
          value: 20,
        },
        {
          text: "All",
          value: this.state.employee!=null?this.state.employee.length:0,
        },
      ],
      sizePerPage: 10,
      pageStartIndex: 1,
      paginationSize: 5,
      prePage: "Prev",
      nextPage: "Next",
      firstPage: "First",
      lastPage: "Last",
    };
    
    const  selectRow = {
      mode: "radio",
      bgColor: "rgb(116 236 255)",  
      clickToSelect: true, 
      selectionHeaderRenderer:()=>{
        debugger
        return(
          <a onClick={this.handlerClickCleanFiltered.bind(this)}  style={ { cursor: 'pointer' } }>Clear Filters</a>
        )      
      },     
        
      onSelect:(row, isSelect, rowIndex, e)=>{
        debugger
        if(isSelect){
          this.setState({
            selectedRow:row,
            sendidtoeditbtn:row
          });          
          return true;
        }
      } ,
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect ) {
          return [0];  
        }
      }
      
    }
    
    const  selectRow1 = {
      mode: "checkbox",
      bgColor: "rgb(116 236 255)",    
      selected: this.state.addData.filter(arr=>arr.IsActive==="Yes").map(item=>{
        return( item.CompanyCode!=null?item.CompanyCode:"");
      }),  
      clickToSelect: true,  
      onSelect:(row, isSelect, rowIndex, e)=>{
        debugger;
        if(isSelect){
          var array=this.state.addData;

          array.filter(arr=>arr.CompanyCode==row.CompanyCode && arr.Name==row.Name).map(item=>{
            return (
              item.IsActive="Yes",
              item.CreatedBy=this.props.user.info.EmpId,
              item.CompanySelected=true
              );
          });
          array.map(item=>{
            return(
              item.CreatedBy=this.props.user.info.EmpId,
              Object.assign(item,{EmpId:this.state.selectedUserId})
            )

          });
          this.setState({
            ...this.state,
            addData:array,
            
          })
        }
        else{
          var array=this.state.addData;

          array.filter(arr=>arr.CompanyCode==row.CompanyCode && arr.Name==row.Name).map(item=>{
            return (item.IsActive="No",
            item.CreatedBy=this.props.user.info.EmpId,
            item.CompanySelected=true
            );
          });
          array.map(item=>{
            return(
              item.CreatedBy=this.props.user.info.EmpId,
              Object.assign(item,{EmpId:this.state.selectedUserId})
            )
          });
          this.setState({
            ...this.state,
            addData:array
          })
        }
      }   
    }    
    return (
      <>
        <ToastContainer 
          position="top-right"
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
      <div className="col-md-6" >
      <Modal open={open} center onClose={this.onCloseModal}>
        <div className="modal-header">
    {this.state.headerText==="add"?<h4>Add Company User Mapping</h4>:<h4>Edit Company User Mapping</h4>}
        </div>
        <div style={{padding:10}}>        
        <Form>
          <FormGroup>
             <Label>Select User</Label>
             <Select 
             value={this.state.defaultOptions}
             className="form-control" 
             style={{ width: '20%' }}
             name="selectUser" 
             id="selectUser"           
             onChange={this.changeHandler}
             options={this.state.userList.length > 0 ?this.state.selectOptions:[]}
             defaultValue={this.state.defaultOptions}
             >            
             </Select>
          </FormGroup>
        </Form>
        </div>
       
        <div style={{padding:5}}>
       
        <Suspense fallback="loading...">
<div className="row">
  <div className="col-md-12" style={{ padding: 5 }}>
    <main role="main">
      <div className="row">
        <div className="container">                  
          <div className="col-md-12">
            <div>
              <div>
              <BootstrapTable
              keyField="CompanyCode"
              data={ this.state.addData.length>0?this.state.addData:[]}
              columns={this.state.columns1}
              selectRow={selectRow1}
              filter={filterFactory()}
              />
              </div>
            </div>
          </div>
        </div>                
      </div>
      {this.state.addData.length>0
      ?
      <Link className="btn btn-sm btn-primary mr-2" onClick={this.saveHandler}>
      Save Mapping
      </Link>
      :null
      }
    
    </main>
   
  </div>    
</div>
</Suspense>


        </div>
        
      </Modal>
      </div>           
      
        {/* <Header props={this.props} menuClick = {this.menuClick} /> */}
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Company User Mapping</h3>
            </li>
          </ol>
           <div className="row">
                <div className="container">                  
                  <div className="col-md-12 mx-auto">
                    <div className="form-container mt-2">
                      <div style={{ padding: 10 ,marginLeft: 5 }} >
                        <Gridcontrolbtn  
                          pageName={this.state.pageName}  
                          add={this.add} 
                          open={this.state.open} 
                          edit={this.edit}  
                          selectedRow={this.state.selectedRow}  
                          delete={this.delete}
                          sendidtoeditbtn={this.state.sendidtoeditbtn}   
                          exportToExcle={this.exportToExcle}
                          printTable={this.printTable}   
                          //menuId={this.props.menuId} 
                        // menuClick={this.menuClick}
                          menuId={this.props.menuId}
                        />
                      </div>
                      
                      <BootstrapTable
                        keyField={"Id"}
                        data={this.state.Data}
                        columns={this.state.columns}
                        selectRow={selectRow}
                        filter={filterFactory()} 
                        headerText={<a  style={ { cursor: 'pointer' } }>clear filters</a>} 
                        pagination={paginationFactory(options)}                     
                      >
                        {/* <a  style={ { cursor: 'pointer' } }>clear filters</a> */}
                      </BootstrapTable>
                    </div>
                  </div>
                </div>                
              </div>
        </main>      
      </>
    )
  }
}
export default connect((state) => ({
  user: state.user,
  menuId:state.menuId,
}),{ setMenu })(CompanyUserMapping);


