import React, { useState, useEffect } from "react";

type AlertBoxProps = {
  alertType: "success" | "error" | "warning" | "info";
  title?: string;
  message?: string;
};

const AlertBox: React.FC<AlertBoxProps> = ({ alertType, title, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const alertConfig = {
    success: {
      img: "images/alert/success.png",
      defaultTitle: "Success",
      defaultMessage: "Your request has been processed successfully.",
      border: "border-green-600",
      bg: "bg-green-50",
    },
    error: {
      img: "images/alert/error.png",
      defaultTitle: "Error",
      defaultMessage: "An error occurred while processing your request.",
      border: "border-red-600",
      bg: "bg-red-50",
    },
    warning: {
      img: "images/alert/warning.png",
      defaultTitle: "Warning",
      defaultMessage: "Certain features are unavailable for this selection.",
      border: "border-yellow-700",
      bg: "bg-yellow-50",
    },
    info: {
      img: "images/alert/info.png",
      defaultTitle: "Info",
      defaultMessage: "You will receive a notification once the process is complete.",
      border: "border-purple-600",
      bg: "bg-purple-50",
    },
  };

  const selectedAlert = alertConfig[alertType] || alertConfig.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 sm:1/1 md:1/2 lg:w-1/4 flex items-center p-4 mb-4 rounded-lg ${selectedAlert.bg} ${selectedAlert.border} border-l-4 animate-slide-in z-50`}
    >
      <img
        src={selectedAlert.img}
        alt="alert icon"
        className="w-[55px] h-[55px] mr-4"
      />
      
      <div>
        <p className="text-headline-4 font-bold text-monochrome-950">
          {title || selectedAlert.defaultTitle}
        </p>
        <p className="text-body-large font-medium text-monochrome-950">
          {message || selectedAlert.defaultMessage}
        </p>
      </div>
    </div>
  );
};

export default AlertBox;
