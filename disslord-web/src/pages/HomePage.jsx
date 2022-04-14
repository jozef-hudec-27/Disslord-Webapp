import React, { useState, useEffect } from 'react'
import { Box, Input, Text, Button, useToast } from '@chakra-ui/react'
import { fetchProfileDetails, fetchSearchRooms } from '../utils'
import RoomsList from '../components/RoomsList'
import ListElements from '../components/ListElements'
import LoadingComponent from '../components/LoadingComponent'
import { FaHammer } from 'react-icons/fa'


const HomePage = ({ dataset }) => {
    const toast = useToast()
    const { username } = dataset
    const [myRooms, setMyRooms] = useState([])
    const [searchRooms, setSearchRooms] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [lastSearchQuery, setLastSearchQuery] = useState(null)
    const [searchRoomsLoading, setSearchRoomsLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const handleSubmitSearchRooms = () => {
        if (!searchRoomsLoading && searchQuery !== lastSearchQuery) {
            setSearchRoomsLoading(true)
            setLastSearchQuery(searchQuery)
            fetchSearchRooms(searchQuery, (response, status) => {
                setSearchRoomsLoading(false)
                if (status === 200) {
                    setSearchRooms(response.length ? response : 'No Rooms found')
                } else if (!toast.isActive('error2')) {
                    toast({
                        id: 'error2',  title: 'Error!',
                        description: `Error searching for rooms. Please try again later.`,
                        status: 'error', duration: 5000, isClosable: true,
                    })
                }
            })    
        }
    }

    useEffect(() => {
        fetchProfileDetails(username, (response, status) => {
            setIsLoading(false)
            if (status === 200) {
                setMyRooms(response.member_rooms)
            } else if (!toast.isActive('error1')) {
                toast({
                    id: 'error1', title: 'Error finding rooms!',
                    description: `Could not find your rooms. Please try again later.`,
                    status: 'error', duration: 5000,  isClosable: true,
                })
            }
            } 
        )
    }, [])

  if (isLoading === true) {
      return <LoadingComponent />
  }

  return (
      <Box>
        <Button colorScheme='purple' m='4' onClick={e => { e.preventDefault(); window.location.href = '/create-room'}} leftIcon={<FaHammer />}
            >Create new Room
        </Button>
        <div style={{ width: '40%', float: 'left'}} align='center'>
            <Box m='4'>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitSearchRooms()
                }}>
                    <Input placeholder='Search for Rooms' w='50%' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} focusBorderColor='purple.400' />
                </form>
            </Box>

            <hr width='75%' />
            {searchRoomsLoading ? <LoadingComponent /> : <RoomsList rooms={searchRooms} member={false} isSearch={true} searchQuery={searchQuery} />}
        </div>
        
        <ListElements width='40%' float='right' align='center' titleOptions={{ as: 'samp', fontWeight: 'bold', fontSize: 'xl' }} 
            title='My Rooms' bool={myRooms.length}  divide boolTrueDisplay={<RoomsList rooms={myRooms} member isSearch={false} />} 
            boolFalseDisplay={<Text as='i'>You are not in any room :'(</Text>} />
      </Box>
  )
}

export default HomePage
