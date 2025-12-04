import type { CreateQuestionParams } from "~/types/question";
import { usePost } from "~/utils/post";

export function usePostQuestion() {
	const { post } = usePost();

	const postQuestion = async (params: CreateQuestionParams) => {
		return await post("/questions", params);
	};

	return { postQuestion };
}
