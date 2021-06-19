import React, { Component,Suspense } from 'react';
import { connect } from "react-redux";
import { compPerm } from "../../redux/actions/companyPermission";
import { Link } from "react-router-dom";
import {
  Form,
  Label,
  FormGroup,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import filterFactory, {
    textFilter,  
    dateFilter,
  } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import { Redirect } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import DateFormatComponent from '../../components/DateFormat/DateFormatComponent';
import { de } from 'date-fns/locale';
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                      ];


class GateTimeTableUI extends Component {
  constructor(props) {
    debugger;
    super(props);
    this.state = {      
        department:[], 
        employee: [],   
        employeeIdCollection:[], 
        departmentId:'',
        departmentName:'',
        InOut: props.Mode==="Edit"?props.editdata[0].Type:'I' ,
        Data:[],
        columns: [
            {
              dataField: "SrNo",
              text: "SrNo.",         
              sort: true,
              filter: textFilter(),
              headerStyle: () => {
                return { width: "5%" };
              }
            },
            {
              dataField: "EmpName",
              text: "Employee Name",
              sort: true,
              filter: textFilter(),
              headerStyle: () => {
                return { width: "22%" };
              }
            },
            {
              dataField: "Date",
              text: "Date",
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
              dataField: "Department",
              text: "Department",
              sort: true,
              filter: textFilter(),
            },
            {
              dataField: "Type",
              text: "Type",
              sort: true,
              filter: textFilter(),
            },      
          ], 
        searchEmployeeData:[],    
        inputValue:'' ,
        inputValueEmpName:''   
    };
  }

  handleChange = ev => {
    debugger
    this.setState({ InOut: ev.target.value });
  };  

  handleClick = ev => {
   debugger
   if(this.props.Mode==="Edit"){
    let {InOut}=this.state; 
    let employeeIdCollection=this.props.editdata;
    employeeIdCollection[0].Type=InOut==='I'?'IN':'OUT';
    employeeIdCollection.map((item,Index)=>{
      debugger;
      Object.assign(item,{ModfiyBy:this.props.user.info.EmpId});
    });
    var Data=employeeIdCollection;
      if(Data.length>0){         
        var string=Object.assign({}, Data);        
        // var url = "http://localhost:52227/api/GateTimeTable/PostGetTimeTable?ActionType=Edit";
         var url = `${axios.baseURL}/GateTimeTable/PostGetTimeTable?ActionType=Edit`;
        
        axios.post(url,string)
        .then((response) =>{
          debugger;
         if(response.data.Status === '1') {
             toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });          
         }else{
             toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
           }
        })
        .catch((error) => {
         toast.error(error, { position: toast.POSITION.TOP_CENTER });      
        });
     }     
  
  else{
    toast.error("Please fill correctly!", { position: toast.POSITION.TOP_CENTER });
  }
}  
   
  else{   
   let {InOut,employeeIdCollection}=this.state;                                                   
    if(InOut!=='' && employeeIdCollection.length>0){  
     employeeIdCollection.map((item,Index)=>{
        debugger;
        Object.assign(item,{Id:0,ModfiyBy:'',Type:InOut==='I'?'IN':'OUT',SrNo:Index+1,Date:new Date().toISOString().slice(0, 19).replace('T', ' ')});
      });
      var Data=employeeIdCollection;

      if(Data.length>0){
       // var  Data = this.state.Data;  
        var string=Object.assign({}, Data);
        
        // var url = "http://localhost:52227/api/GateTimeTable/PostGetTimeTable?ActionType=Add";

         var url = `${axios.baseURL}/GateTimeTable/PostGetTimeTable?ActionType=Add`;
        
        axios.post(url,string)
        .then((response) =>{
          debugger;
         if(response.data.Status === '1') {
             toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });          
         }else{
             toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
           }
        })
        .catch((error) => {
         toast.error(error, { position: toast.POSITION.TOP_CENTER });      
     });
     }     
  }
  else{
    toast.error("Please fill correctly!", { position: toast.POSITION.TOP_CENTER });
  }
}
};

