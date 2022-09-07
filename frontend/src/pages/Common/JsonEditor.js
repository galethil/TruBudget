import React from "react";
import { JSONEditor as VanillaJsonEditor } from "vanilla-jsoneditor";
import { useEffect, useRef, useMemo, useCallback } from "react";

// Component copied from https://codesandbox.io/s/svelte-jsoneditor-react-59wxz
export default function JsonEditor({ data = {}, onChange }) {
  const refContainer = useRef(null);
  const refEditor = useRef(null);

  // VanillaJsonEditor needs this format
  const dataObject = useMemo(() => {
    return {
      json: data
    };
  }, [data]);

  const changeDataCallback = useCallback((rawObject) => onChange(rawObject.json), [onChange]);

  useEffect(() => {
    // create editor
    refEditor.current = new VanillaJsonEditor({
      // inject into refContainer
      target: refContainer.current,
      content: dataObject,
      onChange: changeDataCallback,
      readOnly: false
    });

    return () => {
      // destroy editor on unmount
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps({ content: dataObject, onChange: changeDataCallback });
    }
  }, [changeDataCallback, data, dataObject, onChange]);

  return (
    <div style={{ display: "flex", maxWidth: "700px" }} ref={refContainer} data-test={`project-additional-data`}></div>
  );
}
