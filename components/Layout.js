import Navbar from "@/components/Base/Navbar.js";
import Footer from "@/components/Base/Footer.js";
import Styles from "@/styles/Layout.module.css";

export default function Home({ children }) {
	return (
		<>
			<div className={Styles["background"]}></div>
			<div className={Styles["flex-container"]}>
				<Navbar />
				<main className={Styles["container"]}>
					<div id="content-wrap">
						{children}
					</div>
				</main>
				<Footer />
			</div>
		</>
	);
}
