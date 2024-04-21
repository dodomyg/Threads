import React from 'react'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import {useNavigate} from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()  
  const toast =useToast()
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const resp = await axios.post("http://localhost:8000/threads/users/register", {
            username, email, password, name
        });
        toast({
            title: resp.data.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate("/login");
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


  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Register
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" isRequired />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input value={name} onChange={(e)=>setName(e.target.value)} type="text"  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
                <Input value={password} onChange={(e)=>setPassword(e.target.value)} type="password"  />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                onClick={handleSubmit}
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link href='/login' color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Register