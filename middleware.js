import { NextResponse } from "next/server";

const publicAdminPaths = ["/api/admin/check-admin", "/api/admin/promote-admin"];

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	if (publicAdminPaths.includes(pathname)) {
		return NextResponse.next();
	}

	let isAdmin = false;
	try {
		const checkUrl = new URL("/api/admin/check-admin", request.url);
		const response = await fetch(checkUrl, {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		});
		const data = await response.json();
		isAdmin = Boolean(data.isAdmin);
	} catch (error) {
		console.error("Error checking admin status:", error);
	}

	if (isAdmin) return NextResponse.next();

	if (pathname.startsWith("/api/")) {
		return NextResponse.json(
			{ message: "Forbidden: Admins only" },
			{ status: 403 }
		);
	}

	return NextResponse.redirect(new URL("/404", request.url));
}

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*"],
};
