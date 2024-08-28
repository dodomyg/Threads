import React, { useState, useContext, useEffect } from 'react';
import { Button, Drawer, DrawerOverlay, DrawerContent,Box,Text,Avatar, DrawerHeader, DrawerBody, Input,HStack } from '@chakra-ui/react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
axios.defaults.withCredentials = true

const UpdateButton = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchResults,setSeachResults]=useState([])
    const [loading,setLoading]=useState(false)

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                setLoading(true)
            const resp =  await axios.get(`http://localhost:8000/threads/users/searchUser?search=${inputValue}`,{withCredentials:true})
            setSeachResults(resp.data.findUser)
            setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        fetchUsers()
    },[inputValue])

   
    

    if (!user) {
        return null; 
    }

    return (
        <div>
            <Button onClick={handleDrawerOpen} position={'fixed'} top={'27px'} left={'30px'}>
                    Search for User
            </Button>

            <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose} placement="left">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search for Users</DrawerHeader>
                    <HStack alignItems={'center'} m={3}>
                        <Input
                            placeholder="Enter username or email"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </HStack>
                    <DrawerBody my={3} display={'flex'} flexDir={'column'}>
                       <Box>
                            {!loading && searchResults && searchResults.map((u) => (
                                <Box onClick={() => {
                                    handleDrawerClose()
                                    navigate(`/profile/${u._id}`)
                                }} mt={2}  cursor={'pointer'} px={4} p={2} _hover={{
                                    background:"#38B2AC",
                                    color:"white"
                                  }} bgColor='ButtonFace' borderRadius='lg' gap={'10px'} width={"100%"} display={'flex'} alignItems={'center'} mb={2}>
                                      <Avatar size='sm' src={u.dp} name={u.name}/>
                                      <Box>
                                          <Text>{u.username}</Text>
                                          <Text fontSize='sx'>{u.name}</Text>
                                      </Box>
                              
                              
                                  </Box>
                            ))}
                        </Box> 
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default UpdateButton;
