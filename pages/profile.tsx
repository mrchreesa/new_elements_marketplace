import React, { useEffect, useState } from "react";
import ProfileComponent from "../components/Profile/ProfileComponent";
import { getCookie } from "cookies-next";
import connectDB from "../lib/connectDB";
import Users from "../model/users";
import { ContractAbi, ContractAddress } from "../components/utils/constants";
import { ethers } from "ethers";
import { fetchListingsBatch, fetchListings } from "../components/utils/utils";
import useSWR, { mutate } from "swr";

type Props = {
  user: any;
  users: any;
  collectedNfts: any[];
  listedNfts: any[];
  soldNfts: any[];
  offers: any;
  listings: any;
  contract: any;
};

const Profile = ({ user, users }: Props) => {
  const useFetchListingsSWR = () => {
    const [listings, setListings] = useState<any>([]);
    const [loaded, setLoaded] = useState(false);

    // Custom fetcher that works with the async generator
    const fetcher = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
      const contract = new ethers.Contract(
        ContractAddress,
        ContractAbi,
        provider
      );
      const listingTx = await contract.fetchListingItem();
      console.log("listingTx", listingTx);

      for await (const batch of fetchListingsBatch({ contract, listingTx })) {
        setListings((current: any) => [...current, ...batch]);
      }
      setLoaded(true); // Indicate that the loading process has completed
    };

    // useSWR hook to manage the fetching process
    const { error } = useSWR(loaded ? null : "fetchListingsProfile", fetcher, {
      revalidateOnFocus: true,
      refreshInterval: 5000,
    });

    return { listings, error, isLoading: !loaded && !error };
  };

  const { listings }: any = useFetchListingsSWR();

  console.log("listings", listings);

  const useFetchListingsByAddressSWR = () => {
    const [listingsByAddress, setListingsByAddress] = useState<any>([]);
    const [collectedNfts, setCollectedNfts] = useState<any>([]);
    const [listedNfts, setListedNfts] = useState<any>([]);
    const [soldNfts, setSoldNfts] = useState<any>([]);
    const [loaded, setLoaded] = useState(false);

    // Custom fetcher that works with the async generator
    const fetcher = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
      const contract = new ethers.Contract(
        ContractAddress,
        ContractAbi,
        provider
      );
      const listingTx = await contract.filterNftByAddress(user.address);
      console.log("listingTx", listingTx);

      for await (const batch of fetchListingsBatch({ contract, listingTx })) {
        setListingsByAddress((current: any) => [...current, ...batch]);
        // Loop over the generator until all batches are fetched.

        batch.forEach((nft: any) => {
          if (nft.seller === nft.owner) {
            const collectedBatch = batch.filter(
              (batchNft) => batchNft.seller === batchNft.owner
            );

            setCollectedNfts((current: any) => {
              const nftMap = new Map(
                current.map((currentNft: any) => [currentNft.id, currentNft])
              );

              // Merge new NFTs, avoiding duplicates.
              collectedBatch.forEach((batchNft) =>
                nftMap.set(batchNft.id, batchNft)
              );

              return Array.from(nftMap.values());
            });
          } else if (nft.seller == user.address && !nft.sold) {
            const listedBatch = batch.filter(
              (batchNft) => batchNft.seller == user.address && !batchNft.sold
            );

            setListedNfts((current: any) => {
              const nftMap = new Map(
                current.map((currentNft: any) => [currentNft.id, currentNft])
              );

              // Merge new NFTs, avoiding duplicates.
              listedBatch.forEach((batchNft: any) =>
                nftMap.set(batchNft.id, batchNft)
              );

              return Array.from(nftMap.values());
            });
          }
          if (nft.sold) {
            const soldBatch = batch.filter((batchNft) => batchNft.sold);

            setSoldNfts((current: any) => {
              const nftMap = new Map(
                current.map((currentNft: any) => [currentNft.id, currentNft])
              );

              // Merge new NFTs, avoiding duplicates.
              soldBatch.forEach((batchNft: any) =>
                nftMap.set(batchNft.id, batchNft)
              );

              return Array.from(nftMap.values());
            });
          }
        });
      }

      setLoaded(true);
    };

    // useSWR hook to manage the fetching process
    const { error } = useSWR(
      loaded ? null : "fetchListingsByAddress",
      fetcher,
      {
        revalidateOnFocus: true,
        refreshInterval: 5000,
      }
    );
    console.log("loaded", loaded);
    return {
      listingsByAddress,
      collectedNfts,
      listedNfts,
      soldNfts,
      error,
      isLoading: !loaded,
    };
  };
  const { listingsByAddress, collectedNfts, listedNfts, soldNfts, isLoading } =
    useFetchListingsByAddressSWR();

  const nftFetch = async (userAddress: any, collectedNfts: any) => {
    let offers = [] as any;
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );

    try {
      // const listingTx = await contract.filterNftByAddress(userAddress);
      // const res = await fetchListings({ contract, listingTx });

      // // const listings = await fetchAllNfts(userAddress, contract);
      // console.log("res", res);

      // const collectedNfts = [] as any;
      // const listedNfts = [] as any;
      // const soldNfts = [] as any;

      // if (Array.isArray(res)) {
      //   res.forEach((nft) => {
      //     if (nft.seller === nft.owner) {
      //       collectedNfts.push(nft);
      //     } else {
      //       listedNfts.push(nft);
      //     }

      //     if (nft.sold) {
      //       soldNfts.push(nft);
      //     }
      //   });

      await Promise.all(
        collectedNfts.map(async (nft: any) => {
          const offersTx = await contract.gethighestBidder(nft.id);
          const amountTx = await contract.gethighestBid(nft.id);

          const bidder = offersTx;
          const amount = amountTx / 1e18;

          // const offersArray = bidder.map((bidder: any, index: any) => ({
          //   nftId: nft.id,
          //   bidder,
          //   amount,
          // }));
          if (amount > 0) {
            offers.push({ bidder, amount, nftId: nft.id });
          }

          // const combinedObjects  Array = [];

          // const groupedObjects = offersArray.reduce(
          //   (grouped: any, offer: any) => {
          //     const { nftId, bidder, amount } = offer;
          //     if (!grouped[nftId]) {
          //       grouped[nftId] = [];
          //     }
          //     grouped[nftId].push({ bidder, amount });
          //     return grouped;
          //   },
          //   {}
          // );

          // for (const nftId in groupedObjects) {
          //   combinedObjectsArray.push({
          //     nftId: parseInt(nftId),
          //     bids: groupedObjects[nftId],
          //   });
          // }

          // offers.push(combinedObjectsArray);
        })
      );

      return {
        offers,
      };
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      return null;
    }
  };
  const { data, error } = useSWR(
    "fetcher",
    () => nftFetch(user.address, collectedNfts),
    {
      refreshInterval: 5000,
    }
  );

  console.log(data?.offers);
  console.log(isLoading);
  return (
    <ProfileComponent
      user={user}
      users={users}
      data={data}
      collectedNfts={collectedNfts}
      listedNfts={listedNfts}
      soldNfts={soldNfts}
      offers={data?.offers}
      listings={listings}
      isLoading={isLoading}
    />
  );
};
const getUserData = async ({ req, res }: any) => {
  let auth = getCookie("auth", { req, res });
  await connectDB();

  if (!auth) {
    return {
      notFound: true,
    };
  }

  const json = await Users.findOne({ address: auth });
  const user = JSON.parse(JSON.stringify(json));
  const jsonUsers = await Users.find({});
  const users = JSON.parse(JSON.stringify(jsonUsers));

  return { user, users };
};

export const getServerSideProps = async ({ req, res }: any) => {
  const { user, users } = await getUserData({ req, res });

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      users,
    },
  };
};

export default Profile;
