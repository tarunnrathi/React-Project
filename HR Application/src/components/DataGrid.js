import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import filterFactory, {
  textFilter,
  dateFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Gridcontrolbtn from "./gridcontrolbtn";
import AddDepartmentcls from "./AddDepartmentcls";
import EditDepartmentcls from "./EditDepartmentcls";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

var intervalId = "";
class Bootstraptab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "",
      showEditModal: false,
      employee: [],
      seletedstateid: [],
      editdepartment: "editdepartment",
      adddepartment: "adddepartment",
      add: "",
      selected: null,
      columns: [
        {
          dataField: "Id",
          text: "Dept Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DeptName",
          text: "Dept Name",
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
        },
        {
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
      ],
    };
  }

  handleRowSelect = (row, isSelect, e) => {
    this.setState(
      {
        selected: row.Id,
      },
      () => {
        // alert(this.state.selected);
        console.log(this.state.selected);
      }
    );
  };
  handleBtnClick = () => {
    this.props.history.push("/editdepartment/" + this.state.selected);
  };

  componentDidMount() {
    this.getEmployeeData();
  }

  getEmployeeData() {
    axios
      .get("http://115.112.34.123:5252/api/hrapi/getdepartmentdata")
      .then((response) => {
        console.log(response.data.Data);
        this.setState({
          employee: response.data.Data,
        });
      });
  }

  edit = () => {
    console.log(
      "144==" + this.state.selected + " " + typeof this.state.selected
    );
    if (this.state.selected == null) {
      // alert("")
      return;
    }
    this.setState({ open: true });
    setTimeout(() => {
      this.setState({ test: "" });
    }, 100);
    console.log("From parent access...");
  };
  closeModal2 = () => {
    console.log("From wwww access...");
    this.setState({ open: false });
    this.getEmployeeData();
  };
  delete(name) {
    console.log(name);
    axios
      .post(
        `http://10.1.1.189:5252/api/HRAPI/PostDepartmentVisbileByID?Id=${name}`,
        this.state
      )

      .then((response) => {
        console.log(response);
      });
    // console.log(user);
    // history.push("/datagrid");
  }

  exportToExcle = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let fileName = "Department/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.employee);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  printTable = () => {
    let table = "";

    table +=
      "<table><tr><th>Dept Id</th><th>Dept Name</th><th>Status</th><th>Created By</th><th>Created Date</th><th>ModifyBy</th><th>Modified Date</th></tr>";

    for (let i = 0; i < this.state.employee.length; i++) {
      let employee = this.state.employee[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.DeptName +
        "</td><td>" +
        employee.IsActive +
        "</td><td>" +
        employee.CreatedBy +
        "</td><td>" +
        employee.CreatedDate +
        "</td><td>" +
        employee.ModifyBy +
        "</td><td>" +
        employee.ModifiedDate +
        "</td></tr>";
    }

    table += "</table>";

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
          value: 10,
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
    const selectRow = {
      mode: "radio",
      bgColor: "#00BFFF",

      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          this.handleRowSelect(row, isSelect, e);
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
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog col-lg-">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add Department</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <AddDepartmentcls />
              </div>
            </div>
          </div>
        </div>

        <Modal open={open} center onClose={this.onCloseModal}>
          {this.state.employee[this.state.selected] && (
            <EditDepartmentcls
              departmentId={this.state.employee[this.state.selected]["Id"]}
              closeModal={this.closeModal2}
            />
          )}
          
        </Modal>
        <div className="modal fade" id="myEditModal" role="dialog">
          <div className="modal-dialog col-lg-">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Edit Department</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <EditDepartmentcls
                  closeModal={this.closeModal}
                  departmentInfo={this.state.employee[this.state.selected]}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ marginTop: 20 }}>
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
}))(Bootstraptab);
// export default withRouter(Bootstraptab);
