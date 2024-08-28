import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, FormHelperText ,useToast} from '@chakra-ui/react';
import {useNavigate} from "react-router-dom"
import axios from "axios";
axios.defaults.withCredentials = true;

const Create = () => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("img", file); // Change "file" to "img" to match the backend expectation
      formData.append("title", title);
      
      const resp = await axios.post("http://localhost:8000/threads/posts/create", formData, { 
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      
      console.log(resp.data);
      toast({
        title: resp.data.message,
        status: 'success',
        duration: 3000,
      });
      navigate(`/threads/${resp.data.newPost._id}`);
    } catch (error) {
     
    }
  };

  return (
    <Box p={7} my={8} bgColor={'gray.100'} borderRadius={'lg'}>
      <form onSubmit={handleSubmit}>
        <FormControl my={4}>
          <FormLabel fontSize={'30px'}>Title</FormLabel>
          <Input fontSize={'27px'}
            my={1}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            variant="unstyled"
            placeholder="Enter title"
          />
          <FormHelperText>Keep the caption catchy...</FormHelperText>
        </FormControl>

        <FormControl my={6}>
          <FormLabel>Upload Image</FormLabel>
          <Box p={3} borderRadius={'lg'} bg={'gray.300'}>
            <Input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              accept="image/*"
              variant="unstyled"
            />
          </Box>
          <FormHelperText>Accepted formats: jpg, jpeg, png, gif</FormHelperText>
        </FormControl>

        <Button type="submit" colorScheme="blue">Submit</Button>
      </form>
    </Box>
  );
}

export default Create;
