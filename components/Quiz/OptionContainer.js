import Styles from '@/styles/Quiz.module.css'
import Option from './Option'

export default function OptionContainer({ options, selected, setSelected }) {
	return (
		<div className={Styles["options"]} >
			{options.map((i, e) => <Option key={e} text={i} selected={selected === i} onClick={() => setSelected(i)}/>)}
		</div >
	)
}
