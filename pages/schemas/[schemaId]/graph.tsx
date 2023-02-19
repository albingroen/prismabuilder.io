import Models from "../../../components/Models";
import SchemaGraph from "../../../components/SchemaGraph";

const GraphPage = () => {
  return (
    <>
      <Models />

      <div className="flex-1">
        <SchemaGraph />
      </div>
    </>
  );
};

export default GraphPage;
