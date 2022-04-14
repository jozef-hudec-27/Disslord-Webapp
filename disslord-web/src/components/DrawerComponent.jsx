import React from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button
  } from '@chakra-ui/react'


  
const DrawerComponent = ({ isOpen, onClose, title, body }) => {
  return (
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>

        <DrawerBody>
            {body}
        </DrawerBody>

        <DrawerFooter>
            <Button mr={3} onClick={onClose} colorScheme='red'>
            Cancel
            </Button>
        </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default DrawerComponent