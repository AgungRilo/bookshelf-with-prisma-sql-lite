import React from "react";
import { Modal, ModalProps } from "antd";

interface DeleteModalProps extends ModalProps {
  deleteModalVisible: boolean;
  setDeleteModalVisible: (visible: boolean) => void;
  handleDelete: (id: number) => void;
  bookToDelete?: number | null;
  isDarkMode?: boolean;
  message?: string; 
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  deleteModalVisible,
  setDeleteModalVisible,
  handleDelete,
  bookToDelete,
  isDarkMode = false,
  message = "Are you sure you want to delete this post?", // Default pesan
  ...modalProps
}) => {
  return (
    <Modal
      title="Confirm Delete"
      className={isDarkMode ? "custom-modal" : ""}
      open={deleteModalVisible}
      onOk={() => handleDelete(Number(bookToDelete))}
      onCancel={() => setDeleteModalVisible(false)}
      okText="Delete"
      cancelText="Cancel"
      cancelButtonProps={{ type: "primary" }}
      okButtonProps={{ danger: true }}
      {...modalProps} // Untuk properti tambahan dari Ant Design jika diperlukan
    >
      <p>{message}</p>
    </Modal>
  );
};

export default DeleteModal;
