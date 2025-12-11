import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";

// TODO ログインしていなくてリダイレクトされたときにUIエラーを出す。

export default function ProtectedLayout() {
	const { user, isLoading, error } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !user) {
			navigate("/login");
		}
	}, [isLoading, user, navigate]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<div style={{ padding: "20px", color: "red" }}>
				<h2>エラーが発生しました</h2>
				<p>{error.message}</p>
			</div>
		);
	}

	if (user) {
		return <Outlet />;
	}

	return null;
}
