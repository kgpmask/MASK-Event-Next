import Link from "next/link";
import InstructionField from "./InstructionField";

export default function LiveInstructions ({ buttonCallback }) {
	return (<InstructionField title={ 'Open Campus Anime Quiz - 2024' }>
		<button className='light' onClick={buttonCallback}> Start Quiz </button>
	</InstructionField>);
}