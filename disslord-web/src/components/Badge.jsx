import React, { useState } from 'react'
import { fetchProfileDetails } from '../utils'
import { Image, Box } from '@chakra-ui/react'


const Badge = ({ username, info, profile_pic, all }) => {
  const [pfpUrl, setPfpUrl] = useState(profile_pic)

  if ((profile_pic === null && pfpUrl === null) || all) {
    fetchProfileDetails(username, (response, status) => {
      if (status === 200) {
        setPfpUrl(response.profile_pic)
      }
    })
  }

  return <Box onClick={e => {
      e.preventDefault()
      window.location.href = `/profile-${username}`
    }} _hover={{ cursor: 'pointer' }}>
    
   <Image src={pfpUrl || profile_pic} alt='pfp' borderRadius='full' boxSize='40px' style={{ border: '1px solid' }} />
   {info}
  </Box>
}

export default Badge