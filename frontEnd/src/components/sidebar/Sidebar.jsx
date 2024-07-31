import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <FaBars onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <p>Navigation Items</p>}
    </div>
  );
};

export default Sidebar;
