import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ApprovedNodesTable from "./ApprovedNodesTable";
import DeclinedNodesTable from "./DeclinedNodesTable";

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  customWidth: {
    width: "100%",
    marginTop: "40px"
  }
};

const renderTab = (tabIndex, props) => {
  switch (tabIndex) {
    case 0:
      return <ApprovedNodesTable {...props} />;
    case 1:
      return <DeclinedNodesTable {...props} />;
    default:
      break;
  }
  return null;
};

const NodesTable = props => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div data-test="nodesDashboard" style={styles.container}>
      <div style={styles.customWidth}>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={(_, value) => setTabIndex(value)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={"Approved"} aria-label="approvedNodes" data-test="approved-nodes-tab" />
            <Tab label={"Declined"} aria-label="declinedNodes" data-test="declined-nodes-tab" />
          </Tabs>
        </AppBar>
        {renderTab(tabIndex, props)}
      </div>
    </div>
  );
};
export default NodesTable;
