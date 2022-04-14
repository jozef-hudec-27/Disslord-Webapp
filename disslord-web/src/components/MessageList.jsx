import React from 'react'
import MessageDisplay from './MessageDisplay'
import { SimpleGrid } from '@chakra-ui/react'


const MessageList = ({ messages, username, profile_pic }) => (
      <SimpleGrid columns={1} spacing={5} w='100%'>
          {messages.slice(0, 4).map(message => <MessageDisplay message={message} username={username} profile_pic={profile_pic} />)}
      </SimpleGrid>
)

export default MessageList