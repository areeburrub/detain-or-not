import Head from 'next/head'
import Image from 'next/image'
import { toast } from 'react-toastify';
import styles from '../styles/Home.module.css'
import { useEffect, useState, useReducer } from 'react'
import RickRoll from '../src/components/rickroll';
import Navbar from '../src/components/navbar/navbar';
import Footer from '../src/components/footer/footer';
import ProgressBar from "@ramonak/react-progress-bar";


export default function Home() {

  const [data, setData] = useState([])
  const [metadata, setMetadata] = useState({})
  const [attData, setAttData] = useState({})
  
  const [admissionNumber, setadmissionNumber] = useState("21GCEB")
  const [pswd, setpswd] = useState("GCET123")
  const [downloading, setDownloading] = useState(false)
  const [loggedin, setLoggedin] = useState(false)
  const [formOpen, setFormOpen] = useState(true)

  const [percenReq, setPercenReq] = useState(75)

  const [ExtraDays, setExtraDays] = useState(0)
  const [Leaves, setLeaves] = useState(0)


  const [logins, setLogins] = useState([]);

  const [loginBorderColor, setLoginBorderColor] = useState("#000")

  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem("logins");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      localStorage.setItem("logins", JSON.stringify(logins));
    }, [logins]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setLoggedin(false);
      setLogins(localData ? JSON.parse(localData) : []);
    }, []);
  }

  const AddtoLocalStorage = () => {
    //add details to login array if it doesn't exist
    if (logins.findIndex((x) => x.admissionNumber == admissionNumber) == -1) {
      setLogins([...logins, { admissionNumber: admissionNumber, pswd: pswd }]);
    } else if (logins.findIndex((x) => x.admissionNumber == admissionNumber) != -1) {
      //update details if it exists
      setLogins(
        logins.map((x) => (x.admissionNumber == admissionNumber ? { admissionNumber: admissionNumber, pswd: pswd } : x))
      );
    }
  }
  const getAttendance = async (admissionNumber, pswd) => {
    setDownloading(true);
    console.log(admissionNumber, pswd);

    //api adapted from https://github.com/imprakharshukla/attendance_monitor
    await fetch(`https://detain-api.herokuapp.com/attendance?adno=${admissionNumber}${pswd ? "&pswd=" + pswd : ""}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        HandelResponse(res.response);
        setDownloading(false);
        setLoggedin(true);
        setLoginBorderColor("#27b018");
        setFormOpen(false);
        AddtoLocalStorage();
      })
      .catch((err) => {
        setDownloading(false);
        setLoggedin(false);
        setLoginBorderColor("red");
        throw err;
      });
  };

  const HandelResponse = (data) => {
    const Response = data;
    //trim last 2 elements from the response
    const ClassesData = Response.slice(0, -2);
    setData(ClassesData);

    //last element is metadata
    const Metadata = Response[Response.length - 1].metadata;
    setMetadata({name: Metadata.name[0],Image: Metadata.dp});
    
    //second last element is attendance data
    const AttData = Response[Response.length - 2];
    setAttData(AttData);

  }


  // for recently logged in
  const initLogin = (item) => {
    console.log(item)
    setadmissionNumber(item.admissionNumber)
    setpswd(item.pswd)
    console.log(downloading)
    if(!downloading){
      setLoginBorderColor("#000");
      toast.promise(
        getAttendance(item.admissionNumber,item.pswd),
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
          initLogin({ admissionNumber, pswd });
        }
  };
  
  const [Total, setTotal] = useState(0)
  const [Total_present, setTotal_present] = useState(0)
  
  useEffect(() => {
    if(data.length > 0){
      const tot = attData.total_classes;
      //use as delimiter and seperate 2 digits oftotal classes
      const total = tot.split("/")[1];
      const present = tot.split("/")[0];
      setTotal(parseInt(total))
      setTotal_present(parseInt(present))
    }  
  }, [attData])
 

  return (
    <div className={styles.container}>
      <Head>
        <title>Deatain || !</title>
        <meta
          name="description"
          content="Analyse your Attendance instantly from Galgotias ERP"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Navbar />
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className={styles.form}
          style={{ border:`${loginBorderColor} solid 5px`}}
        >
          {
            loggedin &&(
            <>
            <div className={styles.profileCard}>
              <img src={metadata.Image} alt="profile" className={styles.img} />
              {metadata.name}
            </div>
            <button type="button" onClick={(e)=>{ setFormOpen(!formOpen);}}>{formOpen?"close":"login another"}</button>
            </>
            )
          }
          {
            formOpen && (
              <>
              <lable>Admission ID</lable>
              <input
              type="text"
              placeholder="Enter your admission number"
              value={admissionNumber}
              onChange={(e) => {
                setadmissionNumber(e.target.value);
                setDownloading(false);
              }}
            />
            <lable>ERP Password</lable>
            <input
              type="text"
              placeholder="Enter your password"
              value={pswd}
              onChange={(e) => {
                setpswd(e.target.value);
              }}
              />
              <input type="submit" value="Submit" />
              </>
            )}
          </form>

        {!loggedin && logins.length>0 && (
          <div className={styles.logins}>
            <h1>Recently used</h1>
            {logins.map((item, index) => {
              return (
                <div key={index} className={styles.loginCard}>
                  <h2>{item.admissionNumber}</h2>
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

            {
              loggedin && (
                <>
        <div className={styles.attCard}>
          <h1>Your attendance is {parseFloat((Total_present / Total)*100).toFixed(2)}%</h1>
          <ProgressBar completed={parseFloat((Total_present / Total)*100).toFixed(2)} />
          <h1></h1>
        </div>

        <div className={styles.attCard}>
          <h2>
            You have attended{" "}
            <span style={{ color: "red" }}>{Total_present}</span> classes
            out of <span style={{ color: "green" }}>{Total}</span>
          </h2>
          <h2>
            if you miss <span style={{ color: "orange" }}>{ExtraDays}</span>{" "}
            classes and take sanctioned leave for{" "}
            <span style={{ color: "lightgreen" }}>{Leaves}</span> classes
          </h2>
          <h2>
            then you have to attend{" "}
            <span style={{ color: "blue" }}>
              {

                //(PercentRequired(Missed+TotalClasses)-100(Leaves+Attended))/(100-PercetRequired)
                parseInt(((percenReq*(ExtraDays+Total))-(100*(Leaves+Total_present)))/(100-percenReq))

              }
            </span>{" "}
            more classes
            {/* {3 * (parseInt(Total)+parseInt(ExtraDays)) - 4 * (parseInt(Total_present)+parseInt(Leaves))}</span> more classes */}
          </h2>
          <h2>to get above {percenReq}</h2>
        </div>
        <RickRoll />
        <div className={styles.attCard}>
          <div className={styles.control}>
            <h4>Enter number of classes you are planning to miss</h4>
            <input
              
              type="number"
              value={ExtraDays}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setExtraDays(parseInt(e.target.value));
                }
              }}
            />
          </div>
          <div className={styles.control}>
            <h4>
              Enter number of classes for which you will get your attendace
              marked
            </h4>
            <input
              
              type="number"
              value={Leaves}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setLeaves(parseInt(e.target.value));
                }
                if (
                  parseInt(
                    3 * (Total + ExtraDays) -
                      4 * (Total_present + Leaves)
                  ) <= 0
                ) {
                  setLeaves(Leaves - 1);
                }
              }}
            />
          </div>

          <div className={styles.control}>
            <h4>Enter target percentage</h4>
            <input
              type="number"
              value={percenReq}
              onChange={(e) => {
                if (e.target.value >= 0 && e.target.value <= 100) {
                  setPercenReq(e.target.value);
                }
              }}
              />
          </div>
        </div>
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
        </>)
    }
        <Footer />
      </main>
    </div>
  );
}
