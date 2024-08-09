import Styles from '@/styles/Quiz.module.css'

export default function Option({ text, selected, onClick }) {
	return (
		<button onClick={onClick} className={selected ? Styles['option-button'] + ' ' + Styles['selected'] : Styles['option-button']}>
			<span className={Styles['option-numbering']}>A</span>
			{text}
		</button>
	)
}
