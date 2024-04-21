import React, { useContext } from 'react'
import {Routes, Route,Navigate} from 'react-router-dom'
import { Container } from '@chakra-ui/react'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import Navbar from './components/pages/Navbar'
import { UserContext } from './components/context/UserContext'
import LogOut from './components/pages/LogOut'
import Update from './components/pages/Update'
import UpdateButton from './components/pages/UpdateButton'

import SearchButton from './components/pages/SearchButton'
import UserProfile from './components/pages/UserProfile'
import SinglePost from './components/pages/SinglePost'
import Create from './components/pages/Create'

const App = () => {
  const {user}=useContext(UserContext)
  return (
    <Container maxW={'700px'} margin={'auto'}>
      <Navbar/>
        <Routes>
            <Route path='/' element={user?<Home/>:<Navigate to='/login' />}/>
            <Route path='/login' element={!user ? <Login/> : <Navigate to={'/'}/>}/>
            <Route path='/register' element={!user ?<Register/> : <Navigate to={'/'}/>}/>
            <Route path='/update/:id' element={!user ? <Navigate to={'/login'} /> :  <Update/>}/>
            <Route path='/create' element={user && <Create/>}/>
            <Route path='/profile/:id' element={user && <UserProfile/>}/>
            <Route path='/threads/:id' element={user && <SinglePost/>}/>
            
        </Routes>
        {user && <LogOut/>}
        {user && <UpdateButton/>}
        {user && <SearchButton/>}
    </Container>
  )
}

export default App