import ButtonBase from "../atoms/ButtonBase";

const ButtonCadastrar = ({ onClick, ...props }) => {
    return (
        <ButtonBase onClick={onClick} colorScheme="teal" {...props}>
            CADASTRAR
        </ButtonBase>
    );
};

export default ButtonCadastrar;
