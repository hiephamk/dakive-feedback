import {BrowserRouter as Router, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import About from "./pages/About"
import PrivateRoute from "./services/PrivateRoute"
import Activate from "./pages/Activate";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import NotFound from "./pages/NotFound"
import Nav from "./components/Nav"
import Account from "./pages/Account";
import UpdateProfile from "./components/UpdateProfile";



function App() {

  return (
    <Router>
      <Nav/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/activate/:uid/:token" element={<Activate/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset/confirm/:uid/:token" element={<ResetPasswordConfirm/>} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard/>}/>}>
          <Route index element={<Home/>}/>
          <Route path="/dashboard" element={<Home/>}/>
          <Route path="/dashboard/about" element={<About/>}/>
          <Route path="/dashboard/community" element={<Community/>}/>
          <Route path="/dashboard/profile" element={<Account/>}/>
          <Route path="/dashboard/update-profile" element={<UpdateProfile/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
