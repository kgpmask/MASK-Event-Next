import Styles from '@/styles/Quiz.module.css'

export default function TextInput({ text, setText }) {
	return (
		<input className={Styles['text-input']} type="text" placeholder="Type you answer here..." />
	)
}
