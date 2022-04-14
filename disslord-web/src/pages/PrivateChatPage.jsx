import React, { useState, useEffect } from 'react'
import AlertErrorComponent from '../components/AlertErrorComponent'
import LoadingComponent from '../components/LoadingComponent'
import PrivateChatComponent from '../components/PrivateChatComponent'
import BackButton from '../components/BackButton'
import { fetchProfileDetails } from '../utils'


const PrivateChatPage = ({ dataset }) => {

    const { path, username, userId } = dataset
    let theirId = path?.split('-')[1]
    if (theirId?.includes('/')) {
        theirId = theirId?.substring(0, theirId?.length - 1)
    }

    const [chatSocket, setChatSocket] = useState(null)
    const [error, setError] = useState(false)
    const [theirUsername, setTheirUsername] = useState(null)

    useEffect(() => {

        fetchProfileDetails(theirId, (response, status) => {
            if (status === 200) {
              setTheirUsername(response.username)
            }
          })

        const cSocket = new WebSocket('ws://' + '127.0.0.1:8000' + '/ws/chat/private/' + `${userId}w${theirId}/`)

        cSocket.onopen = e => {
            setChatSocket(cSocket)
            console.log(`** CHATSOCKET ${userId}w${theirId} CONNECTED **`)
        }

        cSocket.onclose = e => {
            setError(true)
        }
    }, [])

  return (
      <>
        {!error && chatSocket === null && <LoadingComponent />}
        {error && <AlertErrorComponent title='Chat not found!' description='Make sure the user exists and you are friends with them.' /> }
        {chatSocket !== null && !error && <>
            <BackButton url={'/profile-' + theirUsername} />
            <PrivateChatComponent username={username} userId={userId} theirId={theirId} chatSocket={chatSocket} theirUsername={theirUsername} />
        </>
        }
      </>
  )
}

export default PrivateChatPage