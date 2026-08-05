import "@/styles/globals.css";
import { Layout } from "@/components/Layout.js";

/**
 * App component that wraps every page with the global layout.
 * @param {object} props - The component props.
 * @param {object} props.Component - The active page component.
 * @param {object} props.pageProps - The props passed to the active page component.
 * @returns {JSX.Element} The wrapped page markup.
 */
export default function App({ Component, pageProps }) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}
