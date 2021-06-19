import React, { Component } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  dateFilter,
} from "react-bootstrap-table2-filter";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
//import ReactDataGrid from '@inovua/reactdatagrid-community';
//import '@inovua/reactdatagrid-community/index.css';
import { connect } from "react-redux";
import { compPerm } from "../../redux/actions/companyPermission";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';

import {
  Form,
  Label,
  FormGroup,
} from "reactstrap";

var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

class TemporaryGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns1: [
        {
          dataField: "EmpId",
          text: "Employee ID",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: '80px', textAlign: 'center' };
          }
        },

        {
          dataField: "EmpName",
          text: "Employee Name",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: '30%' };
          }
        },
        {
          dataField: "DeptName",
          text: "Department Name",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: '20%' };
          }
        },
        {
          dataField: "ShiftName",
          text: "Shift Name",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: '80px', textAlign: 'center' };
          }
        },
        {
          dataField: "FromTime",
          text: "From Time",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "20%" };
          }
        },
        {
          dataField: "ToTime",
          text: "To Time",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "20%" };
          }
        },
        {
          dataField: "DefaultShift",
          text: "Default Shift",
          sort: true,
          filter: textFilter(),
          headerStyle: () => {
            return { width: "30%" };
          }
        }
      ],
      columns2: [
        {
          name: "ShiftId",
          header: "Shift ID",
          defaultFlex: 1,
          filterTypes: null
        },
        {
          name: "ShiftName",
          header: "Shift Name",
          minWidth: 50, defaultFlex: 1,
          filterTypes: null
        },
        {
          name: "FromTime",
          header: "From Time",
          minWidth: 50, defaultFlex: 1,
          filterTypes: null
        },
        {
          name: "ToTime",
          header: "To Time",
          minWidth: 50, defaultFlex: 1,
          filterTypes: null

        },
        {
          name: "applicableDate",
          header: "Applicable Date",
          minWidth: 50, defaultFlex: 1,
          filterTypes: null,
          rendersInlineEditor: true,
          render: ({ value, cellProps }) => {
            debugger
            let v = cellProps.editProps.inEdit
              ? cellProps.editProps.value
              : value;
            return (
              <div>
                <DatePicker
                  //className="datePick"

                  selected={this.state.startDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={this.onChange}
                  popperModifiers={{
                    flip: {
                      behavior: ['auto'] // don't allow it to flip to be above
                    },
                  }}

                />

              </div>

            )
          }

        }
      ],
      expanded: [],
      Data: [],
      startDate: new Date(),
      activeIndex: null,
      selectedEemployeeId: "",
      dropDownVal: "",
    }
    // this.onChange = this.onChange.bind(this);
  }

  onChange = (date) => {
    debugger
    this.setState(() => ({
      startDate: date
    }))
    //console.log('New Applicable Date=' + date);

  }

  handleOnExpand = (row, isExpand, rowIndex, e) => {
    debugger
    const { s } = this.state.expanded;
    if (isExpand) {
      this.setState(() => ({
        expanded: [row.EmpId],
        activeIndex: null,
        selectedEemployeeId: row.EmpId

      }));
      this.subGridData(row);

    } else {
      this.setState(() => ({
        expanded: this.state.expanded.filter(x => x !== row.EmpId)
      }));
    }
  }

  subGridData = (data) => {
    debugger
    if (data != null) {
      var url = `${axios.baseURL}/EmployeeShift/GetShiftMapWithDepartment_By_DeptIdAndCompanyId?DeptId=` + data.DeptId + `&CompanyId=${this.props.compId}`;
      axios.get(url)
        .then(response => {
          debugger
          if (response.data.Status === "1") {
            this.setState({
              Data: response.data.Data,
            });
          }
        }).catch(error => {
          toast.error(error, { position: toast.POSITION.TOP_CENTER });
        });
    }
  }
  onRowClick = (rowProps) => {
    debugger
    const { p } = this.props;
    const { s } = this.state;
    this.setState(() => ({
      activeIndex: rowProps.rowIndex
    }));

    if (this.props.Mode === "search") {
      var selectedRows = rowProps.data;
      if (selectedRows !== null) {
        if (selectedRows.ShiftId != null) {
          Object.assign(selectedRows, { EmpId: this.state.selectedEemployeeId })
          Object.assign(selectedRows, { EventType: "Individual" });
          Object.assign(selectedRows, { index: rowProps.rowIndex });
          this.props.SaveShiftData(selectedRows);
        }
      }
    }
  }
  changeHandler = (e) => {
    debugger
    const { s } = this.state;
    const { p } = this.props;
    var name = e.target.name;
    var v = e.target.value;
    this.setState(() => ({
      dropDownVal: v
    }));

  }

  saveHandler = (e) => {
    debugger
    if(this.props.Mode!=="Edit"){
    const { s } = this.state;
    const { p } = this.props;
    e.preventDefault();

    if (this.props.Data.length > 0) {
      var finalData = {
        EmpId: this.props.Data[0].EmpId,
        DepartmentId: this.props.Data[0].DepartmentId,
        ShiftId: this.state.dropDownVal,
        CompanyId: this.props.compId,
        RosterId: this.props.SelectedRoster,
        IsActive: 'Y',
        CreatedBy: this.props.user.info.EmpId,
        Applicable_Date: this.state.startDate,
      }
      var arr = new Array();
      arr.push(finalData);
     var url = `${axios.baseURL}/EmployeeShift/PostEmployeeShift?ActionType=Add`;
    // var url=`http://localhost:52227/api/EmployeeShift/PostEmployeeShift?ActionType=Add`;
      
      this.save(url, arr);

    }
  }

  if(this.props.Mode==="Edit"){

    const { s } = this.state;
    const { p } = this.props;
    e.preventDefault();

    if (this.props.Data.length > 0) {
      var finalData = {
        Id:this.props.selected,
        EmpId: this.props.EmpId,
        DepartmentId: this.props.Data[0].DepartmentId,
        ShiftId: this.state.dropDownVal===""?this.props.Data[0].ShiftId:this.props.dropDownVal,
        CompanyId: this.props.compId,
        RosterId: this.props.SelectedRoster===""?this.props.Data[0].RosterId:this.props.SelectedRoster,
        IsActive: 'Y',
        CreatedBy: this.props.user.info.EmpId,
        Applicable_Date: this.state.startDate,
      }
      var arr = new Array();
      arr.push(finalData);     
     var url=`${axios.baseURL}/EmployeeShift/PostEmployeeShift?ActionType=Edit`;
      // var url=`http://localhost:52227/api/EmployeeShift/PostEmployeeShift?ActionType=Edit`;
      this.save(url, arr);
    }

  }


  }

  async save(url, data) {
    debugger

    await axios.post(url, data)
      .then(res => {
        debugger
        if (res.data.Status === "1") {
          toast.success(res.data.Message, { position: toast.POSITION.TOP_CENTER });
        }
        else {
          toast.warn(res.data.Message, { position: toast.POSITION.TOP_CENTER });
        }
      })
      .catch(error => {
        toast.error(error, { position: toast.POSITION.TOP_CENTER });
      });

  }

  render() {
    debugger
    const { p } = this.props;
    //console.log(this.state);

    // if(this.props.Mode==="Edit"){
    //   this.setState(() => ({
    //     startDate: new Date(this.props.Data[0].ApplicableDate)
    //   }))
    // }

    
    const selectRow = {
      mode: "radio",
      bgColor: "rgb(116 236 255)",
      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          debugger
          this.handleRowSelect(row, isSelect, rowIndex, e);
          return true; // return false to deny current select action}
        }
      }
    }

    const checkboxColumn = {
      renderCheckbox: (checkboxProps, cellProps) => {
        const { onChange, checked } = checkboxProps;
        //const background = !checked ? '#313943' : '#7986cb';
        const background = 'white';
        const border = checked === false ? '2px solid #7C8792' : '2px solid #7986CB';

        return (
          <input
            style={{
              cursor: 'pointer',
              background,
              borderRadius: '50%',
              height: '24px',
              width: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border,
              fontSize: 12,
              //color: checked === false ? 'inherit' : '#E8E8E8'
            }}
            type={"checkbox"}
            onChange={(e) => {
              debugger

            }}
            hidden={cellProps.headerCell ? true : false}
          />


        );

      }
    }

    // const expandRow = {
    //   renderer: row => (
    //     <div>
    //       <ReactDataGrid
    //         id="subTableData"
    //         columns={this.state.columns2}
    //         dataSource={this.state.Data}
    //         selected={false}
    //         editable={true}
    //         onRowClick={this.onRowClick}
    //         activeIndex={this.state.activeIndex}
    //         checkboxColumn={checkboxColumn}
    //       //onSelectionChange={this.onSelectionChang}
    //       />
    //     </div>
    //   ),
    //   expanded: this.state.expanded,
    //   onExpand: this.handleOnExpand,
    //   showExpandColumn: true,
    //   expandHeaderColumnRenderer: ({ isAnyExpands }) => {
    //     return isAnyExpands;
    //   }

    // };
    const rowStyle = { backgroundColor: '#c8e6c9', border: '2px solid black' };
    


    return (      
      this.props.Data.length > 0?
        <>
        <div className="card">
          <div className="card-header text-center">
            <strong>Shift Details</strong>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="row mb-2">
                  <div className="col-md-4">
                    <label>Shifts :</label>
                  </div>
                  <div className="col-md-8">
                    <select className="form-control"
                      name="shiftDetails"
                      value={ this.props.Mode==="Edit" && this.props.Data.length>0 && this.state.dropDownVal===""?this.props.Data[0].ShiftId:this.state.dropDownVal}
                      onChange={this.changeHandler}
                    >
                      <option placeholder="" value={""}>Select</option>
                      {this.props.shiftdetails.length > 0 ? this.props.shiftdetails.map(arr => (
                        <option key={arr.ShiftId} value={arr.ShiftId}>{arr.ShiftName + "  -->   " + arr.FromTime + " TO " + arr.ToTime}</option>
                      )) : []}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row mb-2">
                  <div className="col-md-4">
                    <label>Applicable Date :</label>
                  </div>
                  <div className="col-md-8">
                    <DatePicker                    
                      selected={  this.state.startDate }                     
                      dateFormat="dd/MMMM/yyyy hh:mm:ss"
                      onChange={this.onChange}
                      popperModifiers={{
                        flip: {
                          behavior: ['auto'] // don't allow it to flip to be above
                        },
                      }}
                     // minDate={moment().toDate()}
                    // maxDate={moment().toDate()}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <button type="submit" className="btn btn-sm btn-primary" onClick={this.saveHandler}>Save</button>
        </div>

        <div>
          <BootstrapTable
            id="tableData"
            // striped
            keyboardnav
            hover
            keyField="EmpId"
            data={this.props.Data}
            columns={ this.state.columns1}
            // selectRow={selectRow}
            filter={filterFactory()}
            // expandRow={expandRow}
            rowStyle={rowStyle}
            headerClasses="header-class"
          ></BootstrapTable>
        </div>        
      </>
      :null
    )
  }

}

export default connect((state) => ({
  user: state.user,
  compId: state.companyPermission.compperm.CompanyId

}), { compPerm })(TemporaryGrid);