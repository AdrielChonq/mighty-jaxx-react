import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  title: string;
  content: string;
  negativeLabel: string;
  positiveLabel: string;
  isLoading: boolean;
  onNegative: () => void;
  onPositive: () => void;
}

export default function ModalConfirmation({
  isOpen,
  title,
  content,
  negativeLabel,
  positiveLabel,
  isLoading,
  onNegative,
  onPositive,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onNegative}
      isCentered
      size={{ sm: "xs", md: "md" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onNegative}
            disabled={isLoading}
          >
            {negativeLabel || "Close"}
          </Button>
          <Button
            colorScheme="red"
            onClick={onPositive}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {positiveLabel || "Confirm"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
