import React, { useEffect, useState } from "react";
import ribbon from "../public/ribbon.png";
import ribbonHover from "../public/ribbon_hover.png";
import ribbonSaved from "../public/ribbon_saved.png";
import Image from "next/image";
import axios from "axios";

type Props = {};

const Ribbon = ({
  authedProfile,
  setAuthedProfile,
  handleSaveToProfile,
  isSaved,
  listing,
}: any) => {
  const [isHovering, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const onSave = (): any => setIsClicked(true);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  const deleteSavedNft = (nft: any) => {
    const data = {
      nft: nft,
      address: authedProfile.address,
    };
    axios.put("/api/saveNft", data).then((res) => {
      console.log(res.data);
      setAuthedProfile(res.data);
      setIsClicked(false);
      // refreshData();
    });
  };

  useEffect(() => {
    if (authedProfile) {
      if (
        authedProfile?.savedNfts?.find((nft: any) => nft?.id === listing?.id)
      ) {
        setIsClicked(true);
      }
    }
  }, [authedProfile]);

  return (
    <>
      <button
        onClick={() => {
          onSave();
          if (authedProfile && !isClicked) {
            handleSaveToProfile();
          } else if (authedProfile && isClicked) {
            deleteSavedNft(listing);
          } else {
            alert("Please Connect Wallet");
          }
        }}
        className="outline-none -m-[2px]  transform active:scale-y-75 transition-transform flex"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isClicked && authedProfile ? (
          <Image
            className=" h-5 w-5"
            src={ribbonSaved}
            height={10}
            width={20}
            alt={""}
          />
        ) : isHovering ? (
          <Image
            className=" h-5 w-5"
            src={ribbonHover}
            height={10}
            width={20}
            alt={""}
          />
        ) : (
          <Image
            className=" h-5 w-5"
            src={ribbon}
            height={10}
            width={20}
            alt={""}
          />
        )}
      </button>
    </>
  );
};

export default Ribbon;
