import React, { useEffect, useState } from "react";
import axios from "axios";
import Profile from "../assets/profile.png";
// import data from "../data/messages.json";

const Messages = (props) => {
  // const messages_data = data.messages.data;
  const [messages, setMesseges] = useState(null);
  console.log(props.conversation);
  function formatDate(inputDate) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const date = new Date(inputDate);

    return date.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    //get The data from the server and store it in the messages state
    // setMesseges(messages);
    const getConversations = async () => {
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${userAccessToken}`,
      //   },
      // };
      // const { data } = await axios.get(
      //   `https://graph.facebook.com/v11.0/me/conversations?fields=messages{message,from,to,created_time},participants&access_token=${userAccessToken}`,
      //   config
      // );
      //how to pass the useraccesstoken as the parameter in the below get request
      // const { data } = await axios.get(
      //   `http://localhost:8000/api/conversationsList?${userAccessToken}`
      // );

      await axios
        .get(`http://localhost:8000/api/messagesList`, {
          params: {
            userAccessToken: props.userAccessToken,
            conversationId: props.conversationId,
            // email: sessionStorage.getItem("email"),
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          console.log(response.data.data.messages.data);
          setMesseges(response.data.data.messages.data.reverse());
        })
        .catch((error) => {
          console.log(error);
        });

      // await axios
      //   .get(`http://localhost:8000/api/conversationsList?${userAccessToken}`)
      //   .then((response) => {
      //     console.log(response);
      //     console.log(response.data);
      //     setConversationList(response.data.data);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    };
    getConversations();
  }, [props.conversationId]);

  async function handleEnterKeyPress() {
    console.log("enter key pressed");
    await axios
      .get(`http://localhost:8000/api/sendmessage`, {
        params: {
          userAccessToken: props.userAccessToken,
          userID: props.conversation.participants.data[0].id,
          // email: sessionStorage.getItem("email"),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        // console.log(response.data);
        // setConversationList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!messages) return <div>Loading...</div>;

  return (
    <>
      <div className="overflow-y-auto">
        {messages.map((chat, i) => {
          return chat.from.name !== "Helpdesk" ? (
            <div className="flex flex-col">
              <div className="flex">
                <img className="w-10 my-2" src={Profile} alt="" />
                <div className="bg-white my-2 mr-2 px-2 py-1 rounded-md ">
                  {chat.message}
                </div>
              </div>
              <p className="text-[12px] font-semibold ml-12">
                {formatDate(chat.created_time)}
              </p>
            </div>
          ) : (
            <div className="flex flex-row-reverse">
              <div className="flex flex-col">
                <div className="flex">
                  <div className="bg-white my-2 mr-2 px-2 py-1 rounded-md ">
                    {chat.message}
                  </div>
                  <img className="w-10 my-2" src={Profile} alt="" />
                </div>
                <span className="text-[12px] font-semibold ">
                  {formatDate(chat.created_time)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center">
        {/* useState for the chat exchange */}
        <input
          type="text"
          className="absolute bottom-4 left-[30.5%] right-[23%] p-2 mx-2 bg-white rounded-md outline outline-blue-600"
          placeholder="Message Hilten Saxena"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Call your function here
              handleEnterKeyPress();
            }
          }}
        />
      </div>
    </>
  );
};

export default Messages;
