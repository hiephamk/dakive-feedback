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
import RoomOwnerDashboard from "./pages/RoomOwnerDashboard";
import Report from "./components/BuildingManagement/Report";
import HomePage from "./pages/HomePage";
import Organizations from "./components/BuildingManagement/Organizations";
import BuildingList from "./components/BuildingManagement/BuildingList";
import Feedback from "./components/RoomOwner/Feedback";
import CreateRoom from "./components/RoomOwner/CreateRoom";
import RoomList from "./components/RoomOwner/RoomList";
import CreateRoomReport from "./components/RoomOwner/CreateRoomReport";
import UpadateBuilding from "./components/BuildingManagement/UpadateBuilding";


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
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard/>}/>}>
          <Route index element={<HomePage/>}/>
          <Route path="/dashboard/about" element={<About/>}/>
          <Route path="/dashboard/community" element={<Community/>}/>
          <Route path="/dashboard/profile" element={<Account/>}/>
          <Route path="/dashboard/update-profile" element={<UpdateProfile/>}/>
        </Route>
        <Route path="/room" element={<PrivateRoute element={<RoomOwnerDashboard/>}/>}>
          <Route index element={<HomeRoomOwner/>}/>
          <Route path="/room/home" element={<HomeRoomOwner/>}/>
          <Route path="/room/feedback" element={<Feedback/>}/>
          <Route path="/room/create-room" element={<CreateRoom/>}/>
          <Route path="/room/room-list" element={<RoomList/>}/>
          <Route path="/room/room-report" element={<CreateRoomReport/>}/>
          {/* <Route path="*" element={<NotFound/>}/> */}
        </Route>
        <Route path="/management" element={<PrivateRoute element={<ManagementBoard/>}/>}>
          <Route index element={<HomeBuidingManagement/>}/>
          <Route path="/management/home" element={<HomeBuidingManagement/>}/>
          <Route path="/management/add_building" element={<Building/>}/>
          <Route path="/management/report" element={<Report/>}/>
          <Route path="/management/add_organization" element={<Organizations/>}/>
          <Route path="/management/building-list" element={<BuildingList/>}/>    
          <Route path="/management/building-update" element={<UpadateBuilding/>}/>    
        </Route>
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
