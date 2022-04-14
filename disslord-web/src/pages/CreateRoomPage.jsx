import React, { useState } from 'react'
import { Box, Textarea, Input, Button, useToast, Text } from '@chakra-ui/react'
import { fetchCreateRoom } from '../utils'
import BackButton from '../components/BackButton'
import { FaHammer } from 'react-icons/fa'

const CreateRoomPage = ({ dataset }) => {

    const toast = useToast()
    const [roomName, setRoomName] = useState('')
    const [roomDesc, setRoomDesc] = useState('')
    const [buttonLoading, setButtonLoading] = useState(false)

  return (
    <>
        <BackButton />
        <div align='center'>
            <Box style={{border: '2px solid #60039e', borderRadius: '15px', background: '#e3acf2'}} w='85%' h='90%' m='10' p='5'>
                <Text fontSize='3xl' fontWeight='bold' color='purple'>Create new Room</Text>
                <br /><br />
                <Input w='25%' focusBorderColor='purple.300' onChange={e => setRoomName(e.target.value)} value={roomName} placeholder='Enter room name (required)' isRequired />
                <br /><br />
                <Textarea w='50%' focusBorderColor='purple.300' onChange={e => setRoomDesc(e.target.value)} value={roomDesc} placeholder='Enter room description (not required)' />
                <br /><br />
                <Button colorScheme='purple' isLoading={buttonLoading} leftIcon={<FaHammer />} onClick={e => {
                    e.preventDefault()
                    
                    if (!roomName.length || roomName.length > 120 || roomDesc.length > 300) {
                        if (!toast.isActive('error1')) {
                            toast({
                                id: 'erro1r', title: 'Error creating room.',
                                description: "Make sure the room's name isn't empty and that maximum lengths for name (120) and description (300) aren't violated.",
                                status: 'error',  duration: 3500, isClosable: true,
                            })
                        }
                    } else {
                        setButtonLoading(true)
                        fetchCreateRoom(roomName, roomDesc, (response, status) => {
                            setButtonLoading(false)
                            if (status === 201) {
                                window.location.href = `/room-${response.id}`
                            } else {
                                if (response?.response?.name?.[0] === 'room with this name already exists.') {
                                    if (!toast.isActive('error2')) {
                                        toast({
                                            id: 'error2', title: 'Error creating room.',
                                            description: "A room with that name already exists. Pick a diffrent name.",
                                            status: 'error', duration: 3500, isClosable: true,
                                        })
                                        } 
                                    } else {
                                        if (!toast.isActive('error3')) {
                                            toast({
                                                id: 'error3', title: 'Error creating room.',
                                                description: "There was an error on our side. Please try again later.",
                                                status: 'error', duration: 3500, isClosable: true,
                                            })
                                        }
                                    }
                            }
                        })
                    }
                }}>Create</Button>
            </Box>
        </div>
    </>
  )
}

export default CreateRoomPage