import React, { FunctionComponent } from "react";
import Modal from "react-modal";

type Props = {
  errorModal2Open: boolean;
  isErrorModal2Closed: () => void;
};

const ErrorModal2: FunctionComponent<Props> = ({
  errorModal2Open,
  isErrorModal2Closed,
}) => {
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
        isOpen={errorModal2Open}
        onRequestClose={isErrorModal2Closed}
        ariaHideApp={false}
      >
        <div className="flex flex-col z-12 h-full w-[70vw] md:w-[70%] my-10 mx-5 overflow-hidden items-center ">
          <div className="flex flex-col h-full">
            <div className="flex flex-col w-full font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] items-center">
              <div className=" flex w-full fontIbm">
                <div className=" flex text-center">
                  {" "}
                  <p className=" text-green">Less than reserve price</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ErrorModal2;
