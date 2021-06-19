import React, { Component } from "react";
import axios from "axios";
import react from "react-router-dom";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import { isEmail, isNumeric } from "validator";

class AddPageMast extends Component {
  constructor(props) {
    super();
    this.state = {
     
      data: {
        PageName: "",
        Viwe_Index: "",
        Parent_Id :"0",
        Module_Id:"",
        Directory: null,
        DisplayName:"",
        DisplayYN:"",
        Img:null,
        Level_Idx:"0",
        Idx:"3",  
        
        
      },
      PetentID: [],
      errors: {},
      viewindex:{
        Id:"",
        DisplayName:"",
        Viwe_Index:"",
        Parent_Id:""
      }
         
    }    
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
   
getInitialState = () => ({

    data: {
      PageName: "",
      Viwe_Index: "",
      Parent_Id :"0",
      Module_Id:"",
      Directory: null,
      DisplayName:"",
      DisplayYN:"",
      Img:null,
      Level_Idx:"",
      Idx:"",      
    },
    PetentID: [],
    errors: {},    
  });
  
componentDidMount() {
    //console.log("devender");
    let PetentID
     axios.get(`${axios.baseURL}/PageMast/GetPageMastByLevel`).then((res) => {           
       this.setState({ PetentID:res.data.Data});
       //return PetentID;
      //console.log({countries}); 
     });         
}

changeHandler = (e) => {
   let ParentId = this.state.data;
  
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
     
     });
  }

    handleChange = (e) => {
    
     var val=e.target.value;
     
//     this.apiData(val);
     
      axios.get(`${axios.baseURL}/PageMast/GetPageMastByViewIndexById?id=`+val)
      .then((res,err)=>{
          if(res){
            this.setState({
              data: {
                ...this.state.data,
              Viwe_Index:res.data.Data[0].Viwe_Index,
              }
              
             })
            
          }
          if(err){
            debugger;
           
          }});
     
          this.setState({
            data: {
              ...this.state.data,
              Parent_Id:e.target.value,
              //Viwe_Index:Viwe_Index,
            },
            errors: {
              ...this.state.errors,
              [e.target.name]: "",
            },
           
           });

    }  
       async apiData(id){
        //  debugger;

          await  axios.get(`${axios.baseURL}/PageMast/GetPageMastByViewIndexById?id=`+id)
          .then((res,err)=>{
           // debugger;
           // this.setState({ viewindex:res.data.Data});
        // if(res){
        //   debugger;
        //   this.setState({
        //      ...this.state.data,
        //      Viwe_Index:res.data.Data[0].Viwe_Index,
        //      Parent_Id:id,
           
        //   })
        //   //return res.data.Data.Viwe_Index; 

        // }
        // if(err){
        //   debugger;
        //   //return null;
        // }
      });
      }

    validate = () => {
    const { data } = this.state;
    let errors = {};

    // if (data.Id === '') errors.Id = 'ID can not be blank.';
    if (data.PageName === "") errors.PageName = "Page Name can not be blank.";
    if (data.Viwe_Index === "") errors.Viwe_Index = "Viwe_Index can not be blank.";

    return errors;
  };

  submitHandler = (e) => {
    debugger;
    e.preventDefault();
    const { data } = this.state;
    var errors = this.validate();

    // if (errors && errors.DesigName && errors.IsActive) {
    //   //   return;
    // }

    if (Object.keys(errors).length === 0) {
      console.log(data);
      axios
        .post(
          
          `${axios.baseURL}/PageMast/PostPageMast?ActionType=Add&EmpID=${this.props.user.info.EmpId}`,
          this.state.data
        )
        .then((response) => {
          debugger;
          this.setState(this.getInitialState());
          window.location.reload(true);
          console.log(response);
        });
        console.log(this.state.data);
    } else {
      this.setState({ errors });
    }
  };

   componentDidUpdate(){
  //debugger;  
   }

  render() {
 // debugger;
    const { data, errors } = this.state;
    //const {data1}=this.state.data;
    // const { name, username, email, phone, website } = this.state
    const headers = { "Content-Type": "application/json" };
    return (
      <>
        <Form onSubmit={this.submitHandler}>
          
<div className="row mb-2">

  <Label className="col-sm-2">Page Name   </Label>
  <div className="col-sm-4">
  <Input
  type="text"
  className="form-control"
  placeholder="Enter Page Name"
  id="PageName"
  name="PageName"
  value={data.PageName}
  invalid={errors.PageName ? true : false}
  onChange={this.changeHandler} />
  </div>

  <Label className="col-sm-2">View Index  </Label>
  <div className="col-sm-4">
  <Input
  type="text"
  className="form-control"
  placeholder="Enter View Index"
  id="Viwe_Index"
  name="Viwe_Index"
  value={data.Viwe_Index}
  invalid={errors.Viwe_Index ? true : false}
  onChange={this.changeHandler}
  />
  </div>

</div>

<div className="row mb-2">

  <Label className="col-sm-2">Parent Name </Label>
  <div className="col-sm-4">
    <select value={this.state.ParentId}
    className="form-control"
    name="Parent_Id"
    //invalid={errors.Parent_Id ? true : false}
    onChange={this.handleChange}
    >
       <option value={0}> Select Parent .... </option> 
{ 
  this.state.PetentID.map((hmenu) =>(
    <option key={hmenu.Id} value={hmenu.Id}> {hmenu.PageName}</option>
  )
  
)}
</select>

  {/* <Input
  type="text"
  className="form-control"
  placeholder="Enter Parent_Id"
  id="Parent_Id"
  name="Parent_Id"
  value={data.Parent_Id}
  invalid={errors.Parent_Id ? true : false}
  onChange={this.changeHandler}
  /> */}
  </div>

  <Label className="col-sm-2">Module Name  </Label>
  <div className="col-sm-4">
  <Input
  type="text"
  className="form-control"
  placeholder="Enter Module Name"
  id="Module_Id"
  name="Module_Id"
  value={data.Module_Id}
  invalid={errors.Module_Id ? true : false}
  onChange={this.changeHandler}
  />
  </div>

</div>

<div className="row mb-2">

  <Label className="col-sm-2">Display Name   </Label>
  <div className="col-sm-4">
  <Input
  type="text"
  className="form-control"
  placeholder="Enter Display Name"
  id="DisplayName"
  name="DisplayName"
  value={data.DisplayName}
  invalid={errors.DisplayName ? true : false}
  onChange={this.changeHandler}
  />
  </div>

  <Label className="col-sm-2">Is Active  </Label>
  <div className="col-sm-4">
{/* <Input
type="text"
className="form-control"
placeholder="Enter DisplayYN"
id="DisplayYN"
name="DisplayYN"
value={data.DisplayYN}
invalid={errors.DisplayYN ? true : false}
onChange={this.changeHandler}
/> */}
 <select
className="form-control"
name="DisplayYN"
value={data.DisplayYN}
//invalid={errors.DisplayYN ? true : false}
onChange={this.changeHandler}
>
<option placeholder="" value="">
Select Value
</option>
<option kay="Y" value="Y">
Yes
</option>
<option kay="N" value="N">
No
</option>
</select> 
{errors.DisplayYN && (
<Label style={{ color: "#dc3545" }}>{errors.Parent_Id}</Label>
)}
</div>

</div>
<div className="row mb-2">

<Label className="col-sm-2">Menu Level   </Label>
<div className="col-sm-4">
<Input
type="text"
className="form-control"
placeholder="Enter Menu Level"
id="Level_Idx"
name="Level_Idx"
value={data.Level_Idx}
invalid={errors.Level_Idx ? true : false}
onChange={this.changeHandler}
/>
</div>

<Label className="col-sm-2" style={{display:"none"}}>Idx  </Label>
<div className="col-sm-4" style={{display:"none"}}>
<Input
type="text"
className="form-control"
placeholder="Enter Idx"
id="Idx"
name="Idx"
value={data.Idx}
invalid={errors.Idx ? true : false}
onChange={this.changeHandler}
/>
</div>

</div>

          <Button className="btn btn-primary btn-block">Submit</Button> 
          
        </Form>
      </>
    );
  }
}
export default connect((state) => ({
  user: state.user,
}))(AddPageMast);
//export default AddPageMast;
