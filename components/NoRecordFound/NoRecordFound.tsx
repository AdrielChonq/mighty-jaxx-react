import { Flex, Text } from "@chakra-ui/react";

export default function NoRecordFound() {
  return (
    <Flex direction="column" align="center" justify="center" w="100%">
      <Text color="gray.500" fontWeight="bold" fontSize="xl" textAlign="center">
        No record found.
      </Text>
    </Flex>
  );
}
