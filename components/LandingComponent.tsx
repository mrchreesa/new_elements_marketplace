import React from "react";
import NFTCardSkeleton from "./LoadingSkeletons/NFTCardSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import NFTCard from "./NFTCard";
import CollectionMarketPage from "./Collection/CollectionMarketPage";

const LandingComponent = ({
  loading,
  setLoading,
  listings,
  users,
  isCollection,
  setIsCollection,
  isLoading,
}: any) => {
  return (
    <>
      {/* Content */}
      <div
        className={`relative flex w-screen overflow-hidden  max-w-[1600px] flex-col items-center content-center ${
          loading && `cursor-progress`
        }`}
      >
        <AnimatePresence>
          <div className="mb-5 w-full mt-32 px-1 lg:px-0">
            {
              // If the listings are loading, show a loading skeleton
              isLoading && !listings.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-10 mb-10">
                  <NFTCardSkeleton />

                  <NFTCardSkeleton />

                  <NFTCardSkeleton />
                </div>
              ) : (
                // Otherwise, show the listings
                listings.length > 0 && (
                  <>
                    <div className="fixed flex font-ibmPlex text-xs mx-4 lg:mx-8 top-12 sm:mt-0 pb-3 pt-10 w-full bg-black z-10">
                      <button
                        onClick={() => setIsCollection(false)}
                        className={`${
                          !isCollection ? "border-b-white" : ""
                        }  mr-10 hover:border-b-white focus:border-b-white border-b border-b-transparent transition-all duration-200`}
                      >
                        ALL
                      </button>
                      <button
                        onClick={() => setIsCollection(true)}
                        className={`${
                          isCollection ? "border-b-white" : ""
                        } mr-10 hover:border-b-white focus:border-b-white border-b border-b-transparent transition-all duration-200`}
                      >
                        COLLECTIONS{" "}
                      </button>
                    </div>
                    {!isCollection ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:mx-4 lg:mx-8 mb-10">
                        {listings?.map((listing: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                            exit={{
                              opacity: 0,
                              y: 90,
                              transition: {
                                ease: "easeInOut",
                                delay: 1,
                              },
                            }}
                          >
                            <>
                              <NFTCard
                                key={index}
                                listing={listing}
                                setLoading={setLoading}
                                users={users}
                              />
                            </>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <CollectionMarketPage users={users} />
                    )}
                  </>
                )
              )
            }
          </div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default LandingComponent;
