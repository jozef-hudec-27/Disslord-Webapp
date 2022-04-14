import React, { useState, useEffect } from 'react'
import { fetchRoomDetail } from '../utils'
import AlertErrorComponent from '../components/AlertErrorComponent'
import LoadingComponent from '../components/LoadingComponent'
import EditRoomComponent from '../components/EditRoomComponent'
import BackButton from '../components/BackButton'


const EditRoomPage = ({ dataset }) => {

    const { username, path } = dataset
    let roomId = path?.split('-')[2]
    if (roomId?.includes('/')) {
        roomId = roomId?.substring(0, roomId?.length - 1)
    } 
    const [roomDetails, setRoomDetails] = useState(null)
    const [error, setError] = useState(null)
    const [roomValues, setRoomValues] = useState({ name: '', description: '' })

    useEffect(() => {
        fetchRoomDetail(roomId, (response, status) => {
            if (status === 200) {
                setRoomDetails(response)
                setRoomValues({
                    name: response.name,
                    description: response.description
                })
            } else (    
                setError(true)
            )
        })
    }, [])

    
  return (
    <>
        {!error && !roomDetails && <LoadingComponent />}
        {error && <AlertErrorComponent title='Error finding room' description="Could not find room. Make sure the room exists and you are it's admin." />}
        {!error && roomDetails !== null && <>
            <BackButton url={'/room-' + roomDetails?.id} />
            <EditRoomComponent roomDetails={roomDetails} username={username} roomValues={roomValues} setRoomValues={setRoomValues} />
        </>}
    </>
  )
}

export default EditRoomPage