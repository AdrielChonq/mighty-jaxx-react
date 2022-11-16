import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { logout } from "../../slices/authSlice";
import { RootState } from "../../slices";
import { ProfileIcon } from "../Icons/Icons";
import logo from "../../assets/img/logo.png";

export default function Navbar() {
  const navbarIcon = useColorModeValue("gray.500", "gray.200");
  const router = useRouter();
  const dispatch = useDispatch();

  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Image
          src={logo}
          height="60px"
          width="60px"
          alt="Comapany Logo"
        />
      </Box>
      {accessToken ? (
        <Flex direction="row" alignItems="center">
          <Text
            display={{ sm: "flex", md: "flex" }}
            color="gray.500"
            fontSize="md"
            fontWeight="bold"
          >
            {firstName} {lastName}
          </Text>
          <Center height="30px" mx="10px">
            <Divider orientation="vertical" />
          </Center>
          <Button
            ms="0px"
            px="0px"
            me={{ sm: "16px", md: "16px" }}
            color={navbarIcon}
            variant="transparent-with-icon"
            onClick={() => {
              dispatch(logout());
            }}
          >
            <Text display={{ sm: "flex", md: "flex" }}>Sign Out</Text>
          </Button>
        </Flex>
      ) : (
        <Button
          ms="0px"
          px="0px"
          me={{ sm: "16px", md: "16px" }}
          color={navbarIcon}
          variant="transparent-with-icon"
          leftIcon={
            <ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />
          }
        >
          <Text display={{ sm: "flex", md: "flex" }}>Sign In</Text>
        </Button>
      )}
    </Flex>
  );
}
