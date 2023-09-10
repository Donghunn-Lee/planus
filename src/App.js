import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate,Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import './App.css';
import Menu from './components/MenuList/Menu';
import MyCalendar from './components/MyCalendar';
import MenuButton from './components/MenuList/MenuButton';
import NotificationButton from './components/NotificationButton';
import Notification from './components/Notification';
import LoginPage from './pages/LoginPage';
import RegisterPage from './components/RegisterPage';
import TodoList from './components/MenuList/TodoList';
import axios from 'axios';


axios.defaults.baseURL = 'http://3.35.22.206:8080/api'; // 백엔드 API의 기본 URL 설정
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccepted, setisAccepted] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupList, setShowGroupList] = useState(false);
  const [showPersonalSchedule, setShowPersonalSchedule] = useState(true);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 마이페이지 모달 열림 여부
  const [newNickname, setNewNickname] = useState(''); // 닉네임 변경을 위한 state
  const [exPassword, setExPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // 비밀번호 변경을 위한 state
  const [eventAccepted, setEventAccepted] = useState('');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (token && user) {
      // 토큰 및 사용자 정보가 로컬 스토리지에 저장되어 있는 경우
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 로그인 토큰 삭제
    localStorage.removeItem('user'); // 유저 정보 삭제
    localStorage.removeItem('userNickname'); // 유저 닉네임 삭제
    localStorage.removeItem('userId');
    setSelectedGroup([]);
    setGroups([]);
    setMenuOpen(false)
    setIsAuthenticated(false); // 인증 상태 변경
    setShowGroupList(false);
  };

  const handleNicknameChange = async (inFo) => {
    // 닉네임 변경에 대한 API 호출 및 처리 로직을 추가하세요.
    // 필요한 state: newNickname, email
    // 변경이 성공적으로 이루어지면 모달을 닫으세요.
    console.log(userInfo);
    try {
      const response = await axios.post('http://3.35.22.206:8080/member/nickname', 
        {
          email: inFo.email,
          nickname: newNickname,
          password: exPassword,
          phoneNumber: inFo.phoneNumber,
        }, {
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        })
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    const newUserInfo = {
      email: inFo.email,
          nickname: newNickname,
          password: exPassword,
          phoneNumber: inFo.phoneNumber,
    }
    localStorage.setItem('userNickname',newUserInfo.nickname);
    setUserInfo(newUserInfo);
    setExPassword();
    setNewNickname();
    setNewPassword();
    setIsProfileModalOpen(false);
  };

  const changePasswordChange = () => {
    handlePasswordChange(userInfo)
  }

  const changeNickNameChange = () => {
    handleNicknameChange(userInfo)
  }


  const handlePasswordChange = async (inFo) => {
    // 비밀번호 변경에 대한 API 호출 및 처리 로직을 추가하세요.
    // 필요한 state: exPassword, newPassword, email
    // 변경이 성공적으로 이루어지면 모달을 닫으세요.
    try {
      const response = await axios.post('http://3.35.22.206:8080/member/password', 
      {
        email: inFo.email,
        exPassword: exPassword,
        newPassword: newPassword,
      }, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      console.log(response);
   
    } catch (error) {
      console.error(error);
    }
    
    setExPassword();
    setNewNickname();
    setNewPassword();
    setIsProfileModalOpen(false);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  }
  
  const handleSetEvents = (events) => {
    setEvents(events);
    // console.log(events);
  }

  const handleIsAccepted = (state) => {
    setisAccepted(state);
  }

  const handleSelectedGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleMessages = (messages) => {
    setMessages(messages);
  }

  const handleGroups = (groups) => {
    setGroups(groups);
    console.log(groups);
  };

  const handlePersonalScheduleCheckboxChange = (personal) => {
    setShowPersonalSchedule(!personal);
    // console.log(personal)
  };

  useEffect(()=>{
    console.log(showPersonalSchedule);
  },[showPersonalSchedule])

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    
  }

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleNotificationToggle = () => {
    // setNotificationOpen(!notificationOpen);
    setNotificationOpen(!notificationOpen);
    console.log(notificationOpen);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };
 

  const redirectPath = isAuthenticated ? '/mycalendar' : '/login';
  


  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <MenuButton onClick={handleMenuToggle} />

          <Menu isOpen={menuOpen}
            handleSelectedGroup={handleSelectedGroup}
            selectedGroup={selectedGroup}
            groups={groups}
            setGroups={handleGroups}
            Personal={handlePersonalScheduleCheckboxChange}
            events = {events}
            setEvents={handleSetEvents}
            showGroupList={showGroupList}
            setShowGroupList={setShowGroupList}

            />

          {isAuthenticated ? <p style={{fontSize:'15px'}}>{localStorage.getItem('userNickname')}</p> : null}
          
          
          {isAuthenticated && (<Link to="/login"><button onClick={handleLogout} className='logout-btn'>로그아웃</button></Link>)}

          {isAuthenticated && (
            <button className="profile-btn" onClick={() => {
              console.log("마이페이지 버튼 클릭됨");
              setIsProfileModalOpen(true);
            }}>
              마이페이지
            </button>
          )}
              
          <h1 id="planus-title">Planus</h1>
          <NotificationButton onClick={handleNotificationToggle}/>
          <Notification
            isOpen={notificationOpen}
            handleclose={handleNotificationClose}
            isAccepted={isAccepted}
            setIsAccepted={handleIsAccepted}
            messages={messages}
            setMessages={handleMessages}
            events={events}
            setEventAccepted={setEventAccepted}
            />
            

        </header>

        <div className="App-body" onClick={handleMenuClose} >
          <Routes>
            <Route
            path="/login"
            element={
            <LoginPage
            setIsAuthenticated={setIsAuthenticated}
            IsAuthenticated={isAuthenticated}
            setUserInfo={setUserInfo}
            />} />
            <Route path="/mycalendar" element={isAuthenticated ?
            <MyCalendar
              eventAccepted={eventAccepted}
              handleIsAccepted={handleIsAccepted}
              isAccepted={isAccepted}
              selectedGroup={selectedGroup}
              Groups={groups}
              Personal={showPersonalSchedule}
              events={events}
              setEvents={handleSetEvents}/>
            : <Navigate to="/login" />} />
            <Route path="/todolist" element={<TodoList/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/" element={<Navigate to={redirectPath} />} />
          </Routes>
        </div>

        <Modal
          show={isProfileModalOpen}
          onHide={handleProfileModalClose}
          backdrop="static" // 바깥 영역 클릭으로 모달 닫히지 않도록 설정
          className="profile-modal"
        >
          
          <h2>마이페이지</h2>
          <div className="profile-info">
            <p>이메일: {localStorage.getItem('user')}</p>
            <p>닉네임: {localStorage.getItem('userNickname')}</p>
          </div>
          <div className="profile-section">
            <h3>닉네임 변경</h3>
            <input
              type="exPassword"
              placeholder="기존 비밀번호"
              value={exPassword}
              onChange={(e) => setExPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="새로운 닉네임"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
            />
            <button onClick={changeNickNameChange}>변경</button>
          </div>
          <div className="profile-section">
            <h3>비밀번호 변경</h3>
            <input
              type="exPassword"
              placeholder="기존 비밀번호"
              value={exPassword}
              onChange={(e) => setExPassword(e.target.value)}
            />
            
            <input
              type="password"
              placeholder="새로운 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={changePasswordChange}>변경</button>
          </div>
          <button className="close-button" onClick={handleProfileModalClose}>
            닫기
          </button>
        </Modal>
      </div>
    </BrowserRouter>
  );
}

export default App;
