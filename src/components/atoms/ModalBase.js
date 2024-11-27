import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from "@chakra-ui/react";

const ModalBase = ({
    isOpen,
    onClose,
    title,
    body,
    onConfirm,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{body}</ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose} mr={3}>
                        {cancelText}
                    </Button>
                    <Button colorScheme="red" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalBase;
