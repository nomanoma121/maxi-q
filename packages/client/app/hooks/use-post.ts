import { useCallback } from "react";
import { serverFetch } from "~/utils/fetch";

// 任意のエンドポイントに POST する汎用フック
// 戻り値は { ok: boolean, data: any | null }

export function usePost() {
	const post = useCallback(
		async <T = any>(
			url: string,
			body: object,
		): Promise<{ ok: boolean; data: T | null }> => {
			try {
				const res = await serverFetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});

				if (!res.ok) return { ok: false, data: null };

				const data = (await res.json()) as T;
				return { ok: true, data };
			} catch (err) {
				console.error(err);
				return { ok: false, data: null };
			}
		},
		[],
	);

	return { post };
}
