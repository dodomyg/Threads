import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import {useNavigate} from 'react-router-dom'

import {useToast,Text } from '@chakra-ui/react'

import axios from "axios"
import UserThreads from './UserThreads'
axios.defaults.withCredentials = true


const Home = () => {
  const toast = useToast()
  const [feed,setFeed]=useState([])

  const [loading ,setLoading]=useState(false)

  useEffect(()=>{
    const fetchFeed=async()=>{
      try {
        setLoading(true)
        const resp = await axios.get(`http://localhost:8000/threads/users/following`,{withCredentials:true})
        setFeed(resp.data)
        setLoading(false)
        console.log(resp.data);
      } catch (error) {
        console.error(error)
        if (error.response) {
          setLoading(false)
          toast({
              title: error.response.data.error || "Server error",
              status: 'error',
              duration: 3000,
              isClosable: true,
          });
      } else if (error.request) {
          
          toast({
              title: "Network error",
              status: 'error',
              duration: 3000,
              isClosable: true,
          });
      } else {
          
          toast({
              title: "Unexpected error",
              status: 'error',
              duration: 3000,
              isClosable: true,
          });
      }
      }
    }
    fetchFeed()
  },[])




    // const navigate=useNavigate()
    const {user}=useContext(UserContext)
    if(!user){
        return;
    }
    if(loading){
      return <div>Loading . . .</div>
    }
  return (
   <div>
   <Text textAlign={'center'} fontSize={'25px'} my={6}>Welcome {user.username} , Here is your feed</Text>

   {!loading && feed.map((thread)=>(
    <UserThreads createdAt={thread?.createdAt.split("T")[0]} key={thread?._id} likeArray={thread?.likes} username={thread?.owner.username} dp={thread?.owner.dp} title={thread?.title} img={thread?.img} likes={thread?.likes.length} comments={thread?.comment.length} id={thread?._id} />
   ))}
   </div>
  )
}

export default Home