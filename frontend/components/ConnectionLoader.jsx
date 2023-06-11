import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  Spinner,
  Stack,
} from "@chakra-ui/react";

export default function ConnectionLoader({ text }) {
  return (
    <Box pt={32}>
      <Flex justifyContent="center">
        <Stack justifyContent="center" alignItems="center" gap={8}>
          <Heading color="#555" size="2xl">
            {text}
          </Heading>
          <CircularProgress color="#555" isIndeterminate thickness="8px" />
        </Stack>
      </Flex>
    </Box>
  );
}
