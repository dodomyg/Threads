import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Button } from '@chakra-ui/react'
import { FiLogOut } from "react-icons/fi";
import axios from "axios"
import { useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"
axios.defaults.withCredentials = true

const LogOut = () => {

    const navigate = useNavigate()
    const toast = useToast()
    const {setUser}=useContext(UserContext)

    const handleLogOut=async()=>{
        
        try {
            const resp =await axios.post("http://localhost:8000/threads/users/logout",{withCredentials:true})
            setUser(null)
            toast({
                title: resp.data.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            navigate("/login")

        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
         <Button onClick={handleLogOut} position={'fixed'} top={'27px'} right={'30px'} >
                <FiLogOut size={'25px'}/>
        </Button>
            
    </div>
  )
}

export default LogOut