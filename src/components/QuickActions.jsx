import React from "react";
import { BsUpload, BsFolder2Open, BsQuestionCircle, BsPersonGear, BsSearch } from "react-icons/bs";

const QuickActions = ({ onAction, userRole }) => {
  const actions = [
    { icon: <BsFolder2Open />, label: "Base Knowledge", action: "base" },
    { icon: <BsQuestionCircle />, label: "Kelola FAQ", action: "faq" },
    { icon: <BsPersonGear />, label: "Kelola Admin", action: "admin", restricted: true },
    { icon: <BsSearch />, label: "Pertanyaan User", action: "history" },
  ];

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center my-4">
      {actions.map(({ icon, label, action, restricted }) => {
        const isDisabled = restricted && userRole !== "superadmin";

        return (
          <button
            key={action}
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => !isDisabled && onAction(action)}
            disabled={isDisabled}
            title={isDisabled ? "Hanya untuk superadmin" : ""}
          >
            {icon} {label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;