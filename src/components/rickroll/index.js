import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";
import styles from "../../../styles/RickRoll.module.css"
import React from 'react'
import { useRouter } from "next/router";

const RickRoll = () => {

  const router = useRouter();

  const btnClick = () =>{
    // window.open("#", "_blank");
    // window.open("http://www.google.com", "_self");
    toast.info("You will be Redirected shortly", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      router.push("transaction/settelment/payout/unavailable");
    }
    , 3000);
  }

  return (
    <>
      <div className={styles.attCard}>
        <h2>Get 90% Attendance ( 50Rs )</h2>
        <button onClick={btnClick}>Pay Now</button>
      </div>
    </>
  );
}

export default RickRoll