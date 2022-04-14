import React, { useState, useEffect } from 'react'
import { fetchGetPrivateMessages } from '../utils'
import AlertErrorComponent from './AlertErrorComponent'
import LoadingComponent from './LoadingComponent'
import { Box, Input, Text, Image, useToast } from '@chakra-ui/react'
import { timeSince } from '../utils'

const PrivateChatComponent = ({ username, userId, theirId, chatSocket, theirUsername }) => {

  const toast = useToast()
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)

  useEffect(() => {
    fetchGetPrivateMessages(theirId, (response, status) => {
      if (status === 200) {
        setMessages(response)
      } else {
        setError(true)
      }
    })
  }, [])


  const handleSubmitNewMessage = () => {
    if (message !== '' && chatSocket !== null) {
      chatSocket.send(JSON.stringify({
        'message': message,
        'name': username
      }))
    } else {
      setMessageLoading(false)
      if (!toast.isActive('info')) {
        toast({
          id: 'info', title: 'Info.',
          description: "Your message cannot be empty.",
          status: 'info', duration: 1500, isClosable: true,
        })
      }
    }
  }

  if (chatSocket !== null) {

    chatSocket.onmessage = e => {
      const { message, name, type, created_at, user_pfp_url, user_id } = JSON.parse(e.data);   
      if (type === 'private_chat_message') {
        const newMsg = {body: message, user_username: name, created_at: created_at, user_profile_pic: 'http://127.0.0.1:8000' + user_pfp_url}
        let newMessages = [ ...messages ]
        newMessages.unshift(newMsg)
        

        setMessageLoading(false)
        setMessages(newMessages)
        setMessage('')
      }
    };
    }


  return (
    <>
      {messages === null && !error && <LoadingComponent />}
      {error && <AlertErrorComponent title='Could not load messages.' description='Something went wrong on our side. Please try again later.' />}
      {messages !== null && !error && <div align='center'>
        <Box style={{border: '2px solid #60039e', borderRadius: '15px', background: '#e3acf2'}} w='60%' h='100%' m='10'>
          <Text fontSize='2xl' fontWeight='bold'>Private Chat with {theirUsername}</Text>

          <Box style={{ overflowY: 'scroll', height: '400px', width: '600px', borderRadius: '15px', background: '#f1c7fc'}}
            m='10' p='5'>
              <form onSubmit={(e) => {
                    e.preventDefault()
                    setMessageLoading(true)
                    handleSubmitNewMessage()
                }}>
               <Input focusBorderColor='purple.300' onChange={e => setMessage(e.target.value)} value={message} placeholder='Say something...' w='70%' />
              </form>


          {messageLoading && <LoadingComponent size='sm' mt='25' />}
          {messages.map(({ id, body, created_at, user_id, user_username, user_profile_pic}) => { 

            return <>
            <Box style={{ border: user_username === username ? '2px solid #60039e' : '1px solid #60039e', borderRadius: '25px'}} m='4' p='2'>
                <Box mb='2'></Box>

                <Box _hover={{ cursor: 'pointer' }} onClick={e => {
                    e.preventDefault()
                    window.location.href = `/profile-${user_username}`
                    }}>
                    <Image src={user_profile_pic} alt='pfp' borderRadius='full' boxSize='40px' style={{ border: '1px solid' }} />
                    <Text fontSize='sm' mt='2'>@{user_username} {user_username === username && '(me)'} {timeSince(new Date(created_at))} ago</Text>
                </Box>

                <Text fontSize='md'>„{body}”</Text>
            </Box>
            </>
          })}
          </Box>
        </Box>
      </div>}
    </>
  )
}

export default PrivateChatComponent