handleEmployeeChange=(e)=>{
    debugger
    var employeeId = e.target.value;
    if(employeeId!==''){
       //var url = `http://localhost:52227/api/GateTimeTable/GetEmployeeWithDepartment_ById?Id=${e.target.value}`;

       var url = `${axios.baseURL}/GateTimeTable/GetEmployeeWithDepartment_ById?Id=${e.target.value}`;
      axios.get(url)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          this.setState({
            searchEmployeeData: response.data.Data,
            inputValueEmpName:employeeId         
          })
        }
        else {
          this.setState({ searchEmployeeData: [] });
        }
      }).catch((error) => {
        toast.error(error, { position: toast.POSITION.TOP_CENTER });      
       });
    }
  }


 

  
  componentDidMount() {    
   // var url = 'http://localhost:52227/api/GateTimeTable/GetDepartment';

   var url = `${axios.baseURL}/GateTimeTable/GetDepartment`;

    axios.get(url)
      .then((response, err) => {
        debugger;
        if (response.data.Status === '1') {
          this.setState({
            department: response.data.Data,
            searchEmployeeData:[]            
          })
        }
        else {
          this.setState({ department: [] });
        }
      })
      
      
  }

  

  submitHandler=(e)=>{
    debugger
//     if(this.props.Mode!=="Edit"){    
//     e.preventDefault();
//     const {data}=this.state.data;
//      //var url = `http://localhost:52227/api/MachineMaster/PostMachineMaster?ActionType=Add`;
//      var url = `${axios.baseURL}/MachineMaster/PostMachineMaster?ActionType=Add`;
//      axios.post(url,this.state.data)
  //    .then((response) =>{
  //     if(response.data.Status === '1') {
  //         toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });          
  //     }else{
  //         toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
  //       }
  //    })
  //    .catch((error) => {
  //     toast.error(error, { position: toast.POSITION.TOP_CENTER });      
  // });
// }

if(this.props.Mode==="Edit"){    
    e.preventDefault();   
    // var url = `http://localhost:52227/api/CheckInOut/PostCheckInOut?Id=${this.props.selected}`;
     var url = `${axios.baseURL}/CheckInOut/PostCheckInOut?Id=${this.props.selected}`;
    if(this.state.data.SENSORID!=="" && this.state.data.CHECKTYPE!=""){
        axios.post(url,this.state.data)
     .then((response) =>{
      if(response.data.Status === '1') {
          debugger
          toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });          
      }else{
          toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
        }
     })
     .catch((error) => {
      toast.error(error, { position: toast.POSITION.TOP_CENTER });      
     });
   }
   else{
    toast.error("Please fill correctly!", { position: toast.POSITION.TOP_CENTER });
   }    
}
} 

  shouldComponentUpdate(nextProps, nextState){
    debugger;
    if(this.props.addOpened!==nextProps.addOpened){
      this.setState({       
        employee:[] ,
        departmentId:'',
        inputValue:'',
        inputValueEmpName:''           
      })      
     return false;
    }     
    return true; 
  }  
  
  render() {
    debugger;
    if (this.props.user.info === null) {
      return <Redirect to="/sign-in" />;
    }
    else{    
    return (
      <>  
      <main role="main">          
          <Suspense fallback={<div> Loading...</div>}>
            
          <div className="row">
            <div className="col-md-12" style={{ padding: 5 }}>
              <main role="main">
                <div className="row">
                  <div className="container">
                    <div className="col-md-12 mx-auto">
                      <div className="form-container mt-2 loader" >
                        <div style={{ padding: 10, marginLeft: 5 }}>
                            <Form>
                            <div style={{ padding: 10, marginLeft:'30%' }}>
                            <Label  style={{position:'relative',top:30 }} >Department :</Label>
                             
                             {this.props.Mode==="Edit"?
                            <Autocomplete                                
                            id="checkboxes-tags-demo"  
                            options={this.props.editdata}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.DeptName} 
                            inputValue={this.props.Mode==="Edit" && this.state.department.length>0 ?
                            this.state.department.filter(x=>x.Id===this.props.editdata[0].DepartmentId).map(item=>{
                              debugger
                              return item.DeptName
                            })[0]:""}
                                                     
                            renderOption={(option, { selected }) => (
                                <React.Fragment >   
                                <span style={{marginLeft: 10 }}> {option.DeptName}</span>
                                </React.Fragment>
                            )}
                            style={{ width: 400,left:165,position:'relative',top:-5 }}
                            renderInput={(params) =>{
                               // debugger                                    
                                return(
                                    <TextField {...params}  label={""} placeholder="Select Departments" />
                                )
                            }}
                            onChange={(event, newValue) => {
                                debugger
                                //console.log(JSON.stringify(newValue, null, ' '));
                                if(newValue!==null){
                                  this.setState({
                                    ...this.state,
                                    departmentId:newValue.Id,
                                    departmentName:newValue.DeptName
                                  });
                                   // var url=`http://localhost:52227/api/GateTimeTable/GetEmployees_ByDepartmentId_ById?Id=${newValue.Id}`;
                                      var url =  `${axios.baseURL}/GateTimeTable/GetEmployees_ByDepartmentId_ById?Id=${newValue.Id}`;
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
                                else {
                                    this.setState({ employee: [] });
                                }
                                
                              }}
                            />
                             
                             : <Autocomplete                                
                                id="checkboxes-tags-demo"  
                                options={this.state.department}                                
                                getOptionLabel={(option) => option.DeptName} 
                               inputValue={this.state.inputValue}
                                renderOption={(option, { selected }) => (
                                    <React.Fragment >   
                                   <span style={{marginLeft: 10 }}> {option.DeptName}</span>
                                    </React.Fragment>
                                )}
                                style={{ width: 400,left:165,position:'relative',top:-5 }}
                                renderInput={(params) =>{
                                   // debugger                                    
                                    return(
                                      
                                        <TextField {...params}  label={""} placeholder="Select Departments" />
                                    )
                                }}
                                onChange={(event, newValue) => {
                                    debugger
                                    //console.log(JSON.stringify(newValue, null, ' '));
                                    if(newValue!==null){
                                      this.setState({
                                        ...this.state,
                                        departmentId:newValue.Id,
                                       // departmentName:newValue.DeptName
                                       inputValue:newValue.DeptName
                                      });
                                       // var url=`http://localhost:52227/api/GateTimeTable/GetEmployees_ByDepartmentId_ById?Id=${newValue.Id}`;
                                          var url =  `${axios.baseURL}/GateTimeTable/GetEmployees_ByDepartmentId_ById?Id=${newValue.Id}`;
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
                                    else {
                                        this.setState({ employee: [] });
                                    }
                                    
                                  }}
                              />
                             }
                            </div>
                            <div style={{ padding: 10, marginLeft:'30%' }}>
                            <Label style={{position:'relative',top:2 }}>Employee :</Label>

                            {this.props.Mode==="Edit"?
                            <Autocomplete   
                            // multiple                             
                                 id="checkboxes-tags-demo"
                                 options={this.props.editdata}
                                 disableCloseOnSelect
                                 getOptionLabel={(option) => option.EmpName} 
                                 inputValue={this.props.editdata[0].EmpName}                              
                                 renderOption={(option, { selected }) => (
                                     <React.Fragment>
                                     <Checkbox
                                         icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                         checkedIcon={<CheckBoxIcon fontSize="small" />}
                                         style={{ marginRight: 8 }}
                                         checked={selected}
                                     /> 
                                    {/* {option.EmpName} */}
                                    
                                    {this.state.employee.length>0?
                                    <>
                                    <div style={{width:70}}>
                                    <span >{option.Id}</span>
                                    </div>
                                    <div  style={{width:150}}>
                                    <span>{option.EmpName}</span>
                                    </div>  
                                    </>
                                    
                                     :
                                     <>
                                    <div style={{width:70}}>
                                    <span >{option.Id}</span>
                                    </div>
                                    <div  style={{width:150}}>
                                    <span>{option.EmpName}</span>
                                    </div> 
                                    <div  style={{width:150}}>
                                    <span>{option.DeptName}</span>
                                    </div>  
                                    </>
                                    }
                                     </React.Fragment>
                                 )}
                                 style={{ width: 400,left:165,position:'relative',top:-30 }}
                                 renderInput={(params) =>{
                                     //debugger                                   
                                     return(
                                         <TextField {...params}  label="" placeholder="Select/Search Employee" onChange={this.state.employee.length===0?   this.handleEmployeeChange:null} />
                                     )
                                 }}
                                 onChange={(event, newValue) => {
                                   debugger  
                                   let employeeIdCollection=[];   
                                                    
                                   if(newValue!==null){  
                                     // newValue.map(item=>{
                                     //   debugger;
                                     //   employeeIdCollection.push({EmployeeId:item.Id,EmpName:item.EmpName, DepartmentId:this.state.departmentId,Department:this.state.departmentName});
                                     // });
                                     if(this.state.employee.length>0){
                                       employeeIdCollection.push({EmployeeId:newValue.Id,EmpName:newValue.EmpName, DepartmentId:this.state.departmentId,Department:this.state.departmentName});  
                                     }
                                     else{
                                       employeeIdCollection.push({EmployeeId:newValue.Id,EmpName:newValue.EmpName, DepartmentId:newValue.DepartmentId,Department:newValue.DeptName});  
                                     }
                                                                       
 
                                    this.setState({
                                       ...this.state,
                                       employeeIdCollection:employeeIdCollection
                                     });
                                   }
                                   else {
                                       this.setState({ employeeIdCollection: [] });
                                   }
                                   
                                 }}
 
                                 onClick={(e)=>{
                                   debugger
 
                                 }}
                                 />
                                 :                            
                            <Autocomplete   
                           // multiple                             
                                id="checkboxes-tags-demo"
                                options={this.state.employee.length>0?this.state.employee:this.state.searchEmployeeData}                                
                                getOptionLabel={(option) => option.EmpName}    
                                //inputValue={this.state.inputValueEmpName}                            
                                renderOption={(option, { selected }) => (
                                    <React.Fragment>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    /> 
                                   {/* {option.EmpName} */}
                                   
                                   {this.state.employee.length>0?
                                   <>
                                   <div style={{width:70}}>
                                   <span >{option.Id}</span>
                                   </div>
                                   <div  style={{width:150}}>
                                   <span>{option.EmpName}</span>
                                   </div>  
                                   </>
                                   
                                    :
                                    <>
                                   <div style={{width:70}}>
                                   <span >{option.Id}</span>
                                   </div>
                                   <div  style={{width:150}}>
                                   <span>{option.EmpName}</span>
                                   </div> 
                                   <div  style={{width:150}}>
                                   <span>{option.DeptName}</span>
                                   </div>  
                                   </>
                                   }
                                    </React.Fragment>
                                )}
                                style={{ width: 400,left:165,position:'relative',top:-30 }}
                                renderInput={(params) =>{
                                    //debugger                                   
                                    return(
                                        <TextField {...params}  label="" placeholder="Select Employee/Search Employee By Id" value={this.state.inputValueEmpName} onChange={this.state.employee.length===0?   this.handleEmployeeChange:null} />
                                    )
                                }}
                                onChange={(event, newValue) => {
                                  debugger  
                                  let employeeIdCollection=[];   
                                                   
                                  if(newValue!==null){  
                                    // newValue.map(item=>{
                                    //   debugger;
                                    //   employeeIdCollection.push({EmployeeId:item.Id,EmpName:item.EmpName, DepartmentId:this.state.departmentId,Department:this.state.departmentName});
                                    // });
                                    if(this.state.employee.length>0){
                                      employeeIdCollection.push({EmployeeId:newValue.Id,EmpName:newValue.EmpName, DepartmentId:this.state.departmentId,Department:this.state.departmentName});  
                                    }
                                    else{
                                      employeeIdCollection.push({EmployeeId:newValue.Id,EmpName:newValue.EmpName, DepartmentId:newValue.DepartmentId,Department:newValue.DeptName});  
                                    }
                                                                      

                                   this.setState({
                                      ...this.state,
                                      employeeIdCollection:employeeIdCollection,
                                      inputValueEmpName:newValue.EmpName
                                    });
                                  }
                                  else {
                                      this.setState({ employeeIdCollection: [] });
                                  }                                  
                                }}                                
                                />
                              }
                            </div>
                            <div style={{ padding: 10, marginLeft:'40%',top: -40,position:'relative' }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend"></FormLabel>
                                <RadioGroup
                                    aria-label="InOut"
                                    value={this.state.InOut}
                                    name="InOut"
                                    row
                                    onChange={this.handleChange}
                                >
                                    <FormControlLabel value="I" control={<Radio />} label="IN"  />
                                    <FormControlLabel value="O" control={<Radio />} label="OUT" />                                    
                                </RadioGroup>
                            </FormControl>  
                            <Button style={{top: 8,left:198,position:'relative',width:115}} 
                            variant="contained"
                            onClick={this.handleClick}
                            >
                              Submit
                            </Button>      
                            </div>
                            </Form>          
                        </div>                        
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
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}), { compPerm })(GateTimeTableUI);