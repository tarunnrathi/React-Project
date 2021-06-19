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

import EditDepartment from "./EditDepartment";
// import { Modal } from "reactstrap";
import "react-responsive-modal/styles.css";

import { Modal } from "react-responsive-modal";

class Bootstraptab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditModal: false,
      employee: [],
      seletedstateid: [],
      editdepartment: "editdepartment",
      adddepartment: "adddepartment",
      add: "",
      selected: "",
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
    axios
      .get("http://115.112.34.123:5252/api/hrapi/getdepartmentdata")
      .then((response) => {
        console.log(response.data.Data);
        this.setState({
          employee: response.data.Data,
        });
      });
  }

  // add(name){
  //   console.log(name);
  // }
  edit = () => {};
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

  render() {
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

    return (
      <>
        {/* <button onClick={this.handleBtnClick}>click</button> */}
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

                {/* <AddDepartment /> */}
              </div>
              {/* <div class="modal-footer">

        </div> */}
            </div>
          </div>
        </div>
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
              />
            </div>
            <BootstrapTable
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
      </>
    );
  }
}
export default Bootstraptab;
