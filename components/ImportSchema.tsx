import React from "react";
import ManualSchemaEditor from "./ManualSchemaEditor";
import FileUploadSchemaEditor from "./FileUploadSchemaEditor";

type ImportSchemaProps = {
  onClose: () => void;
};

const ImportSchema = ({ onClose }: ImportSchemaProps) => {
  return (
    <div>
      <p className="text-sm text-gray-700">
        Be wary that importing a schema will omit any default values on fields.
      </p>
      <ManualSchemaEditor onClose={onClose} />
      <FileUploadSchemaEditor onClose={onClose} />
    </div>
  );
};

export default ImportSchema;
