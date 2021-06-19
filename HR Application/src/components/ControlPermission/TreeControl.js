import React, { Component } from 'react'
//import "";
import axios from "axios";
import { connect } from "react-redux";

import Minus from "../images/minus.jpg"
import Plus from "../images/plus.jpg"
import { userInfo } from "../../redux/actions/user";
import { persistor } from "../../store";
import { ToastContainer, toast } from 'react-toastify';
import TreeMenu from 'react-simple-tree-menu'

class TreeContro extends Component {


	constructor(props) {
		super(props);
		this.state = {
			menuList: [],
			selectedMenuId: 0,
			subMenuVisible: false,
			permission: [],
			nameArray: [],
			id: '',
			val: '',
			zeroLevel: false,
			firstLevel: true,
			secondLevel: true,
			arrIndex: [],
			parentId: '',
			Opened:true,


		}
		//this.toggleSubMenu = this.toggleSubMenu.bind(this);
	}

	// componentDidMount() {
	// 	 debugger;
	// 	 console.log('componentDidMount');
		
	// }
	
	toggleSubMenu = (e, val, id, nameArray, text,PageMastId) => {
		debugger;;
	   if (this.props.selectedUserId != "" && this.props.selectedCompanyId != "") {

		   if (text === e.target.id && nameArray.length > 0) {

			   var index = e.target.id.split(" ");

			   //resetting the menu to it original situation

			   if (this.state.val != id && this.state.val != "" && index[1] == "") {

				   if (this.state.arrIndex.length == 2 && this.state.arrIndex[1] === "") {
					   this.props.menuList.map(item0 => {
							//debugger;
						   if (item0.SubMenu.length > 0) {
								//debugger;
							   var t = item0.SubMenu;
							   item0.SubMenu.filter(arr => arr.Parent_Id === this.state.val).map((item1, i) => {
									//debugger;
								   document.getElementById(this.state.arrIndex[0] + " " + i).hidden = true;
							   });
							   var t = "img " + index[0] + " "
							   document.getElementById("img " + this.state.arrIndex[0] + " ").setAttribute('src', Plus);
						   }
					   });
					   
				   }

				   if (this.state.arrIndex.length == 2 && this.state.arrIndex[1] != "") {
					   this.props.menuList.map(item0 => {
							//debugger;
						   if (item0.SubMenu.length > 0) {
								//debugger;
							   var t = item0.SubMenu;
							   item0.SubMenu.filter(arr => arr.ID === this.state.val).map((item1, i) => {
									//debugger;
								   var t = this.state.arrIndex[0] + " " + this.state.arrIndex[1] + " " + i;
								   document.getElementById(this.state.arrIndex[0] + " " + this.state.arrIndex[1] + " " + i).hidden = true;
								   //document.getElementById(this.state.arrIndex[0] + " " + i).hidden = true;
							   });

							   var t = "img " + index[0] + " ";
							   document.getElementById("img " + this.state.arrIndex[0] + " " + this.state.arrIndex[1]).setAttribute('src', Plus);
						   }
						   item0.SubMenu.filter(arr => arr.Parent_Id === this.state.parentId).map((item2, i) => {
							   document.getElementById(this.state.arrIndex[0] + " " + i).hidden = true;
						   });

						   var t = "img " + index[0] + " ";
						   document.getElementById("img " + this.state.arrIndex[0] + " ").setAttribute('src', Plus);

					   });
				   }

			   }

			   if (this.state.arrIndex.length == 2 && (this.state.arrIndex[0] == index[0] && this.state.arrIndex[1] != index[1]) && this.state.arrIndex[1] != "") {
					//debugger;;

				   this.props.menuList.map(item0 => {
						//debugger;
					   if (item0.SubMenu.length > 0) {
						   item0.SubMenu.filter(arr => arr.PageMastId == this.state.val).map((item1, i) => {
								//debugger;
							   document.getElementById(this.state.arrIndex[0] + " " + this.state.arrIndex[1] + " " + i).hidden = true;
						   });

						   var t = "img " + this.state.arrIndex[0] + " " + this.state.arrIndex[1];
						   document.getElementById("img " + this.state.arrIndex[0] + " " + this.state.arrIndex[1]).setAttribute('src', Plus);
					   }
				   });
			   }




			   // setting the menu to its comming situation

			   if (this.props.selectedUserId != null && this.props.selectedCompanyId != null) {
				  // this.getPermission(id, this.props.selectedUserId, this.props.selectedCompanyId);
				   if (index[1] === "") {

					   var tempList = this.props.menuList.filter(arr => arr.PageMastId == val);
					   if (tempList.length > 0) {
							//debugger;
						   tempList.map((item0) => {
								//debugger;
							   if (item0.SubMenu.length > 0) {
									//debugger;
								   item0.SubMenu.map((item2, i) => {
										//debugger;
									   document.getElementById(index[0] + " " + i).hidden = false;
								   });
								   var t = "img " + index[0] + " ";
								   document.getElementById("img " + index[0] + " ").setAttribute('src', Minus);
							   }
						   });
					   }
					   this.setState({

						   nameArray: nameArray,
						   id: id,
						   val: val,
						   arrIndex: index,
						   parentId: id,
						   
					   });

					   this.getPermission(PageMastId);

					   
				   }

				   if (index.length == 2 && index[1] != "") {
						//debugger;;
					   var tempList = this.props.menuList;
					   if (tempList.length > 0) {
							//debugger;
						   tempList.map((item0) => {
								debugger;
							   if (item0.SubMenu.length > 0) {
									//debugger;
								   item0.SubMenu.filter(arr => arr.PageMastId == val).map((item2, i) => {
										//debugger;
									   if (item2.SubMenu.length > 0) {
										   item2.SubMenu.map((item3, i) => {
												//debugger;
											   var t = index[0] + " " + index[1] + " " + i;
											   document.getElementById(index[0] + " " + index[1] + " " + i).hidden = false;
										   });
										   var t = "img " + index[0] + " " + index[1];
										   document.getElementById("img " + index[0] + " " + index[1]).setAttribute('src', Minus);
									   }
								   });
							   }
						   });
					   }
				   }
				   this.setState({

					   nameArray: nameArray,
					   id: id,
					   val: val,
					   arrIndex: index,					

				   });
				   this.getPermission(PageMastId);
			   }
		   }
	   }
	   else {
		   alert('Please Select the User first then Compnay');
	   }
   }




	
	getPermission = (PageMastId) => {
		 debugger;;
		//  var url= `http://localhost:52227/api/Application_Control/GetControlPermissionByParentId?EmpID=${this.props.selectedUserId}&companyId=${this.props.selectedCompanyId}&ParentId=${PageMastId}`;

		 var url= `${axios.baseURL}/Application_Control/GetControlPermissionByParentId?EmpID=${this.props.selectedUserId}&companyId=${this.props.selectedCompanyId}&ParentId=${PageMastId}`;

		 axios.get(url)
		 .then(response=>{
			 if(response.data.Status==="1"){
			  this.props.callMenuName(response.data.Data);
			 }
			 else{
			  toast.warn(response.data.Message, { position: toast.POSITION.TOP_CENTER });
			 }
		 }).catch(error=>{
		  toast.error(error, { position: toast.POSITION.TOP_CENTER });
		 });

	}



