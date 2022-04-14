import React, { useState } from 'react'
import { Box, Text, Button, Image, Input } from '@chakra-ui/react'
import Badge from './Badge'
import { fetchRoomDetail, fetchRoomAction, timeSince } from '../utils'
import LoadingComponent from './LoadingComponent'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'


const RoomComponent = ({ room, roomId, isMember, setIsMember, setParticipants, message, setMessage, handleSubmitNewMessage,
                         roomMessages, username, toast, messageLoading }) => {

    const [btnLoading, setBtnLoading] = useState(false)

   return <div align='center' style={{ width: '70%', float: 'left'}}>
        <Box style={{border: '2px solid #60039e', borderRadius: '15px', background: '#e3acf2'}} w='85%' h='90%' m='10'>
            <Box align='left' pl='5'>
            <Text fontWeight='bold' as='samp' fontSize='3xl'>{room?.name}</Text><br />
            <Text as='cite'>{room?.description}</Text><br /><br />
            <Badge username={room?.admin?.username} info={`Host @${room?.admin?.username}`} profile_pic={room?.admin?.profile_pic} />
            </Box>
            <Box align='right'>
            <Button m='4' colorScheme='purple' isLoading={btnLoading} leftIcon={isMember && <AiOutlineArrowLeft />} rightIcon={!isMember && <AiOutlineArrowRight />} onClick={(e) => {
                e.preventDefault()
                setBtnLoading(true)
                fetchRoomAction(roomId.includes('/') ? roomId.substring(0, roomId.length - 1) : roomId, isMember ? 'leave' : 'join', (_, status) => {
                setBtnLoading(false)
                
                status === 200 && setIsMember(!isMember)
                status === 200 && fetchRoomDetail(roomId, (response, status) => {
                    if (status === 200) setParticipants(response.participants)
                })
                    
                if (status === 200 && !isMember) {

                    if (!toast.isActive('join')) {
                        toast({
                            id: 'join', title: 'Success',
                            description: `You've successfully joined '${room?.name}'.`,
                            status: 'success', duration: 2000, isClosable: true,
                        })
                    }
                } else if (status !== 200) {
                    if (!toast.isActive('error')) {
                        toast({
                            id: 'join', title: `Error ${isMember ? 'leaving' : 'joining'} room!`,
                            description: `Could not ${isMember ? 'leave' : 'join'} room. Please try again later.`,
                            status: 'error', duration: 5000, isClosable: true,
                        })
                    }
                }
                
                })
            }}>
                {isMember ? 'Leave' : 'Join'}
            </Button>

            {room?.admin?.username === username && 
                <>
                    <Button m='4' colorScheme='purple' onClick={e=> {
                        e.preventDefault()
                        window.location.href = `/edit-room-${room.id}`
                    }}>Edit Room</Button>
                </>
            }

            </Box>

            <hr width='90%'/>

            <Box style={{ overflowY: 'scroll', height: '400px', width: '600px', borderRadius: '15px', background: '#f1c7fc'}}
            m='10' p='5'>

                {isMember && <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitNewMessage()
                }}> 
                    <Input focusBorderColor='purple.300' onChange={e => setMessage(e.target.value)} value={message} placeholder='Say something...' />
                </form>}
                
                {messageLoading && <LoadingComponent size='sm' mt='25' />}

                {roomMessages?.slice(0, 250).map(({ user, body, created_at, profile_pic }) => (
                    <>
                    <Box style={{ border: user === username ? '2px solid #60039e' : '1px solid #60039e', borderRadius: '25px'}} m='4' p='2'>
                        <Box mb='2'></Box>

                        <Box _hover={{ cursor: 'pointer' }} onClick={e => {
                            e.preventDefault()
                            window.location.href = `/profile-${user}`
                            }}>
                            <Image src={profile_pic} alt='pfp' borderRadius='full' boxSize='40px' style={{ border: '1px solid' }} />
                            <Text fontSize='sm' mt='2'>@{user} {user === username && '(me)'} {timeSince(new Date(created_at))} ago</Text>
                        </Box>

                        <Text fontSize='md'>„{body}”</Text>
                    </Box>
                    </>
                ))}
                {!roomMessages.length && <Text as='sub'>No messages yet. Be the first one to say something!</Text>}
            </Box>
        </Box>
    </div>
}

export default RoomComponent