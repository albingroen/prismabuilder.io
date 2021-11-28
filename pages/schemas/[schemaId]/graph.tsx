import Models from "../../../components/Models";
import SchemaGraph from "../../../components/SchemaGraph";

const GraphPage = () => {
  return (
    <div className="flex">
      <Models />

      <div className="flex-1 bg-gray-100 h-screen">
        <SchemaGraph />
      </div>
    </div>
  );
};

export default GraphPage;
