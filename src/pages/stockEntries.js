import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ModalBase from "../components/atoms/ModalBase";

// Serviço para gerenciar o localStorage
const localStorageService = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

const StockEntries = () => {
  const [amount, setAmount] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [listStockEntries, setStockEntries] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } =
    useDisclosure();

  useEffect(() => {
    setStockEntries(localStorageService.get("db_stock_entries"));
    setListProducts(localStorageService.get("db_products"));
  }, []);

  const handleNewEntry = () => {
    if (!amount || amount <= 0 || !product_id) {
      return alert("Selecione o produto e insira uma quantidade válida!");
    }

    const id = Math.random().toString(36).substring(2);
    const newEntry = { id, amount: Number(amount), product_id };

    const updatedEntries = [...listStockEntries, newEntry];
    localStorageService.set("db_stock_entries", updatedEntries);
    setStockEntries(updatedEntries);

    // Limpa os campos
    setAmount("");
    setProduct_id("");
  };

  const handleDeleteEntry = () => {
    const updatedEntries = listStockEntries.filter(
      (item) => item.id !== entryToDelete
    );
    localStorageService.set("db_stock_entries", updatedEntries);
    setStockEntries(updatedEntries);
    onDeleteClose();
  };

  const openDeleteModal = (id) => {
    setEntryToDelete(id);
    onDeleteOpen();
  };

  const getProductById = (id) => {
    return listProducts.find((item) => item.id === id)?.name || null;
  };

  const filteredEntries = listStockEntries.filter((entry) =>
    listProducts.some((product) => product.id === entry.product_id)
  );

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          {/* Filtro para adicionar entradas */}
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Select
              placeholder="Selecione um produto"
              value={product_id}
              onChange={(e) => setProduct_id(e.target.value)}
              aria-label="Selecione um produto para entrada de estoque"
            >
              {listProducts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Quantidade"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Quantidade do produto"
            />
            <Button
              w="40"
              onClick={handleNewEntry}
              isDisabled={!amount || amount <= 0 || !product_id}
            >
              SALVAR
            </Button>
          </SimpleGrid>

          {/* Tabela de entradas */}
          <Box overflowY="auto" height="80vh">
            {filteredEntries.length > 0 ? (
              <Table mt="6">
                <Thead>
                  <Tr>
                    <Th fontWeight="bold" fontSize="14px">
                      Nome
                    </Th>
                    <Th fontWeight="bold" fontSize="14px">
                      Qtd.
                    </Th>
                    <Th textAlign="center" fontWeight="bold" fontSize="14px">
                      Ações
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredEntries.map((item) => (
                    <Tr key={item.id}>
                      <Td color="gray.500">{getProductById(item.product_id)}</Td>
                      <Td color="gray.500">{item.amount}</Td>
                      <Td>
                        <Flex justify="center" gap="4">
                          {/* Botão de Deletar */}
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
            ) : (
              <Box textAlign="center" mt="6" color="gray.500">
                Nenhuma entrada de estoque registrada.
              </Box>
            )}
          </Box>
        </Box>
      </Flex>

      {/* Modal de Confirmação para Deletar */}
      <ModalBase
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="Confirmar Exclusão"
        body="Tem certeza que deseja excluir esta entrada de estoque? Essa ação não pode ser desfeita."
        onConfirm={handleDeleteEntry}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Flex>
  );
};

export default StockEntries;
