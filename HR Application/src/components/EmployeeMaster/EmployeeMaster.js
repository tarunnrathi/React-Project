import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Gridcontrolbtn from "../gridcontrolbtn";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  dateFilter,
  FILTER_TYPES,
  customFilter,
  PriceFilter,
} from "react-bootstrap-table2-filter";
//import Select from 'react-select';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { setMenu } from "../../redux/actions/menu";
import { userInfo } from "../../redux/actions/user";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ToastContainer, toast } from 'react-toastify';
import EmployeeMasterUI from './EmployeeMasterUI'
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Moment from 'moment'
//import overlayFactory from 'react-bootstrap-table2-overlay';
import {controlPermission} from '../../redux/actions/controlPermission';

import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                      ];



var intervalId = "";
class EmployeeMaster extends Component {
  _isMounted = false;
  constructor(props) {
    debugger;
    super(props);
    this.state = {
      selectedUserId: "",
      selected: null,
      open: false,
        columns: [
        {
          dataField: "Id",
          text: "Id",
          hidden: false,
          sort: true,
          filter: textFilter()
        },
        {
          dataField: "EmpName",
          text: "Emp Name",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "20%" };
          }
          // filter:customFilter(),
          // filterRenderer:()=>{
          // return(
          //     <input 
          //     className="form-control" style={{width:'100%'}}
          //     key="input-Empname"  ref={myinput => (this.empName = myinput)} type="text" placeholder="Enter Employee Name" onKeyDown={ this.filter} ></input>
          //   )
          // },
        },
        {
          dataField: "Gender",
          text: "Gender",
          sort: true,
          filter: textFilter()
          // filter:customFilter(),
          // filterRenderer:()=>{
          //    return(
          //     <input 
          //     className="form-control" style={{width:'100%'}} 
          //     key="input-gender" ref={myinput => (this.gender = myinput)} type="text" placeholder="Enter Gender..." onKeyDown={ this.filter}></input>
          //   )
          // },
        },
        {
          dataField: "DOB",
          text: "DOB",          
          sort: true,                   
          filter: dateFilter({             
            onFilter: this.myOwnDOBFilter,
          }),
          
          formatter: (cell) => {
            debugger
            let dateObj = cell;
            if (typeof cell !== "object") {
              dateObj = new Date(cell);               
              return(
                <DateFormatComponent dateFormatString="dd/MM/yyyy"  dateObj={dateObj}/>
              )             
            } 
          }
        },
        {
          dataField: "PhoneNo",
          text: "PhoneNo",
          sort: true,
          filter: textFilter(),
        },
        {
          datafield: "Email",
          text: "Email",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Address1",
          text: "Address1",
          sort: true,
          filter: textFilter()
        },
        {
          dataField: "Address2",
          text: "Address2",
          sort: true,
          filter: textFilter()
        },
        {
          dataField: "DOJ",
          text: "DOJ",          
          sort: true,                   
          filter: dateFilter({             
            onFilter: this.myOwnDOJFilter,
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
        {
          dataField: "DepartmentId",
          text: "DepartmentId",
          hidden: true,
        },
        {
          dataField: "DesignationId",
          text: "DesignationId",
          hidden: true,
        },
        {
          dataField: "CompanyId",
          text: "CompanyId",
          hidden: true,
        },
        {
          dataField: "EmployeeTypeId",
          text: "EmployeeTypeId",
          hidden: true,
        },
        {
          dataField: "IsActive",
          text: "IsActive",
          sort: true,
          //   filter:customFilter(),
          //   filterRenderer:()=>{
          //     return(
          //       <input 
          //       className="form-control" style={{width:'100%'}}
          //       key="inputisactive"
          //       ref={myinput => (this.isactive = myinput)}
          //       type="text"
          //       placeholder="Enter Status Name..."
          //       onKeyDown={ this.filter}
          //       defaultValue=""

          //       ></input>
          //     )
          //  }
        },
        {
          hidden: true,
          dataField: "CreatedBy",
          text: "Created By",
          sort: true,
          // filter:customFilter(),
          // filterRenderer:()=>{

          //   return(
          //     <input 
          //     className="form-control" style={{width:'100%'}}
          //     key="input-createdby"
          //     ref={myinput => (this.createdby = myinput)}
          //     type="text"
          //     placeholder="Enter Created By..."
          //     onKeyDown={ this.filter}

          //     ></input>
          //   )
          // },
        },
        {
          hidden: true,
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
            return `${("0" + dateObj.getDate()).slice(-2)}/${(
              "0" +
              (dateObj.getMonth() + 1)
            ).slice(-2)}/${dateObj.getFullYear()} 
          ${dateObj.getHours()}:${dateObj.getMinutes()}`;
          },
        },
        {
          dataField: "ModifyBy",
          text: "ModifyBy",
          sort: true,
          filter: textFilter(),
          hidden: true
        },
        {
          hidden: true,
          dataField: "ModifiedDate",
          text: "Modified Date",
          sort: true,
          filter: dateFilter(),
          formatter: (cell) => {
            let dateOb = cell;
            if (typeof cell !== "object") {
              dateOb = new Date(cell);
            }
            if (dateOb !== null) {
              return `${("0" + dateOb.getDate()).slice(-2)}/${(
                "0" +
                (dateOb.getMonth() + 1)
              ).slice(-2)}/${dateOb.getFullYear()} 
             ${dateOb.getHours()}:${dateOb.getMinutes()}`;
            } else {
              return "";
            }
          },
        },
        {
          dataField: "EmpImg",
          text: "EmpImg",
          sort: true,
          hidden: true
        },
        {
          text: "Photo",
          hidden:true,
          formatter: (cell, row, rowIndex) => {
            debugger;
          
            var Imgurl = "data:image/jpeg;base64," + row["EmpImg"];
            return (

              <img
                src={Imgurl}
                style={{ width: "65px", height: "60px" }}
                responsive />

            );
          },
          onClick() {
            alert('i am image');
          }
        }
      ],
      employee: [],
      filterdata: [],
      pageName: "EmployeeMaster",
      selectRow: [],
      selectedRow: {},
      Mode: "",
      ModeText: "",
      selectOptions: [],
      isLoading: true,
      company: [],
      ControlsList:[]

    }
    //this.menuClick=this.menuClick.bind(this);
  }

