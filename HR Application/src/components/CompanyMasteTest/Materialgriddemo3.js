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
import { GroupcsvExportWithZeroColumn,GroupcsvExportWithOneColumn,GroupcsvExportWithTwoColumn, GroupcsvExportWithThreeColumn, GroupcsvExportWithFourColumn, GroupcsvExportWithFiveColumn, groupBy, exportCSVFile } from './MaterialGridExportWithExcel'
import {GroupPdfExportWithZeroColumn,GroupPdfExportWithOneColumn,GroupPdfExportWithTwoColumn, GroupPdfExportWithThreeColumn, GroupPdfExportWithFourColumn, GroupPdfExportWithFiveColumn} from './MaterialGridExportWithPrint'
var intervalId = "";
class Materialgriddemo3 extends Component {
  _isMounted = false;
  constructor(props) {
    debugger;
    super(props);
    this.state = {
      selectedUserId: "",
      selected: null,
      open: false,
     Materialcolumn: [
        { title: 'Id', field: 'Id' },
        { title: 'Module_Id', field: 'Module_Id' },
        { title: 'PageName', field: 'PageName' },
        { title: 'Directory', field: 'Directory' },
        { title: 'DisplayName', field: 'DisplayName' },
        { title: 'DisplayYN', field: 'DisplayYN' },
        { title: 'Img', field: 'Img' },
        { title: 'Parent_Id', field: 'Parent_Id' },  
        { title: 'Level_Idx', field: 'Level_Idx' },
        { title: 'Idx', field: 'Idx' },
        { title: 'Parent_Parent_Id', field: 'Parent_Parent_Id' },
        { title: 'Viwe_Index', field: 'Viwe_Index' },
        { title: 'CreatedBy', field: 'CreatedBy' },
        { title: 'CreatedDate', field: 'CreatedDate' },
        { title: 'ModifyBy', field: 'ModifyBy' },
        { title: 'ModifiedDate', field: 'ModifiedDate' },
      ],
     
     PageMast: [],
     Company: {
      CompanyCode: "",
      CompanyName: "",
      SName: "",
      Address: "",
      City: "",
      PIN: "",
      GSTNO: "",
    }
    }

  }

  componentWillUnmount() {
    this._isMounted = false;

  }
  getCompany() {
    debugger;
    var CompanyCode = this.props.comp.compperm.CompanyId
    axios
      .get(`${axios.baseURL}/CompanyMaster/GetCompanyMasterById?id=${CompanyCode}`)
      .then((response) => {
        console.log('response.data.Data' + response.data.Data[0]);
        let data = response.data.Data[0];
        this.setState(
          {
            Company: {
              CompanyCode: data.CompanyCode,
              CompanyName: data.CompanyName,
              SName: data.SName,
              Address: data.Address,
              City: data.City,
              PIN: data.PIN,
              GSTNO: data.GSTNO
            }
          }, () => {
            
          }
        );
      });
  }
  getPageMaster() {
    debugger;
    axios
      .get(`${axios.baseURL}/PageMast/GetPageMast`)
      .then((response) => {
        console.log(response.data.Data);
        let data = response.data.Data;
        this.setState({
            PageMast: data,

        });
      });
  }
  componentDidMount() {
    this._isMounted = true;
    debugger
    this.getPageMaster();
    this.getCompany();
  }

  menuClick = (menuId) => {
    debugger
    console.log("Menu id== for parent" + menuId);
    // this.setState({ selectedMenuId: menuId });
    this.props.setMenu(menuId);
  };
  excelCompanyHeader=(colspanlength) => {
    var companyInfo = this.state.Company;
    var TopHeader = '<table><tr><td style="font-weight:bold;font-size:16" colspan=4>GSTNO:' + companyInfo.GSTNO + ' </td><td style="text-align:center;font-weight:bold;font-size:16" colspan=' + colspanlength + '>' + companyInfo.CompanyName + '</td></tr>'
    TopHeader += '<tr><td colspan=4></td><td style="text-align:center;font-weight:bold;font-size:14" colspan=' + colspanlength + '>' + companyInfo.SName + '</td></tr>'
    TopHeader += '<tr><td colspan=4></td><td style="text-align:center;font-weight:bold;font-size:14" colspan=' + colspanlength + '>' + companyInfo.Address + '</td></tr>'
    TopHeader += '<tr><td colspan=4></td><td style="text-align:center;font-weight:bold;font-size:14" colspan=' + colspanlength + '>' + companyInfo.City + '-' + companyInfo.PIN + '</td></tr></table>'
    return TopHeader;
  }
  pdfCompanyHeader=(colspanlength)=> {
   var companyInfo = this.state.Company;
   var TopHeader = '<tr><td style="font-weight:bold;font-size:16" colspan=4>GSTNO:' + companyInfo.GSTNO + ' </td><td style="text-align:center;font-weight:bold;font-size:16" colspan=' + colspanlength + '>' + companyInfo.CompanyName + '</td></tr>'
   TopHeader += '<tr><td colspan=4></td><td style="text-align:center;font-weight:bold;font-size:14" colspan=' + colspanlength + '>' + companyInfo.SName + '</td></tr>'
   TopHeader += '<tr><td colspan=4></td><td style="text-align:center;font-weight:bold;font-size:14" colspan=' + colspanlength + '>' + companyInfo.Address + '</td></tr>'
   TopHeader += '<tr><td colspan=4></td><td style="text-align:center;font-weight:bold;font-size:14" colspan=' + colspanlength + '>' + companyInfo.City + '-' + companyInfo.PIN + '</td></tr>'
   return TopHeader;
  }

