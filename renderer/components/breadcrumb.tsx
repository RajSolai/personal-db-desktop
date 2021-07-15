import { useRouter } from "next/router";

const BreadCrumb: React.FC<any> = ({ to, dbName }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-row text-white">
        <p className="hover:text-purple-600" onClick={() => router.back()}>
          Home
        </p>
        <p>&nbsp;/&nbsp;{dbName}</p>
      </div>
    </>
  );
};

export default BreadCrumb;
