type Prop = {
  err: string | undefined;
};
const ErrorLabel = ({ err }: Prop) => {
  return <span className="text-red-500">{err}</span>;
};

export default ErrorLabel;
