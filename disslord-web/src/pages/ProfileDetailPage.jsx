import React, { useState, useEffect } from 'react'
import { fetchProfileDetails, fetchRemoveFriend, fetchDeclineFriendRequest, fetchAcceptFriendRequest,
  fetchCancelFriendRequest, fetchSendFriendRequest } from '../utils'
import { Image, Box, Text, Button, useToast } from '@chakra-ui/react' 
import RoomsList from '../components/RoomsList'
import MessageList from '../components/MessageList'
import BackButton from '../components/BackButton'
import PDP_Entry from '../components/PDP_Entry'
import ListElements from '../components/ListElements'
import Badge from '../components/Badge'
import LoadingComponent from '../components/LoadingComponent'
import AlertErrorComponent from '../components/AlertErrorComponent'
import DrawerComponent from '../components/DrawerComponent'
import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { TiTick, TiTimes } from 'react-icons/ti'
import { MdBuild  } from "react-icons/md"


const ProfileDetailPage = ({ dataset }) => {
  const toast = useToast()
  let { path } = dataset
  const { me } = dataset 
  if (path?.endsWith('/')) {
    path = path.substring(0, path.length -  1)
  }
  const username = path?.split('-')[1]
  const [profileDetails, setProfileDetails] = useState(null)
  const [isFriend, setIsFriend] = useState(false)
  const [seeFriends, setSeeFriends] = useState(false)
  const [seeMyRooms, setSeeMyRooms] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [acceptBtnLoading, setAcceptBtnLoading] = useState(false)
  const [rejectBtnLoading, setRejectBtnLoading] = useState(false)
  const [fake, setFake] = useState(0)
  const isSelf = username === me

  useEffect(() => {
    fetchProfileDetails(username, (response, status) => {
      setIsLoading(false)
      if (status !== 400) {
        setProfileDetails(response)
        setIsFriend(response.is_friend)
      }
    })
  }, [])

if (isLoading === true) {
  return <LoadingComponent />
} else if (profileDetails === null) {
  return <AlertErrorComponent title='User not found!' description='Make sure the username is correct or try again later.' /> 
}

return (
  <>

    <DrawerComponent isOpen={seeFriends} onClose={() => setSeeFriends(false)} title='My Friends' body={profileDetails.friend_list.map(({ username, profile_pic}) => {
      return <>
        <Badge username={username} profile_pic={profile_pic}  info={`@${username}`} /><br /><hr /><br />
      </>
    })} />

    <DrawerComponent isOpen={seeMyRooms} onClose={() => setSeeMyRooms(false)} title='My Rooms' body={<RoomsList rooms={profileDetails.owned_rooms} isAll w='100%' hideDesc isProf />} />

    <BackButton />
    <div align='center'>
      <Box style={{border: '2px solid #60039e', borderRadius: '20px', background: '#e3acf2'}} w='75%' h='90%' m='10'>
        <Box mt='5'>
          <Image src={profileDetails.profile_pic} alt='pfp' borderRadius='full'
          boxSize='150px' style={{border: '1px solid'}}/>
          <Text fontSize='xl' fontWeight='bold'>{profileDetails.first_name} {profileDetails.last_name}</Text>
          <Text fontSize='xl' color='blue'>@{profileDetails.username}</Text>
        </Box>

        {isSelf && <Button mt='3' colorScheme='purple' leftIcon={<MdBuild />} onClick={e => {
            e.preventDefault()
            window.location.href = '/profile/edit'
        }}>Edit Profile</Button>}

        {isFriend && <>
          <Button mt='3' mr='1' colorScheme='purple' rightIcon={<AiOutlineMinusCircle />} onClick={e => {
            e.preventDefault()
            setButtonLoading(true)
            fetchRemoveFriend(profileDetails.id, (response, status) => {
              if (status === 200) {
                profileDetails.request_status = 3
                setFake(fake+1)
                setIsFriend(false)
                setButtonLoading(false)
              } else {
                setButtonLoading(false)
                if (!toast.isActive('error1')) {
                  toast({
                      id: 'error1', title: 'Error removing friend.',
                      description: "Could not remove friend. Please try again later.",
                      status: 'error',  duration: 5000, isClosable: true,
                  })
              }
              }
            })
          }} isLoading={buttonLoading}>Remove Friend</Button>

          <Button mt='3' ml='1' colorScheme='purple' onClick={e => {
            e.preventDefault()
            window.location.href = '/chat-' + profileDetails.id
          }}>Message</Button>
        </>}

        {profileDetails.request_status === 1 && <>
          <Button mt='3' mr='1' colorScheme='purple' onClick={e => {
            e.preventDefault()
            setAcceptBtnLoading(true)
            fetchAcceptFriendRequest(profileDetails.request_id_from_them, (response, status) => {
              if (status === 200) {
                profileDetails.request_status = 3
                setFake(fake+1)
                setIsFriend(true)
                setAcceptBtnLoading(false)
              } else {
                setAcceptBtnLoading(false)
                if (!toast.isActive('error1')) {
                  toast({
                      id: 'error1', title: 'Error accepting friend request.',
                      description: "Could not accept friend request. Please try again later.",
                      status: 'error',  duration: 5000, isClosable: true,
                  })
              }
              }
            })
          }} rightIcon={<TiTick />} isLoading={acceptBtnLoading}>Accept</Button>

          <Button mt='3' ml='1' colorScheme='purple' onClick={e => {
            e.preventDefault()
            setRejectBtnLoading(true)
            fetchDeclineFriendRequest(profileDetails.request_id_from_them, (response, status) => {
              if (status === 200) {
                profileDetails.request_status = 3
                setFake(fake+1)
                setIsFriend(false)
                setRejectBtnLoading(false)
              } else {
                setRejectBtnLoading(false)
                if (!toast.isActive('error1')) {
                  toast({
                      id: 'error1', title: 'Error rejecting friend request.',
                      description: "Could not reject friend request. Please try again later.",
                      status: 'error',  duration: 5000, isClosable: true,
                  })
              }
              }
            })
          }} leftIcon={<TiTimes />} isLoading={rejectBtnLoading}>Reject</Button>

          <br /><Text as='sup'>{username} sent you a friend fequest.</Text>
        </>}

        {profileDetails.request_status === 2 && <>
          <Button mt='3' colorScheme='purple' onClick={e => {
            e.preventDefault()
            setButtonLoading(true)
            fetchCancelFriendRequest(profileDetails.id, (response, status) => {
              if (status === 200) {
                profileDetails.request_status = 3
                setFake(fake+1)
                setIsFriend(false)
                setButtonLoading(false)
              } else {
                setButtonLoading(false)
                if (!toast.isActive('error1')) {
                  toast({
                      id: 'error1', title: 'Error cancelling friend request.',
                      description: "Could not cancel friend request. Please try again later.",
                      status: 'error',  duration: 5000, isClosable: true,
                  })
              }
              }
            })
          }} rightIcon={<AiFillMinusCircle />} isLoading={buttonLoading}>Cancel Request</Button>
        </>}

        {profileDetails.request_status === 3 && !isSelf && !isFriend && <>
          <Button mt='3' colorScheme='purple' onClick={e => {
            e.preventDefault()
            setButtonLoading(true)
            fetchSendFriendRequest(profileDetails.id, (response, status) => {
              if (status === 201) {
                profileDetails.request_status = 2
                setIsFriend(false)
                setFake(fake+1)
                setButtonLoading(false)
              } else {
                setButtonLoading(false)
                if (!toast.isActive('error1')) {
                  toast({
                      id: 'error1', title: 'Error sending a friend request.',
                      description: "Could not send friend request. Please try again later.",
                      status: 'error',  duration: 5000, isClosable: true,
                  })
              }
              }
            })
          }} rightIcon={<AiOutlinePlusCircle />} isLoading={buttonLoading}>Send Friend Request</Button>
        </>}


     
        {isSelf && <Button colorScheme='purple' mt='3' ml='3' onClick={() => setSeeFriends(true)}>My Friends</Button>}
        {isSelf && <Button colorScheme='purple' mt='3' ml='3' onClick={() => setSeeMyRooms(true)}>Owned Rooms</Button>}
        
        <PDP_Entry title='LOCATION' value={profileDetails.location || 'No location Provided.'} fontSize='lg' />
        <PDP_Entry title='BIO' value={profileDetails.bio || 'No BIO Provided.'} mt='7' mb='5' />
  
        <div>
          <ListElements width='50%' float='left' align='left' titleOptions={{ as: '', fontWeight: 'bold', fontSize: 'xl', alignTitle: 'left', ml: '5', color: 'purple', mt: '7' }}
            title={`ROOMS ${username.toUpperCase()} PARTICIPATES IN`} bool={profileDetails.member_rooms.length} 
            boolTrueDisplay={<RoomsList rooms={profileDetails.member_rooms} w='80%' profile />} 
            boolFalseDisplay={<Text align='left' ml='5'>{username} does not participate in any room</Text>} />

          <ListElements width='50%' float='left' align='left' titleOptions={{ as: '', fontWeight: 'bold', fontSize: 'xl', alignTitle: 'left', ml: '5', color: 'purple', mt: '7' }}
            title='RECENT ACTIVITIES' bool={profileDetails.messages.length} 
            boolTrueDisplay={<MessageList messages={profileDetails.messages} username={username} profile_pic={profileDetails.profile_pic} />} 
            boolFalseDisplay={<Text align='left' ml='5'>{username} has no recent messages</Text>} />
        </div>
        
      </Box>
    </div>
  </>
)
}


export default ProfileDetailPage