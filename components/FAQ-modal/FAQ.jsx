import { IoIosArrowDown } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useState } from "react";

export default function FAQ({ heading, description }) {
  const [status, setStatus] = useState(false);

  return (
    <div className="FAQs">
      <div className="Qna" onClick={() => setStatus(!status)}>
        <TiTick />
        <p>{heading}</p>
        <IoIosArrowDown />
      </div>
      <div className={`Ans ${status ? 'open' : ''}`}>
        <p>{description}</p>
      </div>
    </div>
  );
}
