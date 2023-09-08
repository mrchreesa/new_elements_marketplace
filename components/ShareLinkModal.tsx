import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {};

const ShareLinkModal = ({
  isModalClosed,
  modalOpen,
  user,
  listing,
  host,
}: any) => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  const [value, setValue] = useState(
    `${origin}/listing/${listing?.id}/${user?._id}`
  );
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(({ target: { innerText } }: any) => {
    console.log(`Clicked on "${innerText}"!`);
  }, []);
  const onCopy = useCallback(() => {
    setCopied(true);
  }, []);

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
      marginRight: "-50%",
      borderRadius: "25px",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div>
      {" "}
      <Modal
        style={customStyles}
        isOpen={modalOpen}
        onRequestClose={isModalClosed}
        ariaHideApp={false}
      >
        <div className="font-ibmPlex m-2">
          <div className="flex">
            <section className="section">
              <p className="w-full h-full resize-none bg-black  text-green border px-2 py-1 text-xs ">
                {value}{" "}
              </p>
            </section>
            <CopyToClipboard
              onCopy={onCopy}
              options={{ message: "Whoa!" }}
              text={value}
            >
              <button onClick={onClick} className="ml-4">
                Copy
              </button>
            </CopyToClipboard>
          </div>
          <section className="h-fit mt-1">
            {copied ? (
              <span style={{ color: "red" }}>Copied.</span>
            ) : (
              <span></span>
            )}
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default ShareLinkModal;
