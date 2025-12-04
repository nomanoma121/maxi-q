import { usePost } from "~/hooks/use-post";
import type { CreateAnswerParams } from "~/types/answer";

export function usePostAnswer() {
	const { post } = usePost();

	const postAnswer = async (params: CreateAnswerParams) => {
		return await post("/answers", params);
	};

	return { postAnswer };
}
