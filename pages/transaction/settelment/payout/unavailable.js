import React from 'react'
import { motion } from 'framer-motion';
import styles from "../../../../styles/RickRoll.module.css"
import { useState, useEffect,useRef } from 'react';
import { useRouter } from "next/router";

const Unavailable = () => {

  const router = useRouter();
  const videoRef = useRef();

  const hidden = {
    visible: {
      opacity: 1,
      transition: {
        delay: 2,
        duration: 0.5 ,
        ease: "easeInOut"
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  }

  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setVisible(true);
  //     // window.open("/trax342.mp4", "_blank");
      
  //   }
  //   , 4000);
  // }
  // , [])


  const videoComponent = () => {
    return (
      <iframe
        width="676"
        height="380"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        title="Rick Astley - Never Gonna Give You Up (Official Music Video)"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    );
  }

  return (
    <div className={styles.FailMain}>
      <h1>Sorry, this service is Not Available for a while</h1>
      <h1>
        see this explaination to{" "}
        <a href="https://youtu.be/dQw4w9WgXcQ">know more</a>
      </h1>
      {/* <motion.div initial="hidden" animate="visible" variants={hidden}>
        <h1>K</h1>
      </motion.div> */}
      {/* {visible && videoComponent()} */}
    </div>
  );
}

export default Unavailable