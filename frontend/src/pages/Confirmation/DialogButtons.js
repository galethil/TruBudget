import { Button, Typography } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import strings from '../../localizeStrings';

const styles = {
  dialogActions: {
    margin: "8px 4px 8px 24px"
  },
  progessContainer: {
    flex: "auto"
  },
  progressInfo: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }
};

const DialogButtons = props => {
  const {
    confirmButtonText,
    onConfirm,
    onCancel,
    confirmDisabled,
    additionalActions = [],
    originalActions = [],
    postActions = [],
    executedActions = [],
    actionsAreExecuted,
    executingActions,
    failedAction,
    submitable = true,
    hasFailure = false
  } = props;

  const visibleAdditionalActions = additionalActions.filter(action => !action.hasOwnProperty("isVisible") || action.isVisible);
  const visibleOriginalActions = originalActions.filter(action => !action.hasOwnProperty("isVisible") || action.isVisible);
  const visiblePostActions = postActions.filter(action => !action.hasOwnProperty("isVisible") || action.isVisible);
  const totalActionsLength = visibleAdditionalActions?.length + visibleOriginalActions?.length + visiblePostActions?.length;

  return (
    <DialogActions style={styles.dialogActions}>
      {submitable && !hasFailure && (
        <div style={styles.progessContainer}>
          <Typography key="progressInfo" style={styles.progressInfo} data-test="actions-counter">
            {strings.formatString(strings.preview.actions_done, executedActions.length, totalActionsLength)}
          </Typography>
        </div>
      )}

      {!hasFailure && (
        <Button
          disabled={executingActions || actionsAreExecuted}
          aria-label="cancel"
          data-test="confirmation-dialog-cancel"
          color={submitable ? "secondary" : "primary"}
          onClick={() => onCancel()}
        >
          {submitable ? strings.common.cancel : strings.common.ok}
        </Button>
      )}

      {submitable && !hasFailure && (
        <Button
          aria-label="confirm"
          data-test="confirmation-dialog-confirm"
          color="primary"
          onClick={_isEmpty(failedAction) ? () => onConfirm() : () => onCancel()}
          disabled={confirmDisabled || executingActions || actionsAreExecuted}
        >
          {confirmButtonText}
        </Button>
      )}

      {hasFailure && (
        <Button
          disabled={executingActions || actionsAreExecuted}
          aria-label="cancel"
          data-test="confirmation-dialog-cancel"
          color={submitable ? "secondary" : "primary"}
          onClick={() => onCancel()}
        >
          {strings.common.close}
        </Button>
      )}
    </DialogActions>
  );
};

export default DialogButtons;
