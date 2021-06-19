import React, { Component } from 'react';
import { connect } from "react-redux";
import { compPerm } from "../../redux/actions/companyPermission";
import {
  Form,
  Label,
  FormGroup,
} from "reactstrap";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';

class EmployeeShiftUI extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      data:{
        MachineAlias:"",
        ConnectType:"",
        IP:"",
        SerialPort:"",
        MachineNumber:"",
        CommPassword:"",
        sn:"",
        ProductType:"",
        Enabled:false
      },
      
    };

  }

  onChangeHandler = (e) => {
    debugger  
    if(e.target.name!=="Enabled") {
        this.setState({
            data: {
              ...this.state.data,
              [e.target.name]: e.target.value,
            },        
        });
    } 
    
    if(e.target.name==="Enabled") {
        this.setState({
            data: {
              ...this.state.data,
              [e.target.name]: !this.state.data.Enabled
            },        
        });
    } 
  }  

  

  
  
  componentDidMount(){
      //debugger
      const {p}= this.props;
      const {s}= this.state;
    if(this.props.Mode==="Edit"){
        this.setState({
            ...this.state,
            data:{
                MachineAlias:this.props.editdata[0].MachineAlias,
                ConnectType:this.props.editdata[0].ConnectType,
                IP:this.props.editdata[0].IP,
                SerialPort:this.props.editdata[0].SerialPort,
                MachineNumber:this.props.editdata[0].MachineNumber,
                CommPassword:this.props.editdata[0].CommPassword,
                sn:this.props.editdata[0].sn,
                ProductType:this.props.editdata[0].ProductType,
                Enabled:this.props.editdata[0].Enabled?true:false,
            }
        })
    }

  }

  submitHandler=(e)=>{
    debugger
    if(this.props.Mode!=="Edit"){    
    e.preventDefault();
    const {data}=this.state.data;
     //var url = `http://localhost:52227/api/MachineMaster/PostMachineMaster?ActionType=Add`;
     var url = `${axios.baseURL}/MachineMaster/PostMachineMaster?ActionType=Add`;
     axios.post(url,this.state.data)
     .then((response) =>{
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

if(this.props.Mode==="Edit"){    
    e.preventDefault();   
     //var url = `http://localhost:52227/api/MachineMaster/PostMachineMaster?ActionType=Edit&id=${this.props.selected}`;
     var url = `${axios.baseURL}/MachineMaster/PostMachineMaster?ActionType=Edit&id=${this.props.selected}`;
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
} 

  shouldComponentUpdate(nextProps, nextState){
    debugger;
    if(this.props.addOpened!==nextProps.addOpened){
     this.setState({
       data:{
         MachineAlias:"",
         ConnectType:"",
         IP:"",
         SerialPort:"",
         MachineNumber:"",
         CommPassword:"",
         sn:"",
         ProductType:"",
         Enabled:false
       },      
     });
     return false;
    } 
    
    return true; 
  }

  
  
  render() {
  //  debugger
    const { s } = this.state;
    return (
      <div>        

<Form onSubmit={this.submitHandler}>
    <div style={{height: '250px',top:'27px',position:'relative'}}>

    
<div className="row">
 <div className="col-md-12">
     <div className="row">
     <div className="col-md-6">
        <div className="row" style={{float:'right'}}>
            <div className="col-md-3" style={{width:'45%'}}>
                <Label>Machine Name :</Label>
            </div>
            <div className="col-md-3">
                <input type="text" name="MachineAlias" value={this.state.data.MachineAlias} onChange={this.onChangeHandler} ></input>
            </div>
        </div>
     </div> 
     <div className="col-md-6">
        <div className="row" style={{float:'Left'}}>
            <div className="col-md-3" style={{width:'40%',left: '67px',position:'relative'}}>
                <Label>Connect Type :</Label>
            </div>
            <div className=" col-md-3">
                <select style={{width:'214px', minHeight: '32px', left: '71px', position: 'relative'}} name="ConnectType" value={this.state.data.ConnectType} onChange={this.onChangeHandler}  >
                    <option value=''>Select</option>
                    <option value='1'>Yes</option>
                    <option value='0'>No</option>
                </select>
            </div>
        </div>
     </div> 
     </div>            
 </div>
</div>
<div className="row">
 <div className="col-md-12">
     <div className="row">
     <div className="col-md-6">
        <div className="row" style={{float:'right'}}>
            <div className="col-md-3" style={{width:'40%'}} >
                <Label>IP Address :</Label>
            </div>
            <div className="col-md-3">
                <input type="text" name="IP" onChange={this.onChangeHandler} value={this.state.data.IP} ></input>
            </div>
        </div>
     </div> 
     <div className="col-md-6">
        <div className="row" style={{float:'Left'}}>
            <div className="col-md-3" style={{width:'40%',left: '88px',position:'relative'}}>
                <Label>Serial Port :</Label>
            </div>
            <div className=" col-md-3">
                <select style={{width:'214px', minHeight: '32px', left: '79px', position: 'relative'}} name="SerialPort" value={this.state.data.SerialPort}  onChange={this.onChangeHandler} >
                    <option value=''>Select</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                </select>
            </div>
        </div>
     </div> 
     </div>            
 </div>
</div>
<div className="row">
 <div className="col-md-12">
     <div className="row">
     <div className="col-md-6">
        <div className="row" style={{float:'right'}}>
            <div className="col-md-3" style={{width:'42%'}}>
                <Label>Machine No :</Label>
            </div>
            <div className="col-md-3">
                <input type="text" name="MachineNumber" onChange={this.onChangeHandler} value={this.state.data.MachineNumber} ></input>
            </div>
        </div>
     </div> 
     <div className="col-md-6">
        <div className="row" style={{float:'Left'}}>
            <div className="col-md-3" style={{width:'47%',left: '28px',position:'relative'}}>
                <Label>Common Password :</Label>
            </div>
            <div className=" col-md-3">
                <select style={{width:'214px', minHeight: '32px',left: '28px',position:'relative'}} name="CommPassword" onChange={this.onChangeHandler} value={this.state.data.CommPassword}  >
                    <option value=''>Select</option>
                    <option value={'O'}>OutPut</option>
                    <option value={'I'}>Input</option>
                    <option value={'B'}>Both</option>
                </select>
            </div>
        </div>
     </div> 
     </div>            
 </div>
</div>
<div className="row">
 <div className="col-md-12">
     <div className="row">
     <div className="col-md-6">
        <div className="row" style={{float:'right'}}>
            <div className="col-md-3" style={{width:'42%'}}>
                <Label>SN Number :</Label>
            </div>
            <div className="col-md-3">
                <input type="text"name="sn" onChange={this.onChangeHandler}  value={this.state.data.sn} ></input>
            </div>
        </div>
     </div> 
     <div className="col-md-6">
        <div className="row" style={{float:'Left'}}>
            <div className="col-md-3" style={{width:'62%',left: '69px',position:'relative'}}>
                <Label>Product Type :</Label>
            </div>
            <div className=" col-md-3">
                <select style={{width:'214px', minHeight: '32px'}} name="ProductType" onChange={this.onChangeHandler} value={this.state.data.ProductType} >
                    <option value=''>Select</option>
                    <option value='A'>A</option>
                    <option value='B'>B</option>
                    <option value='C'>C</option>
                </select>
            </div>
        </div>
     </div> 
     </div>            
 </div>
</div>

<div className="row">
 <div className="col-md-12">
    <div className="row">
     <div className="col-md-6">
        <div className="row" style={{float: 'left', position: 'relative',left: '298px',width: '125px'}}>
            <div className="col-md-3" style={{width:'75%'}}>
                <Label>Enable :</Label>
            </div>
            <div className="col-md-3">
                <input type="checkbox" name="Enabled" onChange={this.onChangeHandler}  checked={this.state.data.Enabled} ></input>
            </div>
        </div>
     </div>
    </div>            
 </div>
</div>

<div className="row">
 <div className="col-md-12">
     <div className="row">
     <div className="col-md-6">
        <div className="row" style={{float:'right',right:'-100px',position:'relative',top:'9px'}}>
            <div className="col-md-3" style={{width:'40%'}}>
               <button>Submit</button>
            </div>                        
        </div>
     </div> 
     
     </div>            
 </div>
</div>
</div>

</Form>
              
      </div>
    )
  }
}
export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}), { compPerm })(EmployeeShiftUI);