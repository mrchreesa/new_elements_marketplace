import React from "react";
import ApplyComponent from "../components/Apply/ApplyComponent";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
const key = process.env.NEXT_PUBLIC_RECAPTCHAV3_SITE_KEY;
const Apply = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={key || ""}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {" "}
      <ApplyComponent />
    </GoogleReCaptchaProvider>
  );
};

export default Apply;
