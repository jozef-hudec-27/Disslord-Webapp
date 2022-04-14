import React, { useState } from 'react'
import RoomDisplay from './RoomDisplay'
import { SimpleGrid, Button, Text, ButtonGroup } from '@chakra-ui/react'


const getPaginatedArray = (array, isProf) => {
  if (array.length) {
    let paginated = [[]]
    for (let val of array) {
      if (paginated[paginated.length - 1].length === 5) {
        paginated.push([])
      }
      (!val.is_member || isProf) && paginated[paginated.length - 1].push(val)
    }
    return paginated
  }
}


const RoomsList = ({ rooms, member, isSearch, searchQuery, isAll, w, profile, hideDesc, isProf }) => {

  const [currentPage, setCurrentPage] = useState(0)

  if (rooms === 'No Rooms found') return <Text mt='2' as='sub'>No Rooms Found...</Text>
  else if (!rooms.length && isAll) return <Text mt='2' as='sub'>No Rooms Found...</Text>
  else if (!rooms.length) return <Text mt='2' as='sub'>Search results will be here :)</Text>

  let realRoomsCount = 0
  let showMoreBtn = false
  let rooms_ = []  
  let paginatedRooms = getPaginatedArray(rooms, isProf)

  if (!isAll) {
    for (let i = 0; i < rooms.length; i++) {
      let room = rooms[i]
      
      if (i > 3 && realRoomsCount > 3 && !room.is_member) {
        showMoreBtn = true
        break
      }
      
      if (!room.is_member) {
        realRoomsCount++
        rooms_.push(room)
      }
    }
  }

  return <>
          <SimpleGrid columns={1} spacing={5} w={w ? w : isAll ? '50%' : '90%'}>
              {isAll ? paginatedRooms[currentPage].map(room => <RoomDisplay all room={room} member={member} hideDesc={hideDesc} isProf={isProf ? true : false} />)
              : rooms_.map(room => <RoomDisplay room={room} member={member} />)
              }
          </SimpleGrid>
          
          {isAll && <ButtonGroup size='sm' isAttached variant='outline' mb='3'>
            <Button isDisabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
            <Button isDisabled={currentPage === paginatedRooms.length - 1} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          </ButtonGroup>}
          
          {!isAll && showMoreBtn && !profile && <Button onClick={(e) => {
            e.preventDefault()
            const endpoint = isSearch ? `/search-rooms-all/${searchQuery}` : '/my-rooms-all'
            window.location.href = endpoint
          }} m='2' colorScheme='purple'>See All</Button>}
        </>
  
}

export default RoomsList