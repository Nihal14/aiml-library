import Footer from "./Components/Footer"
import NavBar from "./Components/NavBar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentMainRoute from "./Routes/Student";
import AdminRoute from "./Routes/Admin";
import LoginRoute from "./Routes/Login";
import PageNotFound from "./Routes/PageNotFound";
import About from "./Routes/About";
import AdminLogin from "./Routes/AdminLogin";

function App() {

  return (
    <>
      <Router>
      <NavBar />
        <Routes>
          <Route path="/" exact element={<LoginRoute />} />
          <Route path="/student-dashboard" element={<StudentMainRoute />} />
          <Route path="/admin" exact element={<AdminLogin />} /> 
          <Route path="/admin-dashboard" exact element={<AdminRoute />} /> 
          <Route path="/about" exact element={<About />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      <Footer />
      </Router>
    </>
  )
}

export default App