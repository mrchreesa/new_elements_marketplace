import Router from "next/router";
import Image from "next/image";
import React from "react";
import {
  getArtist,
  artistNameOrAddress,
  artistProfilePic,
  owner,
} from "../../lib/functions";
import Link from "next/link";

type Props = {};

const SavedNfts = ({ nft, users, deleteSavedNft }: any) => {
  getArtist(users, nft);
  return (
    <div className="flex  flex-col h-full items-start w-min text-xs uppercase ">
      <div className="cursor-pointer relative h-full">
        <Link href={`/listing/${nft.id}`}>
          <Image
            src={nft.image}
            alt="nft7"
            width={150}
            height={200}
            className="max-h-[220px] md:max-h-[300px] w-[41vw] md:w-full md:min-w-[230px] mb-2 object-cover "
          />{" "}
        </Link>
        <button
          onClick={() => deleteSavedNft(nft)}
          className="absolute -top-6 -right-6 border-green border p-1 rounded-full hover:brightness-50 font-ibmPlex  bg-green  font-semibold text-black   hover:border-transparent transition-all duration-100 ease-in"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full items-stretch gap-4 mb-10 mt-4">
        <div className="text-left col-span-2">
          <p>{nft?.title}</p>
        </div>
        {/* <div className="hidden sm:flex grow"></div> */}
        <div className=" flex  justify-end -mr-4">
          {" "}
          <p className=" ">
            Reserve <br /> Price
          </p>
        </div>
        <div className=" flex text-left justify-end">
          <p className="font-bold ">
            {nft?.price == 0 ? nft?.price + ".00" : nft?.price} <br />{" "}
            <span className="flex justify-end"> ETH </span>
          </p>
        </div>
        <div
          onClick={() => {
            Router.push({
              pathname: `user/${owner?._id}`,
            });
          }}
          className="mr-4 text-left flex cursor-pointer  mt-3 col-span-2"
        >
          <p> BY @{artistNameOrAddress}</p>
          {/* <Image
            className=" -mt-1 h-6 w-8 cursor-pointer  object-cover rounded-full"
            src={artistProfilePic}
            height={0}
            width={30}
            alt={""}
          /> */}
        </div>
        {/* <div className="hidden sm:flex grow"></div> */}
        <div className=" flex text-left justify-end -mr-4">
          {" "}
          <p className=" ">
            Current <br /> Bid
          </p>
        </div>
        <div className=" flex text-left justify-end">
          <p className="font-bold text-green">
            {nft.Bid == 0 ? nft.Bid + ".00" : nft.Bid} <br />{" "}
            <span className="flex justify-end"> ETH</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedNfts;
