interface IDescription {
  title: string;
  valeu: string;
  className?: string;
}
export const Description: React.FC<IDescription> = ({
  title,
  valeu,
  className,
}) => {
  return (
    <div className={`border rounded-sm p-4  ${className} `}>
      <span className="text-foreground/60">{title}:</span>
      {" " + valeu}
    </div>
  );
};
