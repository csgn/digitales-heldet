import { fetcher, remover } from "@/lib/client";
import {
  Button,
  FormControl,
  FormLabel,
  Image,
  Switch,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "@/lib/toast";
import { useState } from "react";

export default function FeedPage({ data }) {
  const router = useRouter();

  const [active, setActive] = useState(0);

  const handleDelete = async () => {
    await remover("/api/feeds", {
      params: {
        id: data.id,
      },
    })
      .then((res) => {
        toast({
          title: "Feed is deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "An Error Occured",
          description: err.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const feedURL = `${process.env.NEXT_PUBLIC_FLASK_URL}/feed/${active}/${data.src}`;

  return (
    <div>
      <Link href="/">
        <Button>{"<- Feeds"}</Button>
      </Link>
      {data.name}
      <section>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="inference" mb="0">
            Inference
          </FormLabel>
          <Switch
            id="inference"
            onChange={(e) => {
              setActive(e.target.checked ? 1 : 0);
            }}
          />
        </FormControl>
        <Image src={feedURL} alt={feedURL} width={800} height={600} />
      </section>

      <Button color="tomato" background="white" onClick={handleDelete}>
        Delete
      </Button>
    </div>
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
