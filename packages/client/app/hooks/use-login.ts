import { useState } from "react";
import { useNavigate } from "react-router";
import { postRequest } from "~/utils/fetch";

export const useLogin = () => {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const login = async (email: string, password: string) => {
		setError("");
		setIsLoading(true);

		try {
			const data = await postRequest<{ token: string }>("/login", {
				email,
				password,
			});

			// トークン保存
			localStorage.setItem("token", data.token);

			// 画面遷移
			navigate("/questions");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("予期せぬエラーが発生しました");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return { login, error, isLoading };
};
