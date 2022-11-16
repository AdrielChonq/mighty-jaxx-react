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
import { useDispatch } from "react-redux";
import { hideModalMessage } from "../../slices/commonSlice";

interface Props {
  isOpen: boolean;
  title: String;
  content: String;
  positiveLabel: String;
}

export default function ModalMessage({
  isOpen,
  title,
  content,
  positiveLabel,
}: Props) {
  const dispatch = useDispatch();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        dispatch(hideModalMessage());
      }}
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
            colorScheme="red"
            onClick={() => {
              dispatch(hideModalMessage());
            }}
          >
            {positiveLabel || "Confirm"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
