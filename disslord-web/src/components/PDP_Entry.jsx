import React from 'react'
import { Text } from '@chakra-ui/react'


const PDP_Entry = ({ title, value, mt, fontSize, mb }) => (
  <>
    <Text align='left' ml='5' mt={mt} color='purple' fontWeight='bold' fontSize='xl'>{title}</Text>
    <Text align='left' ml='5' fontSize={fontSize} mb={mb}>{value}</Text>
  </>
)

export default PDP_Entry