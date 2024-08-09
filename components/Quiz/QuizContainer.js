import Styles from '@/styles/Quiz.module.css';
import OptionContainer from './OptionContainer';
import TextInput from './TextInput';
import React from 'react';
import Timer from './Timer';
import WaitingMessage from './WaitingMessage';

export default function QuizContainer({ question, round, time, submitAnswer }) {
	const [selected, setSelected] = React.useState();
	const [answer, setAnswer] = React.useState('');

	const submitHandler = () => {
		return submitAnswer(answer);
	};

	return (
		<div className={Styles['container']}>
			<div className={Styles['card']}>
				{/* <WaitingMessage /> */}
				<div className={Styles['header']}>
					<div className={Styles['info']}>
						<p className={Styles['round-no']}>Round {round}</p>
						<p className={Styles['round-name']}>Shiri Masu Ka?</p>
						<p className={Styles['question-no']}>Question {question.questionNo}</p>
					</div>
					<Timer time={time} onTimeEnd={submitHandler} />
				</div>
				<div className={Styles['content']}>
					<p className={Styles['question-text']}>{question.question}</p>
					{question.type === 'mcq' ? <OptionContainer selected={selected} setSelected={setSelected} options={['Option A', 'Option B', 'Option C', 'Option D']} /> : <TextInput text={answer} setText={setAnswer} />}
				</div>
				<button className={Styles['submit-btn']} onClick={submitHandler}>Submit</button>
			</div>
		</div>
	);
}
