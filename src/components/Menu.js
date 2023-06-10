import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import KakaoShare from "./KakaoShare";
import Modal from "react-modal";
import './Menu.css';
import NotificationList from './NotificationList';
// import Group from './Group';

function Menu({ isOpen, onClose, selectedGroup, handleSelectedGroup, Groups, Personal,events,setEvents}) {
  const token = localStorage.getItem('token');
  const API_GROUP = 'http://13.209.48.48:8080/api/groups';
  const API_SCHEDULE = 'http://13.209.48.48:8080/api/schedules';

  const [showGroupList, setShowGroupList] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  // const [selectedGroup, setSelectedGroup] = useState([]);
  const [deleteGroup, setDeleteGroup] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [showPersonalSchedule, setShowPersonalSchedule] = useState(true);
  const [isKakaoShare, setKakaoShare] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [sharedCode, setSharedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSharedCode('');
    setErrorMessage('');
  };


  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleShare = () => {
    setButtonDisabled(true);
  }
  // useEffect(() => {
  //   if (selectedGroup) {
  //     // 선택한 그룹의 일정을 가져오는 함수
  //     fetchSchedules(selectedGroup.id);
  //   } else {
  //     // 개인 일정을 가져오는 함수
  //     fetchPersonalSchedules();
  //   }
  // }, [selectedGroup]);

  const handleGroupClick = () => {
    setShowGroupList(!showGroupList);
    if(!showGroupList) {
      setShowEditGroup(false);
      setShowDeleteModal(false)
    }
    // console.log(showGroupList);
  };

  const handleAddGroupClick = () => {
    setShowAddGroup(!showAddGroup);
    setShowAddButton(!showAddButton);
  };

  const handleAddButtonClick = () => {
    setShowAddButton(!showAddButton);
  };

  const handleEditGroupClick = () => {
    setShowEditGroup(!showEditGroup);
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleMemberIdsChange = (event) => {
    setMemberIds(event.target.value);
  };

  const handleKakaoShareClick = () => {
    setKakaoShare(!isKakaoShare);
  };

  const handleAddGroupSubmit = (event) => {
    event.preventDefault();


    const data = {
      name: groupName,
    };

    axios.post('http://13.209.48.48:8080/api/groups', data, {
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
      .then((response) => {
        console.log(response);
        setGroupName('');
        setShowAddGroup(false);
        setMemberIds('');
        // LoadGroups();
        setGroupMember(response.data.id);
        // console.log(response.id)
        
      })
      .catch((error) => {
        console.error(error);
      });
      console.log("생성")
  };

  const setGroupMember=(groupId)=>{
    axios.post(`http://13.209.48.48:8080/api/groups/${groupId}/members`, {
      id: localStorage.getItem('userId')
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
    })
    .then((response) => {
      LoadGroups();
    })
    .catch((error) => {
      console.error(error);
    });
    console.log("생성")
  }


  const handleDeleteGroupSubmit = (deleteGroup) => {
    // `http://13.209.48.48:8080/api/groups/owner/${deleteGroup.id}`
    axios.delete(`http://13.209.48.48:8080/api/groups/${deleteGroup.id}/members/${deleteGroup.memberIds}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
      .then((response) => {
        LoadGroups();
        setShowDeleteModal(false);
        console.log("Delete 실행")
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
    const LoadGroups = () => {
      axios
        .get("http://13.209.48.48:8080/api/groups/mygroups", {
          headers: {
            'Authorization': 'Bearer ' + token
          },
        })
        .then((response) => {
          // console.log(localStorage.getItem('userId'))
          setGroups(response.data);
          Groups(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
      });
  };

 const setSharedData = () => {
  const data = groups.find((group)=>group.id===56)
  console.log(data);
 }

//  useEffect(()=>{
//   setSharedData();
//  },[LoadGroups])

  // useEffect(() => {
  //   if(selectedGroup){
  //     handleSelectedGroupEvents()
  //   }
  // }, [selectedGroup]);


useEffect(()=>{
  LoadGroups();
},[])

  const handleGroupCheckboxChange = (event, group) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      handleSelectedGroup((prevSelected) => [...prevSelected, group]);
    } else {
      handleSelectedGroup((prevSelected) =>
        prevSelected ? prevSelected.filter((selected) => selected.id !== group.id) : []
      );
    }
  };

  useEffect(()=>{
    console.log(selectedGroup);
  },[selectedGroup])

  const handlePersonalScheduleCheckboxChange = (event) => {
    console.log(event.target.checked);
    setShowPersonalSchedule(event.target.checked);
    Personal(showPersonalSchedule);
  };


  useEffect(()=>{
    console.log(showPersonalSchedule);
  },[showPersonalSchedule])


  const checkDeleteGroupSubmit = (group) => {
    setShowDeleteModal(true);
    setDeleteGroup(group)
  };


  const handleInviteGroup = () => {
    
    axios.post(`http://13.209.48.48:8080/group/accept?sharedCode=${sharedCode}`,[] ,{
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
      .then((response) => {
        console.log(response);
        LoadGroups();
        setGroupName('');

        console.log(response.sharedCode);
        closeModal();
      })
      .catch((error) => {
        setErrorMessage('초대 코드가 일치하지 않습니다.');
        console.error(error);
      });
  };

useEffect(() => {
  console.log(sharedCode);
}
,[sharedCode]) 




  return (
    <>
    <NotificationList sharedCodee = {sharedCode}></NotificationList>

    {showDeleteModal && (
        <div id='check-delete' className="modal">
          <h2>선택 그룹 : {deleteGroup.name}</h2>
          <h3>삭제하시겠습니까?</h3>
          <div className='button-row'>
            <button id='button-accept' onClick={() => handleDeleteGroupSubmit(deleteGroup)}>삭제</button>
            <button id='button-reject' onClick={() => setShowDeleteModal(false)}>취소</button>
          </div>
        </div>
    )}
    <div className={`menu-container ${isOpen ? 'open' : ''}`}>
      <div className="menu-title">
        <h2>Menu</h2>
      </div>
      <ul className="menu-content">
        <li>
          <NavLink exact to="/" activeClassName="active" onClick={onClose}>
            Home
          </NavLink>
        </li>
        <li>
          <li onClick={()=>{handleGroupClick(); LoadGroups();}} style={{ padding: '0px', margin: '0px' }}>
            Group
          </li>
          {showGroupList && (
            <div style={{ paddingLeft: '0px' }} className="sub-menu-container">
              <button className="edit-button" onClick={handleEditGroupClick}>
                편집
              </button>

              <ul style={{ paddingLeft: '1rem' }}>
                <li style={{ fontSize: '18px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={showPersonalSchedule}
                      onChange={handlePersonalScheduleCheckboxChange}
                    />
                    나의 일정
                  </label>
                </li>
                 {groups.map((group) => (
                  <li style={{ fontSize: '14px' }} key={group.name}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedGroup.some((selected) => selected.id === group.id)}
                        onChange={(event) => handleGroupCheckboxChange(event, group)}
                      />
                      {group.name}
                    </label>

                    <KakaoShare isButtonDisabled={buttonDisabled}  onShare={{handleShare}} propss = {sharedCode}>
                      
                      
                    </KakaoShare>

                    {showEditGroup && (
                      <>
                        <button className="delete-button" onClick={() => checkDeleteGroupSubmit(group)}>
                          삭제
                        </button>
                      </>
                    )}
                  </li>
                ))}
                {showEditGroup && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {showAddButton && (
                      <button className="add-button" onClick={handleAddGroupClick}>
                        그룹 추가
                      </button>
                    )}
                    {showAddGroup && (
                      <li style={{ marginTop: '-1rem' }}>
                        <form onSubmit={handleAddGroupSubmit}>
                          <input
                            type="text"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={handleGroupNameChange}
                            style={{ width: '150px' }}
                          />
                          <button type="submit" onClick={() => setShowAddButton(true)}>
                            생성
                          </button>
                          <button type="button" onClick={handleAddGroupClick}>
                            취소
                          </button>
                        </form>
                      </li>
                    )}
                  </div>
                )}
              </ul>
            </div>
          )}
        </li>
        
        <li>
          <NavLink exact to="/schedule" activeClassName="active" onClick={onClose}>
            Schedule
          </NavLink>
        </li>

        <li>
          <div className='modal-container'>
        <button className='modal-button' onClick={openModal}>초대코드 입력</button>
        <Modal className="share-modal" isOpen={showModal} onRequestClose={closeModal}>
          <div className="modal">
            <div className="modal-content">
              <h2>초대코드 입력</h2>
              <input type="text" value={sharedCode} onChange={(e) => setSharedCode(e.target.value)} />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button onClick={handleInviteGroup}>코드 입력</button>
              <button className='cancel-button' onClick={closeModal}>닫기</button>
            </div>
          </div>
        </Modal>
        </div>
      </li>
      </ul>
    </div>
    </>
  );
  
}

export default Menu;