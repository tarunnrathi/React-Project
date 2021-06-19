import React, { Component } from 'react'
import "./collapse.css";
import axios from "axios";
import { connect } from "react-redux";

import Minus from "../components/images/minus.jpg"
import Plus from "../components/images/plus.jpg"
import { userInfo } from "../redux/actions/user";
import { persistor } from "../store";

import TreeViewMenu from 'react-simple-tree-menu'

const imageArray = { Minus, Plus };

class TreeMenu extends Component {


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
			parentId: ''


		}
		this.toggleSubMenu = this.toggleSubMenu.bind(this);
	}

	componentDidMount() {
		 debugger;;
		//console.log("componentDidMount");
		const {u}= this.props
		//console.log("user data==" + JSON.stringify(this.props.user));
		// var url = 'http://localhost:52227/api/hrapi/MenuItem?EmpId='+this.props.user.info.EmpId+'&companyId='+this.props.user.info.CompanyId;
		// var url = 'http://localhost:52227/api/hrapi/MenuItem?EmpId='+this.props.user.info.EmpId+'&companyId='+1
		// var url = 'http://localhost:52227/api/hrapi/MenuItem';
	       var url = `${axios.baseURL}/hrapi/MenuItem`;

		axios.get(url).then((res, err) => {
			 //debugger;;
			if (res.data.Status === "1") {
				 //debugger;;

				const { updatedArray } = res.data.Data.MainMenuList.length > 0 ?
					res.data.Data.MainMenuList.sort((a, b) => { return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1 }).map((item0, i) => {
						debugger
						Object.assign(item0, { Index: i });
						if (item0.SubMenu.length > 0) {
							item0.SubMenu.sort((a, b) => { return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1 }).map((item1, j) => {
								Object.assign(item1, { Index: i + "" + j });
								if (item1.SubMenu.length > 0) {
									item1.SubMenu.sort((a, b) => { return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1 }).map((item2, k) => {
										Object.assign(item2, { Index: i + "" + j + "" + k });
									});
								}
							})
						}
					}) : [];
					
				this.setState({
					menuList: res.data.Data.MainMenuList					
				});
			}
			if (err) {
				console.log(err);
			}

			//console.log(res.data.Data);
		});
	}
	//


	toggleSubMenu = (e, val, id, nameArray, text) => {
		 debugger;;
		if (this.props.selectedUserId != "" && this.props.selectedCompanyId != "") {

			if (text === e.target.id && nameArray.length > 0) {

				var index = e.target.id.split(" ");

				//resetting the menu to it original situation

				if (this.state.val != id && this.state.val != "" && index[1] == "") {

					if (this.state.arrIndex.length == 2 && this.state.arrIndex[1] === "") {
						this.state.menuList.map(item0 => {
							 debugger;
							if (item0.SubMenu.length > 0) {
								 debugger;
								var t = item0.SubMenu;
								item0.SubMenu.filter(arr => arr.Parent_Id === this.state.val).map((item1, i) => {
									 debugger;
									document.getElementById(this.state.arrIndex[0] + " " + i).hidden = true;
								});
								var t = "img " + index[0] + " "
								document.getElementById("img " + this.state.arrIndex[0] + " ").setAttribute('src', Plus);
							}
						});
						
					}

					if (this.state.arrIndex.length == 2 && this.state.arrIndex[1] != "") {
						this.state.menuList.map(item0 => {
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

					this.state.menuList.map(item0 => {
						 //debugger;
						if (item0.SubMenu.length > 0) {
							item0.SubMenu.filter(arr => arr.ID == this.state.val).map((item1, i) => {
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
					debugger;
					this.getPermission(id, this.props.selectedUserId, this.props.selectedCompanyId);
					if (index[1] === "") {

						var tempList = this.state.menuList.filter(arr => arr.ID == val);
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
					}

					if (index.length == 2 && index[1] != "") {
						 //debugger;;
						var tempList = this.state.menuList;
						if (tempList.length > 0) {
							 //debugger;
							tempList.map((item0) => {
								 //debugger;
								if (item0.SubMenu.length > 0) {
									 //debugger;
									item0.SubMenu.filter(arr => arr.ID == val).map((item2, i) => {
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
				}
			}
		}
		else {
			alert('Please Select the User first then Compnay');
		}
	}

	getPermission = (id, empid, companyId) => {
		 debugger;
		var url = `${axios.baseURL}/HRAPI/GetMenuByUserPermission_ById?EmpID=` + empid + `&MenuID=` + id + `&companyId=` + companyId;
		//var url = `http://localhost:52227/api/HRAPI/GetMenuByUserPermission_ById?EmpID=` + empid + `&MenuID=` + id + `&companyId=` + companyId;

		axios.get(url)
			.then((res, err) => {
				 //debugger;;
				if (res.data.Status === "1") {
					this.setState({
						permission: res.data.Data,
						//menuList: this.state.menuList.filter(arr => arr.Parent_Id == id)
					});
					//return res.data.Data;
				}
				else {
					this.setState({
						permission: []
					});
					//return [];

				}

			});

	}



	componentDidUpdate(preProp, preState) {
		 //debugger;;
		// console.log("preProp= ", preProp);
		// console.log("preState= ", preState);
		if (preProp.selectedCompanyId != this.props.selectedCompanyId) {
			this.setState({
				permission: [],
			});

		}


	}

	componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	recursiveSubMenu = (menu) => {
		 //debugger;;
		return menu.map(hmenu => {
			 //debugger;;
			var t = hmenu.Parent_Id == "0" ? this.state.zeroLevel : hmenu.Parent_Id == "1" ? this.state.firstLevel : hmenu.Parent_Id == "5" ? this.state.secondLevel : true;
			return (
				<div className="dd" hidden={hmenu.Parent_Id == "0" ? this.state.zeroLevel : hmenu.Parent_Id == "1" ? this.state.firstLevel : hmenu.Parent_Id == "2" ? this.state.secondLevel : true}>
					<ol class="tree">
						<div id={hmenu.ID} >
							<li onClick={() => this.toggleSubMenu(hmenu.ID, hmenu.ID, hmenu.SubMenu)}>
								{hmenu.MenuName}
								{hmenu.SubMenu.length > 0 ? this.recursiveSubMenu(hmenu.SubMenu.sort((a, b) => {
									return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
								})) : null}
							</li>
						</div>
					</ol>
				</div>
			)
		}
		)
	}





	render() {
		 debugger;;

		// const { subMenuVisible } = this.state;
		// const { proppppppppppppp } = this.props;
		// const imageName = this.state.img

		this.props.callMenuName(this.state.permission, this.state.nameArray);

		const { opened } = this.state
		return (
			<>
				<div className="dd">
					{this.state.menuList.length > 0 ? this.state.menuList.map((hmenu, i) => {
						debugger
						return (
							<div>
								<ol className="tree">
									<li id={i + " "} key={i + " "} onClick={(e) => this.toggleSubMenu(e, hmenu.ID, hmenu.ID, hmenu.SubMenu, i + " ")} >
										{hmenu.SubMenu.length > 0 ? <img id={"img " + i + " "} src={Plus} ></img> : ""}&nbsp;

										{hmenu.MenuName}
										<div >
											{hmenu.SubMenu.length > 0 ? hmenu.SubMenu.sort((a, b) => {
												return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
											}).map((submenu, j) => {
												return (

													<ol className="tree" key={i + " " + j} >
														<li onClick={(e) => this.toggleSubMenu(e, submenu.ID, submenu.ID, submenu.SubMenu, i + " " + j)} hidden={true} id={i + " " + j} >
															{submenu.SubMenu.length > 0 ? 
															<>
															<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>															
															<img id={"img " + i + " " + j} src={Plus} ></img>
															</> : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}&nbsp;
															{submenu.MenuName}
															<div>
																{submenu.SubMenu.length > 0 ? submenu.SubMenu.sort((a, b) => {
																	return parseInt(a.ID) > parseInt(b.ID) ? 1 : -1
																}).map((sub_submenu, k) => {
																	return (
																		<ol className="tree" key={i + " " + j + " " + k}>
																			<li onClick={(e) => this.toggleSubMenu(e, sub_submenu.ID, sub_submenu.ID, sub_submenu.SubMenu)} hidden={true} id={i + " " + j + " " + k} key={i + " " + j + " " + k}>
																				{sub_submenu.SubMenu.length > 0 ? 
																				<>
																				<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
																				<img id={"img " + i + " " + j + " " + k} src={Minus} ></img>
																				</> :  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}&nbsp;
																				{sub_submenu.MenuName}
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
}),{userInfo})(TreeMenu);


















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
