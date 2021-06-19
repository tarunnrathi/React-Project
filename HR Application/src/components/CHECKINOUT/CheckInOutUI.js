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


class CheckInOutUI extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      data:{
        CHECKTYPE:"",
        SENSORID:"",        
      },      
    };
  }

  onChangeHandler = (e) => {
    debugger   

    if(e.target.id==="SENSORID"){
      const regex = /^\d*$/;
      if(regex.test(e.target.value)){
        if(e.target.value!==""){
          this.setState({
            data: {
              ...this.state.data,
              [e.target.name]: e.target.value,
            },        
        });
        document.getElementById('SENSORID').style.borderColor = "black"; 
        }
  
        else{
          this.setState({
            data: {
              ...this.state.data,
              [e.target.name]: e.target.value,
            },        
        });
        document.getElementById('SENSORID').style.borderColor = "red"; 
        }
      }     
    }

    if(e.target.id==="CHECKTYPE"){
      if(e.target.value!==""){
        this.setState({
          data: {
            ...this.state.data,
            [e.target.name]: e.target.value,
          },        
      });
      document.getElementById('CHECKTYPE').style.borderColor = "black"; 
      }

      else{
        this.setState({
          data: {
            ...this.state.data,
            [e.target.name]: e.target.value,
          },        
      });
      document.getElementById('CHECKTYPE').style.borderColor = "red"; 
      }
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
                CHECKTYPE:this.props.editdata[0].CHECKTYPE,
                SENSORID:this.props.editdata[0].SENSORID,                
            }
        })
    }

  }

  submitHandler=(e)=>{
    debugger
//     if(this.props.Mode!=="Edit"){    
//     e.preventDefault();
//     const {data}=this.state.data;
//      //var url = `http://localhost:52227/api/MachineMaster/PostMachineMaster?ActionType=Add`;
//      var url = `${axios.baseURL}/MachineMaster/PostMachineMaster?ActionType=Add`;
//      axios.post(url,this.state.data)
//      .then((response) =>{
//       if(response.data.Status === '1') {
//           toast.success(response.data.Message, { position: toast.POSITION.TOP_CENTER });          
//       }else{
//           toast.error(response.data.Message, { position: toast.POSITION.TOP_CENTER });
//         }
//      })
//      .catch((error) => {
//       toast.error(error, { position: toast.POSITION.TOP_CENTER });      
//   });
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
       data:{
         CHECKTYPE:"",
         SENSORID:"",       
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
        <div className="row" style={{float:'Left'}}>
            <div className="col-md-3" style={{width:'40%',left: '67px',position:'relative'}}>
                <Label>CHECK TYPE :</Label>
            </div>
            <div className=" col-md-3">
                <select id="CHECKTYPE" style={{width:'214px', minHeight: '32px', left: '71px', position: 'relative'}} name="CHECKTYPE" value={this.state.data.CHECKTYPE} onChange={this.onChangeHandler}  >
                    <option value=''>Select</option>
                    <option value='I'>I</option>
                    <option value='O'>O</option>
                </select>
            </div>
        </div>
     </div> 

     <div className="col-md-6">
        <div className="row" style={{float:'right',position: 'relative',left:'-100px'}}>
            <div className="col-md-3" style={{width:'45%'}}>
                <Label>SENSOR ID :</Label>
            </div>
            <div className="col-md-3">
                <input type="text" 
                 id="SENSORID"
                 name="SENSORID" 
                 value={this.state.data.SENSORID} 
                 onChange={this.onChangeHandler} 
                 maxLength={3}
                 pattern="\d+"
                 placeholder="Enter only numeric value"  
                 ></input>
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
}), { compPerm })(CheckInOutUI);