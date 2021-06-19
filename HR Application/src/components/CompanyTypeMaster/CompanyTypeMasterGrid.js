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
import AddCompanyTypeMaster from "./AddCompanyTypeMaster";
import EditCompanyTypeMaster from "./EditCompanyTypeMaster";
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


var intervalId = "";

class CompanyTypeMasterGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      test: "",
      showEditModal: false,
      employee: [],
      filterdata: [],
      seletedstateid: [],
      add: "",
      selected: null,
      columns: [
        {
          dataField: "Id",
          text: " Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CompTypeCode",
          text: "Company Type Code",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CompTypeName",
          text: "Company Type Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "IsActive",
          text: "Is Active",
          sort: true,
          filter: textFilter(),
        }
      ],
    };
  }

  handleRowSelect = (row, isSelect, rowIndex, e) => {
    this.setState(
      {
        selected: row.Id,
        selectedIndex: rowIndex,
      },
      () => {
        // alert(this.state.selected);
        console.log(this.state.selected);
      }
    );
  };


  componentDidMount() {
    this.getEmployeeData();
  }

  getEmployeeData() {
    axios   
      .get(`${axios.baseURL}/CompanyTypeMaster/GetCompanyTypeMaster`)
      .then((response) => {
        console.log("data---------  ")
        console.log(response.data.Data);
        let data = response.data.Data;
        this.setState({
          employee: data,
          filterdata: data,
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
    console.log("DELETE")
    console.log(name);
    axios
      .post(
        `http://10.1.1.189:5252/api/HRAPI/PostVisbileByID_TableName?TableName=DepartmentMaster&ID=${name}`,
        this.state
      )
      .then((response) => {
        console.log(response);
      });
  }
  exportToExcle = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let fileName = "CompanyTypeMaster/" + new Date().getTime();
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
      "<table classname='table table-bordered'}><tr><th>Id</th><th>Employee Type Code</th><th>Employee Type Name</th><th>IsActive</th></tr>";
    
    for (let i = 0; i < this.state.filterdata.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.CompTypeCode +
        "</td><td>" +
        employee.CompTypeName +
        "</td><td>" +
        employee.IsActive +
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

  render() {
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
          value: this.state.employee.length,
        },
      ],
      sizePerPage: 5,
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

    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    return (
      <>
      <ToastContainer />
         <div className="modal fade" id="myModal" role="dialog">
         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mx-auto">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add Company Type Code</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                 <AddCompanyTypeMaster />  
              </div>
            </div>
          </div>
        </div>
        </div>

        <Modal open={open} center onClose={this.onCloseModal}>
        <div className="modal-header">
                <h4>Edit Company Type Master</h4>
                
              </div>
           {this.state.employee[this.state.selectedIndex] && (
            <EditCompanyTypeMaster
            EditCompanyTypeMasterId={
                this.state.selected
              }
              closeModal={this.closeModal2}
            />
          )}  
        </Modal>


        <div>
          <div style={{ marginTop: 20 }}>
            <div style={{ marginLeft: 5 }}>
              <Gridcontrolbtn
                sendidtoeditbtn={this.state.selected}
                add={this.add }
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
              keyboardnav
              keyField="Id"
              data={this.state.employee}
              columns={this.state.columns}
              selectRow={selectRow}
              filter={filterFactory()}
              pagination={paginationFactory(options)}
            ></BootstrapTable>
          </div>
        </div>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
}),
{ userInfo }
)(CompanyTypeMasterGrid);

