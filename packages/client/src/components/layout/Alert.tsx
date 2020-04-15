import React from "react"
import { Snackbar, IconButton, Slide } from "@material-ui/core"
import { Close as CloseIcon } from "@material-ui/icons"
import { useDismissAlert, useGetShownAlert } from "../../utils"

export const Alert = () => {
  const alert = useGetShownAlert()
  const dismissAlert = useDismissAlert()

  return alert ? (
    <Snackbar
      key={alert.id}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      TransitionComponent={(props) => <Slide {...props} direction="left" />}
      autoHideDuration={6000}
      onClose={async () => dismissAlert(alert.id)}
      message={alert.message}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={async () => dismissAlert(alert.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      open
    />
  ) : null
}

export default Alert
