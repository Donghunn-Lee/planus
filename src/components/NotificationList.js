import React, { useState, useEffect } from 'react';
import Message from './Message';
import axios from 'axios';
import './Notification.css';

function NotificationList(isOpen,setIsAccepted,isAccepted, eventsUpdate) {
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [showGroupMessages, setShowGroupMessages] = useState(false);

  const token = localStorage.getItem('token');

  const handleClick = () => {
    setShowGroupMessages(!showGroupMessages);
  };

  const getMessages = () => {
    axios.get(`http://3.35.22.206:8080/api/messages/received/`,{
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
    .then(response=>{
      const messages = response.data.map(message => ({
          sharedScheduleId: message.sharedScheduleId,
          content: message.content,
          receiverName: message.receiverName,
          senderName: message.senderName,
          title: message.title,
          id: message.id
      }));
      setMessages(messages);
      // console.log(messages);
      console.log(response);
      const filteredMessages = messages.filter(message => !message.isAccepted);

      setMessages(filteredMessages);
      // console.log(filteredMessages);
    }).catch(error => console.log(error));

    axios.get(`http://3.35.22.206:8080/group/messages/`,{
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
    .then(response=>{
      console.log(response)
      const groupMessages = response.data.map(message => ({
         email: message.email,
         groupId: message.groupId,
         id : message.id,
         memberName:message.memberName,
         message: message.message,
         ownerId: message.ownerId,
         sharedCode : message.sharedCode,
         groupName : message.groupName,
      }));
      setGroupMessages(groupMessages);
    }).catch(error => console.log(error));
  }
  
  useEffect(() => {
    console.log(groupMessages);
  }, [groupMessages]);

  useEffect(() => {
    getMessages()
  }, [isOpen]);

  const handleAccept = (message) => {
    // const data = {sharedScheduleId: messageId}
    // console.log(data);
    console.log('sharedScheduleId');
    console.log(message.sharedScheduleId);
    let id = Number(message.sharedScheduleId);
      axios.post(`http://3.35.22.206:8080/api/messages/accept/${message.id}`, Number(message.sharedScheduleId),{
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type' : "application/json"
        }
      })
      .then(response => {
        console.log(response);
        const acceptedMessage = messages.find((message) => message.id === id);
        console.log(`메시지 "${acceptedMessage.content}"가 승인되었습니다.`);
        getMessages();
        setIsAccepted(true);
        console.log(isAccepted);
      })
      .catch(error => console.log(error));
  };
    
  const handleAcceptGroup = (groupMessage) => {
    
    axios.get(`http://3.35.22.206:8080/accept/message/${groupMessage.id}?sharedCode=${groupMessage.sharedCode}&email=${groupMessage.email}`,{
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
      .then((response) => {
        console.log(response);
        getMessages();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRejectGroup = (groupMessage) => {
    
    axios.delete(`http://3.35.22.206:8080/reject/message/${groupMessage.id}` ,{
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
      .then((response) => {
        console.log(response);
        getMessages();
      })
      .catch((error) => {
        console.error(error);
      });
  };

 

  const handleReject = (message) => {
    let id = Number(message.sharedScheduleId);
    axios.post(`http://3.35.22.206:8080/api/messages/reject/${message.id}`, Number(message.sharedScheduleId),{
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type' : "application/json"
        }
      })
      .then(response => {
        console.log(response);
        const rejectedMessage = messages.find((message) => message.id === id);
        console.log(`메시지 "${rejectedMessage.content}"가 거절되었습니다.`);
        getMessages();
        setIsAccepted(true);
      })
      .catch(error => console.log(error));
  };



  return (
    <div>
      <button className='toggle-button' onClick={handleClick}>
        {showGroupMessages ? '그룹 메시지' : '일정 공유 메시지'}
      </button>

      {messages.map((message) => (
        <div className="message-box" key={message.id}>
        <h4 style={{ margin: '0' }}>{message.title}</h4>
        <p style={{ margin: '0' }}>일정 내용: {message.content}</p>
        <p style={{ margin: '0' }}>이벤트 ID: {message.sharedScheduleId}</p>
        <button className="accept" onClick={() => handleAccept(message)}>
          승인
        </button>
        <button className="reject" onClick={() => handleReject(message)}>
          거절
        </button>
      </div>
      ))}

      {showGroupMessages && (
        <div>
          {groupMessages.map((groupMessage) => (
            <div className='group-message-box' key={groupMessage.id}>
              <h4 style={{ margin: '0' }}>그룹 이름 : {groupMessage.groupName}</h4>
              <p style={{ margin: '0' }}>초대 코드 : {groupMessage.sharedCode}</p>
              <p style={{ margin: '0' }}>요청자 : {groupMessage.memberName}</p>
              <button className="accept" onClick={() => handleAcceptGroup(groupMessage)}>
                승인
              </button>
              <button className="reject" onClick={() => handleRejectGroup(groupMessage)}>
                거절
              </button>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default NotificationList;