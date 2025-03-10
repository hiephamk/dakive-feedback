import {BrowserRouter as Router, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import About from "./pages/About"


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Dashboard/>}>
          <Route index element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/community" element={<Community/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
