import Head from 'next/head'
import Image from 'next/image'
import { toast } from 'react-toastify';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Axios } from 'axios';

export default function Home() {

  const [data, setData] = useState({})

  const getAttendance = async (adno, pswd) => {
    // Equivalent to `axios.get('https://httpbin.org/get?answer=42')`
    console.log(adno, pswd)
    // const res = await Axios.get("http://127.0.0.1:5000/api/", {
    //   params: { adno: adno, pswd: pswd } 
    // });

    // console.log(res.data);
    // setData(res.data);
    await fetch(`/api/getAtt?adno=${adno }${pswd?'&pswd='+pswd:''}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res);
      }
      );

  };
  
  useEffect(() => {
    toast.promise(
      getAttendance("21GCEBAI021"),
      {
        pending: "Downloading your Attendance ...",
        success: "Attendance Updated",
        error: "Some error occured, Retry",
      },
      { toastId: "customId" }
    );
  }, [])
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Deatain || !</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
       Data = {JSON.stringify(data)}
      </main>

    </div>
  )
}