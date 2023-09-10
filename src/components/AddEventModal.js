// AddEventModal.js

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./AddEventModal.css";

function AddEventModal({ onAddEventSubmit, onClose, isOpen, groups, upDate}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [start, setStartDateTime] = useState("");
  const [end, setEndDateTime] = useState("");
  const [shared, setShared] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [alarm, setAlarm] = useState(false);
  const [alarmDateTime, setAlarmDateTime] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  const pastelColors = [
    '#F27979',
    '#F2EA79',
    '#7DF279',
    '#43F23D',
    '#79F2E6'
    // ... 더 많은 색상 추가 가능
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("일정 내용을 입력해주세요.");
      return;
    }

    onAddEventSubmit({
      title,
      content,
      start,
      end,
      allDay,
      shared,
      groupId,
      alarm,
      alarmDateTime,
      backgroundColor, // 선택한 색상 추가
    });

    setTitle("");
    setContent("");
    setStartDateTime("");
    setEndDateTime("");
    setShared("");
    setAllDay(false);
    setAlarm(false);
    setAlarmDateTime("");
    onClose();
    upDate();
    setBackgroundColor("");
    console.log('업데이트');
  };

  const handleAlarmChange = (e) => {
    setAlarm(e.target.checked);
    if (!e.target.checked) {
      setAlarmDateTime("");
    }
  };

  return (
    <Modal className={"add-modal"} isOpen={isOpen} onRequestClose={onClose}>
      <form className="add-events-modal" onSubmit={handleSubmit}>
        <label htmlFor="title">일정 제목 : </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content">일정 내용 : </label>
        <textarea
          style={{ height: "4rem" }}
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

        <label htmlFor="start">시작 시간 : </label>
        <input
          type="datetime-local"
          id="start"
          value={start}
          onChange={(e) => setStartDateTime(e.target.value)}
        />

        <label htmlFor="end">종료 시간 : </label>
        <input
          type="datetime-local"
          id="end"
          value={end}
          onChange={(e) => setEndDateTime(e.target.value)}
        />

        <label htmlFor="shared">공유 대상 : </label>
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
          <label htmlFor="group">그룹 선택: </label>
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

        <button type="submit">추가</button>
        <button type="button" onClick={onClose}>
          취소
        </button>
      </form>
    </Modal>
  );
}

export default AddEventModal;
