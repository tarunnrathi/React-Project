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
import AddCompanyMaster from "./AddCompanyMaster";
import EditCompanyMaster from "./EditCompanyMaster";
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
class CompanyMasterGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      test: "",
      showEditModal: false,
      employee: [],
      filterdata: [],
      seletedstateid: [],
      editcompany: "editcompany",
      addcompany: "addcompany",
      add: "",
      selected: null,
      columns: [
        {
          dataField: "Id",
          text: "Company Code",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "CompanyName",
          text: "Company Name",
          sort: true,
          filter: textFilter(),
          width: "600",
          headerStyle: (colum, colIndex) => {
            return { width: '500px', textAlign: 'left' };
            }
        },
        {
          dataField: "SName",
          text: "Short Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "StartDt",
          text: "Start Dtate",          
          sort: true,                   
          filter: dateFilter({             
            onFilter: this.myOwnStartDateFilter,
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
        {
          dataField: "EndDt",
          text: "End Date",          
          sort: true,                   
          filter: dateFilter({             
            onFilter: this.myOwnEndDateFilter,
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
        {
          dataField: "Address",
          text: "Address",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "City",
          text: "City",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Country",
          text: "Country",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "PIN",
          text: "PIN",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Phone",
          text: "Phone",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Fax",
          text: "Fax",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Email",
          text: "Email",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "PanNo",
          text: "PanNo",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "TinNo",
          text: "TinNo",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "ParentComp_Code",
          text: "ParentComp_Code",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "GSTNO",
          text: "GSTNO",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "IsActive",
          text: "IsActive",
          sort: true,
          filter: textFilter(),
        },
        
      
      ],
    };
  }

  myOwnStartDateFilter=(filterVal, data)=>{
    debugger   
    if(filterVal.date!=="" && filterVal.comparator!==""){
      switch(filterVal.comparator){
        case "=":
          return filterVal.comparator!==""?
           data.filter(x=>`${('0' + new Date(x.StartDt).getDate()).slice(-2)}/${('0' + ( new Date(x.StartDt).getMonth() + 1)).slice(-2)}/${ new Date( x.StartDt).getFullYear()}`===`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
           :null

        case ">":
          return filterVal.comparator!==""?
          data.filter(item =>new Date(`${("0" + new Date(item.StartDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.StartDt).getMonth()] )}/${ new Date(item.StartDt).getFullYear()}`)>new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))  
           :null 

           case "<":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.StartDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.StartDt).getMonth()] )}/${ new Date(item.StartDt).getFullYear()}`)<new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case ">=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.StartDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.StartDt).getMonth()] )}/${ new Date(item.StartDt).getFullYear()}`)>=new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "!=":
                  return filterVal.comparator!==""?
                  data.filter(x=>`${('0' + new Date(x.StartDt).getDate()).slice(-2)}/${('0' + ( new Date(x.StartDt).getMonth() + 1)).slice(-2)}/${ new Date( x.StartDt).getFullYear()}`!==`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
                  :null 

                  case "<=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.StartDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.StartDt).getMonth()] )}/${ new Date(item.StartDt).getFullYear()}`)<= new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "LIKE":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.StartDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.StartDt).getMonth()] )}/${ new Date(item.StartDt).getFullYear()}`)<=null )
                  :null 

          default :return null;
      }
    }
  }


  myOwnEndDateFilter=(filterVal, data)=>{
    debugger   
    if(filterVal.date!=="" && filterVal.comparator!==""){
      switch(filterVal.comparator){
        case "=":
          return filterVal.comparator!==""?
           data.filter(x=>`${('0' + new Date(x.EndDt).getDate()).slice(-2)}/${('0' + ( new Date(x.EndDt).getMonth() + 1)).slice(-2)}/${ new Date( x.EndDt).getFullYear()}`===`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
           :null

        case ">":
          return filterVal.comparator!==""?
          data.filter(item =>new Date(`${("0" + new Date(item.EndDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.EndDt).getMonth()] )}/${ new Date(item.EndDt).getFullYear()}`)>new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))  
           :null 

           case "<":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.EndDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.EndDt).getMonth()] )}/${ new Date(item.EndDt).getFullYear()}`)<new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case ">=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.EndDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.EndDt).getMonth()] )}/${ new Date(item.EndDt).getFullYear()}`)>=new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "!=":
                  return filterVal.comparator!==""?
                  data.filter(x=>`${('0' + new Date(x.EndDt).getDate()).slice(-2)}/${('0' + ( new Date(x.EndDt).getMonth() + 1)).slice(-2)}/${ new Date( x.EndDt).getFullYear()}`!==`${('0' +new Date( filterVal.date).getDate()).slice(-2)}/${('0' + ( new Date(filterVal.date).getMonth() + 1)).slice(-2)}/${new Date(filterVal.date).getFullYear()}`)
                  :null 

                  case "<=":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.EndDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.EndDt).getMonth()] )}/${ new Date(item.EndDt).getFullYear()}`)<= new Date(`${("0" + new Date(filterVal.date).getDate()).slice(-2)}/${( monthShortNames[ new Date(filterVal.date).getMonth()] )}/${ new Date(filterVal.date).getFullYear()}`))
                  :null 

                  case "LIKE":
                  return filterVal.comparator!==""?
                  data.filter(item =>new Date(`${("0" + new Date(item.EndDt).getDate()).slice(-2)}/${( monthShortNames[ new Date(item.EndDt).getMonth()] )}/${ new Date(item.EndDt).getFullYear()}`)<=null )
                  :null 

          default :return null;
      }
    }
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
    this.props.history.push("/editcompany/" + this.state.selected);
  };

  componentDidMount() {
    this.getcompanyData();
  }

  getcompanyData() {
    axios
      .get(`${axios.baseURL}/CompanyMaster/CompanyMaster`)
      .then((response) => {
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
    
  };

  closeModal2 = () => {
    console.log("From wwww access...");
    this.setState({ open: false });
    this.getcompanyData();
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
      `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=DepartmentMaster&ID=${name}`,
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

    let fileName = "CompanyMaster/" + new Date().getTime();
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
      "<table><tr><th>Company Code</th><th>Company Name</th><th>Short Name</th><th>Start Dtate</th><th>End Date</th><th>Address</th><th>City</th><th>Country</th><th>PIN</th><th>Phone</th><th>Fax</th><th>Email</th><th>PanNo</th><th>TinNo</th><th>ParentComp_Code</th><th>GSTNO</th><th>IsActive</th></tr>";

    for (let i = 0; i < this.state.filterdata.length; i++) {
      let company = this.state.filterdata[i];
      
      table +=
        "<tr><td>" +
        company.Id +
        "</td><td>" +
        company.CompanyName +
        "</td><td>" +
        company.SName +
        "</td><td>" +
        company.StartDt +
        "</td><td>" +
        company.EndDt +
        "</td><td>" +
        company.Address +
        "</td><td>" +
        company.City +
        "</td><td>" +
        company.Country +
        "</td><td>" +
        company.PIN +
        "</td><td>" +
        company.Phone +
        "</td><td>" +
        company.Fax +
        "</td><td>" +
        company.Email +
        "</td><td>" +
        company.PanNo +
        "</td><td>" +
        company.TinNo +
        "</td><td>" +
        company.ParentComp_Code +
        "</td><td>" +
        company.GSTNO +
        "</td><td>" +
        company.IsActive +
        "</td></tr>";
    }

    table += "</table></body></html>";

    console.log("Print==" + table);
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(table);
    printWin.document.close();
    printWin.print();
    // window.print(this.state.company);
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
          <div className="col-lg-10 col-md-10 col-sm-10 col-xs-12 mx-auto">
            <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add Company Master</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <AddCompanyMaster/>
              </div>
            </div>
          </div>
          </div>
        </div> 

         <Modal open={open} center onClose={this.onCloseModal}>
          {this.state.employee[this.state.selectedIndex] && (
            <EditCompanyMaster
              companyId={
                this.state.selected
              }
              closeModal={this.closeModal2}
            />
          )}
        </Modal> 

        {/* <div className="modal fade" id="myEditModal" role="dialog">
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
                  departmentInfo={this.state.company[this.state.selected]}
                />
              </div>
            </div>
          </div>
        </div> */}

        <div>
          <div style={{ marginTop: 10 }}>
            <div style={{ marginLeft: 5 }}>
              <Gridcontrolbtn
                addcompany={this.state.AddCompanyMaster}
                sendpid="editcompany"
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
)(CompanyMasterGrid);
// export default withRouter(Bootstraptab);