	componentDidUpdate(preProp, preState) {
		 debugger;;
		// console.log("preProp= ", preProp);
		// console.log("preState= ", preState);
		// if (preProp.selectedCompanyId != this.props.selectedCompanyId) {
		// 	this.setState({
		// 		permission: [],
		// 	});

		// }

		// if (this.props.selectedUserId != "" && this.props.selectedCompanyId != ""){
		// 	var url=`http://localhost:52227/api/Application_Control/GetGetControlPermissionById?EmpID=${this.props.selectedUserId}&companyId=${this.props.selectedCompanyId}`;
		// 	axios.get(url)
		// 	.then((response)=>{
		// 		if(response.data.Status==="1"){
		// 			this.setState({
		// 				menuList: response.data.Data,
		// 				permission: [],
		// 			});
		// 		}
		// 		else{
		// 			toast.warn(response.data.Message, { position: toast.POSITION.TOP_CENTER });
		// 		}
		// 	})
		// 	.catch(error=>{
		// 		toast.error(error, { position: toast.POSITION.TOP_CENTER });
		// 	});

		// }


	}

	componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	recursiveSubMenu = (hmenu) => {
		debugger;
		   return (
			   <div>
				   <ol class="tree">
					   <div id={hmenu.PageMastId} >
						   <li>
							   {hmenu.PageName}
							   {this.state.menuList.filter(x=>x.Parent_Id===hmenu.PageMastId)>0?
							    this.state.menuList.filter(x=>x.Parent_Id===hmenu.PageMastId).map(item=>{
									this.recursiveSubMenu(item);
								})
								:null
								}
						   </li>
					   </div>
				   </ol>
			   </div>
		   )
    }
	render() {
		 debugger;;

		// const { subMenuVisible } = this.state;
		// const { proppppppppppppp } = this.props;
		// const imageName = this.state.img

		

		const { opened } = this.state
		return (
			<>
				<div className="dd">
					{this.props.menuList.length > 0 ? this.props.menuList.map((hmenu, i) => {
						//debugger
						return (
							<div>
								<ol className="tree">
									<li id={i + " "} onClick={(e) => this.toggleSubMenu(e, hmenu.PageMastId, hmenu.PageMastId, hmenu.SubMenu, i + " ",hmenu.PageMastId)} >
										{hmenu.SubMenu.length > 0 ? <img id={"img " + i + " "} src={Plus} ></img> : ""}&nbsp;

										{hmenu.DisplayName}
										<div >
											{hmenu.SubMenu.length > 0 ? hmenu.SubMenu.map((submenu, j) => {
												//debugger
												return (
													<ol className="tree" >
														<li onClick={(e) => this.toggleSubMenu(e, submenu.PageMastId, submenu.PageMastId, submenu.SubMenu, i + " " + j,submenu.PageMastId)}  id={i + " " + j} hidden={true}>
															{submenu.SubMenu.length > 0 ? 
															<>
															<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>															
															<img id={"img " + i + " " + j} src={Plus} ></img>
															</>
															 : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}&nbsp;
															{submenu.DisplayName}
															<div>
																{submenu.SubMenu.length > 0 ? submenu.SubMenu.map((sub_submenu, k) => {
																	//debugger
																	return (
																		<ol className="tree">
																			<li onClick={(e) => this.toggleSubMenu(e, sub_submenu.ID, sub_submenu.ID, sub_submenu.SubMenu)}  id={i + " " + j + " " + k} hidden={true}>
																				{sub_submenu.SubMenu.length > 0 ?
																				<>
																				<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
																				<img id={"img " + i + " " + j + " " + k} src={Minus} ></img>
																				</>
																				 : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}&nbsp;
																				{sub_submenu.DisplayName}
																			</li>

																		</ol>
																	)

																}) : null}
															</div>
														</li>
													</ol>

												)
											}) : null}
										</div>
									</li>
								</ol>
							</div>


						)
					})


						: null}

				</div>
			</>
		)		
	}
}

