import Nft from "../../model/nft";
import connectDB from "../../lib/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  console.log("Connected to Mongo");

  //Save to Profile
  if (req.method === "POST") {
    const data = req.body;
    if (!data) {
      return res.status(400).send({ message: "Bad request" });
    }
    const nft = await Nft.create(data);
    return res.status(201).send(nft);
  } else if (req.method === "GET") {
    const data = req.body;
    console.log(req.body);
    console.log("data");

    const nfts = await Nft.findOne({ name: data });
    return res.status(200).send(nfts);
  } else {
    console.log("Wrong method");
  }
};

export default handler;
