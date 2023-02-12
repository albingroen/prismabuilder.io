import React, { useState } from "react";
import ManualSchemaEditor from "./ManualSchemaEditor";
import FileUploadSchemaEditor from "./FileUploadSchemaEditor";
import { Button, Icon } from "@prisma/lens";
import SchemaInfoTooltip from "./SchemaInfoTooltip";

type ImportSchemaProps = {
  onClose: () => void;
};

const ImportSchema = ({ onClose }: ImportSchemaProps) => {
  const [schemaSource, setSchemaSource] = useState("manual");

  return (
    <div>
      <p className="text-sm px-14 text-center text-gray-600">
        Import your schema by typing or pasting your schema directly into the
        editor provided or use the file upload option to browse your local file
        system and select the file to import, if you have the schema saved as a
        file.
      </p>

      <div className="py-6 px-20 flex flex-row content-center justify-center gap-4">
        <Button
          fillParent={true}
          onPress={() => setSchemaSource("manual")}
          variant={schemaSource === "manual" ? "primary" : "secondary"}
        >
          Manual Editor
        </Button>
        <Button
          fillParent={true}
          onPress={() => setSchemaSource("fileUpload")}
          variant={schemaSource === "fileUpload" ? "primary" : "secondary"}
        >
          File Upload
        </Button>
      </div>
      <SchemaInfoTooltip>
        <Icon name={"info"} className="text-gray-600" />
      </SchemaInfoTooltip>
      {schemaSource === "manual" && <ManualSchemaEditor onClose={onClose} />}
      {schemaSource === "fileUpload" && (
        <FileUploadSchemaEditor onClose={onClose} />
      )}
    </div>
  );
};

export default ImportSchema;
