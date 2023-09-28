import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthedProfile } from "../../context/UserContext";
import MakeOfferModal from "./MakeOfferModal";
import SuccessfulOfferdModal from "./SuccesfulOfferModal";
import ShareLinkModal from "../ShareLinkModal";

const CollectedNftComponent = ({ bids, listing }: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [successfulOfferModalOpen, setSuccessfulOfferModalOpen] =
    useState<boolean>(false);
  const [modalReferralOpen, setModalReferralOpen] = useState<boolean>(false);
  // const [listing, setListing] = useState<any>(null);
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();
  const { authedProfile, setAuthedProfile } = useAuthedProfile();
  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  const listingId = router.query.collectedNftId;

  // Modal Make Offer
  const isModalOpen = () => {
    setModalOpen(true);
  };
  const isModalClosed = () => {
    setModalOpen(false);
  };

  // Modal Successful Offer
  const isSuccessfullOfferModalOpen = () => {
    setSuccessfulOfferModalOpen(true);
  };
  const isSuccessfullOfferModalClosed = () => {
    setSuccessfulOfferModalOpen(false);
  };

  // Modal Share Link
  const isModalReferralOpen = () => {
    setModalReferralOpen(true);
  };
  const isModalReferralClosed = () => {
    setModalReferralOpen(false);
  };

  const handleShareWithCommission = () => {
    isModalReferralOpen();
  };

  if (listing) {
    return (
      <>
        <div className="flex flex-col realtive h-full items-center container lg:w-[98dvw]  mt-[6.5rem]  overflow-x-hidden justify-between">
          <div className="flex justify-center realtive w-3/4">
            <div className="absolute translate-x-[100%] lg:translate-x-1 lg:right-[70%] xl:translate-x-0 xl:right-1/2  left-0 hidden md:block ">
              <button
                onClick={() => router.back()}
                className="font-ibmPlex cursor-pointer uppercase font-bold text-green text-xs -z-10"
              >
                {"<<<"} Back
              </button>
            </div>
            <div className="flex flex-col h-full items-center justify-center">
              <div className="w-full lg:w-max">
                <div className=" min-w-[350px]  lg:max-w-[50vw] cursor-pointer">
                  <Image
                    src={listing?.image}
                    alt={listing?.title as string}
                    width={400}
                    height={600}
                    className="w-full mb-2 object-contain cursor-pointer"
                  />{" "}
                  <div className="flex flex-col font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
                    <div className=" flex mt-4">
                      <div className="">
                        <p>{listing?.title}</p>
                      </div>
                      <div className="flex grow"></div>
                      <div className=" flex text-left">
                        {" "}
                        <p className="pr-6 ">
                          Bought <br /> For
                        </p>
                        <p className="font-bold ">
                          {listing.price} <br /> ETH
                        </p>
                      </div>
                    </div>

                    <div className=" flex mt-3">
                      <div className="font-bold flex">
                        <b>
                          {/* {listing.seller?.slice(0, 6) +
                            "..." +
                            listing.seller?.slice(36, 40)} */}
                        </b>
                      </div>

                      <div className="flex grow"></div>
                    </div>
                    <div className=" flex mt-3">
                      <div className="flex grow"></div>
                      <div className="w-full flex font-bold text-green uppercase">
                        <button
                          className="bg-blue text-black flex flex-col items-center mb-6 md:mb-0 w-full font-xCompressed uppercase tracking-[10px] mt-1  bg-green hover:bg-opacity-80 transition duration-300 ease-in-out py-1 md:py-[1vh] md:px-[7vh] z-2 text-2xl   "
                          onClick={isModalOpen}
                        >
                          Make Offer
                        </button>
                      </div>
                      <div className="flex grow"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="font-ibmPlex bold text-center w-full   mt-10 pb-10 border-b leading-5 text-xs">
                <p className="md:w-[50vw]">{listing?.description}</p>
              </div>
              <div className="flex w-full mt-6 mb-10 font-ibmPlex text-xs">
                <div className="flex flex-1/2 flex-col w-1/2 items-start">
                  <button
                    className="text-green mb-4"
                    onClick={() => {
                      if (authedProfile) {
                        handleShareWithCommission();
                      } else {
                        alert("Please Connect Wallet");
                      }
                    }}
                  >
                    SHARE AND EARN 1% {">>"}
                  </button>
                  <button className="mb-4">VIEW ON ETHERSCAN {">"}</button>
                </div>
                <div className="flex-1/2  w-1/2">
                  <p className="text-left mb-2">HISTORY</p>
                  {bids?.length && bids[0] != undefined ? (
                    bids?.map((bid: any, key: number) => (
                      <div
                        className="grid grid-cols-8  justify-between text-left mt-2"
                        key={key}
                      >
                        <div className="col-span-5 flex">
                          {/* <Image
                            src={profile}
                            width={30}
                            height={10}
                            alt="profile picture"
                            className="hidden md:block h-fit"
                            key={key}
                          /> */}

                          <p className=" w-1/2 md:w-full">
                            Bid by{" "}
                            <span className="font-bold">
                              @
                              {bid?.sender?.slice(0, 6) +
                                "..." +
                                bid?.sender?.slice(36, 40)}
                            </span>{" "}
                            {/* <br /> Jan 15, 2023 at 7.31pm */}
                          </p>
                        </div>
                        <div className="flex flex-grow col-span-2"></div>
                        <p className="font-bold text-green text-right">
                          {bid?.amount} <br />{" "}
                          <span className="flex justify-end"> ETH</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-left mt-2">No bids yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <MakeOfferModal
          listing={listing}
          isModalClosed={isModalClosed}
          modalOpen={modalOpen}
          listingId={listingId}
          isSuccessfullOfferModalOpen={isSuccessfullOfferModalOpen}
        />
        <SuccessfulOfferdModal
          successfulOfferModalOpen={successfulOfferModalOpen}
          isSuccessfulOfferModalClosed={isSuccessfullOfferModalClosed}
        />
        <ShareLinkModal
          isModalClosed={isModalReferralClosed}
          modalOpen={modalReferralOpen}
          user={authedProfile}
          listing={listing}
        />
      </>
    );
  } else {
    return null;
  }
};
export default CollectedNftComponent;
