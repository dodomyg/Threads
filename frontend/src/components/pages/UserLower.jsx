import React, { useContext} from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel,TabIndicator,Flex} from '@chakra-ui/react'

import UserThreads from './UserThreads'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
axios.defaults.withCredentials = true

const UserLower = ({userThreads,dp,username}) => {

    const {user}=useContext(UserContext)




if(!user)return
  return (
    <Tabs isFitted variant="unstyled">
    <TabList>
      <Tab>Threads</Tab>
      <Tab>Comments</Tab>
    </TabList>
    <TabIndicator
      mt="-1.5px"
      height="2px"
      bg="black"
      borderRadius="1px"
    />
    <TabPanels>
      <TabPanel>
        <Flex flexDir={'column'} gap={10} my={3}>
        {userThreads && userThreads.map((i)=>(
            <UserThreads createdAt={i.createdAt.split("T")[0]} likeArray={i.likes}  id={i._id} dp={dp} key={i._id} comments={i.comment.length} likes={i.likes.length} img={i.img} title={i.title}  username={username} />
        ))}
        </Flex>
      </TabPanel>
      <TabPanel>
        <p>two!</p>
      </TabPanel>
    </TabPanels>
    
  </Tabs>
  )
}

export default UserLower