import { IoIosArrowDown } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import { useState } from 'react';
import Styles from '@/styles/FAQ.module.css';

export default function FAQ({ heading, description }) {
	const [status, setStatus] = useState(false);

	return (
		<div className={Styles['FAQs']}>
			<div className={Styles['Qna']} onClick={() => setStatus(!status)}>
				<TiTick style={{ marginRight: '10px' }} />
				<p>{heading}</p>
				<IoIosArrowDown style={{ transform: !status ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.5s ease' }} />
			</div>
			<div className={status ? Styles['Ans'] + ' ' + Styles['open'] : Styles['Ans']}>
				<p>{description}</p>
			</div>
		</div>
	);
}
