import FAQ from "./FAQ";
import FAQs from "./FAQs.json";
import Styles from '@/styles/FAQ.module.css'
import { useRouter } from "next/router";

export default function EventInfo() {
  const router = useRouter();
  return (
    <div className={Styles["body-container"]} >
    <div className={Styles["Event_info"]}>
      <div className={Styles["Top_header"]}>
        <div>
          <h1>Event Information</h1>
          <p className={Styles["para"]}>Date/Time: 18th August, 2024, 2:30 PM</p>
          <p>Venue: V3, Vikramshila</p>
        </div>
        <button onClick={() => router.push('/live')}>Quiz Portal</button>
      </div>

      <div className={Styles["FAQ"]}>
        {FAQs.map((value, i) => (
          <FAQ key={i} heading={value.heading} description={value.description} />
        ))}
      </div>

      <div className={Styles["contact-info"]}>
        <p>More Questions? Contact us:</p>
        <div>Manideep: 96037 15582</div>
        <div>Nayandeep: 81309 70929</div>
      </div>
    </div>
    </div>
  );
}
