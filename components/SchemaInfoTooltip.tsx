import React, { ReactNode, useRef, useState } from "react";
import { Tooltip } from "@prisma/lens";

type SchemaInfoTooltipProps = {
  children: ReactNode;
};

const SchemaInfoTooltip = ({ children }: SchemaInfoTooltipProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [delayTooltipPhaseout, setDelayTooltipPhaseout] = useState<ReturnType<
    typeof window.setTimeout
  > | null>(null);

  const handleMouseOver = () => {
    clearTimeout(delayTooltipPhaseout as unknown as number);
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setDelayTooltipPhaseout(
      setTimeout(() => {
        setIsHovering(false);
      }, 400)
    );
  };

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={ref}
        className="w-5"
      >
        {children}
      </div>

      {isHovering && (
        <Tooltip target={ref} position="right">
          Be wary that importing a schema will omit any default values on
          fields.
        </Tooltip>
      )}
    </div>
  );
};

export default SchemaInfoTooltip;
