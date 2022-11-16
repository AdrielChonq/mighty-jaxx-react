import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

// Custom components
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import Navbar from "../../components/Navbars/Navbar";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import useAxios from "../../utils/useAxios";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

function NewProduct() {
  const router = useRouter();
  const api = useAxios();
  const toast = useToast();
  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 2097152,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [sku, setSKU] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    titleError: "",
    skuError: "",
  });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const formValidation = () => {
    let isValid = true;
    if (!title) {
      isValid = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        titleError: "Please enter a name",
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        titleError: "",
      }));
    }

    if (!sku) {
      isValid = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        skuError: "Please enter a SKU",
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        skuError: "",
      }));
    }

    return isValid;
  };

  const onClickAddProduct = async (e: any) => {
    e.preventDefault();
    try {
      setIsSubmitLoading(true);
      if (formValidation()) {
        let { data } = await api.post("/api/products", { title, sku });

        if (data && selectedImage) {
          console.log("id", data.data._id);
          const formData = new FormData();
          formData.append("file", selectedImage);
          await api.post(`/api/products/${data.data._id}/image`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        toast({
          title: `New product '${title}' added successfully`,
          position: "top",
          status: "success",
          isClosable: true,
        });

        router.back();
      }
    } catch (error) {
      let errorMessage = String(error);
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: errorMessage,
        position: "top",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Flex direction="column" pt={{ sm: "25px", md: "35px" }} px="10%">
      <Navbar />
      <Flex
        direction="column"
        minH="100vh"
        align={{ sm: "none", md: "center" }}
        pt={{ sm: "20px", md: "35px" }}
        maxW="100%"
      >
        <Card w={{ md: "600px" }}>
          <CardHeader mb="40px">
            <Flex direction="column">
              <Text color="gray.700" fontSize="lg" fontWeight="bold" mb="3px">
                Create New Product
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <form onSubmit={onClickAddProduct}>
                <Grid
                  templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)" }}
                  gap="24px"
                >
                  <FormControl isInvalid={errorMessage.titleError?.length > 0}>
                    <FormLabel color="gray.700" fontWeight="bold" fontSize="xs">
                      Product Name
                    </FormLabel>
                    <Input
                      borderRadius="15px"
                      fontSize="xs"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                      }
                    />
                    <FormErrorMessage pl="12px">
                      {errorMessage.titleError}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errorMessage.skuError?.length > 0}>
                    <FormLabel color="gray.700" fontWeight="bold" fontSize="xs">
                      SKU
                    </FormLabel>
                    <Input
                      borderRadius="15px"
                      fontSize="xs"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSKU(e.target.value)
                      }
                    />
                    <FormErrorMessage pl="12px">
                      {errorMessage.skuError}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>
                <Grid mt={4}>
                  <FormLabel color="gray.700" fontWeight="bold" fontSize="xs">
                    Image
                  </FormLabel>
                  <Flex position="relative">
                    <Flex
                      align="center"
                      justify="center"
                      border="1px dashed #E2E8F0"
                      borderRadius="15px"
                      w="100%"
                      minH="130px"
                      cursor="pointer"
                      position="relative"
                      {...getRootProps({ className: "dropzone" })}
                    >
                      <input {...getInputProps()} />
                      {selectedImage ? (
                        <Flex w="100%" minH="130px" position="relative">
                          <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            layout="fill"
                            objectFit="contain"
                          />
                        </Flex>
                      ) : (
                        <Button variant="no-hover">
                          <Text color="gray.400" fontWeight="normal">
                            Drop files here to upload
                          </Text>
                        </Button>
                      )}
                    </Flex>
                    {selectedImage && (
                      <IconButton
                        colorScheme="red"
                        aria-label="Delete Image File"
                        position="absolute"
                        bottom={0}
                        right={0}
                        mx={2}
                        my={2}
                        onClick={() => setSelectedImage(null)}
                        icon={<DeleteIcon />}
                      />
                    )}
                  </Flex>
                  <Text fontSize="xs" color="gray.500" mt="8px">
                    Accept one image and PNG / JPG / JPEG format only.
                  </Text>
                </Grid>

                <Flex justify="flex-end">
                  <Button
                    variant="no-hover"
                    bg="gray.100"
                    alignSelf="flex-end"
                    mt="24px"
                    mr="12px"
                    w="130px"
                    h="35px"
                    disabled={isSubmitLoading}
                    onClick={() => router.back()}
                  >
                    <Text fontSize="xs" color="gray.700" fontWeight="bold">
                      Cancel
                    </Text>
                  </Button>
                  <Button
                    variant="no-hover"
                    type="submit"
                    bg="#FEEC1C"
                    alignSelf="flex-end"
                    mt="24px"
                    minWidth="100px"
                    h="35px"
                    isLoading={isSubmitLoading}
                    disabled={isSubmitLoading}
                    loadingText="Creating..."
                    _hover={{
                      bg: "#FEEC1C",
                    }}
                    _active={{
                      bg: "#FEEC1C",
                    }}
                  >
                    <Text fontSize="xs" color="black" fontWeight="bold">
                      Create
                    </Text>
                  </Button>
                </Flex>
              </form>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default NewProduct;
