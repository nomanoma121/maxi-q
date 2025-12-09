import { useEffect, useState } from "react";
import { serverFetch } from "~/utils/fetch";

export function useMe() {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			setLoading(false);
			return;
		}

		serverFetch("/auth/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Unauthorized");
				}
				return res.json();
			})
			.then((data) => {
				setUser(data);
			})
			.catch(() => {
				setUser(null);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { user, loading };
}
