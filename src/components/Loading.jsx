import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Crunching the numbers...', fullScreen = false }) => {
  const content = (
    <div className="loading-container">
      <div className="loading-spinner-wrapper">
        <Loader2 className="animate-spin text-primary" size={38} />
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="loading-fullscreen">{content}</div>;
  }

  return content;
};

export default Loading;
