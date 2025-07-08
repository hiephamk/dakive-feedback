import {BrowserRouter as Router, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard";
// import Community from "./pages/Community";
import Login from "./pages/Login"
import Register from "./pages/Register"
// import HomeRoomOwner from "./components/RoomOwner/HomeRoomOwner"
// import HomeBuidingManagement from "./components/BuildingManagement/HomeBuidingManagement"
import About from "./pages/About"
import Community from "./pages/Community"
import PrivateRoute from "./services/PrivateRoute"
import Activate from "./pages/Activate";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import NotFound from "./pages/NotFound"
import Account from "./pages/Account";
import UpdateProfile from "./components/UpdateProfile";
import Building from "./components/BuildingManagement/Building"
import Report from './components/Reports/Report'
import HomePage from "./pages/HomePage";
import BuildingList from "./components/BuildingManagement/BuildingList";
import CreateRoom from "./components/RoomOwner/CreateRoom";
import CreateRoomAsBuildingId from "./components/RoomOwner/CreateRoomAsBuildingId";
import RoomList from "./components/RoomOwner/RoomList";
import CreateRoomReport from "./components/Reports/CreateRoomReport";
import RoomReportOwner from "./components/Reports/RoomReportOwner"
import RoomReportAnalytics from "./components/Reports/RoomReportAnalytics"
import ReportByRoom from "./components/Reports/ReportByRoom";
import BuildingReports from "./components/Reports/BuildingReports"
import UpdateBuilding from "./components/BuildingManagement/UpadateBuilding";
import UpdateRoom from "./components/RoomOwner/UpdateRoom";
import Home_login from "./pages/Home_login";
import Organization_Details from "./components/Organization/Organization_Details";
import Add_Member from "./components/Organization/Add_Member";
import Update_Role_Members from "./components/Organization/Update_Role_Members";
import AdminPage from "./pages/AdminPage";
import UpdateBuildingOrg from "./components/BuildingManagement/UpadateBuildingOrg";
import Organizations from "./components/Organization/Organizations";
import UpdateOrg from "./components/Organization/UpadateOrg";
import SensorDataBuildings from "./components/Sensor-Data/SensorDataBuildings";
import SensorDataRooms from "./components/Sensor-Data/SensorDataRooms";
import UserFeedbackData_Building from "./components/UserFeedback/UserFeedbackData_Building";
import SensorReportsList from "./components/Sensor-Data/SensorReportsList";
import Community_Dashboard from "./pages/Community_Dashboard";
import HomeOrganization from "./components/Organization/HomeOrganization";
import FeedbackDone from "./pages/FeedbackDone";

function App() {
  return (
    <Router>
      {/* <Nav/> */}
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/activate/:uid/:token" element={<Activate/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset/confirm/:uid/:token" element={<ResetPasswordConfirm/>} />
        <Route path="/home" element={<PrivateRoute element={<Dashboard/>}/>}>
          <Route index element={<HomePage/>}/>
          <Route path="/home/admin" element = {<AdminPage/>}>
            <Route index element={<HomeOrganization/>}/>
            <Route path="/home/admin/organization/details/:orgId" element={<Organization_Details/>}/>
            <Route path="/home/admin/organization/add-members/" element={<Add_Member/>}/>
            <Route path="/home/admin/organization/update_members/:id" element={<Update_Role_Members/>}/>
            <Route path="/home/admin/add_organization" element={<Organizations/>}/>
            <Route path="/home/admin/building/update/:buildingId" element={<UpdateBuildingOrg/>}/>
            <Route path="/home/admin/organization/update/:orgId" element={<UpdateOrg/>}/>
            {/* <Route path="/home/admin/management/room-list/:buildingId/:externalId/:orgId" element={<RoomList/>}/> */}
            {/* <Route path="/home/admin/management/room/update/:roomId/:orgId" element={<UpdateRoom/>}/> */}
          </Route>
          <Route path="/home/community" element={<Community_Dashboard/>}>

          </Route>
          <Route path="/home/management/sensor-data/room-list/:id" element={<SensorDataRooms/>}/>
          <Route path="/home/management/sensor-data/reports/" element={<SensorReportsList/>}/>
          {/* <Route path="/home/management/sensor-data/reports/:buildingid/:externalid" element={<SensorReportsList/>}/> */}
          {/* <Route path="/home/management/sensor-data/reports/:buildingid/:externalid" element={<BuildingReports/>}/> */}
          <Route path="/home/management/sensor-data/building-list" element={<SensorDataBuildings/>}/>
          <Route path="/home/management/building-reports/:buildingId" element={<UserFeedbackData_Building/>}/>
          {/* <Route path="/home/management/sensor-data" element={<UserFeedbackData_Building/>}/> */}
          {/* <Route path="/home/management/building-reports/:buildingId" element={<BuildingReports/>}/> */}
          <Route path="/home/about" element={<About/>}/>
          <Route path="/home/community" element={<Community/>}/>
          <Route path="/home/profile" element={<Account/>}/>
          <Route path="/home/update-profile" element={<UpdateProfile/>}/>
          <Route path="/home/management/add_building" element={<Building/>}/>
          <Route path="/home/management/report/room/:roomId" element={<ReportByRoom/>}/>
          <Route path="/home/management/building-list" element={<BuildingList/>}/>          
          <Route path="/home/management/create-room" element={<CreateRoom/>}/>
          <Route path="/home/management/create-room/:buildingId/:externalId" element={<CreateRoomAsBuildingId/>}/>
          <Route path="/home/management/feedback/create-form/:buildingId/:roomId" element={<RoomReportOwner/>}/>
          <Route path="/home/management/room-list/:buildingId/:externalId/:orgId" element={<RoomList/>}/>
          <Route path="/home/management/report/chart" element={<RoomReportAnalytics/>}/>
          <Route path="/home/management/report/table" element={<Report/>}/>
          <Route path="/home/management/building/update/:buildingId" element={<UpdateBuilding/>}/>
          <Route path="/home/management/room/update/:roomId/:orgId" element={<UpdateRoom/>}/>
          <Route path="/home/login" element={<Home_login/>}/>
        </Route>
          <Route path="/room/feedback/:roomId/:showSensorData/" element={<CreateRoomReport/>}/>
          <Route path="/room/feedback/finished/" element={<FeedbackDone/>}/>
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
