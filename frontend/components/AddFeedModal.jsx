import toast from "@/lib/toast";
import { fetcher, poster } from "@/lib/client";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import useSWR from "swr";
import { socket } from "@/lib/socket";

export default function AddFeedModal(props) {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = props;
  const { data: tagsData, error: tagsError } = useSWR("/api/tags", fetcher);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await poster("/api/feeds", {
      name,
      url,
      tag,
    })
      .then((res) => {
        socket.emit("start_process", { id: res.id });

        toast({
          title: "Feed Created Successfully",
          status: "success",
          duration: 1500,
          isClosable: true,
          onCloseComplete: () => {
            router.push(`/feed/${res.name}`);
          },
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "An Error Occured",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <h4>Create new feed</h4>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={onSubmit}>
            <Stack>
              <FormControl>
                <FormLabel>Name *</FormLabel>
                <Input
                  type="text"
                  placeholder="Type a name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Source *</FormLabel>
                <Input
                  type="text"
                  placeholder="Type the source"
                  required
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                />
                <FormHelperText color="gray">
                  eg. http://192.168.1.37:8080/video
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Tag</FormLabel>
                <Select
                  placeholder="Select a tag"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                >
                  {tagsData?.map((tag) => {
                    return <option key={tag.id}>{tag.name}</option>;
                  })}
                </Select>
              </FormControl>
              <Button
                width="full"
                mt={4}
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                Create
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
