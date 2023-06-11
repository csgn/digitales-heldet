import { socket } from "@/lib/socket";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  switch (req.method) {
    case "GET":
      if (!req.query.name) {
        const feeds = await prisma.feed.findMany({
          orderBy: {
            id: "desc",
          },
        });
        res.json(feeds);
        return;
      }

      const feed = await prisma.feed.findUnique({
        where: {
          name: req.query.name,
        },
      });

      if (!feed) {
        res.status(404).json({ message: "Not Found" });
        return;
      }

      res.status(200).json(feed);
      break;
    case "POST":
      try {
        let existingFeed = await prisma.feed.findUnique({
          where: {
            name: req.body.name,
          },
        });

        if (existingFeed) {
          res.status(409).json({
            message: "Feed with the same Name already exists",
          });
          return;
        }

        existingFeed = await prisma.feed.findUnique({
          where: {
            src: req.body.url,
          },
        });

        if (existingFeed) {
          res.status(409).json({
            message: "Feed with the same Source already exists",
          });
          return;
        }

        const newFeed = await prisma.feed.create({
          data: {
            name: req.body.name,
            src: req.body.url,
            tag: req.body.tag,
          },
        });

        res.status(201).json(newFeed);
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "An error occurred while creating the feed",
          description: "",
        });
      }
      break;
    case "DELETE":
      console.log("YAY", req.params);
      if (!req.query.id) {
        res.status(404).json({ message: "Feed ID is missing" });
        return;
      }

      const deletedFeed = await prisma.feed.delete({
        where: {
          id: parseInt(req.query.id),
        },
      });

      if (!deletedFeed) {
        res.status(404).json({ message: "Feed not found" });
        return;
      }

      res.status(200).json({ message: "Feed deleted successfully" });
      break;
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
