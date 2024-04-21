import React, { useContext, useEffect, useState } from 'react'
import {useParams,useNavigate} from "react-router-dom"
import axios from "axios"
import { FaHeart } from "react-icons/fa";
import { FaRegComment, FaRegHeart } from 'react-icons/fa'
import {Flex,Box,Avatar,HStack,Text,Button,useToast,AvatarGroup,Image,Input,FormControl} from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { AiFillDelete } from "react-icons/ai";
import { UserContext } from '../context/UserContext';
axios.defaults.withCredentials = true

const SinglePost = () => {
    const [post,setPost]=useState(null)
    const {user}=useContext(UserContext)

    const {id}=useParams()

    const [comment,setComment]=useState("")
    
    

    const navigate=useNavigate()
    useEffect(()=>{
        const getSinglePost=async()=>{
            try {
                const resp = await axios.get(`http://localhost:8000/threads/posts/${id}`,{withCredentials:true})
                
                setPost(resp.data)
            } catch (error) {
                console.log(error);
            }
        }
       
        getSinglePost()
    },[id])

    const toast=useToast()  
    const addComment=async()=>{
        try {
            const resp = await axios.post(`http://localhost:8000/threads/posts/comment/${id}`,{text:comment},{withCredentials:true})
            alert(resp.data.message)
            window.location.reload()
            setComment("")
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

    const likePost=async()=>{
        try {
            const resp = await axios.post(`http://localhost:8000/threads/posts/like/${id}`,{withCredentials:true})
            alert(resp.data.message)
            window.location.reload()
        } catch (error) {
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

    const deletePost = async () => {
        try {
            const resp = await axios.delete(`http://localhost:8000/threads/posts/${post._id}`, { withCredentials: true });
            toast({
                title: resp.data.message,
                status: 'success',
                duration: 3000,
            });
            navigate(`profile/${user._id}`);
        } catch (error) {
            console.error(error);
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
    };
    

   



if(!post)return
  return (
    <>
    <Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size='md' name={post.owner.username} src={post.owner.dp}  />
					<Box w='1px' h={"full"} bg='black' my={2}></Box>
					<Box position={"relative"} w={"full"}>
                        <AvatarGroup size='sm' max={2}>
                            {post.likes.map((i)=>(
                                <Avatar name={i.username} src={i.dp} />
                            ))}
                        </AvatarGroup>
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								{post.owner.username}
							</Text>
							
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontStyle={"sm"} color={"gray.light"}>
								{post.createdAt.split("T")[0]}
							</Text>
							{post.owner._id=== user?._id ? <AiFillDelete cursor={'pointer'} onClick={deletePost} size={18} /> : <BsThreeDots size={18} />}
						</Flex>
					</Flex>

					<Text fontSize={"sm"}>{post.title}</Text>
					{(
						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
							<Image  objectFit={"cover"}  src={`http://localhost:8000/images/${post.img}`} w={"full"} />
						</Box>
					)}

					<Flex gap={7} my={2}>
                    {(user && post?.likes.includes(user._id)) ?  
  <FaHeart onClick={likePost} style={{ color: 'red', cursor: 'pointer', fontSize: '19px' }} /> : 
  <FaRegHeart onClick={likePost} style={{ cursor: 'pointer', fontSize: '19px' }} />}

                        <FaRegComment  cursor={'pointer'} size={'19px'}/>
					</Flex>

					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.light"} fontSize='sm'>
                        {post?.likes.comment}  comments
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
						<Text color={"gray.light"} fontSize='sm'>
                        {post?.likes.length}  likes
						</Text>
					</Flex>
                    
				</Flex>
			</Flex>
            <HStack>
                <FormControl gap={'10px'} display={'flex'} alignItems={'center'}>
                <Input value={comment} onChange={(e)=>setComment(e.target.value)} type='text' placeholder='Comment' />
                <Button onClick={addComment} colorScheme='twitter'>Add</Button>
                </FormControl>
            </HStack>
            <Text my={2} fontSize={'24px'}>Comments</Text>
            <Flex flexDirection={'column'} my={1.5} p={1.2}>
            {post.comment.map((i)=>(
                <HStack p={1} my={2.5} bg={'gray.100'} borderRadius={'lg'} justifyContent={'flex-start'} alignItems={'center'}>
                    <Avatar size={'sm'} name={i.userId.username} src={i.userId.dp} />
                    <Box flexDir={'column'} display={'flex'} alignItems={'flex-start'} p={2}  borderRadius={'lg'}>
                    <Text  fontWeight={'bold'}>{i.userId.username}</Text>
                    <Text>{i.text}</Text>
                    </Box>
                </HStack>
            ))}

        </Flex>
        </>
  )
}

export default SinglePost