import type { CreateQuestionParams } from "~/types/question";
import { serverFetch } from "~/utils/fetch";

export default function QuestionsPage() {


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const params: CreateQuestionParams = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
        };

        try {
            const response = await serverFetch("/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) throw new Error("Failed to create question");

            e.currentTarget.reset();
        } catch (error) {
            console.error("Error creating question:", error);
        }
    };

    return (
        <div>
            <h1>質問投稿</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    タイトル:
                    <input name="title" required />
                </label>
                <label>
                    内容:
                    <textarea name="content" required />
                </label>
                <button type="submit">
                    質問を投稿
                </button>
            </form>
        </div>
    );
}
