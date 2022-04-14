import React, { useState, useEffect } from 'react'
import { fetchProfileDetails, fetchSearchRooms } from '../utils'
import RoomsList from '../components/RoomsList'
import BackButton from '../components/BackButton'


const AllRoomsPage = ({ dataset }) => {
    const { path, username } = dataset
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        if (['/my-rooms-all', '/my-rooms-all/'].includes(path)) {
            fetchProfileDetails(username, (response, status) => {
                if (status === 200) {
                    setRooms(response.member_rooms)
                } else {
                    alert('There was an error finding your rooms')
                } 
            })
        } else {
            const searchQuery = path.split('/')[2] || ''
            fetchSearchRooms(searchQuery, (response, status) => {
                if (status === 200) {
                    setRooms(response)
                } else {
                    alert('There was an error searching for rooms')
                }
            })    
        }
    }, [])
    
  return (
      <>
      <BackButton />
      <div align='center'>
        <RoomsList rooms={rooms} isAll={true} member={false} />
      </div>
    </>
  )
}

export default AllRoomsPage