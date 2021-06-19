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
import AddSanctionedPost from "./AddSanctionedPost";
import EditSanctionedPost from "./EditSanctionedPost";
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

var intervalId = "";
class SanctionedPostGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      test: "",
      showEditModal: false,
      employee: [],
      filterdata: [],
      seletedstateid: [],
      editSanctionedPost: "editSanctionedPost",
      addSanctionedPost: "addSanctionedPost",
      add: "",
      selected: null,
      columns: [
        {
          dataField: "Id",
          text: "Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DepartmentId",
          text: "Department Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DeptName",
          text: "Deptpartment Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DesignitionId",
          text: "Designition Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DesigName",
          text: "Designation Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "SanctionedPost",
          text: "Sanctioned Post",
          sort: true,
          filter: textFilter(),
        },
        
        {
          dataField: "IsActive",
          text: "Is Active",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CreatedBy",
          text: "Created By",
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
       //alert(this.state.selected);
        console.log(this.state.selected);
      }
    );
  };

  handleBtnClick = () => {
    this.props.history.push("/editSanctionedPost/" + this.state.selected);
  };

  componentDidMount() {
    this.getEmployeeData();
  }

  getEmployeeData() {
    axios
      .get(`${axios.baseURL}/SanctionedPost/GetSanctionedPost`)
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
   // console.log("From parent access...");
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
      `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=SanctionedPost&ID=${name}`,
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

    let fileName = "SanctionedPost/" + new Date().getTime();
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
      "<table classname='table table-bordered'}><tr><th>Id</th><th>Department Id</th><th>Department Name</th><th>Designition Id</th><th>Designation Name</th><th>Is Active</th><th>Created By</th></tr>";

    for (let i = 0; i < this.state.filterdata.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.DepartmentId +
        "</td><td>" +
        employee.DeptName +
        "</td><td>" +
        employee.DesignitionId +
        "</td><td>" +
        employee.DesigName +
        "</td><td>" +
        employee.IsActive +
        "</td><td>" +
        employee.CreatedBy +
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
                <h4>Add Sanctioned Post</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <AddSanctionedPost /> 
              </div>
            </div>
          </div>
        </div>
        </div>

        <Modal open={open} center onClose={this.onCloseModal}>
        <div className="modal-header">
                <h4>Edit Sanctioned Post</h4>

              </div>
          {this.state.employee[this.state.selectedIndex] && (
            <EditSanctionedPost
            EditSanctionedPost={
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
                AddSanctionedPost={this.state.AddSanctionedPost}
                sendpid="editSanctionedPost"
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
              keyBoardNav
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
export default connect((state) => ({
  user: state.user,
}),
{ userInfo }
)(SanctionedPostGrid);

// export default connect((state) => ({
//   user: state.user,
// }))(WorkingLocationGrid);
