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
import DepartmentShiftt from "./DepartmentShift";
//import EditDepartmentcls from "./EditDepartmentcls";
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
//import Loading from 'react-loading';
var intervalId = "";
class DepartmentShiftGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      test: "",
      showEditModal: false,
      DepartmentShift: [],
      filterdata: [],
      seletedstateid: [],
      editdepartment: "editdepartment",
      adddepartment: "adddepartment",
      add: "",
      selected: null,
      selectedDepartmentName: "",
      isDataFetched: false,
      columns: [
        {
          dataField: "Id",
          text: "Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DepartmentId",
          text: "Dept Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DepartmentName",
          text: "Dept Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "ShiftId",
          text: "Shift Id",
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
          dataField: "IsActive",
          text: "Status",
          sort: true,
          filter: textFilter()
        }

      ],
    };
  }
  handleRowSelect = (row, isSelect, rowIndex, e) => {
    console.log("row.departmentId===", row.departmentId);
    console.log("Id===", row.Id);
    debugger;
    this.setState(
      {
        selected: row.DepartmentId,
        selectedDepartmentName: row.DepartmentName,
        selectedIndex: rowIndex,
      },
      () => {
        // alert(this.state.selected);
        console.log(this.state.selected);
      }
    );
  };

  handleBtnClick = () => {
    //this.props.history.push("/editdepartment/" + this.state.selected);
  };

  componentDidMount() {
    if(this.props.user.info!=null){
      console.log("Datagrid cdm ", this.props.user.info.CompanyId);
      this.getDepartmentShiftData();
    }    
  }

  getDepartmentShiftData() {
    debugger;
    //  console.log(`${comfig.apiUrl}/getdepartmentdata`);
    console.log("base url===");
    console.log(axios.baseURL);
    axios
      .get(`${axios.baseURL}/DepartmentShift/GetDepartmentShif`)
      .then((response) => {
        console.log(response.data.Data);
        let data = response.data.Data;
        this.setState({
          DepartmentShift: data,
          filterdata: data,
          isDataFetched: true
        });
      });
  }

  edit = () => {
    if (this.state.selected == null) {
      toast.error("Please Select Row", { position: toast.POSITION.TOP_CENTER });
      //alert("Please Select Row");
      return;
    }
    this.setState({ open: true });
    setTimeout(() => {
      this.props.userInfo({
        epmd: this.state.DepartmentShift[this.state.selectedIndex]["Id"],
      });
    }, 100);
    // let interValId = setInterval(() => {
    //   this.props.userInfo({
    //     epmd: this.state.DepartmentShift[this.state.selectedIndex]["Id"],
    //   });
    //   clearInterval(interValId);
    // }, 100);
  };

  closeModal2 = () => {
    console.log("From wwww access...");
    this.setState({ open: false });
    this.getDepartmentShiftData();
  };

  delete = (name) => {
    debugger;
    console.log(name);
    if (this.state.selected == null) {
      alert("Please Select Row");
      return;
    }
    axios
      .post(
        `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=DepartmentMaster&ID=${name}`,
        this.state
      )
      .then((response) => {
        console.log(response);
      });
  };

  exportToExcle = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let fileName = "Department/" + new Date().getTime();
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
      "<table><tr><th>Id</th>" +
      "<th>Dept Id</th>" +
      "<th>Dept Name</th>" +
      "<th>ShiftId</th>" +
      "<th>From Time</th>" +
      "<th>To Time</th></tr>";

    for (let i = 0; i < this.state.filterdata.length; i++) {
      let DepartmentShift = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        DepartmentShift.Id +
        "</td><td>" +
        DepartmentShift.DepartmentId +
        "</td><td>" +
        DepartmentShift.DepartmentName +
        "</td><td>" +
        DepartmentShift.ShiftId +
        "</td><td>" +
        DepartmentShift.FromTime +
        "</td><td>" +
        DepartmentShift.ToTime +
        "</td></tr>";
    }

    table += "</table></body></html>";

    console.log("Print==" + table);
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(table);
    printWin.document.close();
    printWin.print();
    // window.print(this.state.DepartmentShift);
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
  _setTableOption() {
    if (this.state.isDataFetched) {
      return "No Record Found";
    }
    // else{
    //   return(
    //     <RefreshIndicator size={40} left={0} top={0} status="loading" style={{position: 'relative', margin: '0px auto'}}/>
    //   );
    // }
  }
  render() {
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    let tableOtions = {
      noDataText: this._setTableOption(),
    };
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
          value: this.state.DepartmentShift.length,
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
      bgColor: "rgb(116 236 255)",
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

    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    // if (user.info && user.info.username) {
    return (
      <div>
        <ToastContainer />
        <div className="modal fade" id="myModal" role="dialog">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mx-auto">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4>Add Department Shift</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                    </button>
                </div>
                <div className="modal-body">
                  <DepartmentShiftt
                    departmentId={
                      0
                    }
                    DepartmentName={
                      ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mx-auto">
          <Modal open={open} center onClose={this.onCloseModal}>
            <div className="modal-header">
              <h4>Edit Department Shift</h4>
            </div>
            {this.state.DepartmentShift[this.state.selected] && (
              <DepartmentShiftt
                departmentId={
                  this.state.selected
                }
                DepartmentName={
                  this.state.selectedDepartmentName
                }
                closeModal={this.closeModal2}
              />
            )}
          </Modal>
        </div>
        <div>
          <div style={{ marginTop: 10 }}>
            <div style={{ marginLeft: 5 }}>
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
              hover
              keyField="Id"
              data={this.state.DepartmentShift}
              columns={this.state.columns}
              selectRow={selectRow}
              filter={filterFactory()}
              pagination={paginationFactory(options)}
              options={this.tableoptions}
              
            ></BootstrapTable>
          </div>
        </div>
      </div>
    );

  }


}
export default connect((state) => ({
  user: state.user,
}),
  { userInfo }
)(DepartmentShiftGrid);
