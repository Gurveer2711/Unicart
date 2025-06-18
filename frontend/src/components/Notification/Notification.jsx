import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";
import "./Notification.css";

const Notification = ({ message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    // Handle different message types
    if (typeof message === "object") {
      // If it's an error object, extract the message
      if (type === "error") {
        const errorMessage =
          message.message || message.error || "An error occurred";
        const details = message.details || message.stack || null;
        setErrorDetails(details);
        setDisplayMessage(errorMessage);
      } else {
        // For non-error objects, try to stringify or use a default
        setDisplayMessage(JSON.stringify(message) || "Notification");
      }
    } else {
      // If it's already a string, use it directly
      setDisplayMessage(String(message));
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, message, type]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="notification-icon" />;
      case "error":
        return <FaExclamationCircle className="notification-icon" />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`notification ${type} ${isVisible ? "show" : "hide"}`}>
      <div className="notification-content">
        {getIcon()}
        <div className="notification-message-container">
          <span className="notification-message">{displayMessage}</span>
          {errorDetails && (
            <details className="notification-error-details">
              <summary>Details</summary>
              <pre>{errorDetails}</pre>
            </details>
          )}
        </div>
        <button
          className="notification-close"
          onClick={() => setIsVisible(false)}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Notification;
