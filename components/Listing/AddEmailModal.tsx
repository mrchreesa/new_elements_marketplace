import React, { FunctionComponent } from "react";
import Modal from "react-modal";
import Image from "next/image";
import Link from "next/link";

type Props = {
  addEmailModalOpen: boolean;
  isAddEmailModalClosed: () => void;
};

const AddEmailModal: FunctionComponent<Props> = ({
  addEmailModalOpen,
  isAddEmailModalClosed,
}) => {
  const customStyles = {
    overlay: {
      backgroundColor: "rgb(25, 25, 25, 0.85)",
    },
    content: {
      zIndex: "20",
      top: "50%",
      left: "50%",
      border: "none",
      right: "auto",
      bottom: "auto",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "black",
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
        isOpen={addEmailModalOpen}
        onRequestClose={isAddEmailModalClosed}
        ariaHideApp={false}
      >
        <>
          <div className="relative flex max-h-[95vh] pt-4 flex-col z-12 text-ibmPlex h-full w-full   mx-5 overflow-hidden justify-between">
            <div className="flex flex-col h-full">
              <div className=" overflow-hidden h-full flex flex-col justify-center items-center mb-3">
                <p className="pb-3 text-green font-ibmPlex text-xs">
                  Please add your email
                </p>

                <Link
                  href="/profile/settings"
                  className="font-xCompressed fontCompress w-full px-10  uppercase tracking-[8px] py-1 text-black   bg-green  hover:bg-opacity-80 font-semibold text-2xl  "
                >
                  To Settings{" "}
                </Link>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default AddEmailModal;
