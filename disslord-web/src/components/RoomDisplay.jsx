import React, { useState } from 'react'
import { Box, Text, IconButton, AlertDialog, AlertDialogOverlay, AlertDialogContent, 
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast } from '@chakra-ui/react'
import { BsBoxArrowRight } from 'react-icons/bs'
import { fetchRoomAction } from '../utils'
import Badge from './Badge'


const RoomDisplay = ({ room, member, hideDesc, isProf, all }) => {

  const toast = useToast()
  const [showAlert, setShowAlert] = useState(false)
  const room_ = { ...room }
  const [member_, setMember_] = useState(member)
  const [leaveBtnLoading, setLeaveBtnLoading] = useState(false)

  if (((!member_ && member) || room.is_member || (room.name === 'No Rooms found')) && !isProf) return null

  const numOfParticipants = room.participants?.length || room.participants_count || 0
  const displayParticipants = `${numOfParticipants} ${numOfParticipants === 1 ? 'Participant' : 'Participants'}`

  return <Box bg='purple.200' height='200px' borderRadius='25px' m='5'
              p='4' border='2px solid #60039e' _hover={{  shadow: '2px 2px 4px #999999' }}>

                <AlertDialog
                    isOpen={showAlert}
                    onClose={() => setShowAlert(false)}>
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                          Leave Room
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure you want to leave {room_.name}?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button onClick={() => setShowAlert(false)}>
                            Cancel
                          </Button>
                          <Button isLoading={leaveBtnLoading} colorScheme='red' onClick={() => {
                            setLeaveBtnLoading(true)
                            fetchRoomAction(room_.id, 'leave', (response, status) => {
                              setLeaveBtnLoading(false)
                              if (status === 200) {
                                setShowAlert(false)
                                setMember_(false)
                              }
                              else if (status !== 200 && !toast.isActive('error')) {
                                  toast({
                                      id: 'error', title: 'Error leaving room!',
                                      description: 'Could not leave the room. Please try again later.',
                                      status: 'error', duration: 5000, isClosable: true,
                                  })}
                            })

                          }} ml={3}>
                            Leave
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                
                <Box _hover={{ cursor: 'pointer' }} onClick={e => {
                  e.preventDefault()
                  window.location.href = `/profile-${room.admin_username || room.admin?.username}`
                }}>
                  <Badge all={all || false} username={room_?.admin?.username || room?.admin_username} info={`Host @${room_?.admin?.username || room_?.admin_username}`} profile_pic={room_?.admin?.profile_pic || null} />
                </Box>
                
                {member_ === true && <IconButton
                  variant='outline'
                  icon={<BsBoxArrowRight />}
                  onClick={() => setShowAlert(true)}
                  colorScheme='purple'
                  ml='3'
                  align='right'
                  mt='-20'
                  mr='40'
                />}

                <Text fontSize='xs' mt={!member_ && 2}>{displayParticipants}</Text>
                
                <Text mt='2' fontSize='xl' fontWeight='bold' as='samp'_hover={{ cursor: 'pointer' }} onClick={(e) => {
                e.preventDefault()
                window.location.href = `/room-${room.id}`
              }}>{room_.name}</Text><br />
                {!hideDesc && <Text fontSize='sm' as='i'>{room_.description?.length <= 75 ? room_.description : room_.description && `${room_.description?.substring(0, 75)}...`}</Text>}
        </Box>
}


export default RoomDisplay