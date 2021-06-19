import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Gridcontrolbtn from "../../components/gridcontrolbtn";
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
import AdjustLeave from "./AdJustLeave"
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { setMenu } from "../../redux/actions/menu";
import { userInfo } from "../../redux/actions/user";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Moment from 'moment'
import { components } from 'react-select';
import { FormSelect } from 'materialize-css';
import { TextField, Select,NativeSelect, MenuItem, FormLabel, InputLabel, FormControlLabel,FormHelperText, Switch, RadioGroup, Radio, FormControl } from '@material-ui/core'

import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";

import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class LeaveSettlementEntry extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }
  getInitialState = () => ({
    data: {
      Id: 0,
      emp_id: "",
      yearNo: "",
      monthNo: "",
      reason: "",
      no_of_days: "",
      LeaveType: "",
      selectedIndex: 0,
      editdepartment: "editdepartment",
      adddepartment: "adddepartment",
      add: "",
      selected: null,
      isDataFetched: false,
    },
    arrSelectedLeave: [],
    button:1,
    ddlLeaveType:"",
    show:false,
    AdjustId:"",
    EmpId:"",
    EmpCode:"",
    disp: "none",
    Employeedata: [],
    attandenceData:[],
    LeaveAdjustedData:[],
    LeaveAdjustedfilterdata:[],
    LeaveAdjustedcolumns:[
      {
        dataField: "Id",
        text: "Id",
        sort: true,
        filter: textFilter()
      },
     {
        dataField: "emp_id",
        text: "EmpCode",
        sort: true,
        filter: textFilter()
      },
      {
        dataField: "f_date",
        text: "from date",
        sort: true,
        filter: textFilter(),
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
        dataField: "t_date",
        text: "to date",
        sort: true,
        filter: textFilter(),
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
        dataField: "reason",
        text: "reason",
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
        text: "leave type",
        sort: true,
        filter: textFilter()
        },

        {
          text: "Action",
          editor: {
          value: 'Y:N',
          },
          events: {
            onClick: (e, column, columnIndex, row, rowIndex) => {
              if (row.ShiftSelected == false) {
                toast.error("Please select checkbox!", { position: toast.POSITION.TOP_CENTER });
                return true;
              }
              else {
                
              }
            }
          },
          formatter: (cell, row, rowIndex) => {
            return (
           <Button className="btn btn-primary btn-block" type="submit" onClick={() => (this.DeleteAdjustLeaveHandler(row))}  >
           Delete
           </Button>
            );
          }
        },
        {
          dataField: "status",
          text: "status",
          hidden:true,
          sort: true,
          filter: textFilter()
        },
        {
          dataField: "entrydate",
          text: "Entrydate",
          editable:false,
          hidden:true,
          sort: true,
          filter: textFilter()
        },
        {
          dataField: "flag",
          text: "flag",
          hidden:true,
          sort: true,
          filter: textFilter()
        },
    ],
    isLoading: false,
    isLoading2: false,
    IsHalfDay: false,
    errors: {},
    manualErrors: {},
    columns:[
      {
        dataField: "Id",
        text: "Id",
        sort: true,
        filter: textFilter()
      },
     {
        dataField: "emp_id",
        text: "EmpCode",
        sort: true,
        filter: textFilter()
      },
      {
        dataField: "f_date",
        text: "from date",
        sort: true,
        filter: textFilter(),
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
        dataField: "t_date",
        text: "to date",
        sort: true,
        filter: textFilter(),
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
        dataField: "reason",
        text: "reason",
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
        text: "leave type",
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            debugger;
            var pp=e;
            if (row.LeaveSelected == false) {
             var leavType=e.target.value;
             var arrAttend = this.state.attandenceData;
             arrAttend.filter(arr => arr.Id == row.Id).map(item => {
                item.leave_type=leavType;
              });
              this.setState({
                ...this.state,
               attandenceData: arrAttend,
             });
              toast.error("Please select checkbox!", { position: toast.POSITION.TOP_CENTER });
              return true;
            }
            else {
              debugger;
             var leavType=e.target.value;
             var arrAttend = this.state.attandenceData;
             arrAttend.filter(arr => arr.Id == row.Id).map(item => {
                item.leave_type=leavType;
              });
              this.setState({
                ...this.state,
               attandenceData: arrAttend,
             });
            }
          }
        },  
        formatter: (cell, row, rowIndex) => {
          debugger;
          return (
<div className="dropdown">
<Select defaultValue={'SelectLeave'} id="selectLeave" name="ddlLeaveType"  style={{width:'100%'}}
                onChange={this.ddlchangeHandler}><MenuItem value={"0"}>Select Leave</MenuItem>
                {
                  this.state.LeaveTypeData.map((hmenu) => (
                    <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.LeaveType}</MenuItem>
                  ))
  }
 </Select>
      </div>
          );
        }
        },
      {
        text: "Action",
        editor: {
        value: 'Y:N',
        },
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            if (row.ShiftSelected == false) {
              toast.error("Please select checkbox!", { position: toast.POSITION.TOP_CENTER });
              return true;
            }
            else {
              // debugger;
              // var arr = this.state.filtershiftmaster;
              // arr.map(item => {
              //   Object.assign(item, { DefaultShift: 0 })
              // });
              // arr[rowIndex].DefaultShift = 1;
              // var radioShift = 1

              // this.setState({
              //   radioShiftSelect: arr[rowIndex].DefaultShift,
              //   filtershiftmaster: arr,
              //   radioShiftSelect: radioShift,
              // });
            }
          }
        },
        formatter: (cell, row, rowIndex) => {
          return (
         <Button className="btn btn-primary btn-block" type="submit" onClick={() => (this.adjustSubmitModelHandler(row))}  >
         Adjust
         </Button>
          );
        }
      },
      {
        dataField: "status",
        text: "status",
        hidden:true,
        sort: true,
        filter: textFilter()
      },
      {
        dataField: "entrydate",
        text: "Entrydate",
        editable:false,
        hidden:true,
        sort: true,
        filter: textFilter()
      },
      {
        dataField: "flag",
        text: "flag",
        hidden:true,
        sort: true,
        filter: textFilter()
      },
    ],
    LeaveTypeData: [
      { Id: "CL", LeaveType: "CL" },
      { Id: "EL", LeaveType: "EL" },
      { Id: "OD", LeaveType: "OD" },
      { Id: "LWP", LeaveType: "LWP" },
      { Id: "RH", LeaveType: "RH" },
      { Id: "CL2", LeaveType: "CL2" },
      { Id: "EL2", LeaveType: "EL2" }
    ],
    MonthData: [
      { Id: "1", MonthType: "JAN" },
      { Id: "2", MonthType: "FEB" },
      { Id: "3", MonthType: "March" },
      { Id: "4", MonthType: "April" },
      { Id: "5", MonthType: "May" },
      { Id: "6", MonthType: "June" },
      { Id: "7", MonthType: "July" },
      { Id: "8", MonthType: "August" },
      { Id: "9", MonthType: "September" },
      { Id: "10", MonthType: "October" },
      { Id: "11", MonthType: "November" },
      { Id: "12", MonthType: "December" }],
   
    YearData: [
      { Id: "2020", YearType: "2020" },
      { Id: "2021", YearType: "2021" }],
      expanded:""
  });
  adjustSubmitModelHandler =(e) =>{
    debugger;
    this.setState({
      ...this.state,
      show : true,
      AdjustId:e.Id,
      EmpId:e.emp_id,
    })
      }
      DeleteAdjustLeaveHandler =(e) => {
        debugger;
        var ID = e.Id;
        if(ID > 0){
          this.delete(ID);

        }



      }
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
                `${axios.baseURL}/HRAPI/PostVisbileByID_TableName?TableName=LeaveAdjustment&ID=${name}`,
               this.state)
              .then((response) => {
                      this.loadLeaveAdjused();
              });
            Swal.fire(
              'Press OK to back',
              'The post has been deleted',
              'success'
            ).then(() => {
        
            })
          }
        })
    
    
      };

  ddlchangeHandler =(e) => {
    debugger;
    this.setState({
      ...this.state,
      [e.target.name]:e.target.value,
    })
  }
  handleChange = (panel) => (event, isExpanded) => {
    var panelname;
    if(isExpanded){
  panelname=panel;
    }
    else{
      panelname=false
    }
    this.setState({
      ...this.state,
      expanded:panelname
    })
 };
  changeHandler = (e) => {
    debugger;
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
    });
  };
  submitHandler =(e)=>{
    debugger;
    e.preventDefault();



    if (this.state.button === 1) {
      this.setState({
        ...this.state,
        isLoading:true,
        isLoading2:true,
      })
      this.loadUser();
      this.loadLeaveAdjused();
    }
    if (this.state.button === 2) {
      debugger;
      this.setState({
        ...this.state,
        isLoading2:true,
      })
      var {p}=this.state;
      var selectedLeaveItem = this.state.attandenceData.filter(srItem => srItem.LeaveSelected == true);
      var url =  `${axios.baseURL}/Leave/PostLeaveAdjustment`
    axios
      .post(url, selectedLeaveItem)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          console.log(response.data.Message);
          this.loadLeaveAdjused();
          toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });
        }
        else {
          toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
          return;
        }
      });
      
    }
  }
  loadLeaveAdjused = async () => {
  
      debugger;
      const result = await axios.get(
        `${axios.baseURL}/Leave/GetLeaveAdjustedByEmpIdYearMonth?empCode=${this.state.EmpCode}&yearNo=${this.state.data.yearNo}&monthNo=${this.state.data.monthNo}`
      )
      .then((response,err)=>{
        if (response.data.Status === '1') {
          console.log(response.data.Message);
          
          this.setState({
            ...this.state,
            LeaveAdjustedData: response.data.Data,
            LeaveAdjustedfilterdata: response.data.Data,
            isLoading2: false,
          })
        }
        else {
          debugger;
          this.setState({ 
            ...this.state,
            LeaveAdjustedData: [],
            isLoading2: false,
           });
      }
     });
    };
  loadUser = async () => {
    debugger;
    const result = await axios.get(
      `${axios.baseURL}/Leave/GetLeaveByEmpIdYearMonth?empCode=${this.state.EmpCode}&yearNo=${this.state.data.yearNo}&monthNo=${this.state.data.monthNo}`
    )
    .then((response,err)=>{
      if (response.data.Status === '1') {
        console.log(response.data.Message);
        response.data.Data.map(item => {
          Object.assign(item, { LeaveSelected: false }) 
        });
        this.setState({
          ...this.state,
          attandenceData: response.data.Data,
          filterdata: response.data.Data,
          isLoading: false,
        })
      }
      else {
        debugger;
        this.setState({
           ...this.state,
           attandenceData: [],
           isLoading: false,
           });
    }
   });
  };
  componentWillReceiveProps(nextProps) {
    debugger;
    if (this.props !== nextProps) {
      let EmpId = nextProps.EmpId;
      let Mode = nextProps.Mode;
      if (Mode === "Add") {
        debugger;
        this.setState({
          ...this.state,
          isLoading: false,
       })
      }
      else
        if (EmpId >= 0) {
          this.setState({
            ...this.state,
            EmpCode: EmpId,
          })
        }
    }
  }
  handleSearchChange = (searchText, colInfos, multiColumnSearch) => {
    alert("11");
    console.log("Data filter====");
  };
  handleRowSelect = (row, isSelect, rowIndex, e) => {
     console.log("Id===", row.Id);
    debugger;
    this.setState(
      {
        selected: row.Id,
        selectedIndex: rowIndex,
      },
      () => {
         console.log(this.state.selected);
      }
    );
  };
  onSelectAll = (isSelected) => {
    debugger;
 if (isSelected) {
          debugger
          var arrData=this.state.attandenceData;
          arrData.map(item => {
      item.LeaveSelected = true
    })
          this.setState({
             ...this.state,
            attandenceData: arrData,
          });
        }
        else {
          debugger
          var arrData=this.state.attandenceData;
          arrData.map(item => {
      item.LeaveSelected = false
    })
          this.setState({
             ...this.state,
            attandenceData: arrData,
          });
        }
  }
  onCloseModal = () => {
    debugger;
    this.setState({ show: false });
    this.loadLeaveAdjused();
  };
  render() {
    
    const { errors,manualErrors,open,show } = this.state;
    const options = {
      onSearchChange: this.handleSearchChange,
      page: 1,
      sizePerPageList: [
        // {
        //   text: "5",
        //   value: 5,
        // },
        // {
        //   text: "10",
        //   value: 10,
        // },
        {
          text: "5",
          value: 5,
        },
        {
          text: "All",
          value: this.state.attandenceData != null ? this.state.attandenceData.length : 0,
        },
      ],
      sizePerPage: 5,
      pageStartIndex: 1,
      paginationSize: 1,
      prePage: "Prev",
      nextPage: "Next",
      firstPage: "First",
      lastPage: "Last",
    };

    const LeaveAdjustedoptions = {
      onSearchChange: this.handleSearchChange,
      page: 1,
      sizePerPageList: [
        // {
        //   text: "5",
        //   value: 5,
        // },
        // {
        //   text: "10",
        //   value: 10,
        // },
        {
          text: "5",
          value: 5,
        },
        {
          text: "All",
          value: this.state.LeaveAdjustedData != null ? this.state.LeaveAdjustedData.length : 0,
        },
      ],
      sizePerPage: 5,
      pageStartIndex: 1,
      paginationSize: 1,
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
      mode: "checkbox",
      bgColor: "#00BFFF",
      onSelectAll:this.onSelectAll,
      onSelect: (row, isSelect, rowIndex, e) => {
        debugger;
        var addIdSelected = this.state.arrSelectedLeave;
        var arr = this.state.attandenceData;
        if (isSelect) {
          debugger
          arr[rowIndex].LeaveSelected = true;
          addIdSelected.push(arr[rowIndex].Id);
          this.setState({
            attandenceData: arr,
            arrSelectedLeave: addIdSelected,
          });
        }
        else {
          debugger
          let removeIdfromSelect = this.state.arrSelectedLeave.filter(srItem => srItem !== arr[rowIndex].Id);
          arr[rowIndex].LeaveSelected = false;
          this.setState({
            attandenceData: arr,
            arrSelectedLeave: removeIdfromSelect,
          });
        }
      },
    
    };
    const onDataSizeChangeAdjusted = (dataSize) => {
      console.log("cunt==" + dataSize);
      console.log(JSON.stringify(dataSize));
      if (this.node && this.node.filterContext && this.node.filterContext) {
        this.setState({ LeaveAdjustedfilterdata: this.node.filterContext.data });
      }
      
    };
    return (
      <>
<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mx-auto"  key="8" >
  <Modal open={show} center onClose={this.onCloseModal} style={{width:'100% !immportant'}}>
         <div className="modal-header"  key="9" >
           <h4>Leave Adjustment</h4>
         </div>
         {this.state.AdjustId && (
         <AdjustLeave Id={this.state.AdjustId} EmpId={this.state.EmpId} Mode={"Edit"} closeModal={this.closeModal2}
              />
            )}
       </Modal>
   </div>
 <div > 
        <Form onSubmit={this.submitHandler} >
        <div className="row">
          <div className="col-md-3"  >
              <FormLabel component="legend">Month</FormLabel>
              <Select defaultValue={'SelectMonth'} id="selectMonth" name="monthNo"  style={{width:'100%'}}
                onChange={this.changeHandler}><MenuItem value={"0"}>Select Month</MenuItem>
                {
                  this.state.MonthData.map((hmenu) => (
                    <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.MonthType}</MenuItem>
                  ))
                }
              </Select>
            </div>
            <div className="col-md-3" >
              <FormLabel component="legend">Year</FormLabel>
              <Select defaultValue={'SelectYear'} id="selectYear" name="yearNo" style={{width:'100%'}}
                onChange={this.changeHandler}><MenuItem value={"0"}>Select Year</MenuItem>
                {
                  this.state.YearData.map((hmenu) => (
                    <MenuItem key={hmenu.Id} value={hmenu.Id}>{hmenu.YearType}</MenuItem>
                  ))
                }
              </Select>
            </div>
            <div className="col-md-3" style={{margin:'4% 0%'}}>
          
              <Button className="btn btn-primary btn-block" type="submit" onClick={() => (this.state.button = 1)}>
                Get Details
          </Button>   
         
            </div>
            <div className="col-md-3" style={{margin:'4% 0%'}} > 
            <Button className="btn btn-primary btn-block" type="submit" onClick={() => (this.state.button = 2)}>
                Approves
          </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
            
            {this.state.isLoading == false ? (
                         <BootstrapTable
                            ref={(n) => (this.node = n)}
                            onDataSizeChange={onDataSizeChange}
                            id="tableData"
                            striped
                            hover
                            keyField="Id"
                            data={this.state.attandenceData}
                            columns={this.state.columns}
                            selectRow={selectRow}
                            filter={filterFactory()}
                            pagination={paginationFactory(LeaveAdjustedoptions)}
                            ></BootstrapTable>
            ):
            <Loader type="Puff" color="#00BFFF" height={100} width={100} /> 
          }

            </div>
          </div>
        </Form>
      
      <div className="row">
            <div className="col-md-12">
            {this.state.isLoading2 == false ? (
            <BootstrapTable
                            ref={(n) => (this.node = n)}
                            onDataSizeChange={onDataSizeChangeAdjusted}
                            id="tableDataLeave"
                            striped
                            hover
                            keyField="Id"
                            data={this.state.LeaveAdjustedData}
                            columns={this.state.LeaveAdjustedcolumns}
                            filter={filterFactory()}
                            pagination={paginationFactory(options)}
            ></BootstrapTable>
            ):
            <Loader type="Puff" color="#00BFFF" height={100} width={100} /> 
          }
            </div>
          </div>
 
    </div>
      </>
    )
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(LeaveSettlementEntry);