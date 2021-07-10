const BreadCrumb: React.FC<any> = ({to,dbName}) => {
  return (
    <>
      <div className="flex flex-row text-white">
        <a className="hover:text-purple-600" href={`/${to}`}>
          Home
        </a>
        <p>&nbsp;/&nbsp;{dbName}</p>
      </div>
    </>
  );
};

export default BreadCrumb;
