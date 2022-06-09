import Head from 'next/head'
import Image from 'next/image'
import { toast } from 'react-toastify';
import styles from '../styles/Home.module.css'
import { useEffect, useState, useReducer } from 'react'
export default function Home() {

  const [data, setData] = useState([])
  const [Adno, setAdno] = useState("21GCEB")
  const [pswd, setPswd] = useState("GCET123")
  const [downloading, setDownloading] = useState(false)
  const [loggedin, setLoggedin] = useState(false)
  
  const [ExtraDays, setExtraDays] = useState(0)
  const [Leaves, setLeaves] = useState(0)


  const [logins, setLogins] = useState([]);
  if (typeof window !== 'undefined') {
  const localData = localStorage.getItem("logins");


  useEffect(() => {
    localStorage.setItem('logins', JSON.stringify(logins));
  }, [logins]);

  useEffect(()=>{
    setLoggedin(false)
    setLogins(localData ? JSON.parse(localData) : [])
  },[])
  
}
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
        setLoggedin(true)
      })
  };

  const initLogin = (item) => {
    console.log(item)
    setAdno(item.Adno)
    setPswd(item.Pswd)
    console.log(downloading)
    if(!downloading){
      toast.promise(
        getAttendance(item.Adno,item.Pswd),
        {
          pending: "Downloading your Attendance ...",
          success: "Attendance Updated",
          error: "Some error occured, Retry",
        },
        { toastId: "customId" }
      );
  }
}

  const handleSubmit = (e) => {
    e.preventDefault();
        if (!downloading) {
          toast.promise(
            getAttendance(Adno, pswd),
            {
              pending: "Downloading your Attendance ...",
              success: "Attendance Updated",
              error: "Some error occured, Retry",
            },
            { toastId: "customId" }
          );
          //add details to login array if it doesn't exist
          if (logins.findIndex((x) => x.Adno == Adno) == -1) {
            setLogins([...logins, { Adno: Adno, Pswd: pswd }]);
          } else if (logins.findIndex((x) => x.Adno == Adno) != -1) {
            //update details if it exists
            setLogins(
              logins.map((x) =>
                x.Adno == Adno ? { Adno: Adno, Pswd: pswd } : x
              )
            );
          }
        }
  };
  
  const [Total, setTotal] = useState(0)
  const [Total_present, setTotal_present] = useState(0)
  
  useEffect(() => {
    if(data.length > 0){
      const tot = data[data.length - 2].total_classes;
      //use as delimiter and seperate 2 digits oftotal classes
      const total = tot.split("/")[1];
      const present = tot.split("/")[0];
      setTotal(total)
      setTotal_present(present)
    }  
  }, [data])
 

  return (
    <div className={styles.container}>
      <Head>
        <title>Deatain || !</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className={styles.form}
        >
          <input
            type="text"
            placeholder="Enter your admission number"
            value={Adno}
            onChange={(e) => {
              setAdno(e.target.value);
              setDownloading(false);
            }}
          />
          <input
            type="text"
            placeholder="Enter your password"
            value={pswd}
            onChange={(e) => {
              setPswd(e.target.value);
            }}
          />
          <input type="submit" value="Submit" />
        </form>

        {!loggedin && (
          <div className={styles.logins}>
            <h1>Recently used</h1>
            {logins.map((item, index) => {
              return (
                <div key={index} className={styles.loginCard}>
                  <h2>{item.Adno}</h2>
                  <button
                    onClick={() => {
                      initLogin(item);
                    }}
                  >
                    Login
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {(Total_present / Total) * 100 < 75 && (
          <>
            <div className={styles.attCard}>
              <h2>
                You have attended <span style={{color:"red"}}>{Total_present}</span> classes out of <span style={{color:"green"}}>{Total}</span> 
              </h2>
              <h2>
                if you miss <span style={{color:"orange"}}>{ExtraDays}</span>  classes and take sanctioned leave for  <span style={{color:"lightgreen"}}>{Leaves}</span> classes
              </h2>
              <h2>
                then have to attend <span style={{color:"blue"}}>
                {3 * (parseInt(Total)+parseInt(ExtraDays)) - 4 * (parseInt(Total_present)+parseInt(Leaves))}</span> more classes
              </h2>
              <h2>to get above 75%</h2>
            </div>
            <div className={styles.attCard}>
              <div className={styles.control}>
                <h4>Enter number of classes you are planning to miss</h4>
                <input type="number" value={ExtraDays} onChange={(e) => {
                  if(e.target.value>=0){
                    setExtraDays(e.target.value)
                  }
                  }} />
              </div>
              <div className={styles.control}>
                <h4>Enter number of classes for which you will get you attendace marked</h4>
                <input type="number" value={Leaves} onChange={(e) => {
                  if(e.target.value>=0){
                    setLeaves(e.target.value)
                  }
                  }} />
              </div>
            </div>
          </>
        )}
        {data.map((item, index) => {
          return (
            <div key={index} className={styles.attCard}>
              <h2>{item.name}</h2>
              <h2>{item.classes}</h2>
              <h2>{item.total_classes}</h2>
              <h2>{item.percentage}%</h2>
            </div>
          );
        })}
      </main>
    </div>
  );
}
