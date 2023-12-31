import Users from "../../model/users";
import connectDB from "../../lib/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import banner from "../../assets/nft.gif";

const handler = async (req: NextApiRequest, res: any) => {
  await connectDB();
  console.log("Connected to Mongo");

  //Banners
  // const banners = [banner1, banner2, banner3, banner4, banner5];
  // const random = Math.floor(Math.random() * banners.length);
  // const randomBanner = banners[random];

  //Sign In
  if (req.method === "POST") {
    const { address } = req.body;

    const user = await Users.findOne({ address });

    if (!user) {
      const newUser = new Users({
        address,
        profilePicture: "",
        bannerPicture: banner.src,
        bio: "",
        username: "",
        collections: [],
        isArtist: false,
        admin: false,
        superAdmin: false,
        email: "",
        profit: 0,
      });

      newUser
        .save()
        .then(() => {
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("auth", address, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              sameSite: "strict",
              maxAge: 3600,
              path: "/",
            })
          );
          console.log("Saved successfully." + newUser);
          res.status(200).json({ user: newUser });
        })
        .catch((err: any) => {
          res.status(400).send({ message: "Saving failed" });
          console.log("Saving failed.", err);
        });
    } else {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth", address, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        })
      );
      return res.status(200).json({ message: "Welcome back", user });
    }
  } else if (
    //Sign out
    req.method === "DELETE"
  ) {
    res.setHeader("Set-Cookie", [
      cookie.serialize("auth", "", {
        maxAge: -1,
        path: "/",
      }),
    ]);

    return res.status(200).json({
      success: "Successfully logged out",
    });
  } else if (req.method === "GET") {
    const auth = req.cookies.auth;
    return res.status(200).json({ auth });
  }
};

export default handler;
