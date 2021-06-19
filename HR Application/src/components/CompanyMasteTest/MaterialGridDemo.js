import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Header from '../Header';
import "react-responsive-modal/styles.css";
import { setMenu } from "../../redux/actions/menu";
import { userInfo } from "../../redux/actions/user";
import MaterialTable from 'material-table';
import CsvBuilder from 'csv-builder';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { components } from 'react-select';
import {GroupcsvExportWithZeroColumn,GroupcsvExportWithOneColumn,GroupcsvExportWithTwoColumn,GroupcsvExportWithThreeColumn,GroupcsvExportWithFourColumn,GroupcsvExportWithFiveColumn,groupBy,exportCSVFile} from './MaterialGridExport'

var intervalId = "";
class MaterialGridDemo extends Component {
    _isMounted = false;
    constructor(props) {
      debugger;
      super(props);
      this.state = {
        selectedUserId: "",
        selected: null,
        open: false,
        //PIN:"",
        Materialcolumn: [
          { title: 'Id', field: 'Id' },
          { title: 'CompanyName', field: 'CompanyName' },
          { title: 'SName', field: 'SName' },
          { title: 'StartDt', field: 'StartDt' },
          { title: 'EndDt', field: 'EndDt' },
          { title: 'Address', field: 'Address' },
          { title: 'City', field: 'City' },
          { title: 'Country', field: 'Country' },
          { title: 'PIN', field: 'PIN'},
          { title: 'Phone', field: 'Phone' },
          { title: 'Fax', field: 'Fax' },
          { title: 'Email', field: 'Email' },
          { title: 'PanNo', field: 'PanNo' },
          { title: 'TinNo', field: 'TinNo' },
          { title: 'TinDate', field: 'TinDate' },
          { title: 'ParentComp_Code', field: 'ParentComp_Code' },
          { title: 'GSTNO', field: 'GSTNO' },
          { title: 'IsActive', field: 'IsActive' }
  
        ],
              
        company: []
  
      }
     
    }
    // changeHandler = (e) => {
    //     this.setState({
    //         ...this.state,
    //         [e.target.name]: e.target.value,
    //      });
    //   };
  
    componentWillUnmount() {
      this._isMounted = false;
  
    }
    getCompanyMaster() {
        debugger;
      axios
        .get(`${axios.baseURL}/CompanyMaster/CompanyMaster`)
        .then((response) => {
          console.log(response.data.Data);
          let data = response.data.Data;
          this.setState({
            company: data,
  
          });
        });
    }
    componentDidMount() {
      this._isMounted = true;
  
      debugger
      this.getCompanyMaster();
     
  
    }
      
    menuClick = (menuId) => {
      debugger
      console.log("Menu id== for parent" + menuId);
      // this.setState({ selectedMenuId: menuId });
      this.props.setMenu(menuId);
    };
    
    render() {
      const exportPdf = (allColumn, allData, grouping) => {
        debugger;
        var printWin = window.open("", "");
        printWin.document.open();
        printWin.document.write('pdf');
        printWin.document.close();
        printWin.print();
      }
        const exportCsv = (allColumns, allData) => {
        debugger;
        var groupColName="PIN";
        const columns = allColumns.filter(columnDef => columnDef["export"] !== false);
        const columnsf = allColumns.filter(columnDef => columnDef.hidden == true);
        const columnst = allColumns.filter(columnDef => columnDef.hidden !== true);
        const exportedData = allData.map(rowData => columns.map(columnDef => rowData[columnDef.field]));
        var ExportdataType = Array.isArray(exportedData);
        var nogroup = false, Group1 = false, Group2 = false, Group3 = false, Group4 = false, Group5 = false
      Group1 = allData[0].hasOwnProperty("groups");
      if (Group1 == true) {
        var Group1length = allData[0].groups.length;
        if (Group1length>0) {
          Group2 = allData[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group2 == true) {
        var Group2length = allData[0].groups[0].groups.length;
        if(Group2length>0){
        Group3 = allData[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group3 == true) {
        var Group3length = allData[0].groups[0].groups[0].groups.length;
        if(Group3length>0){
        Group4 = allData[0].groups[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group4 == true) {
        var Group4length = allData[0].groups[0].groups[0].groups[0].groups.length;
        if(Group4length>0){
        Group5 = allData[0].groups[0].groups[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group5 == true) {
        debugger;
        GroupcsvExportWithFiveColumn(columnst, allData, columnsf,groupColName)
        return;
      }
     if (Group4 == true) {
        debugger;
        GroupcsvExportWithFourColumn(columnst, allData, columnsf,groupColName)
        return;
      }
      if (Group3 == true) {
        debugger;
        GroupcsvExportWithThreeColumn(columnst, allData, columnsf,groupColName);
        return;
      }
      if (Group2 == true) {
        GroupcsvExportWithTwoColumn(columnst, allData, columnsf,groupColName);
        return;
      }
      if (Group1 == true) {
        GroupcsvExportWithOneColumn(columnst, allData, columnsf,groupColName);
        return;
      }
      if (Group1==false) {
        GroupcsvExportWithZeroColumn(columnst, allData, columnsf,groupColName);
        return;
      }
      }
  
      const { user } = this.props;
      console.log({ user });
      console.log({ props: this.props });
  
      if (user.info && !user.info.username) {
        return <Redirect to="/sign-in" />;
      }
      const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
      };
  
  
      return (
        <>
         
  
          <Header props={this.props} menuClick={this.menuClick} />
          <main role="main">
            <ol className="ddhead mb-1">
              <li className="breadcrumb-item active text-dark">
                <h3>Material-table Export With Grouping </h3>
              </li>
            </ol>
            <div className="row">
              <div className="col-md-12" style={{ padding: 5 }}>
                <main role="main">
                  <div className="row">
                    <div className="container">
                      <div className="col-md-12 mx-auto">
                        <div className="form-container mt-2 loader" >
                                                
                          <MaterialTable
                            icons={tableIcons}
                            title="Material Group Export "
                            columns={this.state.Materialcolumn}
                            data={this.state.company}
                            options=
                            {{
                              search: true,
                              grouping: true,
                              exportButton: true,
                              columnsButton: true,
                              filtering: true,
                              sorting:false,
                              exportCsv,
                              exportPdf,
                              pageSize: 10,
                              pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
                              toolbar: true,
                              paging: true
  
                              //exportAllData: true,
                             
  
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
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
  }), { setMenu, userInfo })(MaterialGridDemo);
  
  
  