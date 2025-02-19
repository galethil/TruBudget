import React from "react";
import Fab from "@mui/material/Fab";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";

const styles = {
  root: {
    position: "fixed",
    bottom: theme => theme.spacing(5),
    right: theme => theme.spacing(5)
  }
};

const ScrollTop = props => {
  const { window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector("#back-to-top");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <Fab
        color="primary"
        aria-label="scroll back to top"
        data-test="backToTop-button"
        onClick={handleClick}
        sx={{ ...styles.root }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollTop;
