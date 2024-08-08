import React from "react";
import Styles from '@/styles/Base.module.css'

const TextArea = ({ title, children }) => (
	<div className={Styles['text-container']}>
		<div className={Styles["card"]}>
			<h2 style={{ marginBottom: '10px', color: 'white' }}>{title}</h2>
			{children}
		</div>
	</div>
)

export default TextArea