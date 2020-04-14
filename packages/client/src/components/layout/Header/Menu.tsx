import React, { useState } from "react"
import { connect } from "react-redux"
import { Add, PlusOne } from "@material-ui/icons"
import { IconButton } from "@material-ui/core"
import { UserDialog } from "../../users"
import {
  createRandomUser as addRandomUser,
  useCreateUser,
} from "../../../utils"

export const Menu = ({
  createRandomUser,
}: {
  createRandomUser: () => void
}) => {
  const createUser = useCreateUser()
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setShowDialog(true)}
        aria-label="Add user"
      >
        <Add />
      </IconButton>
      <IconButton
        color="inherit"
        edge="end"
        onClick={createRandomUser}
        aria-label="Add random user"
      >
        <PlusOne />
      </IconButton>
      {showDialog && (
        <UserDialog
          user={{}}
          onClose={() => setShowDialog(false)}
          onSubmit={(newUser) => {
            createUser(newUser)
            setShowDialog(false)
          }}
          open
        />
      )}
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  createRandomUser: () => dispatch(addRandomUser()),
})

export default connect(undefined, mapDispatchToProps)(Menu)
