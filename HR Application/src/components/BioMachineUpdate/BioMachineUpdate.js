import React, { Component,Suspense } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import filterFactory, {
  textFilter,  
  dateFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Gridcontrolbtn from "../gridcontrolbtn";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { setMenu } from "../../redux/actions/menu";
import { userInfo } from "../../redux/actions/user";
import { ToastContainer, toast } from 'react-toastify';
import BioMachineUpdateUI from './BioMachineUpdateUI';
import Swal from 'sweetalert2';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ErrorBoundry from '../../components/ErrorBoundry/ErrorBoundry';

import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                      ];


class BioMachineUpdate extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {      
      selected: "",
      open: false,
      columns: [
        {
          dataField: "Biomachinupdateid",
          text: "Id",
          hidden: true,
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "7%" };
          }
        },
        {
          dataField: "Cardno",
          text: "Card No",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "7%" };
          }
        },
        {
          dataField: "Isfp",
          text: "IsFp",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "7%" };
          }
        },
        {
          dataField: "iscard",
          text: "IsCard",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "isnew",
          text: "IsNew",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "isupdate",
          text: "IsUpdate",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "isdeletefp",
          text: "isDeleteFp",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "isdeleteuser",
          text: "IsDeleteUser",
          sort: true,
          filter: textFilter(),
        },
        {
            dataField: "isblockuser",
            text: "IsBlockUser",
            sort: true,
            filter: textFilter(),
        },
        {
            dataField: "isunblockuser",
            text: "isUnBlockuser",
            sort: true,
            filter: textFilter(),
        },
        {
            dataField: "Createdate",
            text: "Create Date",
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
        {
            dataField: "Createby",
            text: "Create By",
            sort: true,
            filter: textFilter(),
        },
        {
            dataField: "Modifyby",
            text: "Modify By",
            sort: true,
            filter: textFilter(),
        },
        {
            dataField: "Modifydate",
            text: "Modify Date",
            sort: true,
            filter: textFilter(),
        }
                
      ],
      employee: [],      
      Mode: "Add", 
      addOpened: true,
      editdata:{},     
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

  handleRowSelect = (row, isSelect, rowIndex, e) => {
    debugger;
    this.setState(
      {        
        selected: row.Biomachinupdateid,        
      },      
    );
  };
  

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    debugger
    this._isMounted = true;
    var url = `http://localhost:52227/api/BioMachineUpdate/GetBioMachineUpdate`;

   // var url = `${axios.baseURL}/BioMachineUpdate/GetBioMachineUpdate`;

    axios.get(url)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          this.setState({
            employee: response.data.Data,            
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
      ModeText: "Add Employee"
    });
  };

  edit = () => {
    debugger;
    if (this.state.selected ==="") {
      toast.error("Please Select Row", { position: toast.POSITION.TOP_CENTER });
      return;
    }    
    var url = `http://localhost:52227/api/BioMachineUpdate/GetBioMachineUpdateByBiomachinupdateid?Biomachinupdateid=${this.state.selected}`;
   // var url = `http://localhost:52227/api/MachineMaster/GetMachineMaster_ById?Id=${this.state.selected}`;   
    //var url = `${axios.baseURL}/BioMachineUpdate/GetBioMachineUpdateByBiomachinupdateid?Biomachinupdateid=${this.state.selected}`;

    axios.get(url)
    .then((res) => {
      debugger
      if (res.data.Status === "1") {            
        this.setState(()=>({ 
          editdata: res.data.Data,          
          Mode: "Edit",
          open: true
        }));
      }
    }).catch(error => {
      alert(error);
    });

  };

  onCloseModal = () => {
    debugger;
    if (this.state.Mode === "Edit") {
      this.setState({ open: false, Mode: "Add" });
    }

    if (this.state.Mode === "Add") {
      var addOpened = this.state.addOpened
      this.setState({ addOpened: !addOpened });
    }
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
            `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=EmployeeShift&Id=${name}`,
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
    let fileName = "MachineMaster/" + new Date().getTime();
    const ws = XLSX.utils.json_to_sheet(this.state.employee);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  printTable = () => {
    let table = "";
    table += "<html><head></head><body><style>";
    table += "table, th, td {border: 1px solid black;} </style>";

    table +=
      "<table><tr><th>Id</th><th>Employee Name</th><th>Department Name</th><th>Shift Name</th><th>Company Name</th><th>Roster</th><th>IsActive</th><th>CreatedBy</th><th>Created date</th></tr>";

    for (let i = 0; i < this.state.employee.length; i++) {
      let employee = this.state.employee[i];
      table +=
        "<tr><td>" +
        employee.ID +
        "</td><td>" +
        employee.MachineAlias +
        "</td><td>" +
        employee.ConnectType +
        "</td><td>" +
        employee.IP +
        "</td><td>" +
        employee.SerialPort +
        "</td><td>" +
        employee.Port +
        "</td><td>" +
        employee.MachineNumber +
        "</td><td>" +
        employee.Enabled +
        "</td><td>" +
        employee.CommPassword +
        "</td></tr>"+
        employee.ProductType +
        "</td></tr>"+
        employee.sn +
        "</td></tr>"
    }

    table += "</table></body></html>";

    console.log("Print==" + table);
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(table);
    printWin.document.close();
    printWin.print();    
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
    if (this.props.user.info == null) {
      return <Redirect to="/sign-in" />;
    }
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
          debugger
          this.handleRowSelect(row, isSelect, rowIndex, e);
          return true; // return false to deny current select action}
        }
      },
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect) {
          return [0];
        }
      }
    };
    const { user } = this.props;
    if (user.info && !user.info.username) {
      return <Redirect to="/sign-in" />;
    }
    return (
      <>

        <ToastContainer />  
        {this.state.Mode === "Add" && (
          <div className="modal fade" id="myModal" role="dialog">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    {this.state.Mode === "Add" ?
                      <h4>Add In Bio Machine</h4> : <h4>Edit In Bio Machine</h4>}

                    <button type="button" className="close" data-dismiss="modal" onClick={this.onCloseModal}>
                      &times;
                </button>
                  </div>
                  <div className="modal-body">
                    <Suspense fallback={<div> Loading...</div>}>                      
                        <BioMachineUpdateUI Mode={this.state.Mode} addOpened={this.state.addOpened} onCloseModal={this.onCloseModal} compId={`${this.props.comp.compperm.CompanyId}`} />  
                    </Suspense>    
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mx-auto">
          <Modal open={open} center onClose={this.onCloseModal}>
            <div className="modal-header">
              <h4>Edit Bio Machine </h4>
            </div>
            {this.state.selected && (
              <Suspense fallback={<div> Loading...</div>}>
                 <BioMachineUpdateUI Mode={this.state.Mode} addOpened={this.state.addOpened}  onCloseModal={this.onCloseModal} editdata={this.state.editdata} selected={this.state.selected}  />
              </Suspense>              
            )}
          </Modal>
        </div>

        <main role="main">
          <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Bio Machine Update</h3>
            </li>
          </ol>
          <Suspense fallback={<div> Loading...</div>}>
            
          <div className="row" key={"id"}>
            <div className="col-md-12" style={{ padding: 5 }}>
              <main role="main">
                <div className="row">
                  <div className="container">
                    <div className="col-md-12 mx-auto">
                      <div className="form-container mt-2 loader" >
                        <div style={{ padding: 10, marginLeft: 5 }}>

                        <ErrorBoundry>
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
                        </ErrorBoundry>

                          
                        </div>
                        <ErrorBoundry>
                        <div className="table-responsive">
                        
                        <BootstrapTable
                            ref={(n) => (this.node = n)}
                            onDataSizeChange={onDataSizeChange} 
                            id="tableData"
                            striped
                            keyboardnav
                            hover
                            keyField="ID"
                            data={this.state.employee}
                            columns={this.state.columns}
                            selectRow={selectRow}
                            filter={filterFactory()}
                            pagination={paginationFactory(options)}
                            
                          ></BootstrapTable>
                        </div>
                        </ErrorBoundry>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </Suspense>         
        </main>
      </>
    );

  }
}
export default connect((state) => ({
  user: state.user,
  comp: state.companyPermission
}), { setMenu, userInfo })(BioMachineUpdate);


