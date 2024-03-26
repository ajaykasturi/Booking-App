interface Props {
  children: React.ReactNode;
  title: string;
}
const Label = ({ children, title }: Props) => {
  return (
    <label className="text-gray-700 text-sm font-bold flex-1">
      {title} {children}
    </label>
  );
};
export default Label;
