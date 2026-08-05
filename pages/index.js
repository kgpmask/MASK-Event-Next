import Head from "next/head";
import { TextArea } from "@/components/Base/TextArea";
import { EventInfo } from "@/components/FAQ-modal/EventInfo";

/**
 * Home page that renders the event information section with FAQs.
 * @returns {JSX.Element} The home page markup.
 */
export default function Home() {
	return (
		<>
			<Head>
				<title>OCAQ 26</title>
				<meta
					name="description"
					content="This site is made by the WebD Team of MASK with love"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<TextArea>
				<EventInfo />
			</TextArea>
		</>
	);
}
