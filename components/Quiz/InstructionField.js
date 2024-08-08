import styles from '@/styles/Quiz.module.css';

export default function InstructionField ({ title, children }) {
	return (
		<div className={styles['instructions']}>
			{title && (<p style={{ color: 'var(--red)', fontSize: '35px', textAlign: 'center', margin: '0px' }}> {title} </p>)}
			{children}
		</div>
	);
}