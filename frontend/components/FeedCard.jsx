import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { AiFillVideoCamera } from "react-icons/ai";

export default function FeedCard({ name, tag, src }) {
  const router = useRouter();

  return (
    <Card
      _hover={{
        cursor: "pointer",
      }}
      onClick={() => {
        router.push({
          pathname: `feed/${name}`,
        });
      }}
    >
      <CardHeader>
        <span>{name}</span>
      </CardHeader>
      <CardBody>
        <Flex justifyContent="center">
          <AiFillVideoCamera size={64} />
        </Flex>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}
