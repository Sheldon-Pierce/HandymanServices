import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";


interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    emailStatus: string;
    closeAlert: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, emailStatus, closeAlert }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{emailStatus === "success" ? "Success!" : "Error!"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {emailStatus === "success" ? (
            <p>Email sent successfully.</p>
          ) : (
            <p>There was an error sending the email. Please try again.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={closeAlert}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal