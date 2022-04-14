import React, { useState } from 'react'
import { Box, Text, Image, Button, useToast } from '@chakra-ui/react'
import { fetchKickRoomParticipant } from '../utils'

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
  } from '@chakra-ui/react'


const RoomParticipantsComponent = ({ participants, username, setParticipants, room }) => {
    const toast = useToast()
    const [showConfirmKick, setShowConfirmKick] = useState(false)
    const [selectedParticipant, setSelectedParticipant] = useState(null)

    return <div align='center' style={{ width: '30%', float: 'right'}}> 

        <AlertDialog
                isOpen={showConfirmKick}
                onClose={() => setShowConfirmKick(false)}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Kick '{selectedParticipant?.username}'
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to kick this participant out of '{room?.name}'?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button onClick={() => setShowConfirmKick(false)}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={_ => {
                        setShowConfirmKick(false)
                        fetchKickRoomParticipant(room.id, selectedParticipant?.id, (response, status) => {
                            if (status === 200) {
                                setParticipants(response.participants)
                            } else {
                                if (!toast.isActive('error1')) {
                                    toast({
                                        id: 'error1', title: 'Error removing user.',
                                        description: "Could not kick out participant. Please try again later.",
                                        status: 'error',  duration: 5000, isClosable: true,
                                    })
                                }
                            }
                        })
                    }} ml={3}>
                        Kick
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
        </AlertDialog>


         <Box style={{border: '2px solid #60039e', borderRadius: '15px', background: '#e3acf2'}} w='65%' h='90%' m='10'>
             <Text fontWeight='bold' as='samp' fontSize='3xl'>Participants</Text>
             <Text fontSize='sm'>({participants.length} joined)</Text>
             <Box style={{ overflowY: 'scroll', height: '600px', width: '200px', borderRadius: '15px', background: '#f1c7fc'}}
                 m='10' p='5'>
                 {participants.map(participant => (
                     <>
                        <Box align='left' _hover={{ cursor: 'pointer' }}>
                            <Box onClick={e => {
                                e.preventDefault()
                                window.location.href = `/profile-${participant.username}`
                            }}>
                                <Image src={participant.profile_pic} alt='pfp' borderRadius='full' boxSize='40px' style={{ border: '1px solid' }} />
                                {participant.username} {participant.username === username && '(me)'}
                            </Box>
                            
                            {username === room?.admin?.username && username !== participant.username && <>
                                <Button colorScheme='red' size='xs' onClick={() => {
                                    setSelectedParticipant(participant)
                                    setShowConfirmKick(true)
                                }}>Kick</Button>
                            </>}
                        </Box>
                        <br />
                     </>
                 ))}
             </Box>   
         </Box>
     </div>
}

export default RoomParticipantsComponent