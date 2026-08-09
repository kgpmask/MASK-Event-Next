import ErrorPage from "@/pages/_error";

/**
 * NotFoundPage that renders the custom 404 error page.
 * @returns {JSX.Element} The 404 page markup.
 */
export default function NotFoundPage() {
	return <ErrorPage statusCode={404} />;
}