  render() {
    const exportPdf = (allColumns, allData) => { //for Pdf Print
      debugger;
      var groupColName = ["Parent_Id","Level_Idx","Idx","Viwe_Index"];
      var ReportTitle = 'Menu Master Report'
      const columns = allColumns.filter(columnDef => columnDef["export"] !== false);
      const columnsf = allColumns.filter(columnDef => columnDef.hidden == true);
      const columnst = allColumns.filter(columnDef => columnDef.hidden !== true);
      const exportedData = allData.map(rowData => columns.map(columnDef => rowData[columnDef.field]));
      var ExportdataType = Array.isArray(exportedData);
      var nogroup = false, Group1 = false, Group2 = false, Group3 = false, Group4 = false, Group5 = false
      Group1 = allData[0].hasOwnProperty("groups");
      if (Group1 == true) {
        var Group1length = allData[0].groups.length;
        if (Group1length > 0) {
          Group2 = allData[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group2 == true) {
        var Group2length = allData[0].groups[0].groups.length;
        if (Group2length > 0) {
          Group3 = allData[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group3 == true) {
        var Group3length = allData[0].groups[0].groups[0].groups.length;
        if (Group3length > 0) {
          Group4 = allData[0].groups[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group4 == true) {
        var Group4length = allData[0].groups[0].groups[0].groups[0].groups.length;
        if (Group4length > 0) {
          Group5 = allData[0].groups[0].groups[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group5 == true) {
        // var addtotal = 0;
        // var addAvg = 0;
        // var addCount = 0;
        var collength2 = Number(columnst.length) - 1;
        var TopHeader=this.pdfCompanyHeader(collength2);
        GroupPdfExportWithFiveColumn(columnst, allData, columnsf, groupColName, ReportTitle, TopHeader) //addtotal, addAvg, addCount,
        return;
      }
      if (Group4 == true) {
        // var addtotal = 0;
        // var addAvg = 0;
        // var addCount = 0;
        var collength2 = Number(columnst.length) - 2;
        var TopHeader=this.pdfCompanyHeader(collength2);
        GroupPdfExportWithFourColumn(columnst, allData, columnsf, groupColName, ReportTitle, TopHeader) //addtotal, addAvg, addCount,
        return;
      }
      if (Group3 == true) {
        // var addtotal = 0;
        // var addAvg = 0;
        // var addCount = 0;
        var collength2 = Number(columnst.length) - 3;
        var TopHeader=this.pdfCompanyHeader(collength2);
        GroupPdfExportWithThreeColumn(columnst, allData, columnsf, groupColName, ReportTitle, TopHeader);  //addtotal, addAvg, addCount,
        return;
      }
      if (Group2 == true) {
        // var addtotal = 0;
        // var addAvg = 0;
        // var addCount = 0;
        var collength2 = Number(columnst.length) - 4;
        var TopHeader=this.pdfCompanyHeader(collength2);
        GroupPdfExportWithTwoColumn(columnst, allData, columnsf, groupColName, ReportTitle, TopHeader); //addtotal, addAvg, addCount,
        return;
      }
      if (Group1 == true) {
        // var addtotal = 0;
        // var addAvg = 0;
        // var addCount = 0;
        var collength2 = Number(columnst.length) - 5;
        var TopHeader=this.pdfCompanyHeader(collength2);
        GroupPdfExportWithOneColumn(columnst, allData, columnsf, groupColName, ReportTitle, TopHeader); //addtotal, addAvg, addCount,
        return;
      }
      if (Group1 == false) {
        debugger;
        var addtotal = 1;
        var addAvg = 0;
        var addCount = 0;
        var collength2 = Number(columnst.length) - 6;
        var TopHeader=this.pdfCompanyHeader(collength2);
        GroupPdfExportWithZeroColumn(columnst, allData, columnsf, groupColName,addtotal, addAvg, addCount, ReportTitle, TopHeader); 
        return;
      }

    }


    const exportCsv = (allColumns, allData) => {    // For Excel Export
      debugger;
      var groupColName = ["Parent_Id","Level_Idx","Idx","Viwe_Index"];
      var ReportTitle = 'Menu Master Report'
      const columns = allColumns.filter(columnDef => columnDef["export"] !== false);
      const columnsf = allColumns.filter(columnDef => columnDef.hidden == true);
      const columnst = allColumns.filter(columnDef => columnDef.hidden !== true);
      const exportedData = allData.map(rowData => columns.map(columnDef => rowData[columnDef.field]));
      var ExportdataType = Array.isArray(exportedData);
      var nogroup = false, Group1 = false, Group2 = false, Group3 = false, Group4 = false, Group5 = false
      Group1 = allData[0].hasOwnProperty("groups");
      if (Group1 == true) {
        var Group1length = allData[0].groups.length;
        if (Group1length > 0) {
          Group2 = allData[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group2 == true) {
        var Group2length = allData[0].groups[0].groups.length;
        if (Group2length > 0) {
          Group3 = allData[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group3 == true) {
        var Group3length = allData[0].groups[0].groups[0].groups.length;
        if (Group3length > 0) {
          Group4 = allData[0].groups[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group4 == true) {
        var Group4length = allData[0].groups[0].groups[0].groups[0].groups.length;
        if (Group4length > 0) {
          Group5 = allData[0].groups[0].groups[0].groups[0].groups[0].hasOwnProperty("groups");
        }
      }
      if (Group5 == true) {
        var addtotal = 0;
        var addAvg = 0;
        var addCount = 0;
        var collength2 = Number(columnst.length) - 1;
        var TopHeader = this.excelCompanyHeader(collength2);
        GroupcsvExportWithFiveColumn(columnst, allData, columnsf, groupColName, ReportTitle,TopHeader) //addtotal, addAvg, addCount,
        return;
      }
      if (Group4 == true) {
        var addtotal = 0;
        var addAvg = 0;
        var addCount = 0;
       var collength2 = Number(columnst.length) - 2;
       var TopHeader = this.excelCompanyHeader(collength2);
       GroupcsvExportWithFourColumn(columnst, allData, columnsf, groupColName, ReportTitle,TopHeader) //addtotal, addAvg, addCount,
        return;
      }
      if (Group3 == true) {
        var addtotal = 0;
        var addAvg = 0;
        var addCount = 0;
        var collength2 = Number(columnst.length) - 3;
        var TopHeader = this.excelCompanyHeader(collength2);
        GroupcsvExportWithThreeColumn(columnst, allData, columnsf, groupColName, ReportTitle,TopHeader); //addtotal, addAvg, addCount,
        return;
      }
      if (Group2 == true) {
        var addtotal = 0;
        var addAvg = 0;
        var addCount = 0;
        var collength2 = Number(columnst.length) - 4;
        var TopHeader = this.excelCompanyHeader(collength2);
        GroupcsvExportWithTwoColumn(columnst, allData, columnsf, groupColName, ReportTitle,TopHeader); //addtotal, addAvg, addCount,
        return;
      }
      if (Group1 == true) {
        var addtotal = 0;
        var addAvg = 0;
        var addCount = 0;
        var collength2 = Number(columnst.length) - 5;
        var TopHeader = this.excelCompanyHeader(collength2);
        
        GroupcsvExportWithOneColumn(columnst, allData, columnsf, groupColName, ReportTitle,TopHeader); //addtotal, addAvg, addCount,
        return;
      }
      if (Group1 == false) {
        debugger;
        var addtotal = 1;
        var addAvg = 0;
        var addCount = 0;
        var collength2 = Number(columnst.length) - 6;
        var TopHeader = this.excelCompanyHeader(collength2);
        GroupcsvExportWithZeroColumn(columnst, allData, columnsf, groupColName, addtotal, addAvg, addCount, ReportTitle, TopHeader);
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


       
        <main role="main">
          {/* <ol className="ddhead mb-1">
            <li className="breadcrumb-item active text-dark">
              <h3>Material-table Export With Grouping </h3>
            </li>
          </ol> */}
          <div className="row">
            <div className="col-md-12" style={{ padding: 5 }}>
              <main role="main">
                <div className="row">
                  <div className="container">
                    <div className="col-md-12 mx-auto">
                      <div className="form-container mt-2 loader" >

                        <MaterialTable
                          icons={tableIcons}
                          title="Menu Master Report "
                          columns={this.state.Materialcolumn}
                          data={this.state.PageMast}
                          options=
                          {{
                            search: true,
                            grouping: true,
                            exportButton: true,
                            columnsButton: true,
                            filtering: true,
                            sorting: true,
                            exportCsv,
                            exportPdf,
                            pageSize: 100,
                            pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                            toolbar: true,
                            paging: false

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
}), { setMenu, userInfo })(Materialgriddemo3);


