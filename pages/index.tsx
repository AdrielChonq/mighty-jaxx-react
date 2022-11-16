import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import cover from "../assets/img/cover-auth.jpeg";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import { RootState } from "../slices";
import { useRouter } from "next/router";
import useAxios from "../utils/useAxios";
import { AxiosError } from "axios";
import _ from "lodash";
import logo from "../assets/img/logo.png";

function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const api = useAxios();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    emailError: "",
    passwordError: "",
  });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const formValidation = () => {
    let isValid = true;
    if (!email) {
      isValid = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        emailError: "Please enter an email",
      }));
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      isValid = false;
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        emailError: "Invalid email address",
      }));
    } else if (!password) {
      isValid = false;
      setErrorMessage({
        emailError: "",
        passwordError: "Invalid email or password",
      });
    } else {
      setErrorMessage({ emailError: "", passwordError: "" });
    }

    return isValid;
  };

  const onClickSignIn = async (e: any) => {
    e.preventDefault();
    try {
      setIsSubmitLoading(true);
      if (formValidation()) {
        let { data } = await api.post("/api/auth/signin", { email, password });

        dispatch(login(data));
      }
      setIsSubmitLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        let _err = error as AxiosError;
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          passwordError: _err?.response?.data + "",
        }));
      } else {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          passwordError: String(error),
        }));
      }
      setIsSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/products");
    }
  }, [isLoggedIn, router]);

  return (
    <Flex>
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
            
          >
            <Flex direction="row" alignItems="center" mb="24px">
              <Box mr="12px">
                <Image
                  src={logo}
                  height="60px"
                  width="60px"
                  alt="Comapany Logo"
                />
              </Box>
              <Flex direction="column">
                <Heading color="#000" fontSize="32px">
                  Mighty Jaxx
                </Heading>
                <Text
                  ms="4px"
                  color="gray.400"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  Admin Portal
                </Text>
              </Flex>
            </Flex>
            <form onSubmit={onClickSignIn}>
              <FormControl
                isInvalid={errorMessage.emailError?.length > 0}
                mb="24px"
              >
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Email
                </FormLabel>
                <Input
                  borderRadius="15px"
                  fontSize="sm"
                  type="text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Your email adress"
                  size="lg"
                />
                <FormErrorMessage pl="12px">
                  {errorMessage.emailError}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errorMessage.passwordError?.length > 0}
                mb="36px"
              >
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Password
                </FormLabel>
                <Input
                  borderRadius="15px"
                  fontSize="sm"
                  type="password"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Your password"
                  size="lg"
                />
                <FormErrorMessage pl="12px">
                  {errorMessage.passwordError}
                </FormErrorMessage>
              </FormControl>
              <Button
                fontSize="sm"
                type="submit"
                bg="#FEEC1C"
                w="100%"
                h="45"
                mb="20px"
                color="black"
                mt="20px"
                isLoading={isSubmitLoading}
                loadingText="Signing in..."
                _hover={{
                  bg: "#FEEC1C",
                }}
                _active={{
                  bg: "#FEEC1C",
                }}
              >
                SIGN IN
              </Button>
            </form>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100vh"
          w={{ lg: "50vw", "2xl": "50vw" }}
          position="absolute"
          right="0px"
        >
          <Flex
            justify="center"
            align="end"
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
            bg="transparent"
          >
            <Image src={cover} alt="cover" layout="fill" objectFit="cover" />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
