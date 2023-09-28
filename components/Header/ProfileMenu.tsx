import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import axios from "axios";
import { useAuthedProfile } from "../../context/UserContext";

import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";
import { useWalletClient, useDisconnect, useAccount } from "wagmi";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileMenu() {
  const { authedProfile, setAuthedProfile } = useAuthedProfile();
  const [address, setAddress] = useState<string>("");
  const { isConnected, isDisconnected, isConnecting } = useAccount();

  const { disconnect } = useDisconnect({
    onSuccess(data) {
      axios
        .delete("/api/signIn")
        .then((res) => {
          setAddress("");
          setAuthedProfile(null);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const { data: walletClient } = useWalletClient();

  const getAdrress = async () => {
    const accounts = await walletClient?.getAddresses();

    // Return the first account address]
    if (accounts) {
      const addressArray = accounts[0];
      setAddress(addressArray);
      console.log(address);
    }
  };
  useEffect(() => {
    if (walletClient) {
      getAdrress();
    }
  }, [walletClient]);

  return (
    <Menu as="div" className="relative inline-block">
      {address === "" ? (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="text-center whitespace-nowrap w-content z-0 font-ibmPlex text-sm md:text-xs text-black   bg-green  hover:bg-opacity-80 p-2"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <div
                        onClick={openChainModal}
                        style={{ display: "flex", alignItems: "center" }}
                        // type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </div>

                      <button onClick={openAccountModal} type="button">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      ) : (
        // <ConnectButton
        //   accountStatus="address"
        //   // className="text-center w-content z-0 font-ibmPlex text-xs text-green border border-green bg-white bg-opacity-20 hover:bg-opacity-40 p-1"
        //   onClick={connectWallet}
        // ></ConnectButton>
        <>
          <div>
            <Menu.Button className="inline-flex w-[110px] justify-end gap-x-1.5 rounded-full ">
              <div className="h-6 w-6 bg-green rounded-full hover:opacity-80"></div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 text-left z-10 mt-2 w-[15rem] border border-white origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className=" font-ibmPlex text-green">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={classNames(
                        active ? "bg-gray-400 text-white" : "text-white",
                        " px-4 py-2 text-xl uppercase font-bold flex items-center justify-start"
                      )}
                    >
                      <div className="h-5 w-5 bg-green rounded-full mr-3"></div>
                      my profile {">"}
                      {">"}
                    </Link>
                  )}
                </Menu.Item>
                <div className="flex items-center">
                  <p className="block px-4 py-2 text-xs text-white">
                    {address
                      .slice(0, 6)
                      .concat("...")
                      .concat(address.slice(-4))}
                  </p>
                  <div className="h-2 w-2 bg-green rounded-full mr-3"></div>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile/settings"
                      className={classNames(
                        active ? "bg-gray-400 text-green" : "text-green",
                        "block px-4 py-2 text-xs"
                      )}
                    >
                      {">"}
                      {">"}
                      {">"} Settings
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <>
                      <Link
                        href="/"
                        className={classNames(
                          active ? "bg-gray-400 text-green" : "text-green",
                          "block px-4 py-2 text-xs  hover:bg-gray-400"
                        )}
                        // onClick={disconnectWalletAndUser}
                        onClick={() => disconnect()}
                      >
                        <h1>
                          {">"}
                          {">"}
                          {">"} Disconnect
                        </h1>
                      </Link>
                    </>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
