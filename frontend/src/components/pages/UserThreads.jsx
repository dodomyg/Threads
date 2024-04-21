import React, { useContext } from 'react'
import {Box,Flex,Text,Avatar,AvatarGroup,Image} from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { BsThreeDots } from 'react-icons/bs'
import { AiFillDelete } from "react-icons/ai";
import { UserContext } from '../context/UserContext';


const UserThreads = ({username,dp,title,img,likes,comments,id,likeArray,createdAt}) => {

	const navigate=useNavigate()
	const {user}=useContext(UserContext)
	
  
	


  return (
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size='md' name={username} src={dp} />
					<Box w='1px' h={"full"} bg='black' my={2}></Box>
					<Box position={"relative"} w={"full"}>
                    <AvatarGroup size='sm' max={2}>
						{
							likeArray && likeArray.map((i)=>(
								<Avatar key={i._id} name={i.username} src={i.dp} />
							))
						}
                </AvatarGroup>
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								{username}
							</Text>
							
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontStyle={"sm"} color={"gray.light"}>
								{createdAt}
							</Text>
							{user._id === id ? <AiFillDelete size={18}/> : <BsThreeDots size={18}/>}
						</Flex>
					</Flex>

					<Text fontSize={"sm"}>{title}</Text>
					{(
						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
							<Image cursor={'pointer'} onClick={()=>navigate(`/threads/${id}`)}  src={`http://localhost:8000/images/${img}`} w={"full"} />
						</Box>
					)}

					<Flex gap={7} my={2}>
						<FaRegHeart onClick={()=>navigate(`/threads/${id}`)} cursor={'pointer'} size={'19px'}/>
                        <FaRegComment onClick={()=>navigate(`/threads/${id}`)} cursor={'pointer'} size={'19px'}/>
					</Flex>

					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.light"} fontSize='sm'>
							 {comments} comments
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
						<Text color={"gray.light"} fontSize='sm'>
						    {likes}	likes
						</Text>
					</Flex>
				</Flex>
			</Flex>
  )
}

export default UserThreads