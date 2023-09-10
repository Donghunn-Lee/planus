import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './EventDetailModal.css';
import axios from 'axios';

const EventDetailModal = ({ showEditEvent, show, event,events, onClose, onDeleteClick,eventsUpdate}) => {
  const [images, setImages] = useState(event.images);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [showCheckDeleteModal, setShowCheckDeleteModal] = useState(false);

  const token = localStorage.getItem('token');


  const handleDeleteClick = () => {
    setShowCheckDeleteModal(true);
    console.log(showCheckDeleteModal,'적용')
  };

  const handleImageUpdate = async (event, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      console.log("이미지 patch");
      const response = await axios.patch(`http://3.35.22.206:8080/api/schedules/image/${event.id}`, formData, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      });
      eventsUpdate();
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(()=> {
    const newImage = events.find(e => e.id === event.id);
      setImages(newImage.images);
      console.log('새 이미지 저장')
  },[events])

  const handleCommentsSubmit = () => {
    if(event.groupId){
      console.log("rf이벤트");
      axios
      .post(
        `http://3.35.22.206:8080/comments`,
        {
          text: text,
          groupScheduleId: event.id,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleComments();
        setText('');
      })
      .catch((error) => console.log(error));
   
    }
    else{
      console.log("이벤트");
      axios
      .post(
        `http://3.35.22.206:8080/comments`,
        {
          text: text,
          scheduleId: event.id,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleComments();
        setText('');
      })
      .catch((error) => console.log(error));
    }
  };

  const handleComments = () => {
    if(event.groupId){
      axios
      .get(`http://3.35.22.206:8080/comments/groupSchedule/${event.id}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      })
      .then((response) => {
        console.log(response);
        setComments(response.data);
      })
      .catch((error) => console.log(error));
    }
    else{
    axios
      .get(`http://3.35.22.206:8080/comments/schedule/${event.id}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      })
      .then((response) => {
        console.log(response);
        setComments(response.data);
      })
      .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    handleComments();
  }, []);



  return (
    <>
      <Modal show={show} onHide={onClose} className="event-detail-modal"
      style={{backgroundColor : event.backgroundColor}}
      >
        <Modal.Header>
          <Modal.Title className="modal-title">{event.title}</Modal.Title>
          
        </Modal.Header>
        <Modal.Body>
        {images && images.length > 0 ? (
          images.map((imageData, index) => (
            <img
              key={index}
              className='imageData'
              src={`data:image/jpeg;base64,${imageData.imageData}`}
              alt="Decoded Image"
            />
          ))
        ) : (
          <p></p>
        )}
          {event.content && <p className='modal-content'>{event.content}</p>}
          <p className='event-time'>{new Date(event.start).toLocaleString()}</p>
          <p style={{fontSize:"14px", color:"blue"}}>{event.alarm && '알람 시간 : '+new Date(event.alarmDateTime[0], event.alarmDateTime[1] - 1, event.alarmDateTime[2], event.alarmDateTime[3], event.alarmDateTime[4]).toLocaleString()}</p>
          <input
            type="file"
            id="file-input"
            onChange={(e) => handleImageUpdate(event, e.target.files[0])}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="custom-file-input">
            사진 +
          </label>
        </Modal.Body>

        <Modal.Footer>
          <div className="comments-section">
            <h3>댓글</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <span className="author">{comment.memberNickname}</span>
                <p className="content">{comment.text}</p>
                {/* <span className="comment-date">{comment.date}</span> */}
              </div>
            ))}
            <div className="comment-divider"></div>
            <form className="comment-form">
              <textarea
                placeholder="댓글을 입력하세요"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              <button type="button" onClick={handleCommentsSubmit}>
                댓글 작성
              </button>
            </form>
          </div>
          <div style={{textAlign:'right'}}>
            <Button variant="secondary" onClick={() => { onClose(); showEditEvent(); }}>
              수정
            </Button>
            <Button variant="danger" onClick={handleDeleteClick}>
              삭제
            </Button>
            
            <Modal
              show={showCheckDeleteModal}
              onHide={() => setShowCheckDeleteModal(false)}
              className="confirm-delete-modal" // 클래스 이름 추가
            >
              <Modal.Body>
                <p>{event.title} 일정을 삭제하시겠습니까?</p>
                <div className="confirm-buttons">
                  <Button variant="danger" onClick={() => onDeleteClick(event)}
                  style={{backgroundColor:'#15B800'}}>
                    예
                  </Button>
                  <Button variant="secondary" onClick={() => setShowCheckDeleteModal(false)}
                  style={{backgroundColor:'#DC3545'}}>
                    취소
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventDetailModal;
