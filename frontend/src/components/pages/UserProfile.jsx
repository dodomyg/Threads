import React, { useEffect, useState } from 'react'
import UserHeader from './UserHeader'
import {useToast} from '@chakra-ui/react'
import {useParams} from "react-router-dom"
import UserLower from './UserLower'
import axios from "axios"
axios.defaults.withCredentials = true

const UserProfile = () => {

  const {id}=useParams()
  const toast=useToast()

  const [userProfile,setUserProfile]=useState(null)
  const [userThreads,setThreads]=useState([])

  useEffect(()=>{
      const getUserbyId=async()=>{
        try {
          const resp = await axios.get(`http://localhost:8000/threads/users/singleUser/${id}`,{withCredentials:true})
          setUserProfile(resp.data)
        } catch (error) {
          console.log(error);
        }
      }

      const fetchUserThreads=async()=>{
        try {
            const resp = await axios.get(`http://localhost:8000/threads/posts/allPosts/${id}`,{withCredentials:true})
            console.log(resp.data);
            setThreads(resp.data)
        } catch (error) {
            console.log(error);
        }
    }

    fetchUserThreads()


      getUserbyId()


  },[id])

  const followUser=async()=>{
    try {
      const resp = await axios.post(`http://localhost:8000/threads/users/follow/${id}`,{withCredentials:true})
      alert(resp.data.message)
      window.location.reload()
    } catch (error) {
        console.error(error)
  if (error.response) {
 
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



  if(!userProfile) return;
  return (
    <div>
        <UserHeader followUser={followUser} key={userProfile?._id} following={userProfile?.following.length} followers={userProfile?.followers.length} name={userProfile?.name} dp={userProfile?.dp} username={userProfile?.username} id={userProfile?._id} bio={userProfile?.bio}  />
        <UserLower  dp={userProfile?.dp} username={userProfile?.username} userThreads={userThreads}/>
        
    </div>
  )
}

export default UserProfile