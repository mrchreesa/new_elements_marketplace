import React from "react";
import CollectedNftComponent from "../../../components/PublicProfile/CollectedNftComponent";
import connectDB from "../../../lib/connectDB";
import Users from "../../../model/users";
import { BigNumber, ethers } from "ethers";
import {
  ContractAbi,
  ContractAddress,
} from "../../../components/utils/constants";
import { fetchListing } from "../../../components/utils/utils";

type Props = {};

const CollectedNft = ({ bids, listing }: any) => {
  return <CollectedNftComponent bids={bids} listing={listing} />;
};

export const getServerSideProps = async ({ req, res, query }: any) => {
  await connectDB();
  const jsonUsers = await Users.find({});
  let users = JSON.parse(JSON.stringify(jsonUsers));

  // NFT fetch
  const nftFetch = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_APP_INFURA_ID
    );

    const contract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );

    const id = Number(query.collectedNftId);

    const listingTx = await contract.fetchNFT(id);
    // console.log(listingTx);
    let listing = await fetchListing({ contract, listingTx });
    // let listing = 1;
    // Get the latest block number
    const toBlock = await provider.getBlockNumber();
    const fromBlock = 0;
    // const tokenId = BigNumber.from(query.listingId);
    let bids: any = [];
    // Subscribe to the 'Bid' event
    await contract
      .queryFilter(contract.filters.Bid(), fromBlock, toBlock)
      .then((events) => {
        events.map((event: any) => {
          if (Number(event.args.listingId) == id) {
            const { sender, amount } = event?.args;
            const formattedAmount = Number(amount) / 1e18;
            // console.log(sender, formattedAmount);
            bids.push({ sender, amount: formattedAmount });
          }
        });
      });
    console.log(bids);
    return { listing, bids };
  };

  let { listing, bids } = await nftFetch();

  return {
    props: { listing, bids: bids || null },
  };
};
export default CollectedNft;
