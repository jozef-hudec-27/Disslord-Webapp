import { axiosInstance } from '../axios';


export const backendLookup = (method, endpoint, callback, data) => {
    axiosInstance.request({
        url: endpoint,
        method: method,
        data: data
    })
    .then(data => {
        console.log(`RESPONSE AFTER FETCHING ${endpoint} => ${data}, STATUS => ${data.status}`)

        if (data.status === 403) {
            if (window.location.href.indexOf('login') === -1) {
                window.location.href = '/login'
            }
        } else {
            callback(data.data, data.status)
        }
    })
    .catch(err => callback({ response: err.response?.data || err }, 400))
}   


export const fetchProfileDetails = (username, callback) => {
    backendLookup('GET', `/profiles/${username}`, callback)
}

export const fetchSearchRooms = (key, callback) => {
    backendLookup('POST', '/rooms/search/', callback, { key: key })
}

export const fetchRoomAction = (roomId, action, callback) => {
    backendLookup('POST', `/rooms/${roomId.toString()}/action/`, callback, {action: action})
}

export const fetchRoomDetail = (roomId, callback) => {
    backendLookup('GET', `/rooms/${roomId}`, callback)
}

export const fetchNewMessage = (roomId, messageBody, callback) => {
    backendLookup('POST', '/rooms/message/', callback, { room_id: roomId, message_body: messageBody })
}

export const fetchRemoveFriend = (removeeId, callback) => {
    backendLookup('POST', '/friend/remove/', callback, { removee_id: removeeId })
}

export const fetchDeclineFriendRequest = (friendRequestId, callback) => {
    backendLookup('POST', 'friend/request/decline/', callback, { friend_request_id: friendRequestId })
}

export const fetchAcceptFriendRequest = (friendRequestId, callback) => {
    backendLookup('POST', '/friend/request/accept/', callback, { friend_request_id: friendRequestId })
}

export const fetchCancelFriendRequest = (userId, callback) => {
    backendLookup('POST', '/friend/request/cancel/', callback, { user_id: userId })
}

export const fetchSendFriendRequest = (receiverId, callback) => {
    backendLookup('POST', '/friend/request/send/', callback, { receiver_user_id: receiverId })
}

export const fetchGetPrivateMessages = (userId, callback) => {
    backendLookup('GET', `/chat/messages/${userId}/`, callback)
}

export const fetchUpdateRoom = (data, callback) => {
    backendLookup('POST', '/rooms/update/', callback, data)
}

export const fetchKickRoomParticipant = (roomId, participantId, callback) => {
    backendLookup('POST', '/rooms/kick-participant/', callback, { room_id: roomId, kicked_user_id: participantId })
}

export const fetchCreateRoom = (name, description, callback) => {
    backendLookup('POST', '/rooms/create/', callback, { name: name, description: description })
}


export const  timeSince = (date) => {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
