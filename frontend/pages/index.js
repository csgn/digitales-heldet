import AddFeedModal from "@/components/AddFeedModal";
import FeedCard from "@/components/FeedCard";
import { fetcher } from "@/lib/client";
import { handleStartProcess } from "@/lib/events/process";
import {
  Container,
  SimpleGrid,
  Box,
  Button,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { RiAddCircleLine } from "react-icons/ri";

import useSWR from "swr";

export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, error, isLoading } = useSWR("/api/feeds", fetcher);

  if (error) return <div>an error occured</div>;

  return (
    <Container maxW="container.xl" pt={16}>
      <Box pb={8}>
        <Button
          leftIcon={<RiAddCircleLine size={22} />}
          onClick={onOpen}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Add Feed
        </Button>
      </Box>
      {!isLoading && data?.length === 0 ? (
        <Box>
          <h1>There is no feeds here</h1>
        </Box>
      ) : (
        <SimpleGrid spacing="40px" columns={4}>
          {isLoading ? (
            <>
              {[...Array(12)].map((_, i) => (
                <Box key={i}>
                  <Skeleton height={160} width={250} borderRadius={8} />
                </Box>
              ))}
            </>
          ) : (
            data?.map((feed) => {
              const { id, ...rest } = feed;

              return (
                <Box key={id}>
                  <Link href={`/feed/${rest.name}`}>
                    <FeedCard {...rest} />
                  </Link>
                </Box>
              );
            })
          )}
        </SimpleGrid>
      )}
      <AddFeedModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
