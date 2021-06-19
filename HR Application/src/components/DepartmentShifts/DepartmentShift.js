import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { setMenu } from "../../redux/actions/menu";
import axios from "axios";
import { Redirect } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { userInfo } from "../../redux/actions/user";
import { Form, Input, Label, FormGroup, FormFeedback, Button, radio, type } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

class DepartmentShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      test: "",
      radioShiftSelect: 0,
      dataShiftDefault: 0,
      arrSelectedShift: [],
      showEditModal: false,
      selectedDepartmentId: "",
      selectedDepartmentName:"",
      shiftmaster: [],
      filtershiftmaster: [],
      departmentmaster: [],
      shiftPermission: [],
      IsDisabled:false,
      columns: [
        {
          dataField: "Id",
          text: "Id",
          hidden: false
        },
        {
          dataField: "DepartmentId",
          text: "DepartmentId",
        },
        {
          dataField: "FromTime",
          text: "FromTime",
        },
        {
          dataField: "ToTime",
          text: "ToTime",
        },
        {
          dataField:"IsActive",
          text:"Status"
        },
        {
          dataField: "DefaultShift",
          text: "Default Shift",
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
                debugger;
                var arr = this.state.filtershiftmaster;
                arr.map(item => {
                  Object.assign(item, { DefaultShift: 0 })
                });
                arr[rowIndex].DefaultShift = 1;
                var radioShift = 1

                this.setState({
                  radioShiftSelect: arr[rowIndex].DefaultShift,
                  filtershiftmaster: arr,
                  radioShiftSelect: radioShift,
                });
              }
            }
          },
          formatter: (cell, row, rowIndex) => {
            //  value={row["DefaultShift"]}
            //checked={this.state.radioShiftSelect==row["DefaultShift"]}
            return (
              <Input type="radio" name="DShift"  style={{ marginLeft: 90 }} value={row["DefaultShift"]}  defaultChecked={row["DefaultShift"]===this.state.radioShiftSelect} onChange={this.shiftdefaultChange}  ></Input>
            );
          }
        },
      ],
    }
  }
  shiftdefaultChange = e => {
    debugger;
    const { name, value } = e.target;
    var rchk;
    this.setState({
      dataShiftDefault: 1,
    });
  };
  componentDidMount() {
    debugger;
    const propsStateDepartmentId = this.props.departmentId;
    const propsDepartmentname= this.props.DepartmentName
    if(propsStateDepartmentId > 0)
    {
      this.setState({
        IsDisabled:true,
        selectedDepartmentId:propsStateDepartmentId,
        selectedDepartmentName:propsDepartmentname
      })
    }
    else
    {
      this.setState({
        IsDisabled:false,
      })
    }
    this.getShifttMaster(propsStateDepartmentId);
    this.getDepartmentMaster();
  }
  getDepartmentMaster() {
    var Departmenturl = `${axios.baseURL}/HRAPI/getdepartmentdata`;
    axios.get(Departmenturl).then((res, err) => {
      if (res)
        this.setState({ departmentmaster: res.data.Data });
      if (err)
        console.log("GetCompanyMaster Api err", err);
    });
  }
  getShifttMaster(departmentId) {
    debugger;
    console.log("base url===");
    console.log(axios.baseURL);
    //let DepartmentId=this.state.selectedDepartmentId;
    axios
      .get(`${axios.baseURL}/DepartmentShift/GetDeprtmentShiftmappingById?&Id=` + departmentId)
      .then((response, error) => {
        debugger;
        if (response.data.Status === "1") {
          response.data.Data.map(item => {
            item.DepartmentId > 0 && item.IsActive==='Y' ? Object.assign(item, { ShiftSelected: true }) : Object.assign(item, { ShiftSelected: false });
          });
          var arr = [];
          response.data.Data.filter(arr => arr.DepartmentId > 0 && arr.IsActive === 'Y').map(item => {
            arr.push(item.Id);
          });
          var radioShift;
          response.data.Data.filter(arr => arr.DefaultShift == 1).map(item => {
            radioShift = item.DefaultShift;
          });
          this.setState({
            arrSelectedShift: arr,
            radioShiftSelect: radioShift,
          })
        } else {
          this.setState({
            ...this.state,
            shiftmaster: [],
            filtershiftmaster: [],
          });
        }
        this.setState({
          ...this.state,
          shiftmaster: response.data.Data,
          filtershiftmaster: response.data.Data,
          // arrSelectedShift:response.data.Data.filter(arr=>arr.DepartmentId>0).Id,
        });
      });
  }
  handleRowSelect = (row, isSelect, rowIndex, e) => {
    var mainArray = this.state.filtershiftmaster;
    var foundCompanyRoleItem = mainArray.filter(crItem => crItem.Id == row.Id).map(item => {
      item.ShiftSelected = true;
    });
    console.log("  shiftPermission  == " + foundCompanyRoleItem);
    this.setState(
      {
        ...this.state,
        selected: row.Id,
        selectedIndex: rowIndex,
        filtershiftmaster: mainArray
      },
      () => {
        // alert(this.state.selected);
        console.log(this.state.selected);
      }
    );
    console.log("shiftPermission  " + this.state.shiftPermission);
  };

  handleSubmitHandler = (e) => {
    debugger;
    const { UserId } = this.props;
    var selectedShiftItem = this.state.filtershiftmaster.filter(srItem => srItem.ShiftSelected == true);
    selectedShiftItem.map(item => {
      Object.assign(item, { CreatedBy: this.props.user.info.EmpId });
    })
    selectedShiftItem.filter(arr => arr.DepartmentId === 0).map(item => {
      item.DepartmentId = this.state.selectedDepartmentId
    })
    const IsDefaultShiftSelected = selectedShiftItem.some(item=>item.DefaultShift > 0);
    if(IsDefaultShiftSelected)   {
    var url = `${axios.baseURL}/DepartmentShift/PostDepartmentShif`
    axios
      .post(url, selectedShiftItem)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          console.log(response.data.Message);
          toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });
        }
        else {
          toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
          return;
        }
      });
    }
    else
    {
      toast.error("Please Select Default Shift !",{position: toast.POSITION.TOP_CENTER});
      return;
    }
    console.log(selectedShiftItem);
    console.log("this.state.selectedDepartmentId " + this.state.selectedDepartmentId);
  };
  changeHandler = (e) => {
    debugger;
    var name = e.label;
    var v = e.value;
    console.log("e.value " + e.value);
    this.setState({
      ...this.state,
      selectedDepartmentId: e.value,
    });
    this.getShifttMaster(e.value);
  };
  render() {
    debugger;
    if (this.props.user.info==null) {
      return <Redirect to="/sign-in" />;
    }
    const { selectedDeptId,departmentmaster } = this.state;
    const selectRow = {
      mode: "checkbox",
      bgColor: "#00BFFF",
      hideSelectAll: true,
      selected: this.state.arrSelectedShift,
      onSelect: (row, isSelect, rowIndex, e) => {
        debugger;
        var addIdSelected = this.state.arrSelectedShift;
        var arr = this.state.filtershiftmaster;
        if (isSelect) {
          debugger
          arr[rowIndex].ShiftSelected = true;
          addIdSelected.push(arr[rowIndex].Id);
          this.setState({
            filtershiftmaster: arr,
            arrSelectedShift: addIdSelected,
          });
        }
        else {
          debugger
          let removeIdfromSelect = this.state.arrSelectedShift.filter(srItem => srItem !== arr[rowIndex].Id);
          arr[rowIndex].ShiftSelected = false;
          this.setState({
            filtershiftmaster: arr,
            arrSelectedShift: removeIdfromSelect,
          });
        }
      },
    };
    return (
      <>
        <div className="row" >
          <div className="container">
            <div style={{ padding: 10 }} >
              <Form>
                <FormGroup>
                  <div className="col-md-4" style={{ float: 'left' }}>
                     <Select value={this.state.Id}
                      className="form-control"
                      name="Department"
                      onChange={this.changeHandler}
                      isDisabled={this.state.IsDisabled}
                      options={departmentmaster.map(opt => ({ label: opt.DeptName, value: opt.Id }))}
                      defaultValue={{ label: this.props.DepartmentName , value: this.state.selectedDepartmentId }}
                      >
                    </Select>
                  </div>
                  <div className="col-md-4" style={{ float: "left" }}>
                     <Button variant="primary" size="sm" onClick={this.handleSubmitHandler} >
                      Save
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </div>
            <div className="col-md-12 mx-auto" style={{ float: "left" }}>
              <div className="form-container mt-1 table-responsive">
                <BootstrapTable
                  id="tableData"
                  striped
                  hover
                  keyField="Id"
                  data={this.state.filtershiftmaster}
                  columns={this.state.columns}
                  selectRow={selectRow}
                >
                </BootstrapTable>
                <ToastContainer />
                <div>
                </div>
              </div>
            </div>
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
)(DepartmentShift);
