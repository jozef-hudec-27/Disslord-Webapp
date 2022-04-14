import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ChakraProvider } from '@chakra-ui/react'

import HomePage from './pages/HomePage';
import AllRoomsPage from './pages/AllRoomsPage'
import RoomDetailPage from './pages/RoomDetailPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import CreateRoomPage from './pages/CreateRoomPage';
import PrivateChatPage from './pages/PrivateChatPage';
import EditRoomPage from './pages/EditRoomPage';


const privateChatEl = document.getElementById('private-chat')
if (privateChatEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <PrivateChatPage dataset={privateChatEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    privateChatEl
  );
} 

const roomDetailEl = document.getElementById('room-detail')
if (roomDetailEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <RoomDetailPage dataset={roomDetailEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    roomDetailEl
  );
} 

const editRoomEl = document.getElementById('edit-room')
if (editRoomEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <EditRoomPage dataset={editRoomEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    editRoomEl
  );
} 

const createRoomEl = document.getElementById('create-room-page')
if (createRoomEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <CreateRoomPage dataset={createRoomEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    createRoomEl
  );
} 


const profileDetailEl = document.getElementById('profile-detail')
if (profileDetailEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <ProfileDetailPage dataset={profileDetailEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    profileDetailEl
  );
} 


const appEl = document.getElementById('root')
if (appEl) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    appEl
  );
}


const homeEl = document.getElementById('home-page')
if (homeEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <HomePage dataset={homeEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    homeEl
  );
}


const allRoomsEl = document.getElementById('all-rooms-page')
if (allRoomsEl) {
  ReactDOM.render(
    <ChakraProvider>
      <React.StrictMode>
          <AllRoomsPage dataset={allRoomsEl.dataset} />
      </React.StrictMode>
    </ChakraProvider>,
    allRoomsEl
  );
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
