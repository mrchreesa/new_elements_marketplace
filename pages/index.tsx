import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthedProfile } from "../context/UserContext";
import { getCookie } from "cookies-next";
import Users from "../model/users";
import connectDB from "../lib/connectDB";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../components/utils/constants";
import { fetchListings } from "../components/utils/utils";
import useSWR from "swr";
import dynamic from "next/dynamic";
const LandingComponent = dynamic(
  () => import("../components/LandingComponent")
);

// import LandingComponent from "../components/LandingComponent";

const Home: NextPage = ({ user, users, auth }: any) => {
  const [isCollection, setIsCollection] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const { authedProfile, setAuthedProfile } = useAuthedProfile();

  const fetchlisting = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );

    const listingTx = await contract.fetchListingItem();

    const res = await fetchListings({ contract, listingTx });

    return res;
  };

  // let listings: any = [];
  const { data, error, isLoading } = useSWR(
    ["fetchListing"],
    () => fetchlisting(),
    {
      fallbackData: [],
      refreshInterval: 10000,
    }
  );

  useEffect(() => {
    if (user) {
      setAuthedProfile(user);
    }
  }, [user]);

  return (
    <LandingComponent
      loading={loading}
      isLoading={isLoading}
      // listings={listings}
      setIsCollection={setIsCollection}
      isCollection={isCollection}
      users={users}
      setLoading={setLoading}
      data={data}
    />
  );
};

export const getServerSideProps = async ({ req, res }: any) => {
  let auth = getCookie("auth", { req, res }) || null;

  await connectDB();
  const json = await Users.findOne({ address: auth });
  let user = JSON.parse(JSON.stringify(json));
  const jsonUsers = await Users.find({});
  let users = JSON.parse(JSON.stringify(jsonUsers));

  return { props: { user, users } };
};

export default Home;
