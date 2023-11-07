import useSWR from "swr";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { fetchListingsBatch } from "../components/utils/utils";
import { ContractAbi, ContractAddress } from "../components/utils/constants";

// Assuming `fetchListingsBatch` and `fetchOffers` are defined elsewhere and properly imported
// import { fetchListingsBatch, fetchOffers } from './your-functions-file';

// SWR fetcher function that works with async generators
const batchFetcher = async (contract: any, listingTx: any) => {
  let listings = [] as any;

  for await (const batch of fetchListingsBatch({ contract, listingTx })) {
    listings = [...listings, ...batch];
  }

  return listings;
};

const useNftFetch = (userAddress: any) => {
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    // Initialize ethers contract once and reuse it
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const initializedContract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );
    setContract(initializedContract);
  }, []);

  // Define the key to revalidate and a conditional fetch only if we have the contract and user address
  const shouldFetch = contract && userAddress;
  const key = shouldFetch ? ["nftFetch", userAddress] : null;

  // Define the `fetcher` function to get the listing transactions and then fetch batches
  const fetcher = async (_key: any, userAddr: any) => {
    const listingTx = await contract.filterNftByAddress(userAddr);
    return batchFetcher(contract, listingTx);
  };

  const { data, error } = useSWR(key, fetcher, {
    refreshInterval: 5000, // Fetch data every 5 seconds
  });

  // Process the `data` into categorized arrays.
  const processNfts = (nfts: any) => {
    const collectedNfts = [] as any;
    const listedNfts = [] as any;
    const soldNfts = [] as any;
    const offers = [] as any;

    nfts.forEach((nft: any) => {
      if (nft.seller === nft.owner) {
        collectedNfts.push(nft);
      } else if (!nft.sold) {
        listedNfts.push(nft);
      } else {
        soldNfts.push(nft);
      }
    });

    // We return a function to await on when calling this to ensure the offers are fetched asynchronously
    return async () => {
      await Promise.all(
        nfts.map(async (nft: any) => {
          if (!nft.sold) {
            const nftOffers = await contract.getAllOffersForNFT(nft.id);
            offers.push({ nftId: nft.id, bids: nftOffers });
          }
        })
      );

      return {
        collectedNfts,
        listedNfts,
        soldNfts,
        offers,
      };
    };
  };

  // We return a function to process and an array to ensure the offers are fetched asynchronously
  const processAndSetNfts = async () => {
    if (data) {
      return await processNfts(data)();
    }
    return {
      collectedNfts: [],
      listedNfts: [],
      soldNfts: [],
      offers: [],
    };
  };

  return {
    data: processAndSetNfts,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useNftFetch;
