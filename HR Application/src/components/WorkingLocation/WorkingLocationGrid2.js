import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axiosConfig from '../axiosconfig';
import axios from "axios";
import filterFactory, {
  textFilter,
  dateFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory ,{ PaginationProvider, PaginationListStandalone } from "react-bootstrap-table2-paginator";
import Gridcontrolbtn from "../gridcontrolbtn";
import AddWorkLocation from "./AddWorkLocation";
import EditWorkLocation from "./EditWorkingLocation";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { userInfo } from "../../redux/actions/user";

var intervalId = "";
class WorkingLocationGrid2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sizePerPage: 10,
      selectedIndex: 0,
      test: "",
      showEditModal: false,
      employee: [],
      filterdata: [],
      seletedstateid: [],
      editDesignation: "editworkinglocation",
      adddesignation: "addworkinglocation",
      add: "",
      data: employee.slice(0, 10),
      selected: null,
      columns: [
        {
          dataField: "Id",
          text: "Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "LocationName",
          text: "Location Name",
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

  handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      this.setState(() => ({
        page,
        data: employee.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage
      }));
    }, 2000);
  }

  handleBtnClick = () => {
    this.props.history.push("/editWorkingLocation/" + this.state.selected);
  };

  componentDidMount() {
    this.getEmployeeData();
  }

  getEmployeeData() {
    axios   
      .get(`${axios.baseURL}/HRAPI/GetWorkLocation`)
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
      alert("Please Select Row");
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
    if (name == null) {
      alert("Please Select Row");
      return;
    }
    console.log("DELETE")
    console.log(name);
    //alert("Delete"+name);
    axios
      .post(
        `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=WorkingLocationMaster&ID=${name}`,
        this.state )
      .then((response) => {
        window.location.reload(true);
        console.log(response);
      });
  }

  exportToExcle = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let fileName = "Worklocation/" + new Date().getTime();
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
      "<table classname='table table-bordered'}><tr><th>Dept Id</th><th>Designation Name</th><th>Status</th><th>Created By</th><th>Created Date</th><th>ModifyBy</th><th>Modified Date</th></tr>";
    
    for (let i = 0; i < this.state.filterdata.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.LocationName +
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
  handleSearchChange = (searchText, colInfos, multiColumnSearch) => {
    alert("11");
    console.log("Data filter====");
  };

  render() {
    const { data, sizePerPage, page } = this.state;
    const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
        <div>
          <PaginationProvider
            pagination={
              paginationFactory({
                custom: true,
                page,
                sizePerPage,
                totalSize
              })
            }
          >
            {
              ({
                paginationProps,
                paginationTableProps
              }) => (
                <div>
                  <div>
                    <p>Current Page: { paginationProps.page }</p>
                    <p>Current SizePerPage: { paginationProps.sizePerPage }</p>
                  </div>
                  <div>
                    <PaginationListStandalone
                      { ...paginationProps }
                    />
                  </div>
                  <BootstrapTable
                    remote
                    keyField="id"
                    data={ data }
                    columns={ columns }
                    onTableChange={ onTableChange }
                    { ...paginationTableProps }
                  />
                </div>
              )
            }
          </PaginationProvider>
        </div>
      );
      
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
    };
    const { user } = this.props;
    console.log({ user });
    console.log({ props: this.props });

    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    return (
      <>
       <RemotePagination
        data={ data }
        page={ page }
        sizePerPage={ sizePerPage }
        totalSize={ employee.length }
        onTableChange={ this.handleTableChange }
      />
         <div className="modal fade" id="myModal" role="dialog">
         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 mx-auto">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add Working Location</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
               <AddWorkLocation />
              </div>
            </div>
          </div>
        </div>
        </div>

        <Modal open={open} center onClose={this.onCloseModal}>
        <div className="modal-header">
                <h4>Edit Working Location</h4>
                
              </div>
          {this.state.employee[this.state.selectedIndex] && (
            <EditWorkLocation
            WorkingLocation={
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
                AddWorkLocation={this.state.AddWorkLocation}
                sendpid="editworkinglocation"
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
              remote
              keyField="Id"
              data={this.state.employee}
              columns={this.state.columns}
              onTableChange={ onTableChange }
              { ...paginationTableProps }
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
)(WorkingLocationGrid2);

// export default connect((state) => ({
//   user: state.user,
// }))(WorkingLocationGrid);
