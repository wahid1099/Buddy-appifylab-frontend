import React, { useState, useRef, useEffect } from 'react';
import './PullToRefresh.css';

const PullToRefresh = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  
  const PULL_THRESHOLD = 80; // Distance needed to trigger refresh
  const MAX_PULL = 120; // Maximum pull distance

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;
    
    if (distance > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, MAX_PULL));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setStartY(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
      setStartY(0);
    }
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.clientY);
    }
  };

  const handleMouseMove = (e) => {
    if (startY === 0 || isRefreshing || e.buttons !== 1) return;
    
    const distance = e.clientY - startY;
    
    if (distance > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, MAX_PULL));
    }
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const spinnerRotation = pullProgress * 360;

  return (
    <div
      ref={containerRef}
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (startY !== 0) handleMouseUp();
      }}
    >
      <div
        className="pull-to-refresh-indicator"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div className="pull-to-refresh-content">
          {isRefreshing ? (
            <div className="spinner spinning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <div
              className="spinner"
              style={{
                transform: `rotate(${spinnerRotation}deg)`,
                opacity: pullProgress,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V2M12 22v-3M5 12H2M22 12h-3M6.34 6.34L4.22 4.22M19.78 19.78l-2.12-2.12M6.34 17.66l-2.12 2.12M19.78 4.22l-2.12 2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          <span className="pull-to-refresh-text">
            {isRefreshing ? 'Refreshing...' : pullDistance >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      <div className="pull-to-refresh-children">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
