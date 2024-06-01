import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import EditOrderForm from "../components/EditOrderForm";

const EditOrderModal = ({
  isOpen,
  onClose,
  sale,
  onFormSubmit,
  isDarkMode,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        bg={isDarkMode ? "gray.800" : "white"}
        color={isDarkMode ? "white" : "black"}
      >
        <ModalHeader>Edit Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditOrderForm sale={sale} onSubmit={onFormSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditOrderModal;
