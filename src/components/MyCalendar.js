import  {React, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import './Mycalendar.css'
import AddEventModal from './AddEventModal';
import EventDetailModal from './EventDetailModal.js';
import EditEventModal from './EditEventModal';
import Alarm from './Alarm';


function MyCalendar({ selectedGroup ,Groups, Personal, events, setEvents, isAccepted, handleIsAccepted}) {

  const API_CALENDAR = 'http://3.35.22.206:8080/api/schedules';
  const API_USER = 'http://3.35.22.206:8080/api/schedules/user'

  
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [checkedGroupEvents, setCheckedGroupEvents] = useState([]);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);

  const token = localStorage.getItem('token');

  const handleAddEventSubmit = (data) => {
    if(data.shared) {
      console.log("공유 일정 생성");
      axios.post(`http://3.35.22.206:8080/api/schedules/shared?sharedWithIds=${data.shared}`, data, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      .then(() => {
        const newEvent = {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
        };
        handleEventsDisplay();
        console.log(newEvent);
      })
      
      .catch(error => {
        console.error(error);
      });
    }
    else if(data.groupId){
      console.log("그룹 일정 생성");

        axios.post(`http://3.35.22.206:8080/api/groups/${data.groupId}/schedules`, data, {
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        })
        .then((response) => {
          const newEvent = {
            ...data,
            start: new Date(data.start),
            end: new Date(data.end),
          };
          handleEventsDisplay();
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }

    else {
      console.log("개인 일정 생성");
      axios.post(API_CALENDAR, data, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(() => {
        const newEvent = {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
          border:'none'
        };
        handleEventsDisplay();
        console.log(newEvent);
      })
      .catch(error => {
        console.error(error);
      });
    }
}

const updatePersonalEvents = async () => {
  console.log('개인 일정 업데이트')
  try {
    const response = await axios.get(API_USER, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });

    const newEvents = response.data.map(event => ({
      ...event,
      id: event.id.toString(),
      start: new Date(
        event.start[0],
        event.start[1] - 1,
        event.start[2],
        event.start[3],
        event.start[4]
      ),
      end: new Date(
        event.end[0],
        event.end[1] - 1,
        event.end[2],
        event.end[3],
        event.end[4]
      ),
      title: event.title,
      content: event.content,
      backgroundColor: event.backgroundColor,
      textColor:'black'
    }));
    return newEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
};


const updateGroupEvents = async () => {
  console.log('그룹 일정 업데이트')
  let newGroupEvents = [];

  for (const group of selectedGroup) {
    try {
      const response = await axios.get(
        `http://3.35.22.206:8080/api/groups/${group.id}/schedules`,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        }
      );
      console.log(response.data)
      const groupEvents = response.data.map(event => ({
        ...event,
        id: event.id.toString(),
        start: new Date(
          event.start[0],
          event.start[1] - 1,
          event.start[2],
          event.start[3],
          event.start[4]
        ),
        end: new Date(
          event.end[0],
          event.end[1] - 1,
          event.end[2],
          event.end[3],
          event.end[4]
        ),
        title: event.title,
        content: event.content,
        groupId: event.groupId,
        backgroundColor: event.backgroundColor,
        textColor:'black'
      }));

      newGroupEvents = [...newGroupEvents, ...groupEvents];
    } catch (error) {
      console.log(error);
    }
    
  }
  return newGroupEvents;
};


  const handleEventsDisplay = async () => {
    let newPersonalEvents = [];
    let newCheckedGroupEvents = [];
  
    if (Personal) {
      if (selectedGroup.length > 0) {
        newPersonalEvents = await updatePersonalEvents();
        newCheckedGroupEvents = await updateGroupEvents();
      } else {
        newPersonalEvents = await updatePersonalEvents();
      }
    } else {
      if (selectedGroup.length > 0) {
        newCheckedGroupEvents = await updateGroupEvents();
      }
    }
  
    const combinedEvents = [...newPersonalEvents, ...newCheckedGroupEvents];
    setEvents(combinedEvents);
  };
 


  useEffect(() => {
    handleEventsDisplay();
  }, [Personal, selectedGroup, imageUpload]);
 
  useEffect(() => {
    updateGroupEvents();
    updatePersonalEvents();
  }, []);

  // useEffect(() => {
  //   updateGroupEvents();
  // }, [selectedGroup]);

  useEffect(() => {
    handleEventsDisplay();
    handleIsAccepted(false);
    console.log("공유후 일정 업데이트",isAccepted)
  }, [isAccepted]);

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = events.find(event => event.id === eventId);
  
    if (!event) {
      console.log("Could not find event with id", eventId);
      return;
    }
    setSelectedEvent(event);
    setShowEventDetailModal(true);
    console.log(event);
  };
  

const handleEditClick = (event) => {
  if(event.shared) {
    axios.patch(`http://3.35.22.206:8080/api/schedules/shared?sharedWithIds=${event.shared}`, event, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
    .then(response => {
      
      const newEvent = {
        ...event,
        id: response.data.id.toString(),
        start: new Date(
          event.start[0],
          event.start[1] - 1,
          event.start[2],
          event.start[3],
          event.start[4]
        ),
        end: new Date(
          event.end[0],
          event.end[1] - 1,
          event.end[2],
          event.end[3],
          event.end[4]
        ),
        content: event.content,
        backgroundColor:event.backgroundColor,
      };
      setPersonalEvents(preEvents => [...preEvents, newEvent])
      setShowAddEventModal(false);
      handleEventsDisplay();
      // console.log(events);
    })
    
    .catch(error => {
      console.error(error);
    });
    console.log("공유 일정 수정");
  }
  else if(event.groupId){
    // console.log(event.groupId);
      axios.patch(`http://3.35.22.206:8080/api/groups/${event.groupId}/schedules/${event.id}`, event
      , {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      .then(response => {
        const newEvent = {
          ...event,
          id: response.data.id.toString(),
          start: new Date(
            event.start[0],
            event.start[1] - 1,
            event.start[2],
            event.start[3],
            event.start[4]
          ),
          end: new Date(
            event.end[0],
            event.end[1] - 1,
            event.end[2],
            event.end[3],
            event.end[4]
          ),
          content: event.content,
          alarm:event.alarm,
          alarm:event.alarmDateTime,
          backgroundColor:event.backgroundColor,
          borderColor:'none'
        };
        setCheckedGroupEvents(preEvents => [...preEvents, newEvent])
        handleEventsDisplay();
      })
      .catch(error => {
        console.error(error);
      });
      console.log("그룹 일정 수정");
  }

  else {
    axios.patch(`http://3.35.22.206:8080/api/schedules/${event.id}`, event, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      const newEvent = {
        ...event,
        id: response.data.id.toString(),
        start: new Date(
          event.start[0],
          event.start[1] - 1,
          event.start[2],
          event.start[3],
          event.start[4]
        ),
        end: new Date(
          event.end[0],
          event.end[1] - 1,
          event.end[2],
          event.end[3],
          event.end[4]
        ),
        content: event.content,
        backgroundColor:event.backgroundColor,
      };
      setPersonalEvents(preEvents => [...preEvents, newEvent]);
      handleEventsDisplay();
    })
    .catch(error => {
      console.error(error);
    });
    console.log("개인 일정 수정");
  }
  console.log('수정 완료');
};

const handleEditEvent=()=>{
  setShowEditEventModal(true)
}


const handleDeleteClick = (event) => {
  if(event.groupId){
    axios.delete(`http://3.35.22.206:8080/api/groups/${event.groupId}/schedules/${event.id}`,{
      headers: {
          'Authorization': 'Bearer ' + token,
        }
    })
    .then(() => {
      const newEvents = checkedGroupEvents.filter(e => e.id !== event.id);
      setCheckedGroupEvents(newEvents);
      
      setSelectedEvent(null);
      setShowEventDetailModal(false);
      handleEventsDisplay();
    })
    .catch(error => {
      console.log(error);
    });
    console.log("그룹 일정 삭제");
  }

  else {
    axios.delete(`http://3.35.22.206:8080/api/schedules/${event.id}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => {
      const newEvents = personalEvents.filter(e => e.id !== event.id);
      setPersonalEvents(newEvents);
    
      setSelectedEvent(null);
      setShowEventDetailModal(false);
      handleEventsDisplay();
    })
    .catch(error => {
      console.error(error);
    });
    console.log("개인 일정 삭제")
  }
};

  
  const calendarOptions = {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'addEventButton',
        },
    
        customButtons: {
          addEventButton: {
            text: '일정 추가',
            click: () => setShowAddEventModal(true),
          },
        },
    
        titleFormat: {
          month: 'long',
        },
    
        eventClick: handleEventClick,
        events: events,
        eventDisplay: 'block',
        border: 'none'

        
      };
 
    
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        {...calendarOptions}
        style={{ height: '100%', width: '100%' }}
        
      />

      {showAddEventModal && (
        <AddEventModal
          onAddEventSubmit={handleAddEventSubmit}
          onClose={() => setShowAddEventModal(false)}
          upDate={handleEventsDisplay}
          isOpen={showAddEventModal}
          groups={Groups}
        />
      )}

      {showEventDetailModal && selectedEvent && (
        <EventDetailModal
        event={selectedEvent}
        onClose={() => setShowEventDetailModal(false)}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        show={showEventDetailModal}
        events={events}
        setEvents={setEvents}
        groups={Groups}
        showEditEvent={handleEditEvent}
        eventsUpdate={handleEventsDisplay}
      />
      )}

      {showEditEventModal && (
            <EditEventModal
              show={showEditEventModal}
              event={selectedEvent}
              onClose={() => setShowEditEventModal(false)}
              groups={Groups}
              hide = {()=>setShowEventDetailModal(false)}
              handleEditSubmit={handleEditClick}
              eventsUpdate={handleEventsDisplay}
              eventUpdate={setSelectedEvent}
              setImageUpload={setImageUpload}
            />
          )}
    </>
  );
}

export default MyCalendar;