import { useState } from "react";

// POST専用のフック
// 使い方：const { post, loading, error } = usePost();

export function usePost() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function post(url: string, body: object) {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			// サーバーがエラーを返したとき
			if (!res.ok) {
				setError(`POST failed: ${res.status}`);
				return null;
			}

			// JSON を返す前提
			const data = await res.json();
			return data;
		} catch (err) {
			setError("ネットワークエラーが発生しました");
			return null;
		} finally {
			setLoading(false);
		}
	}

	return { post, loading, error };
}
