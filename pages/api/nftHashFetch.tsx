import Nft from "../../model/nft";
import connectDB from "../../lib/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  console.log("Connected to Mongo");

  //Save to Profile
  if (req.method === "POST") {
    const data = req.body;
    const nfts = await Nft.findOne({ name: data.name });
    console.log(nfts);

    return res.status(200).send(nfts);
  } else {
    console.log("Wrong method");
  }
};

export default handler;
