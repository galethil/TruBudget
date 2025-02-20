import React, { useRef, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

const OverflowTooltip = ({ text = "", maxWidth = "140px" }) => {
  const textElementRef = useRef();
  const [isOverflowed, setIsOverflowed] = useState(false);

  const compareSize = () => {
    setIsOverflowed(textElementRef.current.scrollWidth > textElementRef.current.clientWidth);
  };

  // compare once and add resize listener
  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);
    return () => {
      window.removeEventListener("resize", compareSize);
    };
  }, []);

  return (
    <Tooltip data-test="overflow-tooltip" title={text} disableHoverListener={!isOverflowed}>
      <div
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: maxWidth
        }}
      >
        {text}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
