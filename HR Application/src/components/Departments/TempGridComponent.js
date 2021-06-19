import React, { useEffect,useState,Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  dateFilter,
} from "react-bootstrap-table2-filter";

import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

class TempGridComponent extends Component{ 
  constructor(props){
    super(props);
    this.state={
      departmentData:[],
      columns:[
        {
          dataField: "Id",
          text: "Dept Id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "DeptName",
          text: "Dept Name",
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
      selected:null,
      selectedIndex: 0,
      showGrid:false
    }
    
  }

  handleRowSelect = (row, isSelect,rowIndex, e) => {
    debugger;

    this.setState(
      {
        selected: row.DeptName,
        selectedIndex:rowIndex, 
        showGrid:isSelect      
             
      },
      () => {
        // alert(this.state.selected);
        this.props.temGridCallBack(this.state.selected);
        console.log(this.state.selected);
      }
    );
  };



  componentDidMount(){
   // debugger;
    axios.get("http://10.1.1.189:5252/api/hrapi/getdepartmentdata")
    .then((res,err)=>{
      if(res){
        this.setState({
          departmentData:res.data.Data
        });
        
        console.log(this.state.departmentData);
      }
      if(err){
        console.log("error");
      }
    });

  }

  render(){
    debugger; 
   const {showGrid}=this.state;
   const{hideGrid}=this.props;
   const  selectRow = {
      mode: "radio",
      bgColor: "#00BFFF",     
      clickToExpand: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        debugger;
        if (isSelect) {
          this.handleRowSelect(row, isSelect,rowIndex, e);
          return true; // return false to deny current select action}
        }
      },
    }  
    
    return(
      <div>
                    
        {hideGrid? 
        !this.state.showGrid &&
        <div style={{ marginTop: 10}}>
          <div style={{ marginLeft:5 }}>
            <BootstrapTable            
            striped
            hover
            keyField="Id"
            data={this.state.departmentData}
            columns={this.state.columns}
            selectRow={selectRow}
            filter={filterFactory()} 
            ></BootstrapTable>                                 
          </div>
        </div>
        :null          
        }                 
        </div>
       
        
    );
  }
}
    

export default TempGridComponent;
    
