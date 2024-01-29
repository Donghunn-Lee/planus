import { useEffect, useState } from "react";
import Modal from "react-modal";
import './KakaoShare.css';

const KaKaoShare = ({groups, setSharedCode }) => {
  const { Kakao } = window;
  const [showInviteGroupModal, setShowInviteGroupModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState({});
  const [checkInviteCode, setCheckInviteCode] = useState(false);

  const handleShowInviteGroupModal = () => {
    setShowInviteGroupModal(!showInviteGroupModal);
    setShowModal(!showModal);
    if (!showInviteGroupModal) {
      setSharedCode('');
      setTargetGroup('');
      setErrorMessage('');
    }
  };

  const handleTargetGroup = (e) => {
    const selectedGroup = groups.find(group => group.id == e);
    setTargetGroup(selectedGroup);
    console.log(selectedGroup);

}

  useEffect(()=>{
    Kakao.cleanup();
    if(!Kakao.isInitialized()){
      Kakao.init(SECRET_KEY);
      };
    
    // shareKakao();
  },[targetGroup])


  useEffect(()=>{
    // init 해주기 전에 clean up 을 해준다.
    Kakao.cleanup();
    // 자신의 js 키를 넣어준다.
    if(!Kakao.isInitialized()){
      Kakao.init(SECRET_KEY);
      };
    console.log(true)
    
  },[]);

 


  const shareKakao = () =>{
    console.log('click kakaoshare')

    Kakao.Share.createDefaultButton({
      container: '#kakaotalk-sharing-btn',
      objectType: 'feed',
      content: {
        title: 'Planus',
        description: `그룹 '${targetGroup.name}'의 초대코드 : ${targetGroup.sharedCode}`,
        imageUrl:
          'https://postfiles.pstatic.net/MjAyMzA2MDlfMjgx/MDAxNjg2MzE5MzU3ODY5.corFgvtwwadfGjqOkgO79YFMTC4qgfeT2QOkNC5VcDYg.4bj1IWgyKH14pK8TYYkiIqdo8M4F-BCvasb8xZPbK5Ig.PNG.xortlsrkdfla/logo.png?type=w580',
        link: {
          webUrl: IP_ADRESS,
          mobileWebUrl: IP_ADRESS,
        },
      },
      buttons: [
        {
          title: '참여하기',
          link: {
            webUrl: IP_ADRESS,
            mobileWebUrl: IP_ADRESS,
          },
        },
      ]
    });

    
  }

  return (
    <>
      <button className='share-button' onClick={handleShowInviteGroupModal}>
        그룹 초대
      </button>
      {showInviteGroupModal && (
        <>
          <Modal
            className="select-group-modal"
            isOpen={showModal}
            onRequestClose={handleShowInviteGroupModal}
            contentLabel="Invite Group Modal"
            >
            <div className="select-group-modal-content">
              <h2>그룹 초대 코드 전송</h2>
              <div>
                <label htmlFor="targetGroup">그룹 선택: </label>
                <select
                  id="targetGroup"
                  value={targetGroup ? targetGroup.id : ""}
                  onChange={(e) => {handleTargetGroup(e.target.value); }}
                >
                  <option value="">그룹</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="kakaotalk-sharing-btn"
                onClick={()=>{shareKakao()}}
                >
                  공유하려면 더블클릭!
                  </button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
  };

  export default KaKaoShare;

