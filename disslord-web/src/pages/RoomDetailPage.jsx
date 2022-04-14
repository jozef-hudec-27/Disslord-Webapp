import React, { useEffect, useState } from 'react'
import { fetchRoomDetail, fetchNewMessage } from '../utils'
import { useToast } from '@chakra-ui/react'
import '../room.css';
import BackButton from '../components/BackButton';
import RoomComponent from '../components/RoomComponent';
import RoomParticipantsComponent from '../components/RoomParticipantsComponent'
import LoadingComponent from '../components/LoadingComponent';
import AlertErrorComponent from '../components/AlertErrorComponent';


const RoomDetailPage = ({ dataset }) => {
  const toast = useToast()
  const { path, username } = dataset
  let roomId = path?.split('-')[1]
  if (!roomId?.includes('/')) {
    roomId = roomId + '/'
  }
  const [room, setRoom] = useState(null)
  const [message, setMessage] = useState('')
  const [roomMessages, setRoomMessages] = useState([])
  const [isMember, setIsMember] = useState(null)
  const [participants, setParticipants] = useState([])
  const [isLoading, setIsLoading] =  useState(true)
  const [messageLoading, setMessageLoading] = useState(false)
  const [chatSocket, setChatSocket] = useState(null)

  useEffect(() => {
    fetchRoomDetail(roomId, (response, status) => {
      setIsLoading(false)
      if (status === 200) {
        setRoom(response)
        setRoomMessages(response.messages)
        setIsMember(response.is_member)
        setParticipants(response.participants)
      }
    })

    const cSocket = new WebSocket('ws://' + '127.0.0.1:8000' + '/ws/chat/' + roomId)
    setChatSocket(cSocket)

    cSocket.onopen = e => {
      console.log(`** CHATSOCKET IN ROOM ${roomId} CONNECTED **`)
    }
  }, [])

  if (chatSocket !== null) {

  chatSocket.onmessage = e => {
    const { message, name, type, created_at, profile_pic } = JSON.parse(e.data);   
    if (type === 'room_chat_message') {
      const newMsg = {body: message, user: name, created_at: created_at, profile_pic: profile_pic}
      let newMessages = [ ...roomMessages ]
      newMessages.unshift(newMsg)
      
      setRoomMessages(newMessages)
      setMessage('')
      setMessageLoading(false)
    }
  };
  }

  const handleSubmitNewMessage = () => {
    if (room !== null && message !== '' && chatSocket !== null) {
      setMessageLoading(true)
      chatSocket.send(JSON.stringify({
        'message': message,
        'name': username
      }))
    
    } else {
      if (!toast.isActive('info')) {
        toast({
          id: 'info', title: 'Info.',
          description: "Your message cannot be empty.",
          status: 'info', duration: 1500, isClosable: true,
        })
      }
    }
  }

if (isLoading === true) {
  return <LoadingComponent />
} else if (room === null) {
  return <AlertErrorComponent title='Room not found!' description='Make sure the room id is correct or try again later.' />
}

return (
  <>
    <BackButton />
    <div>
      <RoomComponent room={room} isMember={isMember} setIsMember={setIsMember} setParticipants={setParticipants}
      message={message} setMessage={setMessage} handleSubmitNewMessage={handleSubmitNewMessage} roomMessages={roomMessages}
      username={username} roomId={roomId} toast={toast} messageLoading={messageLoading} setMessageLoading={messageLoading} />

      <RoomParticipantsComponent room={room} participants={participants} username={username} setParticipants={setParticipants} />
    </div>
  </>
)
}

export default RoomDetailPage