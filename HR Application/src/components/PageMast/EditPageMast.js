import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import $ from "jquery";
import {
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Button,
} from "reactstrap";
import { isEmail, isNumeric } from "validator";

class EditPageMast extends Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    data: {
      PageName: "",
      Viwe_Index: "",
      Parent_Id: "",
      Module_Id: "",
      Directory: "",
      DisplayName: "",
      DisplayYN: "",
      Img: "",
      Level_Idx: "",
      Idx: "",

    },
    Menuid: "",
    PetentID: [],
    isLoading: false,
    errors: {},
  });

  changeHandler = (e) => {
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
  };

  validate = () => {
    const { data } = this.state;
    let errors = {};

    if (data.PageName === "") errors.PageName = "Page Name can not be blank.";
    if (data.DisplayName === "") errors.DisplayName = "Display Name can not be blank.";
    return errors;
  };

  submitHandler = (e) => {
    e.preventDefault();
    if (this.state.isLoading) {
      return;
    }
    const { data } = this.state;
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      console.log("data---------------------------");
      console.log(data);
      debugger;
      this.setState({ isLoading: true });

      axios
        .post(
          `${axios.baseURL}/PageMast/PostPageMast?ActionType=Edit&EmpID=${this.props.user.info.EmpId}&MenuID=` +
          this.state.Menuid,
          this.state.data
        )
        .then((response) => {
          this.props.closeModal();
          setTimeout(() => {
            alert("Record updated..");
          }, 1000);

          this.setState({ isLoading: false });

          // this.setState(this.getInitialState());
          // window.location.reload(false);
          console.log(response);
          // window.$("#myEditModal").modal("hide");
          // window.location.reload();
        })
        .catch((error) => {
          console.log("Error==" + error);
          setTimeout(() => {
            alert("Record Failed..");
          }, 1000);
          this.props.closeModal();
          // window.$("#myEditModal").modal("hide");
          // window.location.reload();
        });
    } else {
      this.setState({ errors });
    }
  };

  loadUser = async (id) => {
    debugger;
    console.log(" id    " + id);
    const result = await axios.get(
      `${axios.baseURL}/PageMast/GetPageMastById?id=${id}`
    );

    let pagemastinfo = result.data.Data[0];

    this.setState(
      {
        data: {
          PageName: pagemastinfo.PageName,
          Viwe_Index: pagemastinfo.Viwe_Index,
          Parent_Id: pagemastinfo.Parent_Id,
          Module_Id: pagemastinfo.Module_Id,
          DisplayName: pagemastinfo.DisplayName,
          DisplayYN: pagemastinfo.DisplayYN === 'NO' ? 'N' : 'Y',
          Level_Idx: pagemastinfo.Level_Idx,
          Idx: pagemastinfo.Idx,
          Img: "",
          Directory: "",
        },
        isLoading: false,
        Menuid: id,
      },
      () => {
        console.log("data===");
        console.log(this.state.data);
        console.log(this.state);
      }
    );
  };
  handleChange = (e) => {
    var val = e.target.value;
    axios.get(`${axios.baseURL}/PageMast/GetPageMastByViewIndexById?id=` + val)
      .then((res, err) => {
        if (res) {
          this.setState({
            data: {
              ...this.state.data,
              Viwe_Index: res.data.Data[0].Viwe_Index,
            }

          })

        }
        if (err) {
          debugger;

        }
      });

    this.setState({
      data: {
        ...this.state.data,
        Parent_Id: e.target.value,

      },
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },

    });

  };


  componentDidMount() {
    debugger;
    //let PetentID
    const { abc } = this.props;
    console.log(abc);
    axios.get(`${axios.baseURL}/PageMast/GetPageMastByLevel`).then((res) => {
      this.setState({ PetentID: res.data.Data });
    });
  }



  componentWillReceiveProps(nextProps) {
    debugger;
    if (this.props !== nextProps) {
      debugger;
      let EditPageMastId = nextProps.EditPageMastId;
      if (EditPageMastId >= 0) {
        console.log("Infoo=== 96");
        this.loadUser(EditPageMastId);
      }
    }

  }


  render() {
    const { data, errors } = this.state;
    const { pagemastinfo } = this.props;
    const headers = { "Content-Type": "application/json" };

    console.log(data);
    console.log({ data });
    return (
      <>
        <Form onSubmit={this.submitHandler}>

          <div className="row mb-2">

            <Label className="col-sm-2">Page Name </Label>
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
              {/*<Input
type="text"
className="form-control"
placeholder="Enter Parent_Id"
id="Parent_Id"
name="Parent_Id"
value={data.Parent_Id}
invalid={errors.Parent_Id ? true : false}
onChange={this.changeHandler}
/>*/}

              <select value={data.Parent_Id}
                className="form-control"
                name="Parent_Id"
                //invalid={errors.Parent_Id ? true : false}
                onChange={this.handleChange}
              >
                <option value={0}> Select Parent .... </option>
                {
                  this.state.PetentID.map((hmenu) => (
                    <option key={hmenu.Id} value={hmenu.Id}> {hmenu.PageName}</option>
                  )

                  )}
              </select>


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
                <option key="Y" value="Y">
                  Yes
</option>
                <option key="N" value="N">
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
                placeholder="Enter Level Idx"
                id="Level_Idx"
                name="Level_Idx"
                value={data.Level_Idx}
                invalid={errors.Level_Idx ? true : false}
                onChange={this.changeHandler}
              />
            </div>

            <Label className="col-sm-2" style={{ display: "none" }}>Idx  </Label>
            <div className="col-sm-4" style={{ display: "none" }}>
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

          <Button className="btn btn-primary btn-block" type="submit">
            {this.state.isLoading ? "Loading..." : "Submit"}
          </Button>

        </Form>
      </>
    );
  }
}

export default connect((state) => ({
  user: state.user,
  userEdit: state.userEdit.userInfo,
}))(EditPageMast);

// export default EditPageMast;
