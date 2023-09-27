import React, { useState, useEffect, FunctionComponent } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  modalCollectionOpen: boolean;
  isModalCollectionClosed: () => void;
};

const MintCollectionModal: FunctionComponent<Props> = ({
  modalCollectionOpen,
  isModalCollectionClosed,
}) => {
  const router = useRouter();
  const customStyles = {
    overlay: {
      backgroundColor: "rgb(25, 25, 25, 0.85)",
    },
    content: {
      zIndex: "20",
      top: "50%",
      left: "50%",
      minWidth: "40vw",
      right: "auto",
      bottom: "auto",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "black",
      backgroundSize: "cover",
      marginRight: "-50%",
      borderRadius: "10px",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div>
      {" "}
      <Modal
        style={customStyles}
        isOpen={modalCollectionOpen}
        onRequestClose={isModalCollectionClosed}
        ariaHideApp={false}
      >
        <div className="flex flex-col z-12 h-full w-full md:w-[70%] my-10 mx-5 overflow-hidden justify-between ">
          <div className="flex flex-col h-full">
            <div className="flex flex-col w-full font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
              <div className=" flex w-full fontIbm">
                <div className=" flex text-left">
                  {" "}
                  <p className="pr-6 text-green">Collection minted!</p>
                </div>
              </div>
              <button
                onClick={isModalCollectionClosed}
                className="bg-green flex justify-center whitespace-nowrap text-black  font-xCompressed  w-full uppercase tracking-[6px] mt-3   hover:bg-opacity-80 py-[1.2vh] px-[2vw] fontCompress  z-2 text-2xl  transition duration-200 ease-in-out"
              >
                Add NFTs
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MintCollectionModal;
