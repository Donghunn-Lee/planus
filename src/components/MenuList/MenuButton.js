import React from 'react';

function MenuButton({onClick,}) {
  return (
    <button className="menu-button" onClick={onClick}>
      <div className="menu-icon">
        <div className="menu-bar"></div>
        <div className="menu-bar"></div>
        <div className="menu-bar"></div>
      </div>
    </button>
  );
}

export default MenuButton;