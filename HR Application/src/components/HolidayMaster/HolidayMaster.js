import React, { Component } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import filterFactory, {
  textFilter,
  dateFilter,
  FILTER_TYPES,
  customFilter,
  PriceFilter,
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
import HolidayMasterUI from './HolidayMasterUI'
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
//import overlayFactory from 'react-bootstrap-table2-overlay';

var intervalId = "";
class HolidayMaster extends Component {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state={    
      selectedUserId: "", 
      selected:"",
      open:false, 
      columns: [
        {
          dataField: "Id",
          text: "hId",
          sort:true,
          filter:textFilter()
        },
        {
          dataField: "HolidayName",
          text: "Holiday Name",
          sort: true,
          filter:textFilter(),
          headerStyle: () => {
            return { width: "16%" };
          }
        },
        {
          dataField: "HolidayType",
          text: "Holiday Type",
          sort: true,
          filter:textFilter(),
          headerStyle: () => {
            return { width: "10%" };
          }
        },
        {
          dataField: "IsActive",
          text: "Status",
          sort: true,
          filter:textFilter()
          
        },
        {
          dataField: "HolidayDate",
          text: "Holiday Date",
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
            return `${("0" + dateObj.getDate()).slice(-2)}/${("0" + (dateObj.getMonth() + 1)).slice(-2)}/${dateObj.getFullYear()}`;
        } else {
          return "";
        }
          },
        },
        {
          dataField: "CreatedBy",
          text: "Created By",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Createddate",
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
        {
          dataField: "ModifiedBy",
          text: "ModifyBy",
          sort: true,
          filter: textFilter(),
        },
        {
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
        }
      ],
      employee:[],     
      filterdata:[], 
      selectRow:[],
      selectedRow:{},
      Mode:"",
      ModeText:"",
      selectOptions :[],
      isLoading: true,
     
    };
    //this.menuClick=this.menuClick.bind(this);
  }
  handleRowSelect = (row, isSelect, rowIndex, e) => {
    //debugger;
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

  //   handleBtnClick = () => {
  //   alert('EmployeeMasterUI');
  //   this.props.history.push("/EmployeeMasterUI/" + this.state.selected);
  // };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
   this._isMounted = true;
    var url=`${axios.baseURL}/HolidayMaster/GetHolidayMaster`;
   
    axios.get(url)
    .then((response, err) => {
      //debugger;
     
      if (response.data.Status === '1') {
        this.setState({
          employee:response.data.Data,
          filterdata:response.data.Data,
          isLoading:false
        })
        
       }
      else {
      this.setState({employee:[]}); 
       
      }
    });
   
   }

add = (open) => {  
    //debugger;  
    this.setState({           
      open: open,
      Mode:"Add",
      ModeText:"Add Employee"
     });  
  };

edit = () => {
    //debugger;
    if (this.state.selected == null) {
      toast.error("Please Select Row",{position:toast.POSITION.TOP_CENTER});
      return;
    }
    this.setState({ open: true,Mode:"Edit",ModeText:"Edit Employee" });
    setTimeout(() => {
      this.props.userInfo({
        epmd: this.state.employee[this.state.selectedIndex]["EmpId"],
        
      });
    }, 100);
  };

  onCloseModal = () => {
    //debugger;
    this.setState({ open: false });
  };
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
      `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=HolidayMaster&Id=${name}`,
      this.state )
    .then((response) => {
          console.log("Response "+ response.data.Status);
    });
      Swal.fire(
          'Press OK to back',
          'The post has been deleted',
          'success'
      ).then(()=>{
      window.location.reload(true);
      })
  }
})
};

exportToExcle = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = "HolidayMaster/" + new Date().getTime();
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
      "<table><tr><th>Id</th><th>Holiday Name</th><th>Holiday Type</th><th>IsActive</th><th>Holiday Date</th><th>Created By</th><th>Created date</th></tr>";

    for (let i = 0; i < this.state.filterdata.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.HolidayName +
        "</td><td>" +
        employee.HolidayType +
        "</td><td>" +
        employee.IsActive +
        "</td><td>" +
        employee.HolidayDate +
        "</td><td>" +
        employee.CreatedBy +
        "</td><td>" +
        employee.Createddate +
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
    
  };
  menuClick = (menuId) => {    
    debugger
    console.log("Menu id== for parent" + menuId);
   // this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };
  render() {
    //debugger;
    const  loading  = this.state.isLoading;
    const {b }=this.props;
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
          onSelectAll: (isSelect, rows, e) => {
        if (isSelect ) {
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
                <h4>Add Holiday</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
               <HolidayMasterUI HolidayId="0" Mode="Add" /> 
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
        <Modal open={open} center onClose={this.onCloseModal}>
        <div className="modal-header">
      <h4>Edit Holiday </h4>
        </div>
         {this.state.selected && (
              <HolidayMasterUI
                HolidayId={
                  this.state.selected
                }
                Mode={
                  "Edit"
                }
                closeModal={this.closeModal2}
              />
            )} 
         </Modal>
       
</div>
       

<Header props={this.props} menuClick = {this.menuClick} />
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Holiday Master</h3>
            </li>
          </ol>
        <div className="row">
          <div className="col-md-12" style={{ padding: 5 }}>
            <main role="main">
              <div className="row">
                <div className="container">                  
                  <div className="col-md-12 mx-auto">
                    <div className="form-container mt-2 loader" >
                      <div style={{ padding: 10 ,marginLeft: 5 }}>
                        
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
  comp: state.companyPermission
}),{ setMenu,userInfo })(HolidayMaster);


