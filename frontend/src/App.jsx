import {BrowserRouter as Router, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard";
// import Community from "./pages/Community";
import Login from "./pages/Login"
import Register from "./pages/Register"
import HomeRoomOwner from "./components/RoomOwner/HomeRoomOwner"
import HomeBuidingManagement from "./components/BuildingManagement/HomeBuidingManagement"
import About from "./pages/About"
import Community from "./pages/Community"
import PrivateRoute from "./services/PrivateRoute"
import Activate from "./pages/Activate";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import NotFound from "./pages/NotFound"
import Account from "./pages/Account";
import UpdateProfile from "./components/UpdateProfile";
import ManagementBoard from "./pages/ManagementBoard";
import Building from "./components/BuildingManagement/Building"
import Report from "./components/BuildingManagement/Report";
import HomePage from "./pages/HomePage";
import Organizations from "./components/BuildingManagement/Organizations";
import BuildingList from "./components/BuildingManagement/BuildingList";
import CreateRoom from "./components/RoomOwner/CreateRoom";
import CreateRoomAsBuildingId from "./components/RoomOwner/CreateRoomAsBuildingId";
import RoomList from "./components/RoomOwner/RoomList";
import CreateRoomReport from "./components/RoomOwner/CreateRoomReport";
import RoomReportOwner from "./components/RoomOwner/RoomReportOwner"
import RoomReportAnalytics from "./components/BuildingManagement/RoomReportAnalytics"
import ReportByRoom from "./components/BuildingManagement/ReportByRoom";
import BuildingReports from "./components/BuildingManagement/BuildingReports"
import UpdateBuilding from "./components/BuildingManagement/UpadateBuilding";
import UpdateRoom from "./components/RoomOwner/UpdateRoom";

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
          {/* <Route path="/home" element={<HomeBuidingManagement/>}/> */}
          <Route path="/home/about" element={<About/>}/>
          <Route path="/home/community" element={<Community/>}/>
          <Route path="/home/profile" element={<Account/>}/>
          <Route path="/home/update-profile" element={<UpdateProfile/>}/>
          <Route path="/home/management/add_building" element={<Building/>}/>
          <Route path="/home/management/report/room/:roomId" element={<ReportByRoom/>}/>
          <Route path="/home/management/add_organization" element={<Organizations/>}/>
          <Route path="/home/management/building-list" element={<BuildingList/>}/>          
          <Route path="/home/management/create-room" element={<CreateRoom/>}/>
          <Route path="/home/management/create-room/:buildingId" element={<CreateRoomAsBuildingId/>}/>
          <Route path="/home/management/feedback/create-form/:buildingId/:roomId" element={<RoomReportOwner/>}/>
          <Route path="/home/management/room-list/:buildingId" element={<RoomList/>}/>
          <Route path="/home/management/report/chart" element={<RoomReportAnalytics/>}/>
          <Route path="/home/management/report/table" element={<Report/>}/>
          <Route path="/home/management/building-reports/:buildingId" element={<BuildingReports/>}/>
          <Route path="/home/management/building/update/:buildingId" element={<UpdateBuilding/>}/>
          <Route path="/home/management/room/update/:roomId" element={<UpdateRoom/>}/>
        </Route>
          <Route path="/room/feedback/:roomId/" element={<CreateRoomReport/>}/>
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
