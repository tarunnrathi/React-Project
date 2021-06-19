import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Gridcontrolbtn from "../../components/gridcontrolbtn"
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
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { setMenu } from "../../redux/actions/menu";
import { userInfo } from "../../redux/actions/user";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ToastContainer, toast } from 'react-toastify';
import LeaveUI from './LeaveUI'
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Moment from 'moment'


var intervalId = "";
class LeaveEntry extends Component {
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
          sort: true,
          filter: textFilter()
        },
        {
          dataField: "emp_id",
          text: "emp_id",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "20%" };
          }
        },
        {
          dataField: "f_date",
          text: "f_date",
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
            dataField: "t_date",
            text: "t_date",
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
            dataField: "reason",
            text: "Reason",
            sort: true,
            filter: textFilter()
          },
          {
            dataField: "no_of_days",
            text: "no_of_days",
            sort: true,
            filter: textFilter()
          },
          {
            dataField: "leave_type",
            text: "leave_type",
            sort: true,
            filter: textFilter()
          },
          {
            dataField: "status",
            text: "status",
            sort: true,
            filter: textFilter()
          },
          {
            dataField: "entrydate",
            text: "entrydate",
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
      employee: [],
      filterdata: [],
      pageName: "Leave",
      selectRow: [],
      selectedRow: {},
      Mode: "",
      ModeText: "",
      selectOptions: [],
      isLoading: true,
      company: []

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

  componentWillUnmount() {
    this._isMounted = false;
  }
  authenticate(){
    return new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds
  }
  componentDidMount() {

    this.authenticate().then(() => {
        const ele = document.getElementById('ipl-progress-indicator')
        if(ele){
          
          ele.classList.add('available')
          setTimeout(() => {
            ele.outerHTML = ''
          }, 2000)
        }
      })
    this._isMounted = true;
    debugger
    
   //var url = `${axios.baseURL}/EmployeeMaster/GetEmployees`;
   
   var url=`${axios.baseURL}/Leave/GetLeaveByEmpId?id=`+this.props.user.info.EmpId
   this.getEmployeeLeaveData(url);
  }
  getEmployeeLeaveData(url) {
    debugger
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
  }

  add = (open) => {
    debugger;
    this.setState({
      open: open,
      Mode: "Add",
      ModeText: "Add Leave"
    });


  };
  edit = () => {
    debugger;
    if (this.state.selected == null) {
      toast.error("Please Select Row", { position: toast.POSITION.TOP_CENTER });
      return;
    }
    this.setState({ open: true, Mode: "Edit", ModeText: "Edit Leave" });
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
            `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=Leave&ID=${name}`,
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

    let fileName = "Leave/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.filterdata);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  printTable = () => {
    let table = "";
    table += "<html><head></head><body><style>";
    table += "table , th, td {border: 1px solid black;}</style>";
    table +=
      "<table><tr><td colspan='8' style='text-align:center;'>Leave Details </td></tr><tr><th>Id</th><th>EmployeeId</th><th>FromDate</th><th>ToDate</th><th>No of days</th><th>Leave Type</th><th>Reason</th><th>EntryDate</th></tr>";
    for (let i = 0; i < this.state.filterdata.length; i++) {
      let employee = this.state.filterdata[i];
      table +=
        "<tr><td>" +
        employee.Id +
        "</td><td>" +
        employee.emp_id +
        "</td><td>" +
        Moment(employee.f_date).format('DD-MM-YYYY') +  
        "</td><td>" +
        Moment(employee.t_date).format('DD-MM-YYYY') +
        "</td><td>" +
        employee.no_of_days +
        "</td><td>"+
        employee.leave_type+
        "</td><td>"+
        employee.reason+
        "</td><td>"+
        employee.entrydate+
        "</td></tr>";
    }
    table += "</table></body></html>";
    console.log("Print==" + table);
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(table);
    printWin.document.close();
    printWin.print();
    
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
                  <h4>Add Leave</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                </button>
                </div>
                <div className="modal-body">
                  <LeaveUI Id="0" Mode="Add" />
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
          <Modal open={open} center onClose={this.onCloseModal}>
            <div className="modal-header">
              <h4>Edit Leave</h4>
            </div>
            {this.state.selected && (
              <LeaveUI
                Id={
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
        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Leave</h3>
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
                            remote
                            condensed

                          ></BootstrapTable>
                        ) :
                          <Loader type="Bars" color="#00BFFF" height={80} width={80} />
                        }
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
}), { setMenu, userInfo })(LeaveEntry);


