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
          <p className={Styles["para"]}>Date/Time: September 3, 2023, 2:00 PM</p>
          <p>Venue: Raman Auditorium (Main Building)</p>
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
        <div>Aman: 63773 08533</div>
        <div>Soumil: 86975 63554</div>
      </div>
    </div>
    </div>
  );
}
