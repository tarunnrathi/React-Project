import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axiosConfig from '../axiosconfig';
import axios from "axios";
import filterFactory, {
  textFilter,
  dateFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Gridcontrolbtn from "../gridcontrolbtn";
import AddShiftMasterGrid from "./AddShiftMastergrid";
import EditShiftMaster from "./EditShiftMastergrid";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { userInfo } from "../../redux/actions/user";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                      ];

var intervalId = "";
class ShiftMasterGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      test: "",
      showEditModal: false,
      employee: [],
      filterEmployee: [],
      seletedstateid: [],
      editshiftmaster: "editshiftmaster",
      addshiftmaster: "addshiftmaster",
      add: "",
      selected: null,
      columns: [
        {
          dataField: "ShiftName",
          text: "Shift Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "FromTime",
          text: "From Time",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "ToTime",
          text: "To Time",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "TotalTiming",
          text: "Total Timing",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "GracePeriod",
          text: "Grace Period",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Remark",
          text: "Remark",
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
    };
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

  handleRowSelect = (row, isSelect,  rowIndex, e) => {
    this.setState(
      {
        selected: row.Id,
        selectedIndex: rowIndex
      },
      () => {
       // alert(this.state.selected);
        console.log(this.state.selected);
      }
    );
  };

  handleBtnClick = () => {
    this.props.history.push("/editshiftmaster/" + this.state.selected);
  };

  componentDidMount() {
    this.getEmployeeData();
  }

  getEmployeeData() {
    // console.log(`${comfig.apiUrl}/getdepartmentdata`);
    
     console.log("base url===");
     console.log(axios.baseURL);
    axios
      .get(`${axios.baseURL}/ShiftMaster/GetShiftMaster`)
      .then((response) => {
        console.log(response.data.Data);
        let data = response.data.Data;
        this.setState({
          employee: data,
          filterEmployee: data,
        });
      });
  }

  edit = () => {
    if (this.state.selected == null) {
      toast.error("Please Select Row",{position:toast.POSITION.TOP_CENTER});
      return;
    }
    this.setState({ open: true });
    setTimeout(() => {
      this.props.userInfo({
        epmd: this.state.employee[this.state.selectedIndex]["Id"],
      });
    }, 100);
    console.log("From parent access...");
  };
  closeModal2 = () => {
    //console.log("From wwww access...");
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
    console.log("result.value  "+result.value);
    axios
    .post(
      `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=ShiftMaster&ID=${name}`,
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
    let fileName = "Working Master/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.filterEmployee);
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
      "<table> <tr><th>From Time</th><th>To Time</th><th>Total Timing</th><th>IsActive</th><th>Created By</th><th>Created Date</th></tr>";

    for (let i = 0; i < this.state.filterEmployee.length; i++) {
      let employee = this.state.filterEmployee[i];
      table +=
        "<tr><td>" +
        employee.FromTime +
        "</td><td>" +
        employee.ToTime +
        "</td><td>" +
        employee.TotalTiming +
        "</td><td>" +
        employee.GracePeriod +
        "</td><td>" +
        employee.Remark +
        "</td><td>" +
        employee.IsActive +
        "</td><td>" +
        employee.CreatedBy +
        "</td><td>" +
        employee.CreatedDate +
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

  render() {
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    const { open } = this.state;
    const options = {
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
          value: this.state.employee.length,
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
        this.setState({ filterEmployee: this.node.filterContext.data });
      }
      // handle any data change here
    };
    const selectRow = {
      mode: "radio",
      bgColor: "rgb(137 227 242)",
      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          this.handleRowSelect(row, isSelect, rowIndex, e);
          return true; // return false to deny current select action}
        }
      },
    };
    const { user } = this.props;
    console.log({ user });
    console.log({ props: this.props });
    console.log(user.info.username);

    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    // if (user.info && user.info.username) {
    return (
      <div>
        <ToastContainer />
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog col-lg-">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Shift Master</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <AddShiftMasterGrid />
              </div>
            </div>
          </div>
        </div> 

         <Modal open={open} center onClose={this.onCloseModal}>
         <div className="modal-header">
          <h4>Edit Shift Master</h4>
         </div>
          {this.state.employee[this.state.selectedIndex] && (
            <EditShiftMaster
              ShiftMasterId={
                //this.state.employee[this.state.selectedIndex]["Id"]
                  this.state.selected
              }
              closeModal={this.closeModal2}
            />
          )}
        </Modal> 

      

        <div>
          <div style={{ marginTop: 10 }}>
            <div style={{ marginLeft: 5 }}>
              <Gridcontrolbtn
                adddepart={this.state.addshiftmaster}
                sendpid="editshiftmaster"
                sendidtoeditbtn={this.state.selected}
                add={this.add}
                edit={this.edit}
                delete={this.delete}
                exportToExcle={this.exportToExcle}
                printTable={this.printTable}
               // menuId={this.props.menuId}
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
    );
    // }
    // else {
    //   <Redirect to="/sign-in" />;
    // }
  }
}

export default connect((state) => ({
  user: state.user,
}),
{ userInfo }
)(ShiftMasterGrid);


// export default withRouter(Bootstraptab);
