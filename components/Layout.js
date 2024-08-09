import Navbar from "@/components/Base/Navbar";
import Footer from "@/components/Base/Footer";
import Styles from "@/styles/Layout.module.css";

export default function Home({ children }) {
	return (
		<>
			<Navbar />
			<main className={Styles["container"]}>
				<div id="content-wrap">
					{children}
				</div>
			</main>
			<Footer />
		</>
	);
}