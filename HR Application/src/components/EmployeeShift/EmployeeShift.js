import React, { Component } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import filterFactory, {
  textFilter,
  dateFilter,
  Comparator,
  customFilter,
  FILTER_TYPES 
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Gridcontrolbtn from "../gridcontrolbtn";
import Header from '../Header';
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Form, Input, Label, FormGroup, FormFeedback, Button } from 'reactstrap';
import Select from 'react-select';
import { setMenu } from "../../redux/actions/menu";
import { userInfo } from "../../redux/actions/user";
import { ToastContainer, toast } from 'react-toastify';
import EmployeeShiftUI from './EmployeeShiftUI';
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
//import overlayFactory from 'react-bootstrap-table2-overlay';
import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';


var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

let dateFilteVal;

var intervalId = "";
class EmployeeShift extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      selectedUserId: "",
      selected: "",
      open: false,
      columns: [
        {
          dataField: "Id",
          text: "Id",
          hidden: true,
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "5%" };
          }
        },
        {
          dataField: "EmpId",
          text: "EmployeeId",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "5%" };
          }
        },
        {
          dataField: "EmpName",
          text: "Employee Name",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "16%" };
          }
        },
        {
          dataField: "DeptName",
          text: "Department Name",
          sort: true,
          filter: textFilter(),

        },
        {
          dataField: "ShiftName",
          text: "Shift Name",
          sort: true,
          filter: textFilter(),

        },
        {
          dataField: "CompanyName",
          text: "Company Name",
          sort: true,
          filter: textFilter(),

        },
        {
          dataField: "Roster",
          text: "Roster",
          sort: true,
          filter: textFilter(),

        },
        {
          dataField: "IsActive",
          text: "Status",
          sort: true,
          filter: textFilter()

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
        }
