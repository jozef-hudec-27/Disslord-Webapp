import React, { useState } from 'react'
import { Box, Text, Input, Textarea, Button, useToast } from '@chakra-ui/react'
import { fetchUpdateRoom } from '../utils'
import { FaHammer } from 'react-icons/fa'


const EditRoomComponent = ({ roomDetails, username, roomValues, setRoomValues }) => {

    const toast = useToast()
    const [buttonLoading, setButtonLoading] = useState(false)

  return (
    <div align='center'>
        <Box style={{border: '2px solid #60039e', borderRadius: '15px', background: '#e3acf2'}} w='85%' h='90%' m='10' p='5'>
            <Text fontSize='3xl' fontWeight='bold' color='purple'>Edit {roomDetails.name}</Text>
            <br /><br />
            <Input w='25%' focusBorderColor='purple.300' onChange={e => setRoomValues({ ...roomValues, name: e.target.value })} value={roomValues.name} placeholder='Enter room name (required)' isRequired />
            <br /><br />
            <Textarea w='50%' focusBorderColor='purple.300' onChange={e => setRoomValues({ ...roomValues, description: e.target.value })} value={roomValues.description} placeholder='Enter room description (not required)' />
            <br /><br />
            <Button colorScheme='purple' isLoading={buttonLoading} leftIcon={<FaHammer />} onClick={e => {
                e.preventDefault()
                
                if (!roomValues.name || roomValues.name.length > 120 || roomValues.description.length > 300) {
                    if (!toast.isActive('error1')) {
                        toast({
                            id: 'error1', title: 'Error creating room.',
                            description: "Make sure the room's name isn't empty and that maximum lengths for name (120) and description (300) aren't violated.",
                            status: 'error',  duration: 5000, isClosable: true,
                        })
                    }
                } else {
                    setButtonLoading(true)

                    fetchUpdateRoom({ id: roomDetails.id, name: roomValues.name, description: roomValues.description }, (response, status) => {
                        if (status === 200) {
                            window.location.href = '/room-' + roomDetails.id
                        } else {
                            if (!toast.isActive('error2')) {
                            toast({
                                id: 'error2', title: 'Error updating room.',
                                description: "Could not update room. Please try again later.",
                                status: 'error', duration: 5000, isClosable: true,
                            })
                            } 
                        }
                    })
                }
            }}>Edit</Button>
        </Box>
    </div>
  )
}

export default EditRoomComponent