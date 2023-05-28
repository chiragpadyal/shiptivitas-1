##### 1. Method put on /api/v1/clients/:id

- takes:
  - priority or status
  - priority and status
- returns
  - All clients

##### 2. if priority value is less than 0 or is not a number

- following error is raised

  ```
  {
      valid: false,
      messageObj: {
        message: "Invalid priority provided.",
        long_message: "Priority can only be positive integer.",
      },
    };
  ```

##### 3. if priority value is too big than the number of client in one swinelane

- It changes the priority to the maxed allowed value
  - for same lane its max size
  - for different lane max size + 1

##### 4. if status or priority is not given then status or priority is assumed as its original value

##### 5. when priority is changed to a mid value, then every else client priority is shifted

- rotatePriority() for same swinelane
- removeClientOfPriority() and addClientAtPriority() for different swinelane

##### 6. At end all clients with status that been changed and its previous status clients are updated in database using `transaction` of better-sqlite3
