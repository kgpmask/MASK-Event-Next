import Styles from '@/styles/Quiz.module.css'
import OptionContainer from './OptionContainer'
import TextInput from './TextInput';
import React from 'react'
import Timer from './Timer';

export default function QuizContainer({  }) {
	const [selected, setSelected] = React.useState();

	return (
		<div className={Styles['container']}>
			<div className={Styles["card"]}>
				<div className={Styles["header"]}>
					<div className={Styles["info"]}>
						<p className={Styles["round-no"]}>Round 2</p>
						<p className={Styles["round-name"]}>Shiri Masu Ka?</p>
						<p className={Styles["question-no"]}>Question 1</p>
					</div>
					{/* need to implement timer */}
					<Timer time={15} onTimeEnd={() => console.log("Ended")}/>
				</div>
				<div className={Styles["content"]}>
					<p className={Styles['question-text']}>
						In the anime &quot;Naruto,&quot; what is the name of Naruto&quot;s signature jutsu that creates multiple copies of himself?
					</p>
					<OptionContainer selected={selected} setSelected={setSelected} options={['OPtion A', 'OPtion B', 'OPtion C', 'OPtion D']}/>
					{/* <TextInput /> */}
				</div>
			</div>
		</div>
	)
}
