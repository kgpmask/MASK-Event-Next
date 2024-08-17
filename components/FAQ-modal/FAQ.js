import { IoIosArrowDown } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import Styles from '@/styles/FAQ.module.css';

export default function FAQ({ heading, description, expanded, onClick }) {
	return (
		<div className={Styles['FAQs']}>
			<div className={Styles['Qna']} onClick={onClick}>
				<TiTick style={{ marginRight: '10px' }} />
				<p>{heading}</p>
				<IoIosArrowDown style={{ transform: expanded ? 'rotate(-180deg)' : 'rotate(0deg)', transition: 'all 0.5s ease' }} />
			</div>
			<div className={expanded ? Styles['Ans'] + ' ' + Styles['open'] : Styles['Ans']}>
				<p>{description}</p>
			</div>
		</div>
	);
}
