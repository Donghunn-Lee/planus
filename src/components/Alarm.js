import React, { useEffect } from "react";
import axios from "axios";

function Alarm({ events, onUpdateEvent }) {

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!events) {
      return; // events가 undefined일 경우 실행 중단
    }
    const checkAlarms = () => {

      const now = new Date();
      events.forEach((event) => {
        if (event.alarm && new Date(event.alarmDateTime) < now) {
          sendAlarm(event);
        }
      });
    };

    const sendAlarm = (event) => {
      // 알람 전송을 위한 axios 요청
      axios.post(`http://3.35.22.206:8080/send-one`,event.title, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      .then((response) => {
        console.log(response);
        // 알람 전송 성공 시 이벤트 업데이트
          const updatedEvent = { ...event, alarm: false };
          onUpdateEvent(updatedEvent);
      });
    };

    const interval = setInterval(checkAlarms, 5000); // 5초마다 알람 체크

    return () => {
      clearInterval(interval);
    };
  }, [events, onUpdateEvent]);

  return null;
}

export default Alarm;