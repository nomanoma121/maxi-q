import { useState } from "react";
import { useNavigate } from "react-router";
import { css } from "styled-system/css";
import { postRequest } from "../utils/fetch";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const data = await postRequest<{ token: string }>("/login", {
				email,
				password,
			});
			localStorage.setItem("token", data.token);

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

	return (
		<div
			className={css({
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				bg: "gray.100",
			})}
		>
			<div
				className={css({
					p: "8",
					bg: "white",
					rounded: "md",
					shadow: "lg",
					width: "100%",
					maxWidth: "400px",
				})}
			>
				<h1
					className={css({
						textAlign: "center",
						mb: "6",
						fontSize: "2xl",
						fontWeight: "bold",
						color: "gray.800",
					})}
				>
					ログイン
				</h1>

				<form
					onSubmit={handleLogin}
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "5",
					})}
				>
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "2",
						})}
					>
						<label
							htmlFor="email"
							className={css({
								fontSize: "sm",
								fontWeight: "medium",
								color: "gray.700",
							})}
						>
							メールアドレス
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="user@example.com"
							className={css({
								px: "4",
								py: "2",
								rounded: "md",
								borderWidth: "1px",
								borderColor: "gray.300",
								fontSize: "md",
								outline: "none",
								transition: "all 0.2s",
								_focus: {
									borderColor: "blue.500",
									ring: "2px",
									ringColor: "blue.200",
								},
							})}
						/>
					</div>

					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "2",
						})}
					>
						<label
							htmlFor="password"
							className={css({
								fontSize: "sm",
								fontWeight: "medium",
								color: "gray.700",
							})}
						>
							パスワード
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="8文字以上"
							className={css({
								px: "4",
								py: "2",
								rounded: "md",
								borderWidth: "1px",
								borderColor: "gray.300",
								fontSize: "md",
								outline: "none",
								transition: "all 0.2s",
								_focus: {
									borderColor: "blue.500",
									ring: "2px",
									ringColor: "blue.200",
								},
							})}
						/>
					</div>

					{error && (
						<p
							className={css({
								color: "red.500",
								fontSize: "sm",
								textAlign: "center",
								fontWeight: "medium",
							})}
						>
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className={css({
							mt: "2",
							py: "3",
							bg: "blue.600",
							color: "white",
							fontWeight: "bold",
							rounded: "md",
							cursor: "pointer",
							transition: "background-color 0.2s",
							_hover: {
								bg: "blue.700",
							},
							_disabled: {
								opacity: 0.7,
								cursor: "not-allowed",
							},
						})}
					>
						{isLoading ? "ログイン中..." : "ログイン"}
					</button>
				</form>
			</div>
		</div>
	);
}
