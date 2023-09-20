import React, { useState } from "react";
import send from "../public/send.png";
import sendHover from "../public/sendHover.png";
import sendSaved from "../public/sendHover.png";
import Image from "next/image";

type Props = {};

const Send = ({ authedProfile, handleShareWithCommission }: any) => {
  const [isHovering, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const onClick = (): any => setIsClicked(true);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  return (
    <>
      <button
        onClick={() => {
          onClick();
          if (authedProfile) {
            handleShareWithCommission();
          } else {
            alert("Please Connect Wallet");
          }
        }}
        className="outline-none   transform active:scale-y-75 transition-transform flex"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isClicked ? (
          <Image
            className=" h-5"
            src={sendSaved}
            height={10}
            width={20}
            alt={""}
          />
        ) : isHovering ? (
          <Image
            className=" h-5"
            src={sendHover}
            height={10}
            width={20}
            alt={""}
          />
        ) : (
          <Image className=" h-5" src={send} height={10} width={20} alt={""} />
        )}
      </button>
    </>
  );
};

export default Send;
