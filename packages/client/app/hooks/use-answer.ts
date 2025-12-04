import type { CreateAnswerParams } from "~/types/answer";
import { usePost } from "~/utils/post";

export function usePostAnswer() {
	const { post } = usePost();

	const postAnswer = async (questionId: string, params: CreateAnswerParams) => {
		return await post(`/questions/${questionId}/answers`, params);
	};

	return { postAnswer };
}
