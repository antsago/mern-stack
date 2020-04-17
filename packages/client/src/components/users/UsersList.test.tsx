import React from "react"
import { waitFor } from "@testing-library/react"
import { User } from "@mernstack/shared"
import userEvent from "@testing-library/user-event"
import { renderWithState } from "../../testHelpers"
import { GET_USERS } from "../../utils/state/users/GetUsers"
import { DELETE_USER } from "../../utils/state/users/DeleteUser"
import UsersList from "./UsersList"

const testUser = () => ({
  id: "test",
  givenName: "name",
  familyName: "surname",
  email: "name@surname.com",
  created: new Date(),
})

const getUsersQuery = (users: User[] = [testUser()]) => ({
  request: {
    query: GET_USERS,
  },
  result: {
    data: {
      users,
    },
  },
})

const deleteUserQuery = (id: string) => ({
  request: {
    query: DELETE_USER,
    variables: { id },
  },
  result: { data: { deleteUser: { id } } },
})

// const updateUserQuery = (id: string, user: UserInput, updatedUser: User) => ({
//   request: {
//     query: UPDATE_USER,
//     variables: { id, user },
//   },
//   result: { data: { updateUser: updatedUser } },
// })

describe("UsersList", () => {
  test("Shows loader while getting users", () => {
    const { getByRole } = renderWithState([getUsersQuery()], <UsersList />)

    expect(getByRole("progressbar")).toBeInTheDocument()
  })

  test("Does not shows loader when not loading", async () => {
    const { queryByRole } = renderWithState([getUsersQuery()], <UsersList />)

    await waitFor(() =>
      expect(queryByRole("progressbar")).not.toBeInTheDocument(),
    )
  })

  test("Shows users if given", async () => {
    const { getByTestId } = renderWithState([getUsersQuery()], <UsersList />)

    await waitFor(() => expect(getByTestId("user-item")).toBeInTheDocument())
  })

  // test.only("Update user", async () => {
  //   const user: User = testUser()
  //   const append = "2"
  //   const changes: UserInput = {
  //     givenName: user.givenName,
  //     familyName: user.familyName,
  //     email: `${user.email}${append}`,
  //   }
  //   const updatedUser = { ...user, ...changes }
  //   const mocks = [
  //     getUsersQuery([user]),
  //     updateUserQuery(user.id, changes, updatedUser),
  //   ]
  //   const { queryByRole, getByText, getByDisplayValue } = renderWithState(mocks)
  //   await waitFor(() => expect(getByText(user.email)).toBeInTheDocument())

  //   expect(queryByRole("dialog")).not.toBeInTheDocument()
  //   userEvent.click(getByText("Update"))
  //   expect(queryByRole("dialog")).toBeInTheDocument()
  //   await userEvent.type(getByDisplayValue(user.email), append)
  //   userEvent.click(getByText("Save"))

  //   await waitFor(
  //     () => expect(getByText(updatedUser.email)).toBeInTheDocument(),
  //     { timeout: 5000 },
  //   )
  //   expect(queryByRole("dialog")).not.toBeInTheDocument()
  // }, 6000)

  test("Deletes user", async () => {
    const user = testUser()
    const mocks = [getUsersQuery([user]), deleteUserQuery(user.id)]
    const { queryByText, getByText } = renderWithState(mocks, <UsersList />)
    await waitFor(() => expect(getByText(user.email)).toBeInTheDocument())

    userEvent.click(getByText("Delete"))

    await waitFor(() => expect(queryByText(user.email)).not.toBeInTheDocument())
  })
})
