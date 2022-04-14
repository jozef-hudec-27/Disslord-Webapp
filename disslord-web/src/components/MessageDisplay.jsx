import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import Badge from './Badge'
import { timeSince } from '../utils'


const MessageDisplay = ({ message : { body, room_name, created_at }, username, profile_pic }) => (
   <Box bg='purple.200' height='200px' borderRadius='55px' m='5' p='7' border='2px solid #60039e'>  
            <Badge username={username} info={`@${username} said in '${room_name}'`} profile_pic={profile_pic} />
            <Text mt='1'>{timeSince(new Date(created_at))} ago</Text>
            <Box border='2px solid #60039e' bg='purple.400' borderRadius='5px' mt='1' p='2'>
                {body.length > 130 ? <Text fontSize='sm'>{`${body.substring(0, 130)}...`}</Text> : <Text>{body}</Text>}
            </Box>
        </Box>
)

export default MessageDisplay