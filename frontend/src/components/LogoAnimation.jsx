import React, { useEffect, useState } from 'react';
import '../styles/LogoAnimation.css';

const LogoAnimation = () => {
  const [typing, setTyping] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [collaborator, setCollaborator] = useState(false);

  // Animation sequence
  useEffect(() => {
    // Start typing animation
    const typingTimer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        setTyping((prev) => {
          if (prev >= 100) {
            clearInterval(typeInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(typeInterval);
    }, 500);

    // Start rendering animation after typing starts
    const renderTimer = setTimeout(() => {
      setRendered(true);
    }, 2500);

    // Show collaborator after some content is typed
    const collabTimer = setTimeout(() => {
      setCollaborator(true);
    }, 3500);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(renderTimer);
      clearTimeout(collabTimer);
    };
  }, []);

  return (
    <div className="logo-container">
      <div className="logo-content">
        <div className="markdown-editor">
          <div className="editor-window">
            <div className="window-header">
              <div className="window-controls">
                <span className="control close"></span>
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
              <div className="window-title">markdown.md</div>
            </div>
            <div className="editor-content">
              <div className="markdown-code" style={{ width: `${typing}%` }}>
                <span className="syntax"># </span>
                <span className="content">Hello, World!</span>
              </div>
              {typing >= 40 && (
                <div
                  className="markdown-code"
                  style={{ width: `${typing - 20}%` }}
                >
                  <span className="syntax">## </span>
                  <span className="content">Collaborative</span>
                </div>
              )}
              {typing >= 60 && (
                <div
                  className="markdown-code"
                  style={{ width: `${typing - 30}%` }}
                >
                  <span className="syntax">- </span>
                  <span className="content">Real-time</span>
                </div>
              )}
              {typing >= 80 && (
                <div
                  className="markdown-code"
                  style={{ width: `${typing - 30}%` }}
                >
                  <span className="syntax">- </span>
                  <span className="content">Instant</span>
                </div>
              )}

              {collaborator && (
                <div className="collaborator">
                  <div className="collab-cursor"></div>
                  <div className="collab-typing">
                    <span className="syntax">- </span>
                    <span className="content collab-text"> Work together</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {rendered && (
            <div className="preview-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <div className="window-title">Preview</div>
              </div>
              <div className="preview-content">
                <h1 className="rendered-h1">Hello, World!</h1>
                {typing >= 40 && <h2 className="rendered-h2">Collaborative</h2>}
                {typing >= 60 && (
                  <ul className="rendered-list">
                    <li className="rendered-item">real-time</li>
                    {typing >= 80 && <li className="rendered-item">Instant</li>}
                    {collaborator && (
                      <li className="rendered-item collab-rendered">
                        Work together
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="logo-title">
          <span className="mark">Mark</span>
          <span className="it">It</span>
          <div className="tagline">Collaborate. Create. Markdown.</div>
        </div>
      </div>
    </div>
  );
};

export default LogoAnimation;