  myOwnDOBFilter=(filterVal, data)=>{
    debugger   
    if(filterVal.date!=="" && filterVal.comparator!==""){
      switch(filterVal.comparator){
        case "=":
          return filterVal.comparator!==""?
           data.filter(x=>`${('0' + new Date(x.DOB).getDate()).slice(-2)}/${('0' + ( new Date(x.DOB).getMonth() + 1)).slice(-2)}/${ new Date( x.DOB).getFullYear()}`===`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
           :null

        case ">":
          return filterVal.comparator!==""?
          data.filter(item =>new Date(`${("0" + new Date(item.DOB).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOB).getMonth()] )}/${ new Date(item.DOB).getFullYear()}`)>new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))  
           :null 

           case "<":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOB).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOB).getMonth()] )}/${ new Date(item.DOB).getFullYear()}`)<new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case ">=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOB).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOB).getMonth()] )}/${ new Date(item.DOB).getFullYear()}`)>=new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "!=":
                  return filterVal.comparator!==""?
                  data.filter(x=>`${('0' + new Date(x.DOB).getDate()).slice(-2)}/${('0' + ( new Date(x.DOB).getMonth() + 1)).slice(-2)}/${ new Date( x.DOB).getFullYear()}`!==`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
                  :null 

                  case "<=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOB).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOB).getMonth()] )}/${ new Date(item.DOB).getFullYear()}`)<= new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "LIKE":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOB).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOB).getMonth()] )}/${ new Date(item.DOB).getFullYear()}`)<=null )
                  :null 

          default :return null;
      }
    }
  }

  myOwnDOJFilter=(filterVal, data)=>{
    debugger   
    if(filterVal.date!=="" && filterVal.comparator!==""){
      switch(filterVal.comparator){
        case "=":
          return filterVal.comparator!==""?
           data.filter(x=>`${('0' + new Date(x.DOJ).getDate()).slice(-2)}/${('0' + ( new Date(x.DOJ).getMonth() + 1)).slice(-2)}/${ new Date( x.DOJ).getFullYear()}`===`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
           :null

        case ">":
          return filterVal.comparator!==""?
          data.filter(item =>new Date(`${("0" + new Date(item.DOJ).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOJ).getMonth()] )}/${ new Date(item.DOJ).getFullYear()}`)>new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))  
           :null 

           case "<":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOJ).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOJ).getMonth()] )}/${ new Date(item.DOJ).getFullYear()}`)<new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case ">=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOJ).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOJ).getMonth()] )}/${ new Date(item.DOJ).getFullYear()}`)>=new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "!=":
                  return filterVal.comparator!==""?
                  data.filter(x=>`${('0' + new Date(x.DOJ).getDate()).slice(-2)}/${('0' + ( new Date(x.DOJ).getMonth() + 1)).slice(-2)}/${ new Date( x.DOJ).getFullYear()}`!==`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
                  :null 

                  case "<=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOJ).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOJ).getMonth()] )}/${ new Date(item.DOJ).getFullYear()}`)<= new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "LIKE":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.DOJ).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.DOJ).getMonth()] )}/${ new Date(item.DOJ).getFullYear()}`)<=null )
                  :null 

          default :return null;
      }
    }
  }

handleRowSelect = (row, isSelect, rowIndex, e) => {
    debugger;
    this.setState(
      {
        ...this.state,
        selected: row.Id,
        selectedIndex: rowIndex,
      },
      //() => {
      //console.log(this.state.selected);
      // }
    );
  };

  // handleBtnClick = () => {
  //   alert('EmployeeMasterUI');
  //   this.props.history.push("/EmployeeMasterUI/" + this.state.selected);
  // };



  componentWillUnmount() {
    this._isMounted = false;

  }
  getCompanyMaster() {
    axios
      .get(`${axios.baseURL}/CompanyMaster/CompanyMaster`)
      .then((response) => {
        console.log(response.data.Data);
        let data = response.data.Data;
        this.setState({
          company: data,

        });
      });
  }
  componentDidMount() {
    this._isMounted = true;

    debugger
    this.getCompanyMaster();
    var url = `${axios.baseURL}/EmployeeMaster/GetEmployees`;
    // var inputData={
    //   Id:"",
    //   deptname:"",
    //   isactive:"",
    //   createdby:""
    //  }
    // this.getEmployeeData(url); 
    axios
      .get(url)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          console.log(response.data.Message);
          this.setState({
            employee: response.data.Data,
            filterdata: response.data.Data,
            isLoading: false,
          })
        }
        else {
          this.setState({ employee: [] });

        }
      });
     // this.controlPermission();

  }

  // handlerClickCleanFiltered(e) {
  //   debugger;
  //   this.Id.value="";
  //   this.deptname.value="";
  //   this.createdby.value="";
  //   this.isactive.value="";     
  // }

  // filter(e) {    

  //   if (e.key === 'Enter') {
  //     debugger
  //     var inputData={
  //       Id:this.Id.value,
  //       deptname:this.deptname.value,
  //       createdby:this.createdby.value,
  //       isactive:this.isactive.value
  //     } 

  //     //var url=`${axios.baseURL}/HRAPI/DepartmentCustomSearch`;
  //    // var url='http://localhost:52227/api/HRAPI/DepartmentCustomSearch';
  //     var url=`${axios.baseURL}/HRAPI/DepartmentCustomSearch`;

  //     this.getEmployeeData(url);     

  //   // axios.post(url,inputData).then((res,err) => {
  //   //   debugger;
  //   //   res.data.Status==="1"?this.setState({ Data: res.data.Data }):this.setState({ Data: [] });      
  //   // });    
  //   } 

  // }

  getEmployeeData(url) {
    debugger
    axios
      .post(url)
      .then((response, error) => {
        debugger
        if (response.data.Status === "1") {
          let data = response.data.Data;
          this.setState({
            employee: data,
            filterdata: data,
            loading: false
          });

        }
        else {
          this.setState({
            employee: [],
            filterdata: []
          });
          console.log(error);
        }
      });
  }

  add = (open) => {
    debugger;
    this.setState({
      open: open,
      Mode: "Add",
      ModeText: "Add Employee"
    });


  };
  edit = () => {
    debugger;
    if (this.state.selected == null) {
      toast.error("Please Select Row", { position: toast.POSITION.TOP_CENTER });
      return;
    }
    this.setState({
       open: true,
        Mode: "Edit", 
        ModeText: "Edit Employee" ,
        ControlsList:this.props.controlsList.filter(x=>x.PageMastId===this.props.menuId.menuId).length>0?this.props.controlsList.filter(x=>x.PageMastId===this.props.menuId.menuId):[]
      });
    setTimeout(() => {
      this.props.userInfo({
        epmd: this.state.employee[this.state.selectedIndex]["Id"], 
      });
    }, 100);

  };
  onCloseModal = () => {
    debugger;
    this.setState({ open: false });
  };
  closeModal2 = () => {
    debugger;
    console.log("From wwww access...");
    this.setState({ open: false });
    this.getEmployeeData();
  };
  delete(name) {
    debugger;
    if (name == null) {
      Swal.fire("Please Select Row");
      return;
    }
    Swal.fire({
      title: 'Delete this one?',
      text: "This action can not be canceled!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, Cancel'
    }).then((result) => {
      if (result.value) {
        debugger;
        console.log("result.value  " + result.value);
        axios
          .post(
            `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=EmployeeMaster&ID=${name}`,
           this.state)
          .then((response) => {
            console.log("Response " + response.data.Status);
          });
        Swal.fire(
          'Press OK to back',
          'The post has been deleted',
          'success'
        ).then(() => {
          window.location.reload(true);
        })
      }
    })


  };
  exportToExcle = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let fileName = "Employee/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.filterdata);
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
      "<table><tr><th>Id</th><th>EmployeeName</th><th>DOB</th><th>DOJ</th><th>PhoneNo</th><th>Gender</th><th>Email</th><th>Address1</th><th>Address2</th></tr>";

    for (let i = 0; i < this.state.filterdata.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.EmpName +
        "</td><td>" +
        Moment(employee.DOB).format('DD-MM-YYYY') +  
        "</td><td>" +
        Moment(employee.DOJ).format('DD-MM-YYYY') +
        "</td><td>" +
        employee.PhoneNo +
        "</td><td>" +
        employee.Gender +
        "</td><td>" +
        employee.Email +
        "</td><td>" +
        employee.Address1 +
        "</td><td>" +
        employee.Address2 +
        "</td></tr>";
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

  onOpenModal = () => {
    clearInterval(intervalId);
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
  handleSearchChange = (searchText, colInfos, multiColumnSearch) => {
    alert("11");
    console.log("Data filter====");
  };
  menuClick = (menuId) => {
    debugger
    console.log("Menu id== for parent" + menuId);
    // this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };
  handleChange = (event) => {
    //  setAge(event.target.value);
  };
  



  render() {
     
    debugger;
    const loading = this.state.isLoading;
    const { b } = this.props;
    const { open } = this.state;
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
          value: this.state.employee != null ? this.state.employee.length : 0,
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
    const seletedstate = "";
    const onDataSizeChange = (dataSize) => {
      console.log("cunt==" + dataSize);
      console.log(JSON.stringify(dataSize));
      if (this.node && this.node.filterContext && this.node.filterContext) {
        this.setState({ filterdata: this.node.filterContext.data });
      }
      // handle any data change here
    };
    const selectRow = {
      mode: "radio",
      bgColor: "#00BFFF",
      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          this.handleRowSelect(row, isSelect, rowIndex, e);
          return true; // return false to deny current select action}
        }
      },
      // selectionHeaderRenderer:()=>{

      //   return(
      //     <a onClick={this.handlerClickCleanFiltered.bind(this)}  style={ { cursor: 'pointer' } }>Clear Filters</a>
      //   )      
      // }, 
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect) {
          return [0];
        }
      }
    };
    const { user } = this.props;
    console.log({ user });
    console.log({ props: this.props });

    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }


   


    return (
      <>
        <ToastContainer />
        <div className="modal fade" id="myModal" role="dialog">
          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4>Add Employee</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                </button>
                </div>
                <div className="modal-body">
                  <EmployeeMasterUI EmpId="0" Mode="Add" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
          <Modal open={open} center onClose={this.onCloseModal}>
            <div className="modal-header">
              <h4>Edit Employee</h4>
            </div>
            {this.state.selected && (
              <EmployeeMasterUI
                EmpId={
                  this.state.selected
                }
                Mode={
                  "Edit"
                }
                closeModal={this.closeModal2}
                ControlsList={this.state.ControlsList}
              />
            )}
          </Modal>

        </div>


        
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Employee Master</h3>
            </li>
          </ol>
          <div className="row">
            <div className="col-md-12" style={{ padding: 5 }}>
              <main role="main">
                <div className="row">
                  <div className="container">
                    <div className="col-md-12 mx-auto">
                      <div className="form-container mt-2 loader" >
                        <div style={{ padding: 10, marginLeft: 5 }}>

                          <Gridcontrolbtn
                            adddepart={this.state.adddepartment}
                            sendpid="editdepartment"
                            sendidtoeditbtn={this.state.selected}
                            add={this.add}
                            edit={this.edit}
                            delete={this.delete}
                            exportToExcle={this.exportToExcle}
                            printTable={this.printTable}
                            menuId={this.props.menuId}
                          />
                        </div>
                        {this.state.isLoading == false ? (
                          <BootstrapTable

                            ref={(n) => (this.node = n)}
                            onDataSizeChange={onDataSizeChange}
                            id="tableData"
                            striped
                            hover
                            keyField="Id"
                            data={this.state.employee}
                            columns={this.state.columns}
                            selectRow={selectRow}
                            filter={filterFactory()}
                            pagination={paginationFactory(options)}

                          ></BootstrapTable>
                        ) :
                          <Loader type="Bars" color="#00BFFF" height={80} width={80} />
                        }
                     
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </main>
      </>
    );

  }
}
export default connect((state) => ({
  user: state.user,
  comp: state.companyPermission ,
  controlsList:state.controls.controlsItem,
  menuId:state.menu,
}), { setMenu, userInfo,controlPermission })(EmployeeMaster);


