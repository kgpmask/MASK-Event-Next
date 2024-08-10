import FAQ from "./FAQ";
import FAQs from "./FAQs.json";

export default function Eventinfo() {
  return (
    <div className="Event_info">
      <div className="Top_header">
        <div>
          <h1>Event Information</h1>
          <p>Date/Time: September 3, 2023, 2:00 PM</p>
          <p>Venue: Raman Auditorium (Main Building)</p>
        </div>
        <button>Quiz Portal</button>
      </div>

      <div className="FAQ">
        {FAQs.map((value, i) => (
          <FAQ key={i} heading={value.heading} description={value.description} />
        ))}
      </div>

      <div className="contact-info">
        <p>More Questions? Contact us:</p>
        <div>Aman: 63773 08533</div>
        <div>Soumil: 86975 63554</div>
      </div>
    </div>
  );
}
