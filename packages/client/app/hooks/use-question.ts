import { useCallback } from "react";
import type { CreateQuestionParams } from "~/types/question";
import { serverFetch } from "~/utils/fetch";

export function usePostQuestion() {
	const postQuestion = useCallback(
		async (params: CreateQuestionParams): Promise<boolean> => {
			const res = await serverFetch("/questions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(params),
			});

			if (!res.ok) return false;

			return true;
		},
		[],
	);

	return { postQuestion };
}
