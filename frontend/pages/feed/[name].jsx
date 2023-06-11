import { fetcher, remover } from "@/lib/client";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Skeleton,
  Spinner,
  Stack,
  StackDivider,
  Stat,
  StatLabel,
  StatNumber,
  Switch,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "@/lib/toast";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { FiArrowLeft } from "react-icons/fi";
import { RiIndeterminateCircleLine } from "react-icons/ri";
import { AiOutlineStop } from "react-icons/ai";
import { BiRun } from "react-icons/bi";
import { VscDebugRestart } from "react-icons/vsc";
import {
  handleHealthcheck,
  handleKillProcess,
  handleResumeProcess,
  handleStartProcess,
  handleSuspendProcess,
} from "@/lib/events/process";

const STATUSES = {
  sleeping: {
    label: "running",
    accent: "green",
  },
  terminated: {
    label: "terminated",
    accent: "red",
  },
  stopped: {
    label: "suspended",
    accent: "orange",
  },
};

export default function FeedPage({ data }) {
  const router = useRouter();
  const [status, setStatus] = useState(null);

  const { id, name, src } = data;

  useEffect(() => {
    function listenHealthCheck(data) {
      setStatus(STATUSES[data.status]);
    }

    handleHealthcheck(id);

    const h = setInterval(() => {
      handleHealthcheck(id);
    }, 20000);

    socket.on("healthcheck", listenHealthCheck);

    return () => {
      socket.off("healthcheck", listenHealthCheck);
      clearInterval(h);
    };
  }, []);

  return (
    <Container pt={16} maxW="container.xl">
      <Stack>
        <HStack justifyContent="flex-start" alignItems="center">
          <Link href="/">
            <IconButton icon={<FiArrowLeft />} />
          </Link>
          <Heading color="#333">{name}</Heading>

          {/* <Button
            leftIcon={<FiTrash size={22} />}
            color="white"
            onClick={handleDelete}
          >
            Delete Feed
          </Button> */}
        </HStack>
        <Divider />
        <HStack alignItems="flex-start" gap={4}>
          <Box position={"relative"}>
            <Skeleton width={800} height={600} />
          </Box>
          <Box width={"100%"}>
            <VStack>
              <Box width={"100%"}>
                <Heading size="md" pb={4}>
                  Feed Detail
                </Heading>
                <Stack divider={<StackDivider />}>
                  <FormControl>
                    <FormLabel>Id:</FormLabel>
                    <Text color="gray">{id}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Name:</FormLabel>
                    <Text color="gray">{name}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Source:</FormLabel>
                    <Text color="gray">{src}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status:</FormLabel>
                    {!status ? (
                      <Spinner />
                    ) : (
                      <Badge color={status.accent} colorScheme={status.accent}>
                        {status.label}
                      </Badge>
                    )}
                  </FormControl>
                </Stack>
              </Box>
              <Box width="100%">
                <Heading size="md" pb={4} pt={4}>
                  Actions
                </Heading>
                <Stack width="fit-content">
                  <Button
                    leftIcon={<BiRun size={22} />}
                    color="green"
                    variant={"outline"}
                    isDisabled={
                      !status ||
                      [
                        STATUSES.sleeping.label,
                        STATUSES.stopped.label,
                      ].includes(status.label)
                    }
                    onClick={() => {
                      setStatus(null);
                      handleStartProcess(id, src);
                    }}
                  >
                    Run
                  </Button>
                  <Button
                    leftIcon={<VscDebugRestart size={22} />}
                    color="green"
                    variant={"outline"}
                    isDisabled={
                      !status ||
                      [
                        STATUSES.sleeping.label,
                        STATUSES.terminated.label,
                      ].includes(status.label)
                    }
                    onClick={() => {
                      setStatus(null);
                      handleResumeProcess(id);
                    }}
                  >
                    Resume
                  </Button>
                  <Button
                    leftIcon={<AiOutlineStop size={22} />}
                    color="orange"
                    variant={"outline"}
                    isDisabled={
                      !status ||
                      [
                        STATUSES.terminated.label,
                        STATUSES.stopped.label,
                      ].includes(status.label)
                    }
                    onClick={() => {
                      setStatus(null);
                      handleSuspendProcess(id);
                    }}
                  >
                    Suspend
                  </Button>
                  <Button
                    leftIcon={<RiIndeterminateCircleLine size={22} />}
                    color="red"
                    variant={"outline"}
                    isDisabled={
                      !status ||
                      [STATUSES.terminated.label].includes(status.label)
                    }
                    onClick={() => {
                      setStatus(null);
                      handleKillProcess(id);
                    }}
                  >
                    Terminate
                  </Button>
                </Stack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Stack>
      {/* <Box pt={8}>
        <Heading>Logs</Heading>
        <Table>
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box> */}
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { name } = ctx.query;

  try {
    const data = await fetcher(`http://localhost:3000/api/feeds`, {
      params: {
        name,
      },
    });
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
}
