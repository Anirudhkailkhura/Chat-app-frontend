import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute , host} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

const Chat = () => {

  const navigate = useNavigate();
  const socket = useRef();
  //STATES
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [mounted, setMounted] = useState(false);
  // const [isLoaded, setisLoaded] = useState(false);

  useEffect(() => {
    if (!mounted) {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(
          JSON.parse(
            localStorage.getItem("chat-app-user")
          )
        );
        setMounted(true);
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);


  useEffect(() => {
    if (currentUser && currentUser.isAvatarImageSet) {
      axios.get(`${allUsersRoute}/${currentUser._id}`)
        .then(response => setContacts(response.data))
        .catch(error => console.error(error));
    } else if (currentUser && !currentUser.isAvatarImageSet) {
      navigate("/setAvatar");
    }
  }, [currentUser]);


  // useEffect(async () => {
  //   if (!localStorage.getItem("chat-app-user")) {
  //     navigate("/login");
  //   } else {
  //     setCurrentUser(
  //       await JSON.parse(
  //         localStorage.getItem("chat-app-user")
  //       )
  //     );
  //     setisLoaded(true)
  //   }
  // }, []);

  // useEffect(async () => {
  //   if (currentUser) {
  //     if (currentUser.isAvatarImageSet) {
  //       const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
  //       setContacts(data.data);
  //     } else {
  //       navigate("/setAvatar");
  //     }
  //   }
  // }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (

    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}

        />
        {mounted && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        )
        }
      </div>
    </Container>

  );
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 90vh;
    width: 90vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    @media screen and (min-width: 320px) and (max-width: 404px) {
      grid-template-columns: 25% 75%;
    }
  }
`;

export default Chat

// In this version, we added a new state variable called mounted and set it to false initially.
// In the first useEffect hook, we check if the component has been mounted and if the mounted state
//  is false then it will check for the user in the local storage and set the currentUser state variable.
// And then it sets the mounted state variable to true to prevent the loop error.

// In the second useEffect hook, we check the currentUser state variable, and if it's truthy,
//  we check the isAvatarImageSet property of the currentUser object. If it's true,
//  it makes an API request to ${allUsersRoute}/${currentUser._id} using the axios library,
//   and then sets the state of contacts to the data returned by the API. If isAvatarImageSet is false, the code navigates to the /setAvatar route.

// This way, the useEffect hooks only run when the relevant state variables change, preventing a loop error.

// Also, in the first useEffect, the fetchData function is removed as it is unnecessary, and the code check for user in localstorage,
//  if it's not found it navigate to login page, otherwise it set the current user.
// And in the second useEffect, it only runs if the currentUser is truthy and checks for the isAvatarImageSet,
//  if true it fetches the data, if false it navigates to setAvatar page.