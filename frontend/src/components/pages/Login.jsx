import React, { useContext, useState } from 'react'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { UserContext } from '../context/UserContext'

axios.defaults.withCredentials = true

const Login = () => {
  const toast = useToast()
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const {setUser}=useContext(UserContext)
const navigate=useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const resp = await axios.post("http://localhost:8000/threads/users/login", {
        username,password
      },{withCredentials:true})

      toast({
        title: resp.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
    });
    setUser(resp.data.alreadyUser)
    navigate("/")
    

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
  

  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="Username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} type="text"  />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                  <Text>Dont have an account?</Text>
                  <Link href='/register' color={'blue.400'}>Register</Link>
              </Stack>
              <Button
              onClick={handleLogin}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Login