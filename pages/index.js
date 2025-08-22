import Head from "next/head";
import Styles from "@/styles/Home.module.css";
import MainBody from "../components/MainBody";
import TextArea from "@/components/Base/TextArea";
import Profile from "@/pages/profile";
import EventInfo from "@/components/FAQ-modal/EventInfo";

export default function Home() {
	return (
		<>
			<Head>
				<title>OCAQ 25</title>
				<meta name="description" content="This site is made by the WebD Team of MASK with love" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<meta name="darkreader-lock" />
			</Head>
      		<TextArea>
				<EventInfo />
      		</TextArea>
		</>
	);
}
