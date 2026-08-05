import { Navbar } from "@/components/Base/Navbar.js";
import { Footer } from "@/components/Base/Footer.js";
import Styles from "@/styles/Layout.module.css";
import { useRouter } from "next/router";

/**
 * Layout component that wraps page content with the site background, navbar and footer.
 * @param {object} props - The component props.
 * @param {JSX.Element} props.children - The page content to render inside the layout.
 * @returns {JSX.Element} The layout markup.
 */
export function Layout({ children }) {
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
