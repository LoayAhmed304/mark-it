import React, { useState, useEffect } from 'react';
import './AnimatedLogo.css';

const AnimatedLogo = () => {
  const [stage, setStage] = useState(0);

  // Cycle through animation stages
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prevStage) => (prevStage >= 3 ? 0 : prevStage + 1));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-logo">
      {stage === 0 && <div className="plain-text">MarkTogether</div>}

      {stage === 1 && (
        <div className="markdown-heading">
          <span className="md-symbol"># </span>
          <span>MarkTogether</span>
        </div>
      )}

      {stage === 2 && (
        <div className="markdown-bold">
          <span className="md-symbol">**</span>
          <span>Mark</span>
          <span className="md-symbol">**</span>
          <span>Together</span>
        </div>
      )}

      {stage === 3 && (
        <div className="markdown-final">
          <span className="md-symbol"># </span>
          <span className="text-mark">Mark</span>
          <span className="text-together">Together</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
