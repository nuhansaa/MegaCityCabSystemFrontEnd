import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import AboutUs from './Pages/AboutUs'
import AuthLogin from './Pages/AuthLogin'
import AuthSignUp from './Pages/AuthSignUp'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import DriverRegister from './components/DriverRegister/DriverRegister'
import Contact from './components/Contact/Contact'
import Cabs from './components/Cabs/Cabs'
import BookingForm from './components/BookingForm/BookingForm'
import AdminRoutes from './components/Admin_Panel/AdminRoutes'
import DriverProfile from './components/DriverProfile/DriverProfile'
import UpdateDriverProfile from './components/DriverProfile/UpdateDriverProfile'
import CustomerProfile from './components/Customer/CustomerProfile'


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={
          <main>
            <Navbar/>
            <Home/>
            <Footer/>
          </main>
        }
        />
        <Route path ='/Drive' element={<DriverRegister/>}/>
        <Route path ='/AboutUs' element={<AboutUs/>}/>
        <Route path ='/AuthLogin' element={<AuthLogin/>}/>
        <Route path ='/AuthSignUp' element={<AuthSignUp/>}/>
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Cabs' element={<Cabs/>}/>
        <Route path='/BookingForm' element={<BookingForm/>}/>
        <Route path='/admin/*' element={<AdminRoutes/>}/>
        <Route path='/DriverProfile' element={<DriverProfile/>}/>
        <Route path='/UpdateDriverProfile' element={<UpdateDriverProfile/>}/>
        <Route path='/CustomerProfile' element={<CustomerProfile/>}/>
        
      </Routes>
    </>
    
  )
}

export default App
