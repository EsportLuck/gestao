interface IDescription {
  title: string;
  valeu: string;
}
export const Description: React.FC<IDescription> = ({ title, valeu }) => {
  return (
    <div className="border rounded-sm p-4">
      <span className="text-foreground/60">{title}:</span>
      {" " + valeu}
    </div>
  );
};
