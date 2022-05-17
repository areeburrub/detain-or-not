import Head from 'next/head'
import Image from 'next/image'
import { toast } from 'react-toastify';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
export default function Home() {

  const [data, setData] = useState([])
  const [Adno, setAdno] = useState("21GCEB")
  const [pswd, setPswd] = useState("GCET123")
  const [downloading, setDownloading] = useState(false)

  const getAttendance = async (adno, pswd) => {
    setDownloading(true)
    // Equivalent to `axios.get('https://httpbin.org/get?answer=42')`
    // const res = await Axios.get("http://127.0.0.1:5000/api/", {
    //   params: { adno: adno, pswd: pswd } 
    // });

    // console.log(res.data);
    // setData(res.data);
    await fetch(`https://detain-api.herokuapp.com/attendance?adno=${adno }${pswd?'&pswd='+pswd:''}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res.response);
        setDownloading(false)
      })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!downloading){
      toast.promise(
        getAttendance(Adno),
        {
          pending: "Downloading your Attendance ...",
          success: "Attendance Updated",
          error: "Some error occured, Retry",
        },
        { toastId: "customId" }
      );
    }
  };
  
  useEffect(() => {

  }, [])
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Deatain || !</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <input type="text" placeholder="Enter your admission number" value={Adno} onChange={(e) => {setAdno(e.target.value); setDownloading(false)}} />
          <input type="text" placeholder="Enter your password" value={pswd} onChange={(e)=>{setPswd(e.target.value)}}/>
          <input type="submit" value="Submit" />
        </form>
        {
          data.map((item, index) => {
            return (
              <div key={index} className={styles.attCard}>
                <h1>{item.serial_number}</h1>
                <h2>{item.name}</h2>
                <h2>{item.classes}</h2>
                <h2>{item.percentage}%</h2>
              </div>
            );
          })
        }
      </main>

    </div>
  )
}
