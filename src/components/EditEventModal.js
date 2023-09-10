import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./EditEventModal.css";

function EditEventModal({ hide,event, onClose, show, groups ,handleEditSubmit,eventUpdate}) {
  const [title, setTitle] = useState(event.title);
  const [content, setContent] = useState(event.content);
  const [start, setStartDateTime] = useState(event.start);
  const [end, setEndDateTime] = useState(event.end);
  const [shared, setShared] = useState(event.shared);
  const [allDay, setAllDay] = useState(event.allDay);
  const [groupId, setGroupId] = useState(event.groupId);
  const [alarm, setAlarm] = useState(event.alarm);
  const [alarmDateTime, setAlarmDateTime] = useState(event.alarmDateTime);
  const [backgroundColor, setBackgroundColor] = useState(event.backgroundColor);

  const pastelColors = [
    '#F27979',
    '#F2EA79',
    '#7DF279',
    '#43F23D',
    '#79F2E6'
  ];

  useEffect(()=>{
    console.log("EditEventModal");
    console.log(groups)
  },[])
  
  const handleAlarmChange = (e) => {
    setAlarm(e.target.checked);
    if (!e.target.checked) {
      setAlarmDateTime("");
    }
  };

  const handleSubmit = (e) => {
    if (!title.trim()) {
      alert("일정 내용을 입력해주세요.");
      return;
    }

    const updatedEvent = {
      id: event.id,
      title,
      content,
      start,
      end,
      allDay,
      shared,
      groupId,
      alarm,
      alarmDateTime,
      backgroundColor,
      images:event.images,
    };

    handleEditSubmit(updatedEvent);
    onClose();
  };

  

  return (
    <Modal className="edit-modal" isOpen={show} onRequestClose={onClose}>
      <form className="edit-events-modal" onSubmit={handleSubmit}>
        <h2>일정 수정</h2>
        <label htmlFor="title">일정 제목:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content">일정 내용:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <label>일정 색상 선택:</label>
        <div className="color-options">
          {pastelColors.map((color) => (
            <div
              key={color}
              className={`color-option ${backgroundColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setBackgroundColor(color)}
            ></div>
          ))}
        </div>

        <label htmlFor="start">시작 시간:</label>
        <input
          type="datetime-local"
          id="start"
          value={start}
          onChange={(e) => setStartDateTime(e.target.value)}
        />

        <label htmlFor="end">종료 시간:</label>
        <input
          type="datetime-local"
          id="end"
          value={end}
          onChange={(e) => setEndDateTime(e.target.value)}
        />

        <label htmlFor="shared">공유 대상:</label>
        <input
          type="text"
          id="shared"
          value={shared}
          onChange={(e) => setShared(e.target.value)}
        />

        <label htmlFor="all-day">
          <input
            type="checkbox"
            id="all-day"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          하루 종일
        </label>

        <label htmlFor="alarm">
          <input
            type="checkbox"
            id="alarm"
            checked={alarm}
            onChange={handleAlarmChange}
          />
          알람 설정 여부
        </label>

        {alarm && (
          <>
            <label htmlFor="alarmDateTime">알람 시간 : </label>
            <input
              type="datetime-local"
              id="alarmDateTime"
              value={alarmDateTime}
              onChange={(e) => setAlarmDateTime(e.target.value)}
            />
          </>
        )}

        <div>
          <label htmlFor="group">그룹 선택:</label>
          <select
            id="group"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">그룹</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" onClick={()=>{handleSubmit()}}>수정</button>
        <button type="button" onClick={onClose}>
          취소
        </button>
      </form>
    </Modal>
  );
}

export default EditEventModal;
