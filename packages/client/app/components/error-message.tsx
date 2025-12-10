import { css } from "styled-system/css";

interface ErrorMessageProps {
	message: string;
	onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
	return (
		<div
			className={css({
				maxWidth: "800px",
				margin: "0 auto",
				padding: "16px",
				textAlign: "center",
			})}
		>
			<p
				className={css({
					color: "red",
					fontSize: "18px",
					marginBottom: "16px",
				})}
			>
				{message}
			</p>

			{onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className={css({
						marginTop: "1rem",
						padding: "0.5rem 1rem",
						borderRadius: "0.5rem",
						backgroundColor: "gray.200",
					})}
				>
					再読み込み
				</button>
			)}
		</div>
	);
}
