import React from "react";
import { Modal, ModalProps } from "antd";

interface ConfirmModalProps extends ModalProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;  
  confirmDanger?: boolean;
  closable?: boolean;
  isDarkMode?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  setIsVisible,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmDanger = false,
  closable = true,
  isDarkMode = false,
  ...modalProps
}) => {
  return (
    <Modal
      title={title}
      open={isVisible}
      onOk={onConfirm}
      className={isDarkMode ? "custom-modal" : ""}
      onCancel={() => setIsVisible(false)}
      okText={confirmText}
      cancelText={cancelText}
      cancelButtonProps={{ type: "primary" }}
      okButtonProps={{ danger: confirmDanger }}
      closable={closable}
      {...modalProps} // Untuk properti tambahan dari Ant Design
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
