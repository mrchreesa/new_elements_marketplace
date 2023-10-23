import Image from "next/image";
import React, { useEffect, useState } from "react";
import banner from "../../assets/banner.png";
import avatar from "../../assets/avatar.gif";

import star from "../../assets/star.png";
import { useAuthedProfile } from "../../context/UserContext";

import Router, { useRouter } from "next/router";
import Countdown from "react-countdown";
import Link from "next/link";

type Props = {
  user: any;
  collectedNfts: any[];
  listedNfts: any[];
};

const PublicProfileComponent = ({ user, collectedNfts, listedNfts }: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { setAuthedProfile, authedProfile } = useAuthedProfile();
  const router = useRouter();
  console.log(collectedNfts);

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a complete state
      return null;
    } else {
      // Render a countdown
      return (
        <span>
          Ends In <span className="mr-4" /> {hours < 10 ? "0" + hours : hours}H{" "}
          {minutes < 10 ? "0" + minutes : minutes}M{" "}
          {seconds < 10 ? "0" + seconds : seconds}S
        </span>
      );
    }
  };

  return (
    <div
      className={`flex flex-col w-full max-w-[1590px] px-4 md:px-3 lg:px-6  md:mt-24  bg-black overflow-hidden ${
        loading && `cursor-progress`
      }`}
    >
      <div className="flex flex-col w-full mt-20 md:mt-0 font-ibmPlex ">
        <label className="" htmlFor="input-banner">
          <Image
            src={user?.bannerPicture || banner}
            width={1600}
            height={200}
            alt="banner"
            className="h-[12vh] md:h-[14vh]  object-cover   z-0"
          />
        </label>

        <div className="flex w-full -mt-4">
          <label className="" htmlFor="input-profile">
            <Image
              className="border border-green rounded-full  bg-black z-10 object-center object-cover aspect-square"
              src={user?.profilePicture || avatar}
              width={70}
              height={70}
              alt="profile"
            />
          </label>
          <Image
            className="ml-4 mb-1 h-5 self-center"
            src={star}
            width={20}
            height={10}
            alt="star"
          />
          <p className="text-xs pl-1 font-bold tracking-wider self-center">
            ARTIST
          </p>
        </div>

        <div className="flex flex-col w-full mt-4 text-left text-xs">
          <h1 className="text-2xl mb-1 font-bold">{user?.username}</h1>
          <p>{user?.bio}</p>
        </div>
        <div className="flex  flex-col-reverse md:flex-col">
          <div className="flex flex-col font-ibmPlex mt-10 text-left">
            <h3 className="font-bold">LISTED</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4  items-stretch gap-10 md:gap-4 mb-10 mt-4">
              {/* NFT 1  */}
              {listedNfts.map(
                (nft: any, index: React.Key | null | undefined) => (
                  <div
                    className="flex md: flex-col h-full items-start w-max "
                    key={index}
                  >
                    <Link
                      href={`/listing/${nft.id}`}
                      className="cursor-pointer h-full"
                    >
                      <Image
                        src={nft.image}
                        alt="nft7"
                        width={150}
                        height={200}
                        className="max-h-[220px] md:max-h-[300px] w-[41vw] md:w-full md:min-w-[230px] mb-2 object-cover"
                      />{" "}
                    </Link>
                    <div className="flex flex-col w-full md:min-w-[230px] font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
                      <div className=" flex ">
                        <div className=" flex w-full  text-green font-ibmPlex justify-center uppercase">
                          {nft.timeElapse ? (
                            <>
                              <p>Auction ended</p>
                            </>
                          ) : (
                            <>
                              {nft.endTime != 0 || nft.endTime != "" ? (
                                <Countdown
                                  date={Date.now() + nft.endTime * 1000}
                                  renderer={renderer}
                                />
                              ) : nft.bid ? (
                                <p>Auction in progress</p>
                              ) : (
                                <p>Reserve NOt met</p>
                              )}
                            </>
                          )}
                          <div className="flex grow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {/* PURCHASED */}

            <div className="flex flex-col">
              <h3 className="font-bold">PURCHASED</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4  items-stretch gap-10 md:gap-4 mb-10 mt-4">
                {collectedNfts.map(
                  (nft: any, index: React.Key | null | undefined) => (
                    <div
                      className="grid grid-cols-2  lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4"
                      key={index}
                    >
                      <div className="flex  flex-col h-full items-start w-auto ">
                        <Link
                          href={`/user/${router.query.slug}/${nft.id}`}
                          className="cursor-pointer h-full"
                        >
                          <Image
                            src={nft.image}
                            alt="nft7"
                            width={150}
                            height={200}
                            className="max-h-[220px] md:max-h-[300px] w-[41vw] md:w-full md:min-w-[230px] mb-2 object-cover"
                          />{" "}
                        </Link>
                        <div className="flex flex-col w-full md:min-w-[230px] font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
                          <div className=" flex ">
                            <div className=" flex w-full">
                              {" "}
                              <p className="pr-6 ">
                                Bought <br /> For
                              </p>
                              <div className="flex grow"></div>
                              <p className="font-bold text-green">
                                {nft.price} <br />{" "}
                                <span className="flex justify-end">ETH</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileComponent;
