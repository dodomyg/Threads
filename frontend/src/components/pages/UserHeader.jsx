import React, { useContext } from 'react'
import {Flex,Box,Avatar,HStack,Text,Button,useToast} from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import {FaRegCopy } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa6";
import { Badge } from '@chakra-ui/react'
import { UserContext } from '../context/UserContext'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem
  } from '@chakra-ui/react'
import axios from "axios"
axios.defaults.withCredentials = true





const UserHeader = ({name,followUser,dp,username,id,bio,followers,following}) => {

    const toast = useToast()
    const navigate=useNavigate()

    

    const copyUrl = () => {
        const currentURL = window.location.href
        navigator.clipboard.writeText(currentURL).then(()=>{
            toast({
                title: 'Copied',
                status: 'success',
                duration: 2000,
            })
        })
    }



    const {user}=useContext(UserContext)
    const handleRedirect = () => {
        window.location.href = `https://www.instagram.com/${user.username}/?hl=en`;
    }


  return (
    <>
    <Flex width={'100%'} my={"54px"} flexDir={'column'}>
    <HStack my={3} alignItems={'flex-start'} justifyContent={'space-between'}>
        <Flex  alignItems={'flex-start'} flexDir={'column'}>
            <Text as={'b'} fontSize={'26px'} >{username}</Text>
            <HStack alignItems={'center'}>
            <Text fontSize={'17px'}>{name}</Text>
            <Badge variant={'subtle'}>{id}</Badge>
            </HStack>
        </Flex>
        <Avatar src={dp} colorScheme='gray' name={name} size={'xl'}/>
    </HStack>
    <Box width={'87%'} my={5}>
        <Text color={'gray.600'}>{bio}</Text>

    </Box>
    
    
    {user._id === id ? <Button maxW={'90px'} onClick={()=>navigate(`/update/${user._id}`)}>Update</Button> : <Button maxW={'90px'} onClick={followUser}>{user.following.includes(id) ? "UnFollow" : "Follow"}</Button>}

    <HStack my={3} justifyContent={'space-between'}>
        <Flex alignItems={'center'} gap={5}>
        <Text fontSize={'17px'}>
        {followers} followers 
        </Text>
        <Text fontSize={'17px'}>
        {following} following 
        </Text>
        <Button  variant={'link'}>
            instagram.com
        </Button>
        </Flex>
        <Flex alignItems={'center'} gap={5}>
            <Button onClick={handleRedirect} >
                <FaInstagram fontSize={'21px'} />
            </Button>
            <Menu>
        <MenuButton as={Button}>
            <FaRegCopy />
        </MenuButton>
        <MenuList>
        <MenuItem onClick={copyUrl}>Copy Url</MenuItem>
        </MenuList>
        </Menu>
        </Flex>
        


    </HStack>

    </Flex>
    {user._id === id && <IconButton onClick={()=>navigate('/create')}  width={16} h={16} position={"fixed"} bottom={'30px'} right={'30px'} isRound={true} icon={<LuPlus  size={'28px'} />} />}
    </>
  )
}

export default UserHeader