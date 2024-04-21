import React, { useContext } from 'react'
import {Button} from '@chakra-ui/react'
import { UserContext } from '../context/UserContext'
import { FaUserEdit } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'

const UpdateButton = () => {
    const navigate=useNavigate()
    const {user}=useContext(UserContext)
    if(!user){
        return;
    }
  return (
    <div>
        <Button key={user._id} onClick={() => navigate(`profile/${user._id}`)} position={'fixed'} top={'27px'} right={'120px'} >
                <FaUserEdit size={'25px'}/>
        </Button>
    </div>
  )
}

export default UpdateButton