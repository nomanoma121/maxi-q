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
						padding: "12px 24px",
						backgroundColor: "blue.500",
						color: "white",
						borderRadius: "8px",
						cursor: "pointer",
						fontWeight: "bold",
					})}
				>
					再読み込み
				</button>
			)}
		</div>
	);
}
