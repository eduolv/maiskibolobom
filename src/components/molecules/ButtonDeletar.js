import ButtonBase from "../atoms/ButtonBase";

const ButtonDeletar = ({ onClick, ...props }) => {
    return (
        <ButtonBase onClick={onClick} colorScheme="red" fontSize="sm" {...props}>
            DELETAR
        </ButtonBase>
    );
};

export default ButtonDeletar;
