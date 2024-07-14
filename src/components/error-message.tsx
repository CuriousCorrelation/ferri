interface ErrorMessageProps {
    error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
    <div className="mb-4 p-2 bg-red-100 text-red-800 shadow">{error}</div>
);

export default ErrorMessage;
