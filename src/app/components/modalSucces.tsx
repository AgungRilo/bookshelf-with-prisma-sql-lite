import React from "react";
import { Button, Modal, ModalProps } from "antd";

interface ModalSuccess extends ModalProps {
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

const ModalSuccess: React.FC<ModalSuccess> = ({
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
      okText={confirmText}
      closable={closable}
      footer={[
        <Button key="ok" type="primary" onClick={onConfirm}>
            OK
        </Button>,
    ]}
      {...modalProps} // Untuk properti tambahan dari Ant Design
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ModalSuccess;
