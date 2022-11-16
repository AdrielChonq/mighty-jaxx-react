import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Text,
  Image,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import _ from "lodash";
import { AxiosError } from "axios";

// Custom components
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import Navbar from "../../components/Navbars/Navbar";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";

import useAxios from "../../utils/useAxios";

function EditProduct() {
  const api = useAxios();
  const router = useRouter();
  const toast = useToast();
  const onDrop = useCallback((acceptedFiles: any) => {
    setDefaultImage("");
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 2097152,
  });
  const query = router.query;
  const id = query.id;
  const [product, setProduct] = useState<types.IProduct | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [sku, setSKU] = useState("");
  const [defaultImage, setDefaultImage] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    titleError: "",
    skuError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          let { data } = await api.get(`/api/products/${id}`);

          if (data.data) {
            setProduct(data.data);
            setTitle(data.data.title);
            setSKU(data.data.sku);

            if (data.data.imageID) {
              setDefaultImage(
                `${process.env.NEXT_PUBLIC_BASE_URL}/image/products/${data.data.imageID}`
              );
            }
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      };

      if (!product) {
        fetchData();
      }
    }
  });

  const setupUpdateData = () => {
    let requestBody = {} as types.IProduct;

    if (title !== product?.title) {
      requestBody.title = title;
    }

    if (sku !== product?.sku) {
      requestBody.sku = sku;
    }

    return requestBody;
  };

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

  const onClickUpdateProduct = async (e: any) => {
    e.preventDefault();
    try {
      setIsSubmitLoading(true);
      if (formValidation()) {
        let updateData = setupUpdateData();

        if (!_.isEmpty(updateData)) {
          await api.patch(`/api/products/${id}`, updateData);
        }

        if (selectedImage) {
          const formData = new FormData();
          formData.append("file", selectedImage);
          await api.post(`/api/products/${id}/image`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else if (product?.imageID && !defaultImage && !selectedImage) {
          await api.delete(`/api/products/${id}/image`);
        }

        toast({
          title: `Product '${title}' updated successfully`,
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

  const onClickRemoveImage = () => {
    if (defaultImage) setDefaultImage("");
    if (selectedImage) setSelectedImage(null);
  };

  return (
    <Flex direction="column" pt={{ sm: "25px", md: "35px" }} px="10%">
      <Navbar />
      <Flex
        direction="column"
        minH="100vh"
        align="center"
        pt={{ sm: "20px", md: "35px" }}
        maxW={{ md: "90%", lg: "100%" }}
        mx="auto"
      >
        <Card w={{ md: "600px" }}>
          <CardHeader mb="40px">
            <Flex direction="column">
              <Text color="gray.700" fontSize="lg" fontWeight="bold" mb="3px">
                Update Product Details
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <Flex direction="column" w="100%">
                <form onSubmit={onClickUpdateProduct}>
                  <Grid
                    templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)" }}
                    gap="24px"
                  >
                    <FormControl
                      isInvalid={errorMessage.titleError?.length > 0}
                    >
                      <FormLabel
                        color="gray.700"
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        Product Name
                      </FormLabel>
                      <Input
                        borderRadius="15px"
                        fontSize="xs"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTitle(e.target.value)
                        }
                      />
                      <FormErrorMessage pl="12px">
                        {errorMessage.titleError}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errorMessage.skuError?.length > 0}>
                      <FormLabel
                        color="gray.700"
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        SKU
                      </FormLabel>
                      <Input
                        borderRadius="15px"
                        fontSize="xs"
                        value={sku}
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
                        {!selectedImage && defaultImage ? (
                          <Flex w="100%" minH="130px" position="relative">
                            <Image
                              src={defaultImage}
                              alt="Preview"
                              objectFit="contain"
                            />
                          </Flex>
                        ) : selectedImage ? (
                          <Flex w="100%" minH="130px" position="relative">
                            <Image
                              src={URL.createObjectURL(selectedImage)}
                              alt="Preview"
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
                      {(selectedImage || defaultImage) && (
                        <IconButton
                          colorScheme="red"
                          aria-label="Delete Image File"
                          position="absolute"
                          bottom={0}
                          right={0}
                          mx={2}
                          my={2}
                          onClick={onClickRemoveImage}
                          icon={<DeleteIcon />}
                        />
                      )}
                    </Flex>
                    <Text fontSize='xs' color="gray.500" mt="8px">Accept one image and PNG / JPG / JPEG format only.</Text>
                  </Grid>

                  <Flex justify="flex-end">
                    <Button
                      variant="no-hover"
                      bg="gray.100"
                      alignSelf="flex-end"
                      mt="24px"
                      mr="12px"
                      w="100px"
                      h="35px"
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
                      loadingText="Updating..."
                      _hover={{
                        bg: "#FEEC1C",
                      }}
                      _active={{
                        bg: "#FEEC1C",
                      }}
                    >
                      <Text fontSize="xs" color="black" fontWeight="bold">
                        Update
                      </Text>
                    </Button>
                  </Flex>
                </form>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default EditProduct;
