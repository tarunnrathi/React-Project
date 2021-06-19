import React, { useState, useEffect  } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';  
import Gridcontrolbtn from "./gridcontrolbtn";

function DataGridFunc(){
        const [user, state] = useState([]);
        
      
        useEffect(() => { loadUsers(); }, []);
      
        const loadUsers = async () => {
          const result = await axios.get("http://10.1.1.189:5252/api/hrapi/getdepartmentdata");
          state(result.data.Data.reverse());
        };
        
 const columns = [{
    dataField: 'DeptId',
    text: 'DeptId',
    sort: true,
    filter: textFilter()
  },
  {
    dataField: 'DeptName',
    text: 'DeptName',
    sort:true,
    filter: textFilter()
  },
  {
    dataField: 'IsActive',
    text: 'IsActive',
    sort: true,
    filter: textFilter()
  },
  {
    dataField: 'CreatedBy',
    text: 'CreatedBy',
    sort: true,
    filter: textFilter()
  },
  {
    dataField: 'CreatedDate',
    text: 'CreatedDate',
    sort: true,
    alignItems: 'top',
    filter: dateFilter(),
    formatter: (cell) => {
      let dateObj = cell;
      if (typeof cell !== 'object') {
        dateObj = new Date(cell);
      }
      //return `${ dateObj.toUTCString()} `;
       return `${('0' + dateObj.getDate()).slice(-2)}/${('0' + (dateObj.getMonth() + 1)).slice(-2)}/${dateObj.getFullYear()} 
        ${ dateObj.getHours() }:${ dateObj.getMinutes() }`;
    }
  },
  {
    dataField: 'ModifyBy',
    text: 'ModifyBy',
    sort: true,
    filter: textFilter()
  },
  {
    dataField: 'ModifiedDate',
    text: 'ModifiedDate',
    sort: true,
    filter: dateFilter(),
    formatter: (cell) => {
      let dateOb = cell;
      if (typeof cell !== 'object'  ) {
        dateOb = new Date(cell);
      }
      if(dateOb !==null)
      {
          return `${('0' + dateOb.getDate()).slice(-2)}/${('0' + (dateOb.getMonth() + 1)).slice(-2)}/${dateOb.getFullYear()} 
           ${ dateOb.getHours() }:${ dateOb.getMinutes() }`;
      }
      else{
        return ''
      }
    }
  }]
const handleRowSelect=(row, isSelect, e)=>{
    state({
            selected: row.DeptId,
          });
         //alert( this.state.selected ); 
        };
//    const handleBtnClick = () => { 
//           props.history.push('/editdepartment/'+state.selected)
//         };
        const onSubmit = async e => {
            e.preventDefault();
            console.log(user);
            axios.post("http://10.1.1.189:5252/api/HRAPI/PostDepartmentData?ActionType=Add", user);
           // history.push("/GridControl");
          };

        // const delete = async e => {
        
        //     axios.post(`http://10.1.1.189:5252/api/HRAPI/PostDepartmentVisbileByID?id=$name`)
                        
        //     .then(response => {
                    
        //       console.log(response);
        //   });
        //    // console.log(user);
        //    // history.push("/datagrid");
          
        //   } 

          const options = {  
            page: 1,   
            sizePerPageList: [ {  
              text: '5', value: 5  
            }, {  
              text: '10', value: 10  
            }, { 
              text: '20', value: 10  
            },{ 
              text: 'All', value: this.state.employee.length  
            } ],   
            sizePerPage: 5,   
            pageStartIndex: 1,   
            paginationSize: 5,    
            prePage: 'Prev',   
            nextPage: 'Next',   
            firstPage: 'First',   
            lastPage: 'Last',   
          };  

const selectRow = {
mode: 'radio',
bgColor: '#00BFFF',
onSelect: (row, isSelect, rowIndex, e) => {
if (isSelect) {
  handleRowSelect(row, isSelect, e);
    return (true) ; // return false to deny current select action}
}
}
};

return(
    <>
    {/* <button onClick={this.handleBtnClick}>click</button> */}

    <div className="container">
      <div  style={{ marginTop: 20 }}>
        {/* <Gridcontrolbtn adddepart={user.adddepartment} sendpid={user.editdepartment} sendidtoeditbtn={user.selected} delete={ user.delete } /> */}
      
        <BootstrapTable striped hover keyField='DeptId' data={ user.employee } columns={ user.columns } selectRow={ selectRow } filter={ filterFactory() } pagination={ paginationFactory(options) }  >
        </BootstrapTable>
      </div>
    </div>
    </>
);


};
export default DataGridFunc();