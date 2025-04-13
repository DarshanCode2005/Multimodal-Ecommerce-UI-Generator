'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import LeftPane from './LeftPane';
import PreviewPane from './PreviewPane';
import RightPane from './RightPane';

export default function AppLayout() {
  const [isLeftPaneVisible, setIsLeftPaneVisible] = useState(true);
  const [isRightPaneVisible, setIsRightPaneVisible] = useState(true);
  
  const toggleLeftPane = () => {
    setIsLeftPaneVisible(!isLeftPaneVisible);
  };
  
  const toggleRightPane = () => {
    setIsRightPaneVisible(!isRightPaneVisible);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar 
        onToggleLeftPane={toggleLeftPane}
        onToggleRightPane={toggleRightPane}
        isLeftPaneVisible={isLeftPaneVisible}
        isRightPaneVisible={isRightPaneVisible}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftPane isVisible={isLeftPaneVisible} />
        <PreviewPane expanded={!isLeftPaneVisible && !isRightPaneVisible} />
        <RightPane isVisible={isRightPaneVisible} />
      </div>
    </div>
  );
} 