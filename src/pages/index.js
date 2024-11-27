import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "../components/organisms/Header";
import Sidebar from "../components/organisms/Sidebar";
import ButtonCadastrar from "../components/molecules/ButtonCadastrar";
import ModalBase from "../components/atoms/ModalBase";
import { localStorageService } from "../services/localStorageService";

const Produtos = () => {
  const [name, setName] = useState("");
  const [listProducts, setListProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } =
    useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    const products = localStorageService.get("db_products");
    setListProducts(products);
  }, []);

  const handleNewProduct = () => {
    if (!name.trim()) return alert("Nome inválido!");
    if (verifyProductName()) return alert("Produto já cadastrado!");

    const newProduct = { id: generateId(), name };
    const updatedProducts = [...listProducts, newProduct];

    localStorageService.set("db_products", updatedProducts);
    setListProducts(updatedProducts);
    setName("");
  };

  const verifyProductName = () =>
    listProducts.some((prod) => prod.name === name.trim());

  const handleDeleteProduct = () => {
    const updatedProducts = listProducts.filter(
      (prod) => prod.id !== productToDelete
    );
    localStorageService.set("db_products", updatedProducts);
    setListProducts(updatedProducts);
    onDeleteClose();
  };

  const handleEditProduct = () => {
    const updatedProducts = listProducts.map((prod) =>
      prod.id === productToEdit ? { ...prod, name: editName } : prod
    );
    localStorageService.set("db_products", updatedProducts);
    setListProducts(updatedProducts);
    onEditClose();
  };

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    onDeleteOpen();
  };

  const openEditModal = (id, name) => {
    setProductToEdit(id);
    setEditName(name);
    onEditOpen();
  };

  const generateId = () => Math.random().toString(36).substring(2);

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />
      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6">
        <Sidebar />
        <Box w="100%">
          <SimpleGrid minChildWidth={240} spacing="6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do produto"
            />
            <ButtonCadastrar onClick={handleNewProduct} />
          </SimpleGrid>
          <Box overflowY="auto" height="80vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {listProducts.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>
                      <Flex justify="center" gap="4">
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => openEditModal(item.id, item.name)}
                        >
                          Editar
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => openDeleteModal(item.id)}
                        >
                          Deletar
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>

      <ModalBase
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="Confirmar Exclusão"
        body="Tem certeza que deseja excluir este produto? Essa ação não pode ser desfeita."
        onConfirm={handleDeleteProduct}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <ModalBase
        isOpen={isEditOpen}
        onClose={onEditClose}
        title="Editar Produto"
        body={
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Novo nome do produto"
          />
        }
        onConfirm={handleEditProduct}
        confirmText="Salvar"
        cancelText="Cancelar"
      />
    </Flex>
  );
};

export default Produtos;