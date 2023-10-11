import { useState, FunctionComponent } from "react";
import Router from "next/router";
import Image from "next/image";
import Countdown from "react-countdown";

import send from "../public/send.png";
import axios from "axios";
import { useAuthedProfile } from "../context/UserContext";
import {
  getArtist,
  artistNameOrAddress,
  artistProfilePic,
  owner,
} from "../lib/functions";
import ShareLinkModal from "./ShareLinkModal";
import { useRouter } from "next/router";
import Ribbon from "./Ribbon";
import Send from "./Send";
import Link from "next/link";

type Props = {
  listing: object | any;
  setLoading: Function;
  users: object | any;
};
const NFTCard: FunctionComponent<Props> = ({ listing, setLoading, users }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  getArtist(users, listing);
  console.log(owner);

  const { authedProfile, setAuthedProfile } = useAuthedProfile();
  const router = useRouter();

  const handleSaveToProfile = () => {
    setLoading(true);
    const data = {
      nft: listing,
      address: authedProfile?.address,
    };
    axios
      .post("/api/saveNft", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleShareWithCommission = () => {
    isModalOpen();
  };

  const { _id } = owner || {};

  // Countdown

  const Completionist = () => <span>Auction Ended</span>;
  const timeLeft = Number(listing.endTime);

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    console.log(completed);

    if (completed) {
      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          Ends In <span className="mr-8" /> {hours < 10 ? "0" + hours : hours}H{" "}
          <span className="mr-4" />
          {minutes < 10 ? "0" + minutes : minutes}M <span className="mr-4" />
          {seconds < 10 ? "0" + seconds : seconds}S
        </span>
      );
    }
  };
  // Modal Share Link
  const isModalOpen = () => {
    setModalOpen(true);
  };
  const isModalClosed = () => {
    setModalOpen(false);
  };
  console.log(listing);

  return (
    <>
      {listing ? (
        <div className="flex flex-col h-full px-4 md:px-0 overflow-hidden justify-between ">
          <div className="flex flex-col h-full">
            {/* <div className="flex grow"></div> */}
            <Link
              href={`/listing/${listing.id}`}
              className=" overflow-hidden h-full flex min-h-[370px] max-h-[450px]  xl:max-h-[580px] justify-center items-center"
            >
              <Image
                src={listing?.image}
                alt={listing?.title}
                width={400}
                height={400}
                className="w-full  object-cover cursor-pointer"
              />
            </Link>

            <div className="flex flex-col font-ibmPlex mb-16 uppercase text-xs text-[#e4e8eb] ">
              <div className=" grid grid-cols-4 sm:grid-cols-5 gap-3 w-full mt-3">
                <div className="text-left col-span-2">
                  <p>{listing?.title}</p>
                </div>
                <div className="hidden sm:flex grow"></div>
                <div className=" flex text-left -mr-7 justify-end">
                  {" "}
                  <p className=" ">
                    Reserve <br /> Price
                  </p>
                </div>
                <div className=" flex text-left justify-end">
                  <p className="font-bold ">
                    {listing?.price == 0
                      ? listing?.price + ".00"
                      : listing?.price}{" "}
                    <br /> <span className="flex justify-end"> ETH </span>
                  </p>
                </div>
                <Link
                  href={`/user/${_id}`}
                  className="font-bold text-left flex cursor-pointer col-span-2"
                >
                  <p> BY @{artistNameOrAddress}</p>
                  <Image
                    className="ml-1 md:ml-3 -mt-1 h-6 cursor-pointer  object-cover rounded-full"
                    src={artistProfilePic}
                    height={0}
                    width={25}
                    alt={""}
                  />
                </Link>
                <div className="hidden sm:flex grow"></div>
                <div className=" flex text-left -mr-7 justify-end">
                  {" "}
                  <p className=" ">
                    Current <br /> Bid
                  </p>
                </div>
                <div className=" flex text-left justify-end">
                  <p className="font-bold text-green">
                    {listing.Bid == 0 ? listing.Bid + ".00" : listing.Bid}{" "}
                    <br />
                    <span className="flex justify-end"> ETH</span>
                  </p>
                </div>
              </div>
              <div className=" flex mt-3 -z-0">
                <Ribbon
                  authedProfile={authedProfile}
                  handleSaveToProfile={handleSaveToProfile}
                />

                <div className="flex grow"></div>
                <div className="-mb-[2px] flex font-bold text-green items-end">
                  {listing.timeElapse ? (
                    <>
                      <p className="pr-5">Auction ended</p>
                    </>
                  ) : (
                    <>
                      {listing.endTime != 0 || listing.endTime != "" ? (
                        <Countdown
                          date={Date.now() + listing.endTime * 1000}
                          renderer={renderer}
                        />
                      ) : (
                        <Link
                          href={`/listing/${listing.id}`}
                          className="cursor-pointer"
                        >
                          {" "}
                          place bid
                        </Link>
                      )}
                    </>
                  )}
                </div>
                <div className="flex grow"></div>

                <div className="font-bold flex">
                  <Send
                    authedProfile={authedProfile}
                    handleShareWithCommission={handleShareWithCommission}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <ShareLinkModal
        isModalClosed={isModalClosed}
        modalOpen={modalOpen}
        user={authedProfile}
        listing={listing}
      />
    </>
  );
};
export default NFTCard;
