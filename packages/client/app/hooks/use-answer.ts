import { useCallback, useEffect, useState } from "react";
import type { Answer, CreateAnswerParams } from "~/types/answer";
import { postRequest, serverFetch } from "~/utils/fetch";

export function useAnswers(questionId?: string) {
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// 回答投稿2
	const postAnswer = useCallback(
		async (params: CreateAnswerParams): Promise<Answer> => {
			if (!questionId) {
				throw new Error("Question ID is required to post an answer.");
			}
			// postRequest を直接利用
			return await postRequest<Answer>(
				`/questions/${questionId}/answers`,
				params,
			);
		},
		[questionId],
	);

	// 回答取得
	const fetchAnswers = useCallback(async () => {
		if (!questionId) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await serverFetch(`/questions/${questionId}/answers`);
			if (!res.ok) throw new Error("Failed to fetch answers");
			setAnswers(await res.json());
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err : new Error("Unknown error"));
		} finally {
			setIsLoading(false);
		}
	}, [questionId]);

	// 回答投稿1+再取得
	const submitAnswer = useCallback(
		async (content: string) => {
			if (!questionId || !content.trim()) return;
			setIsPending(true);
			setError(null);

			try {
				await postAnswer({ content });
				await fetchAnswers();
			} catch (err) {
				console.error(err);
				setError(err instanceof Error ? err : new Error("Unknown error"));
			} finally {
				setIsPending(false);
			}
		},
		[questionId, fetchAnswers, postAnswer],
	);

	// 初期ロード
	useEffect(() => {
		fetchAnswers();
	}, [fetchAnswers]);

	return {
		answers,
		isLoading,
		error,
		isPending,
		submitAnswer,
		refetch: fetchAnswers,
	};
}
