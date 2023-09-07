import Users from "../../model/users";
import connectDB from "../../lib/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  console.log("Connected to Mongo");

  //Find user by Id
  if (req.method === "POST") {
    const { userId } = req.body;
    
    await Users.findOne({ _id: userId })
      .then((response) => {
        console.log(response);

        res.status(200).send(response);
      })
      .catch((err: any) => {
        res.status(400).send({ message: "User request failed" });
      });
  } else {
    console.log("Wrong method");
  }
};

export default handler;
