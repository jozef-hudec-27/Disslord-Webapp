import React from 'react'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'

const AlertErrorComponent = ({ title, description }) => {
    return <div>
        <Alert status='error'>
        <AlertIcon />
        <AlertTitle mr={2}>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        </Alert>
  </div>
}

export default AlertErrorComponent