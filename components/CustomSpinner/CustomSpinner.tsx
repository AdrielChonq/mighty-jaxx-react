import { Flex, Spinner } from "@chakra-ui/react";

export default function CustomSpinner() {
  return (
    <Flex direction="column" align="center" justify="center" w="100%">
      <Spinner
        thickness="4px"
        speed="0.5s"
        emptyColor="black"
        color="#FEEC1C"
        size="lg"
      />
    </Flex>
  );
}
