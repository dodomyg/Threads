import React, { useContext, useEffect, useRef, useState } from 'react'
import {useParams,useNavigate} from "react-router-dom"
import { UserContext } from '../context/UserContext'
import {useToast,Avatar} from '@chakra-ui/react'

import {
  Button,
  Flex,
  FormControl,
  Input,

} from '@chakra-ui/react'
// import { FaPlus } from 'react-icons/fa'
import axios from "axios"
axios.defaults.withCredentials = true


const Update = () => {
  const navigate=useNavigate()
  const toast = useToast()
  const {user,setUser}=useContext(UserContext)


  const [name,setName]=useState("")
  const [dp,setDp]=useState("")
  const [email,setEmail]=useState("")
  const [id,setId]=useState("")
  const [username,setUsername]=useState("")
  const [bio,setBio]=useState("")
  const [password,setPassword]=useState("")

  useEffect(()=>{
    const getUserValue=async()=>{
      try {
        const resp = await axios.get(`http://localhost:8000/threads/users/jwt`,{withCredentials:true})
        setUsername(resp.data.username)
        setEmail(resp.data.email)
        setDp(resp.data.dp)
        setName(resp.data.name)
        setBio(resp.data.bio)
        setId(resp.data._id)
      } catch (error) {
        console.log(error);
      }
    }
    getUserValue()
  },[])


  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('username', username);
      formData.append('bio', bio);
      formData.append('password', password);
      formData.append('dp', fileRef.current.files[0]); // Append the selected file to FormData
  
      const response = await fetch(`http://localhost:8000/threads/users/update/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      const data = await response.json();
      console.log(data); // Log response from server
      toast({
        title: 'User Credentials Updated Successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error('Update user error:', error.message);
      toast({
        title: error.message || 'Unexpected error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const fileRef = useRef(null)
  
  return (
    <Flex
    gap={'15px'}
    width={'100%'}
    align={'center'}
    flexDir={'column'}
    justify={'center'}>
      
      <FormControl display={'flex'} alignItems={'center'} justifyContent={'space-evenly'} my={2}>
        <Avatar boxShadow={"md"} size='2xl' src={dp} name={username} />
        <Button onClick={()=>fileRef.current.click()}>Change Display Pic</Button>
        <Input type='file' hidden ref={fileRef}/>
      </FormControl>
      <FormControl>
        <Input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='email'/>
      </FormControl>
      <FormControl>
        <Input value={username} onChange={(e)=>setUsername(e.target.value)} type='text' placeholder='username'/>
      </FormControl>
      <FormControl>
        <Input value={name} onChange={(e)=>setName(e.target.value)} type='text' placeholder='name'/>
      </FormControl>
      <FormControl>
        <Input value={password} onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='password'/>
      </FormControl>
      <FormControl>
        <Input value={bio} onChange={(e)=>setBio(e.target.value)} type='text' placeholder='Bio'/>
      </FormControl>
      <Button colorScheme='teal' my={3} type='button' onClick={updateUser}>
        Update
      </Button>
      
    
  </Flex>
  )
}

export default Update