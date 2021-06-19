import React,{lazy,Suspense} from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/react-fontawesome";
import { BrowserRouter as Router, Switch, Route, Link,useHistory  } from "react-router-dom";
import "./components/Style.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";

import Login from "./components/login.component";
import Admin from "./components/Admin";
import Logout from "./components/logout";
import DepartmentGrid from "./components/Departments/DepartmentGrid";
import Designation from "./components/Designations/Designation";
import WorkingLocation from "./components/WorkingLocation/WorkLocation";
import PageMast from "./components/PageMast/PageMast";
import ShiftMaster from "./components/ShiftMaster/ShiftMaster";
import userperm from "./components/userperm";
import AddDepartmentcls from "./components/Departments/AddDepartmentcls";
import CompanyMaster from "./components/CompanyMaster/CompanyMaster";
import CompanyMasterGrid from "./components/CompanyMaster/CompanyMaster";
import WorkLocation from "./components/WorkingLocation/WorkLocation";
import CompanyUserMapping from "./components/CompanyUserMappings/CompanyUserMapping";
import LoginCompany from "./components/LoginCompanys/LoginCompany"
import DepartmentShift from "./components/DepartmentShifts/DepartmentShift"
import DepartmentShiftUI from "./components/DepartmentShifts/DepartmentShiftUI";
import SanctionedPost from "./components/SanctionedPost/SanctionedPost";
import EmployeeTypeMaster from "./components/EmployeeTypeMaster/EmployeeTypeMaster";
import CompanyTypeMaster from "./components/CompanyTypeMaster/CompanyTypeMaster";
import EmployeeMaster from "./components/EmployeeMaster/EmployeeMaster"
import MaterialGridDemo from "./components/CompanyMasteTest/MaterialGridDemo"
import Materialgriddemo2 from "./components/CompanyMasteTest/Materialgriddemo2"
import Materialgriddemo3 from "./components/CompanyMasteTest/Materialgriddemo3"
import Header from "./components/Header"
import UserDashboard from "./components/Dashboard/UserDashboard"
import EmployeeShift from "./components/EmployeeShift/EmployeeShift";
import ControlPermission from "./components/ControlPermission/ControlPermission";
import EmployeeShiftWeekOff from "./components/EmployeeShiftWeekOff/EmployeeShiftWeekOff"; 
import MachineMaster from './components/Machine/MachineMaster';
import { div } from "react-dom-factories";
import BioMachineUpdate from "./components/BioMachineUpdate/BioMachineUpdate";
import CheckInOut from "./components/CHECKINOUT/CheckInOut";
import GateTimeTable from "./components/Gate Time Table/GateTimeTable";



function App(props) {
  let history = useHistory();
  return (
    <Provider key={store} store={store}>
       <PersistGate key={persistor} loading={null} persistor={persistor}>
        <Router key="s2">
        {history.location.pathname === '/' || history.location.pathname === '/sign-in' || history.location.pathname === '/LoginCompany' ? null : <Header history={history}/>}
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/admin" component={Admin} />
            <Route path="/logout" component={Logout} />
            <Route path="/departmentgrid" component={DepartmentGrid} />
            <Route path="/designation" component={Designation} />
            <Route path="/workinglocation" component={WorkingLocation} />
            <Route path="/userperm" component={userperm} />  
            <Route path="/pagemast" component={PageMast} />  
            <Route path="/WorkLocation" component={WorkLocation}/>
            <Route path="/CompanyUserMapping" component={CompanyUserMapping}/>
            <Route path="/LoginCompany" component={LoginCompany} />           
            <Route path="/DepartmentShift" component={DepartmentShift} />        
            <Route path="/CompanyMasterGrid" component={CompanyMasterGrid} />   
            <Route path="/DepartmentShiftUI" component={DepartmentShiftUI} />
            <Route path="/companymaster" component={CompanyMaster} />         
            <Route path="/ShiftMaster" component={ShiftMaster} />           
            <Route path="/CompanyMasterGrid" component={CompanyMasterGrid} />   
            <Route path="/sanctionedpost"  component={SanctionedPost} />
            <Route path="/employeetypemaster" component={EmployeeTypeMaster} />
            <Route path="/companytypemaster" component={CompanyTypeMaster} />
            <Route path="/EmployeeMaster" component={EmployeeMaster}/>
            <Route path="/MaterialGridDemo" component={MaterialGridDemo}/>
            <Route path="/Materialgriddemo2" component={Materialgriddemo2}/>
            <Route path="/Materialgriddemo3" component={Materialgriddemo3}/>
            <Route path="/UserDashboard" component={UserDashboard} />
            <Route path="/ControlPermission" component={ControlPermission} />             
            <Route path="/EmployeeShiftWeekoff" component={EmployeeShiftWeekOff} />    
            <Route path="/MachineMaster" component={MachineMaster} />       
            <Route path="/BioMachineUpdate" component={BioMachineUpdate} /> 
            <Route path="/EmployeeShift" component={EmployeeShift} /> 
            <Route path="/CheckInOut" component={CheckInOut} /> 
            <Route path="/GateTimeTable" component={GateTimeTable} />        
            
          </Switch>
        </Router>
       </PersistGate> 
     </Provider>
  );
}
export default App;


