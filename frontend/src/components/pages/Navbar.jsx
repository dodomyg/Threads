import React from 'react'
import { Box } from '@chakra-ui/react'
import { BsThreads } from "react-icons/bs";
import {useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <Box my={6} mx={4} display={'flex'} onClick={()=>navigate('/')} cursor={'pointer'} justifyContent={'center'} alignItems={'center'}>
        <BsThreads size={'35px'}/>
    </Box>
  )
}

export default Navbar