export default connect((state) => ({
	user: state.user,
}),{userInfo})(TreeContro);


















// return (
// 	<>
// 		<div className="dd">
// 			{this.state.persons.map((hmenu) => {
// 				// //debugger;;
// 				return (<ol class="tree">
// 					<li>
// 						<label onClick={() => this.toggleSubMenu(hmenu.ID, hmenu.ID, hmenu.SubMenu = hmenu.SubMenu)} >
// 							{hmenu.MenuName}
// 							<ol>
// 								<div id={hmenu.ID} hidden={true}>
// 									{hmenu.SubMenu.sort((a, b) => {
// 										return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
// 									}).map((submenu) => {
// 										// //debugger;;
// 										return (
// 											<li onClick={() => this.toggleSubMenu(submenu.ID, submenu.ID, submenu.SubMenu = submenu.SubMenu)}>
// 												<label  >
// 													{submenu.MenuName}
// 												</label>
// 												{submenu.SubMenu.length>0?submenu.SubMenu.sort((a,b)=>{
// 													return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
// 												}).map((sub_submenu)=>(
// 													<ol>
// 														<li>
// 															<label>
// 																{sub_submenu.MenuName}
// 															</label>
// 														</li>
// 													</ol>
// 												)):[]}
// 											</li>
// 										)
// 									})}
// 								</div>
// 							</ol>

// 						</label>
// 					</li>
// 				</ol>)

// 			})}

// 		</div>
// 	</>
// )