,
        {
          hidden: true,
          dataField: "ModifiedBy",
          text: "ModifyBy",
          sort: true,
          filter: textFilter(),

        },
        {
          hidden: true,
          dataField: "Modifieddate",
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
          dataField: "ApplicableDate",
          text: "Applicable Date",          
          sort: true,                   
          filter: dateFilter({             
            onFilter: this.myOwnApplicableDateFilter,
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
      ],
      employee: [],
      filterdata: [],
      selectRow: [],
      selectedRow: {},
      Mode: "Add",
      ModeText: "",
      selectOptions: [],
      isLoading: true,
      addOpened: true,
      editObj: {
        empId: "",
        deptId: "",
        companyId: "",
      },
      employeeSearch:[],
      shiftdetails:[],
      // startDate: new Date(),
      // comparator:""
    };
    //this.menuClick=this.menuClick.bind(this);
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


  myOwnApplicableDateFilter=(filterVal, data)=>{
    debugger   
    if(filterVal.date!=="" && filterVal.comparator!==""){
      switch(filterVal.comparator){
        case "=":
          return filterVal.comparator!==""?
           data.filter(x=>`${('0' + new Date(x.ApplicableDate).getDate()).slice(-2)}/${('0' + ( new Date(x.ApplicableDate).getMonth() + 1)).slice(-2)}/${ new Date( x.ApplicableDate).getFullYear()}`===`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
           :null

        case ">":
          return filterVal.comparator!==""?
          data.filter(item =>new Date(`${("0" + new Date(item.ApplicableDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.ApplicableDate).getMonth()] )}/${ new Date(item.ApplicableDate).getFullYear()}`)>new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))  
           :null 

           case "<":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.ApplicableDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.ApplicableDate).getMonth()] )}/${ new Date(item.ApplicableDate).getFullYear()}`)<new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case ">=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.ApplicableDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.ApplicableDate).getMonth()] )}/${ new Date(item.ApplicableDate).getFullYear()}`)>=new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "!=":
                  return filterVal.comparator!==""?
                  data.filter(x=>`${('0' + new Date(x.ApplicableDate).getDate()).slice(-2)}/${('0' + ( new Date(x.ApplicableDate).getMonth() + 1)).slice(-2)}/${ new Date( x.ApplicableDate).getFullYear()}`!==`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
                  :null 

                  case "<=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.ApplicableDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.ApplicableDate).getMonth()] )}/${ new Date(item.ApplicableDate).getFullYear()}`)<= new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "LIKE":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.ApplicableDate).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.ApplicableDate).getMonth()] )}/${ new Date(item.ApplicableDate).getFullYear()}`)<=null )
                  :null 

          default :return null;
      }
    }
  }
   
  


  handleRowSelect = (row, isSelect, rowIndex, e) => {
    debugger;
    this.setState(
      {
        //...this.state,
        selected: row.Id,
        //selectedIndex: rowIndex,
      },
      //() => {
      //console.log(this.state.selected);
      // }
    );
  };

  //   handleBtnClick = () => {
  //   alert('EmployeeMasterUI');
  //   this.props.history.push("/EmployeeMasterUI/" + this.state.selected);
  // };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    var url = `${axios.baseURL}/EmployeeShift/GetEmployeeShift`;

    axios.get(url)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          this.setState({
            employee: response.data.Data,
            filterdata: response.data.Data,
            isLoading: false
          })

        }
        else {
          this.setState({ employee: [] });

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
    var obj={
      empId: this.state.employee.filter(x => x.Id === this.state.selected).map(item => {
        return item.EmpId
      }),
      deptId: this.state.employee.filter(x => x.Id === this.state.selected).map(item => {
        return item.DepartmentId
      }),
      companyId: this.state.employee.filter(x => x.Id === this.state.selected).map(item => {
        return item.CompanyId
      }),
    }
    
    this.setState(()=>({
      ...this.state,
      editObj: {
        empId: this.state.employee.filter(x => x.Id === this.state.selected).map(item => {
          return item.EmpId
        }),
        deptId: this.state.employee.filter(x => x.Id === this.state.selected).map(item => {
          return item.DepartmentId
        }),
        companyId: this.state.employee.filter(x => x.Id === this.state.selected).map(item => {
          return item.CompanyId
        }),
      },
      Mode: "Edit",
      open: true
    }));
    
    // var url = `http://localhost:52227/api/EmployeeShift/GetEmployeeShiftById?EmpId=${obj.empId[0]}&CompanyId=${obj.companyId[0]}&Id=${this.state.selected}`;

    var url = `${axios.baseURL}/EmployeeShift/GetEmployeeShiftById?EmpId=${obj.empId[0]}&CompanyId=${obj.companyId[0]}&Id=${this.state.selected}`;


    axios.get(url)
    .then((res) => {
      debugger
      if (res.data.Status === "1") {            
        this.setState(()=>({ 
          employeeSearch: res.data.Data.Table1,
          shiftdetails: res.data.Data.Table,
          Mode: "Edit",
        }));

      }
    }).catch(error => {
      alert(error);
    });

  };



  onCloseModal = () => {
    debugger;
    if (this.state.Mode === "Edit") {
      this.setState({ open: false, Mode: "Add" });
    }

    if (this.state.Mode === "Add") {
      var addOpened = this.state.addOpened
      this.setState({ addOpened: !addOpened });
    }


  };

  // onCloseModal = () => {
  //   debugger
  //   this.setState({ open: false });
  // };


  closeModal2 = () => {
    //debugger;

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

        axios
          .post(
            `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=EmployeeShift&Id=${name}`,
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
    let fileName = "EmployeeShift/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.filterdata);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  printTable = () => {
    let table = "";
    table += "<html><head></head><body><style>";
    table += "table, th, td {border: 1px solid black;} </style>";

    table +=
      "<table><tr><th>Id</th><th>Employee Name</th><th>Department Name</th><th>Shift Name</th><th>Company Name</th><th>Roster</th><th>IsActive</th><th>CreatedBy</th><th>Created date</th></tr>";

    for (let i = 0; i < this.state.employee.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.EmpName +
        "</td><td>" +
        employee.DeptName +
        "</td><td>" +
        employee.ShiftName +
        "</td><td>" +
        employee.CompanyName +
        "</td><td>" +
        employee.Roster +
        "</td><td>" +
        employee.IsActive +
        "</td><td>" +
        employee.CreatedBy +
        "</td><td>" +
        employee.CreatedDate +
        "</td></tr>"+
        employee.ApplicableDate +
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
    debugger
    clearInterval(intervalId);
    this.setState({ open: true });
  };



  handleSearchChange = (searchText, colInfos, multiColumnSearch) => {
    alert("11");

  };
  menuClick = (menuId) => {
    debugger
    console.log("Menu id== for parent" + menuId);
    // this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };

  changeAddOpened = (val) => {
    debugger
    this.setState({
      addOpened: val
    })
  }
  render() {
    debugger;
    if (this.props.user.info == null) {
      return <Redirect to="/sign-in" />;
    }
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
      // console.log("cunt==" + dataSize);
      // console.log(JSON.stringify(dataSize));
      if (this.node && this.node.filterContext && this.node.filterContext) {
        this.setState({ filterdata: this.node.filterContext.data });
      }
      // handle any data change here
    };
    const selectRow = {
      mode: "radio",
      bgColor: "rgb(116 236 255)",
      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          debugger
          this.handleRowSelect(row, isSelect, rowIndex, e);
          return true; // return false to deny current select action}
        }
      },
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect) {
          return [0];
        }
      }
    };
    const { user } = this.props;
    // console.log({ user });
    // console.log({ props: this.props });


    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    return (
      <>

        <ToastContainer />
        {this.state.Mode === "Add" && (
          <div className="modal fade" id="myModal" role="dialog">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    {this.state.Mode === "Add" ?
                      <h4>Add Employee Shift</h4> : <h4>Edit Employee Shift</h4>}

                    <button type="button" className="close" data-dismiss="modal" onClick={this.onCloseModal}>
                      &times;
                </button>
                  </div>
                  <div className="modal-body">

                    <EmployeeShiftUI Mode={this.state.Mode} addOpened={this.state.addOpened} onCloseModal={this.onCloseModal} compId={`${this.props.comp.compperm.CompanyId}`} changeAddOpened={this.changeAddOpened} />

                    {/* <EmployeeShiftUI  Mode={this.state.Mode} addOpened={this.state.addOpened} onCloseModal={this.onCloseModal} editObj={this.state.editObj} />  */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
          <Modal open={open} center onClose={this.onCloseModal}>
            <div className="modal-header">
              <h4>Edit Employee Shift </h4>
            </div>
            {this.state.selected && (
              <EmployeeShiftUI Mode={this.state.Mode} addOpened={this.state.addOpened} editObj={this.state.editObj} selected={this.state.selected} compId={`${this.props.comp.compperm.CompanyId}`} onCloseModal={this.onCloseModal} employeeSearch={this.state.employeeSearch} shiftdetails={this.state.shiftdetails} />
            )}
          </Modal>
        </div>


        {/* <Header props={this.props} menuClick = {this.menuClick} key={this.menuClick}  /> */}
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Employee Shift Master</h3>
            </li>
          </ol>
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
                        <div className="table-responsive">
                          <BootstrapTable
                            ref={(n) => (this.node = n)}
                            onDataSizeChange={onDataSizeChange} 
                            id="tableData"
                            striped
                            keyboardnav
                            hover
                            keyField="Id"
                            data={this.state.employee}
                            columns={this.state.columns}
                            selectRow={selectRow}
                            filter={filterFactory()}
                            pagination={paginationFactory(options)}
                            
                          ></BootstrapTable>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </main>
      </>
    );

  }
}
export default connect((state) => ({
  user: state.user,
  comp: state.companyPermission
}), { setMenu, userInfo })(EmployeeShift);


