import { Button } from "@chakra-ui/react";

const ButtonBase = ({ children, onClick, colorScheme, ...props }) => {
  return (
    <Button onClick={onClick} colorScheme={colorScheme} {...props}>
      {children}
    </Button>
  );
};

export default ButtonBase;
