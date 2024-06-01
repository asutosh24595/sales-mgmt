import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import SaleOrderForm from "../components/SaleOrderForm";

const SaleOrderModal = ({ isOpen, onClose, onFormSubmit , isDarkMode}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        bg={isDarkMode ? "gray.800" : "white"}
        color={isDarkMode ? "white" : "black"}
      >
        <ModalHeader>Create Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SaleOrderForm onSubmit={onFormSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SaleOrderModal;
