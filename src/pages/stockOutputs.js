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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Serviço para gerenciar o localStorage
const localStorageService = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

const StockOutputs = () => {
  const [amount, setAmount] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [listStockOutputs, setStockOutputs] = useState([]);
  const [listStockEntries, setStockEntries] = useState([]);
  const [listProducts, setListProducts] = useState([]);

  useEffect(() => {
    const entries = localStorageService.get("db_stock_entries");
    const outputs = localStorageService.get("db_stock_outputs");
    const products = localStorageService.get("db_products");

    setStockEntries(entries);
    setStockOutputs(outputs);
    setListProducts(products);
  }, []);

  useEffect(() => {
    syncOutputsWithStock(); // Sincroniza saídas sempre que entradas mudarem
  }, [listStockEntries, listProducts]);

  // Calcula o saldo atual de cada produto
  const calculateStockBalance = () => {
    return listProducts.map((product) => {
      const entries = listStockEntries
        .filter((entry) => entry.product_id === product.id)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const outputs = listStockOutputs
        .filter((output) => output.product_id === product.id)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      return {
        ...product,
        balance: entries - outputs, // Saldo atual do produto
      };
    });
  };

  // Sincroniza saídas com o saldo disponível
  const syncOutputsWithStock = () => {
    const stockBalance = calculateStockBalance();
    const validOutputs = listStockOutputs.filter((output) => {
      const productBalance = stockBalance.find(
        (product) => product.id === output.product_id
      );
      return productBalance && productBalance.balance >= Number(output.amount);
    });

    if (validOutputs.length !== listStockOutputs.length) {
      localStorageService.set("db_stock_outputs", validOutputs);
      setStockOutputs(validOutputs);
    }
  };

  const handleNewOutput = () => {
    if (!amount || amount <= 0 || !product_id) {
      return alert("Selecione o produto e insira uma quantidade válida!");
    }

    // Busca o saldo do produto selecionado
    const productBalance = calculateStockBalance().find(
      (product) => product.id === product_id
    )?.balance;

    if (!productBalance || Number(amount) > productBalance) {
      return alert(
        "Quantidade solicitada excede o saldo disponível no estoque!"
      );
    }

    const id = Math.random().toString(36).substring(2);
    const newOutput = { id, amount: Number(amount), product_id };

    const updatedOutputs = [...listStockOutputs, newOutput];
    localStorageService.set("db_stock_outputs", updatedOutputs);
    setStockOutputs(updatedOutputs);

    // Limpa os campos
    setAmount("");
    setProduct_id("");
  };

  const removeOutput = (id) => {
    const updatedOutputs = listStockOutputs.filter((item) => item.id !== id);
    localStorageService.set("db_stock_outputs", updatedOutputs);
    setStockOutputs(updatedOutputs);
  };

  const filteredProducts = calculateStockBalance().filter(
    (product) => product.balance > 0 // Mostra apenas produtos com saldo maior que 0
  );

  const getProductById = (id) => {
    return listProducts.find((item) => item.id === id)?.name || null;
  };

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          {/* Filtro para adicionar saídas */}
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Select
              placeholder="Selecione um produto"
              value={product_id}
              onChange={(e) => setProduct_id(e.target.value)}
              aria-label="Selecione um produto para saída de estoque"
            >
              {filteredProducts.map((item) => (
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
              onClick={handleNewOutput}
              isDisabled={!amount || amount <= 0 || !product_id}
            >
              SALVAR
            </Button>
          </SimpleGrid>

          {/* Tabela de saídas */}
          <Box overflowY="auto" height="80vh">
            {listStockOutputs.length > 0 ? (
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
                  {listStockOutputs.map((item) => (
                    <Tr key={item.id}>
                      <Td color="gray.500">{getProductById(item.product_id)}</Td>
                      <Td color="gray.500">{item.amount}</Td>
                      <Td textAlign="end">
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => removeOutput(item.id)}
                        >
                          Deletar
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box textAlign="center" mt="6" color="gray.500">
                Nenhuma saída de estoque registrada.
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default StockOutputs;
