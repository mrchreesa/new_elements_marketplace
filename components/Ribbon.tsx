import React, { useState } from "react";
import ribbon from "../public/ribbon.png";
import ribbonHover from "../public/ribbon_hover.png";
import ribbonSaved from "../public/ribbon_saved.png";
import Image from "next/image";

type Props = {};

const Ribbon = ({ authedProfile, handleSaveToProfile }: any) => {
  const [isHovering, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const onSave = (): any => setIsClicked(true);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  return (
    <>
      <button
        onClick={() => {
          onSave();
          if (authedProfile) {
            handleSaveToProfile();
          } else {
            alert("Please Connect Wallet");
          }
        }}
        className="outline-none -m-[2px]  transform active:scale-y-75 transition-transform flex"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isClicked ? (
          <Image
            className=" h-5"
            src={ribbonSaved}
            height={10}
            width={20}
            alt={""}
          />
        ) : isHovering ? (
          <Image
            className=" h-5"
            src={ribbonHover}
            height={10}
            width={20}
            alt={""}
          />
        ) : (
          <Image
            className=" h-5"
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
