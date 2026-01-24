
import {Routes,Route} from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./components/Login"
import Test from "./components/Test"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import Connections from "./components/Connections"
import Request from "./components/Request"

function App() {
  return (
    <div>
  
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route path="/login" element={<Login/>}/>
      <Route path="/test" element={<Test/>}/>
      <Route path="/feed" element={<Feed/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/connections" element={<Connections/>}/>
      <Route path="/requests" element={<Request/>}/>
      </Route>
    </Routes>


    </div>
    
  )
}

export default App
