import React from 'react'
import { Button } from '@chakra-ui/react'
import { AiOutlineArrowLeft }from 'react-icons/ai'

const BackButton = ({ url }) => (
  <Button leftIcon={<AiOutlineArrowLeft />} onClick={(e) => {
            e.preventDefault()
            window.location.href = url || '/'
        }} m='2' colorScheme='purple'>Back</Button>
)

export default BackButton