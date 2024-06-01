import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ViewOrderForm from "../components/ViewOrderForm";

const EditOrderModal = ({ isOpen, onClose, sale, isDarkMode }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        bg={isDarkMode ? "gray.800" : "white"}
        color={isDarkMode ? "white" : "black"}
      >
        <ModalHeader>View Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ViewOrderForm sale={sale} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditOrderModal;
