import React, { useEffect, useState } from "react";
import ProfileComponent from "../components/Profile/ProfileComponent";
import { getCookie } from "cookies-next";
import connectDB from "../lib/connectDB";
import Users from "../model/users";
import { ContractAbi, ContractAddress } from "../components/utils/constants";
import { ethers } from "ethers";
import { fetchListingsBatch, fetchListings } from "../components/utils/utils";
import useSWR from "swr";

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
      revalidateOnFocus: false,
    });

    return { listings, error, isLoading: !loaded && !error };
  };
  const { listings }: any = useFetchListingsSWR();
  console.log("listings", listings);

  const nftFetch = async (userAddress: any) => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );

    try {
      const listingTx = await contract.filterNftByAddress(userAddress);
      const res = await fetchListings({ contract, listingTx });

      // const listings = await fetchAllNfts(userAddress, contract);

      const collectedNfts = [] as any;
      const listedNfts = [] as any;
      const soldNfts = [] as any;
      const offers = [] as any;

      if (Array.isArray(res)) {
        res.forEach((nft) => {
          if (nft.seller === nft.owner) {
            collectedNfts.push(nft);
          } else {
            listedNfts.push(nft);
          }

          if (nft.sold) {
            soldNfts.push(nft);
          }
        });

        await Promise.all(
          collectedNfts.map(async (nft: any) => {
            const offersTx = await contract.getAllOffersForNFT(nft.id);
            const bidder = offersTx.map((offer: any) => offer.bidder);
            const amount = offersTx.map(
              (offer: any) => Number(offer.amount) / 1e18
            );

            const offersArray = bidder.map((bidder: any, index: any) => ({
              nftId: nft.id,
              bidder,
              amount: amount[index],
            }));

            const combinedObjectsArray = [];

            const groupedObjects = offersArray.reduce(
              (grouped: any, offer: any) => {
                const { nftId, bidder, amount } = offer;
                if (!grouped[nftId]) {
                  grouped[nftId] = [];
                }
                grouped[nftId].push({ bidder, amount });
                return grouped;
              },
              {}
            );

            for (const nftId in groupedObjects) {
              combinedObjectsArray.push({
                nftId: parseInt(nftId),
                bids: groupedObjects[nftId],
              });
            }

            offers.push(combinedObjectsArray);
          })
        );

        return {
          collectedNfts,
          listedNfts,
          soldNfts,
          offers,
        };
      } else {
        throw new Error("Failed to fetch NFT data");
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      return null;
    }
  };
  const { data, error, isLoading } = useSWR(
    "fetcher",
    () => nftFetch(user.address),
    { refreshInterval: 5000 }
  );

  console.log(data);
  console.log(isLoading);
  return (
    <ProfileComponent
      user={user}
      users={users}
      data={data}
      collectedNfts={data?.collectedNfts}
      listedNfts={data?.listedNfts}
      soldNfts={data?.soldNfts}
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
