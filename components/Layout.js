import Navbar from "@/components/Base/Navbar.js";
import Footer from "@/components/Base/Footer.js";
import Styles from "@/styles/Layout.module.css";
import { useRouter } from "next/router";

export default function Home({ children }) {
	const router = useRouter();
	const live = router.pathname.startsWith("/live");
	if (live) {
		return (
			<>
				<div className={Styles["background"]}></div>
				<div className={Styles["flex-container-live"]}>
					<Navbar />
					<main className={Styles["container"]}>
						<div id="content-wrap">{children}</div>
					</main>
				</div>
			</>
		);
	} else {
		return (
			<>
				<div className={Styles["background"]}></div>
				<div className={Styles["flex-container"]}>
					<Navbar />
					<main className={Styles["container"]}>
						<div id="content-wrap">{children}</div>
					</main>
					<Footer />
				</div>
			</>
		);
	}
}
