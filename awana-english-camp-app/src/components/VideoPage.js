import React from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import './VideoPage.css';

function VideoPage() {
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    navigate('/');
  };

  const handleSkipVideo = () => {
    navigate('/');
  };

  return (
    <div className="video-page">
      <ReactPlayer
        url="/videos/intro.mp4"  // 비디오 파일의 경로를 설정합니다.
        playing
        muted
        controls
        onEnded={handleVideoEnd}
        width="100%"
        height="100%"
      />
      <button className="skip-button" onClick={handleSkipVideo}>Skip Video</button>
    </div>
  );
}

export default VideoPage;
