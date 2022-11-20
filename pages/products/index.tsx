import {
  Button,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

// Custom components
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import NoRecordFound from "../../components/NoRecordFound/NoRecordFound";
import Navbar from "../../components/Navbars/Navbar";
import useAxios from "../../utils/useAxios";
import ModalConfirmation from "../../components/Modal/ModalConfirmation";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";

function Products() {
  const api = useAxios();
  const router = useRouter();
  const { query } = router;
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenModalConfirmation, setIsOpenModalConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    types.IProduct | undefined
  >(undefined);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchData = async (page?: number, query?: string) => {
    try {
      setIsLoading(true);
      let url = `/api/products${buildQueryParam(page, query)}`;

      let { data } = await api.get(url);

      setProducts(data.data);
      setPageSize(data.pageLimit);
      setPageCount(data.pages);
      setCurrentPage(data.currentPage);
      setCanPreviousPage(data.canPreviousPage);
      setCanNextPage(data.canNextPage);
      setTotalData(data.totalData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const buildQueryParam = (page?: number, query?: string) => {
    let queryUrl = "";

    let queryParams = [];

    if (query) {
      queryParams.push(`query=${query}`);
    } else if (searchTerm) {
      queryParams.push(`query=${searchTerm}`);
    }

    if (page) {
      queryParams.push(`page=${page}`);
    }

    if (queryParams.length > 0) {
      queryUrl += `?${queryParams.join("&")}`;
    }

    return queryUrl;
  };

  const onClickPreviousPage = async () => {
    try {
      let targetPage = currentPage - 1;
      await fetchData(targetPage);
      router.push(`/products${buildQueryParam(targetPage)}`, undefined, {
        shallow: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickNextPage = async () => {
    try {
      let targetPage = currentPage + 1;
      await fetchData(targetPage);
      router.push(`/products${buildQueryParam(targetPage)}`, undefined, {
        shallow: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickPage = async (pageNumber: number) => {
    try {
      await fetchData(pageNumber);
      router.push(`/products${buildQueryParam(pageNumber)}`, undefined, {
        shallow: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickConfirmDelete = async () => {
    try {
      setIsDeleteLoading(true);
      await api.delete(`/api/products/${selectedProduct?._id}`);
    } catch (err) {
    } finally {
      setIsDeleteLoading(false);
      setSelectedProduct(undefined);
      setIsOpenModalConfirmation(false);
      await fetchData(currentPage);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    await fetchData(undefined, e.target.value);
    router.push(
      `/products${buildQueryParam(undefined, e.target.value)}`,
      undefined,
      {
        shallow: true,
      }
    );
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  const createPages = (count: number) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const page = urlSearchParams.get("page");
    const query = urlSearchParams.get("query");

    if (query) {
      setSearchTerm(query);
    }
    fetchData(Number(page), query as string);

    return () => {
      debouncedResults.cancel();
    };
  }, []);

  return (
    <Flex direction="column" pt={{ sm: "25px", md: "35px" }} px="10%">
      <Navbar />
      <Flex
        direction={{ sm: "column", md: "row" }}
        mt={{ sm: "25px", md: "35px" }}
        justify="space-between"
        align="center"
        w="100%"
        mb="24px"
      >
        <Button
          variant="no-hover"
          bg="#FEEC1C"
          h="35px"
          w="150px"
          mb={{ sm: "24px" }}
          onClick={() => router.push("/products/new")}
        >
          <Text fontSize="sm" fontWeight="bold" color="#000" w="125px">
            New Product
          </Text>
        </Button>
        <InputGroup width={{ sm: "100%", md: "200px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            defaultValue={searchTerm}
            onChange={debouncedResults}
            placeholder="Search..."
          />
        </InputGroup>
      </Flex>
      <Card px="0px">
        <CardBody>
          {isLoading && <CustomSpinner />}
          {!isLoading && products?.length > 0 && (
            <Card overflowX={{ sm: "scroll", lg: "hidden" }}>
              <CardBody>
                <Flex direction="column" w="100%">
                  <Table variant="simple" color={"gray.700"}>
                    <Thead>
                      <Tr my=".8rem" ps="0px" color="gray.400">
                        <Th ps="0px" color="gray.400">
                          Image
                        </Th>
                        <Th ps="0px" color="gray.400">
                          Name
                        </Th>
                        <Th ps="0px" color="gray.400">
                          SKU
                        </Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody pb="0px">
                      {products.map((row: types.IProduct, index: number) => (
                        <Tr key={index}>
                          <Td
                            width={{ sm: "90px", md: "150px", lg: "250px" }}
                            ps="0px"
                          >
                            <Flex direction="column">
                              {row.imageID ? (
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/products/${row.imageID}`}
                                  width={{
                                    sm: "90px",
                                    md: "90px",
                                    lg: "150px",
                                  }}
                                  borderRadius="10px"
                                  alt={row.title}
                                />
                              ) : null}
                            </Flex>
                          </Td>

                          <Td ps="0px">
                            {/* <Flex direction="column"> */}
                            <Text
                              fontSize="md"
                              color="gray.700"
                              fontWeight="bold"
                              minWidth="100%"
                            >
                              {row.title}
                            </Text>
                            {/* </Flex> */}
                          </Td>

                          <Td
                            width={{ sm: "100px", md: "120px", lg: "150px" }}
                            ps="0px"
                          >
                            <Flex direction="column">
                              <Text
                                fontSize="md"
                                color="gray.700"
                                fontWeight="bold"
                                minWidth="100%"
                              >
                                {row.sku}
                              </Text>
                            </Flex>
                          </Td>

                          <Td
                            width={{ sm: "50px", md: "90px", lg: "150px" }}
                            ps="0px"
                          >
                            <Flex
                              direction={{ sm: "column", md: "row" }}
                              align="flex-end"
                              p={{ md: "24px" }}
                            >
                              <Button
                                p="0px"
                                bg="transparent"
                                onClick={() =>
                                  router.push({
                                    pathname: "/products/[id]",
                                    query: { id: row._id },
                                  })
                                }
                              >
                                <Flex
                                  color="gray.700"
                                  cursor="pointer"
                                  align="center"
                                  p="12px"
                                >
                                  <Icon as={FaPencilAlt} me="4px" />
                                  <Text fontSize="sm" fontWeight="semibold">
                                    EDIT
                                  </Text>
                                </Flex>
                              </Button>
                              <Button
                                p="0px"
                                bg="transparent"
                                mb={{ sm: "10px", md: "0px" }}
                                me={{ md: "12px" }}
                              >
                                <Flex
                                  color="red.500"
                                  cursor="pointer"
                                  align="center"
                                  p="12px"
                                >
                                  <Icon as={FaTrashAlt} me="4px" />
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    onClick={() => {
                                      setSelectedProduct(row);
                                      setIsOpenModalConfirmation(true);
                                    }}
                                  >
                                    DELETE
                                  </Text>
                                </Flex>
                              </Button>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Flex>
              </CardBody>
            </Card>
          )}
          {!isLoading && (!products || products.length === 0) && (
            <NoRecordFound />
          )}
        </CardBody>
      </Card>

      {!isLoading && products?.length > 0 && pageCount > 1 && (
        <Flex
          hidden={pageCount === 1}
          direction={{ sm: "column", md: "row" }}
          w="100%"
          mb={10}
          justify="space-between"
          align="center"
        >
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="normal"
            mb={{ sm: "24px", md: "0px" }}
          >
            Showing {currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1}{" "}
            to{" "}
            {pageSize * currentPage < totalData
              ? pageSize * currentPage
              : pageSize * (currentPage - 1) + products.length}{" "}
            of {totalData} entries
          </Text>
          <Flex justify="center">
            <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
              <Button
                variant="no-hover"
                onClick={onClickPreviousPage}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="50%"
                bg="#fff"
                border="1px solid lightgray"
                display={canPreviousPage ? "flex" : "none"}
                _hover={{
                  bg: "gray.200",
                  opacity: "0.7",
                  borderColor: "gray.500",
                }}
              >
                <Icon as={GrFormPrevious} w="16px" h="16px" color="gray.400" />
              </Button>
              {createPages(pageCount).map((pageNumber, index) => {
                return (
                  <Button
                    variant="no-hover"
                    transition="all .5s ease"
                    onClick={() => onClickPage(pageNumber)}
                    w="40px"
                    h="40px"
                    borderRadius="160px"
                    bg={pageNumber === currentPage ? "#FEEC1C" : "#fff"}
                    border="1px solid lightgray"
                    _hover={{
                      bg: "gray.200",
                      opacity: "0.7",
                      borderColor: "gray.500",
                    }}
                    key={index}
                  >
                    <Text
                      fontSize="sm"
                      color={pageNumber === currentPage ? "black" : "gray.600"}
                    >
                      {pageNumber}
                    </Text>
                  </Button>
                );
              })}
              <Button
                variant="no-hover"
                onClick={onClickNextPage}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="160px"
                bg="#fff"
                border="1px solid lightgray"
                display={canNextPage ? "flex" : "none"}
                _hover={{
                  bg: "gray.200",
                  opacity: "0.7",
                  borderColor: "gray.500",
                }}
              >
                <Icon as={GrFormNext} w="16px" h="16px" color="gray.400" />
              </Button>
            </Stack>
          </Flex>
        </Flex>
      )}
      <ModalConfirmation
        isOpen={isOpenModalConfirmation}
        onNegative={() => setIsOpenModalConfirmation(false)}
        onPositive={onClickConfirmDelete}
        negativeLabel="Cancel"
        positiveLabel="Delete"
        title="Delete Confirmation"
        content={`Are you sure you want to delete ${selectedProduct?.title}`}
        isLoading={isDeleteLoading}
      />
    </Flex>
  );
}

export default Products;
