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

class BioMachineUpdateUI extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      data:{
        Cardno:"",
        IsNew:false,
        IsUpdate:false,
        IsDelete:false,
        IsBlock:false,
        IsFp:false,
        IsDeleteFp:false,        
      },
      
    };

  }

  onChangeHandler = (e) => {
    debugger 
    switch(e.target.name){
        case "IsNew":
            if(e.target.checked){
                document.getElementsByName("IsUpdate").values(false);
                document.getElementsByName("IsDelete").values(false);
                document.getElementsByName("IsBlock").values(false);
                document.getElementsByName("IsDeleteFp").values(false);
            }
            this.setState({
                data: {
                  ...this.state.data,
                  [e.target.name]: e.target.checked,
                },        
            });
            return null;

            case "IsFp":
                if(e.target.checked){
                    document.getElementsByName("IsUpdate").values(false);
                    document.getElementsByName("IsDelete").values(false);
                    document.getElementsByName("IsBlock").values(false);
                    document.getElementsByName("IsDeleteFp").values(false);
                }
                this.setState({
                    data: {
                      ...this.state.data,
                      [e.target.name]: e.target.checked,
                    },        
                });
                return null;    

                

            case "IsUpdate":
                if(e.target.checked){
                    if(this.state.data.IsNew===true||this.state.data.IsFp===true){
                        this.setState({
                            data: {
                              ...this.state.data,
                              [e.target.name]: false,
                            },        
                        });
                    }
                    else{
                      this.setState({
                        data: {
                          ...this.state.data,
                          [e.target.name]: e.target.checked,
                        },        
                    });
                    }
                }
                return null;    

                case "IsDelete":
                  if(e.target.checked){
                      if(this.state.data.IsNew===true||this.state.data.IsFp===true){
                          this.setState({
                              data: {
                                ...this.state.data,
                                [e.target.name]: false,
                              },        
                          });
                      }
                      else{
                        this.setState({
                          data: {
                            ...this.state.data,
                            [e.target.name]: e.target.checked,
                          },        
                      });
                      }
                  }
                
                return null;  
                
                case "IsBlock":
                  if(e.target.checked){
                      if(this.state.data.IsNew===true||this.state.data.IsFp===true){
                          this.setState({
                              data: {
                                ...this.state.data,
                                [e.target.name]: false,
                              },        
                          });
                      }
                      else{
                        this.setState({
                          data: {
                            ...this.state.data,
                            [e.target.name]: e.target.checked,
                          },        
                      });
                      }
                  }
                  return null;    

                  case "IsDeleteFp":
                  if(e.target.checked){
                      if(this.state.data.IsNew===true||this.state.data.IsFp===true){
                          this.setState({
                              data: {
                                ...this.state.data,
                                [e.target.name]: false,
                              },        
                          });
                      }
                      else{
                        this.setState({
                          data: {
                            ...this.state.data,
                            [e.target.name]: e.target.checked,
                          },        
                      });
                      }
                  }
                
                return null; 


        default :
           return null;    
    }
    
        
  }  

  

  
  
  componentDidMount(){
      debugger
      const {p}= this.props;
      const {s}= this.state;
    if(this.props.Mode==="Edit"){
        this.setState({
            ...this.state,
            data:{
              Cardno:this.props.editdata[0].Cardno,
              IsNew:this.props.editdata[0].isnew,
              IsUpdate:this.props.editdata[0].isupdate,
              IsDelete:this.props.editdata[0].isdeletefp,
              IsBlock:this.props.editdata[0].Isstatus,
              IsFp:this.props.editdata[0].Isfp,
              IsDeleteFp:this.props.editdata[0].isdeletefp,                
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
         
       },      
     });
     return false;
    } 
    
    return true; 
  }

  
  
  render() {
    debugger
    const { s } = this.state;
    return (
      <div>        

<Form onSubmit={this.submitHandler}>
    <div style={{height: '250px',top:'27px',position:'relative'}}>

    
<div className="row">
 <div className="col-md-12">
     <div className="row">
     <div className="col-md-4">
        <div className="row" style={{float:'left'}}>
            <div className="col-md-2" style={{width:'30%'}}>
                <Label>Card No :</Label>
            </div>
            <div className="col-md-2">
                <input type="text" name="Cardno" value={this.state.data.Cardno||''} onChange={this.onChangeHandler} ></input>
            </div>            
        </div>
     </div>
     <div className="col-md-1">
                <Label>Is New :</Label>
    </div>
    <div className="col-md-1">
        <input type="checkbox" name="IsNew" checked={this.state.data.IsNew||false} onChange={this.onChangeHandler} ></input>
    </div>

    <div className="col-md-1">
                <Label>Is Update :</Label>
    </div>
    <div className="col-md-1">
        <input type="checkbox" name="IsUpdate" checked={this.state.data.IsUpdate||false} onChange={this.onChangeHandler} ></input>
    </div>

    <div className="col-md-1">
                <Label>Is Delete User :</Label>
    </div>
    <div className="col-md-1">
        <input type="checkbox" name="IsDeleteUser" checked={this.state.data.IsDelete||false} onChange={this.onChangeHandler} ></input>
    </div>

    <div className="col-md-1">
                <Label>Is Block User :</Label>
    </div>
    <div className="col-md-1">
        <input type="checkbox" name="IsBlockUser"  checked={this.state.data.IsBlock||false} onChange={this.onChangeHandler} ></input>
    </div>
     </div>    
     <div className="row"> 
     <div className="col-md-4">
        <div className="row" style={{float:'left'}}>
            <div className="col-md-2" style={{width:'30%'}}>
               
            </div>
            <div className="col-md-2">
                
            </div>            
        </div>
     </div>    
     <div className="col-md-1">
                <Label>Is Fp :</Label>
    </div>
    <div className="col-md-1">
        <input type="checkbox" name="IsFp" checked={this.state.data.IsFp||false} onChange={this.onChangeHandler} ></input>
    </div>    

    <div className="col-md-2">
                <Label>Is Delete Fp :</Label>
    </div>
    <div className="col-md-1">
        <input type="checkbox" name="IsDeleteFp" checked={this.state.data.IsDeleteFp||false} onChange={this.onChangeHandler} ></input>
    </div>    
     </div>  

       <div className="row"> 
     <div className="col-md-8">
        <div className="row" >
            <div className="col-md-3" style={{width:'172px'}}>
                <Label>Select Machine Name :</Label>
            </div>
            <div className="col-md-5" width={'100%'}>
                <select></select>
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
}), { compPerm })(BioMachineUpdateUI);