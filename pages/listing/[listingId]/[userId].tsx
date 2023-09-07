import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

type Props = {};

const UserId = () => {
  const router = useRouter();

  const fetchUserAddress = () => {
    const userId = router.query.userId;
    const listingId = router.query.listingId;

    const data = {
      userId: userId,
    };

    axios
      .post(`/api/userId`, data)
      .then((res: any) => {
        localStorage.setItem("userAddress", res.data.address);
        router.push(`/listing/${listingId}`);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchUserAddress();
  }, [router.isReady]);

  return <div>UserId</div>;
};

export default UserId;
