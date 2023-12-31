import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthedProfile } from "../../context/UserContext";
import router from "next/router";

type Props = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  authedProfile: any;
};

const Bio = ({ loading, setLoading }: Props) => {
  const [bio, setBio] = React.useState<any>({
    bio: "",
    open: false,
  });

  const { authedProfile, setAuthedProfile } = useAuthedProfile();
  useEffect(() => {
    if (authedProfile == null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [authedProfile]);
  //Username change

  const handleBioCancel = () => {
    setBio({
      ...bio,
      bio: "",
      open: false,
    });
  };
  const handleBioOpen = () => {
    setBio({
      ...bio,
      open: true,
    });
  };

  const handleBioChange = (e: any) => {
    setBio({
      ...bio,
      bio: e.target.value,
    });
    console.log(bio);
  };
  const handleBioSave = () => {
    setLoading(true);
    setBio({
      ...bio,
      bio: "",
      open: false,
    });
    const refreshData = () => {
      router.replace(router.asPath);
    };
    axios
      .post("/api/updateProfile", {
        address: authedProfile.address,
        bio: bio.bio,
      })
      .then((response) => {
        setAuthedProfile(response.data);
        refreshData();
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <label
        className={` w-fit p-1 border border-transparent
        ${bio.open ? null : ` hover:border-green cursor-pointer`} `}
        htmlFor="input-bio"
        onClick={handleBioOpen}
      >
        {authedProfile?.bio ? (
          <p> {authedProfile?.bio}</p>
        ) : loading ? null : (
          <p>Add your bio here...</p>
        )}
      </label>
      {bio.open && (
        <div className="flex flex-col items-start w-1/4 min-w-[220px]">
          <textarea
            id="input-bio"
            rows={5}
            className="text-green  w-full bg-black font-bold border border-green  px-1 mt-1 mb-2  bg-opacity-20 hover:bg-opacity-40 focus:outline-none text-base "
            value={bio.bio}
            onChange={handleBioChange}
          />

          <>
            <div className="flex w-full justify-around mb-2">
              <button
                className=" text-green font-compressed uppercase border border-green tracking-[6px] w-full px-1 text-xl my-1 mr-2 bg-white bg-opacity-20 hover:bg-opacity-40 font-semibold "
                onClick={handleBioSave}
              >
                Save
              </button>
              <button
                className=" text-green font-xxCompressed uppercase border border-green tracking-[6px] w-full px-1 text-xl my-1 bg-white bg-opacity-20 hover:bg-opacity-40 font-semibold "
                onClick={handleBioCancel}
              >
                Cancel
              </button>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Bio;
