import React from "react";
import type { NextPage } from "next";
import CollectionListing from "../../components/Collection/CollectionListing";
import { getCookie } from "cookies-next";
import connectDB from "../../lib/connectDB";
import Users from "../../model/users";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../../components/utils/constants";
import { fetCollection, fetchListings } from "../../components/utils/utils";

const CollectionListingPage: NextPage = ({ users, listings, listing }: any) => {
  return (
    <CollectionListing listing={listing} listings={listings} users={users} />
  );
};

export const getServerSideProps = async (context: any) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const fetchlisting = async () => {
    if (context.query.collectionId) {
      // setLoading(true);
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      const contract = new ethers.Contract(
        ContractAddress,
        ContractAbi,
        provider
      );
      const id = Number(context.query.collectionId);
      const collectionTx = await contract.fetchCollection(id);
      const collection = await fetCollection(collectionTx);

      const listingTx = await contract.fetchCollectionNFTs(collectionTx.id);
      const listings = await fetchListings({ contract, listingTx });
      // console.log(context + " id");

      return { listings, collection };
    }
    // setLoading(false);
  };

  let { listings, collection }: any = await fetchlisting();
  listings = JSON.parse(JSON.stringify(listings));
  collection = JSON.parse(JSON.stringify(collection));
  await connectDB();

  const jsonUsers = await Users.find({});
  let users = JSON.parse(JSON.stringify(jsonUsers));

  return { props: { users, listings, listing: collection } };
};

export default CollectionListingPage;
