import React from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {
        backlog: [],
        inProgress: [],
        complete: [],
      },
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    this.getClients();

    // using dragula to make the swimlanes draggable
    this.dragula = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ]);

    // when a card is dropped, update the state
    this.dragula.on("drop", (el, target, source, sibling) => {
      // get the new status of the card
      let newStatus = target.previousElementSibling.innerHTML
        .toLowerCase()
        .replaceAll(" ", "-");
      // get the previous status of the card
      const prevStatus = el.getAttribute("data-status");
      // get the id of the card
      const selectedElementId = parseInt(el.getAttribute("data-id"));
      // get the new priority of the card
      let newIndex;
      // get the priority of the card
      let prevIndex;
      // get the clients
      let clients = this.state.clients;

      //revert changes
      this.dragula.cancel(true);
      // as the status is in-progress in the database, we need to change it to inProgress
      if (newStatus === "in-progress") newStatus = "inProgress";

      newIndex =
        sibling === null
          ? -1
          : clients[newStatus].findIndex(
              (client) =>
                client.id === parseInt(sibling.getAttribute("data-id"))
            ) + 1;

      prevIndex =
        clients[newStatus].findIndex(
          (client) => client.id === selectedElementId
        ) + 1;

      console.log("newIndex", newIndex);
      console.log("prevIndex", prevIndex);
      // console.log("newStatus", newStatus);
      // console.log("selectedElementId", selectedElementId);
      // console.log("client", clients[selectedElementId]);

      // tweak for abonoramlities
      if (
        prevStatus === newStatus ||
        (prevStatus === "in-progress" && newStatus === "inProgress")
      ) {
        if (newIndex !== -1) {
          // moving up
          if (newIndex > prevIndex) {
            newIndex = newIndex - 1;
          }
          // moving down
          else {
            if (newIndex === clients[newStatus].length) newIndex = newIndex - 1;
          }
        }
      }

      // if the new index is -1, it means that the card is dropped at the end of the swimlane
      if (newIndex === -1) newIndex = clients[newStatus].length + 1;

      console.log("newIndex updated", newIndex);

      // setback the status to in-progress
      if (newStatus === "inProgress") newStatus = "in-progress";
      this.updateClient(selectedElementId, newIndex, newStatus);
    });
  }

  async getClients() {
    try {
      const clientsResponse = await fetch(
        "http://localhost:3001/api/v1/clients"
      );

      const clients = await clientsResponse.json();

      this.setState({
        clients: {
          backlog: clients
            .filter((client) => !client.status || client.status === "backlog")
            .sort((a, b) => a.priority - b.priority),
          inProgress: clients
            .filter(
              (client) => client.status && client.status === "in-progress"
            )
            .sort((a, b) => a.priority - b.priority),
          complete: clients
            .filter((client) => client.status && client.status === "complete")
            .sort((a, b) => a.priority - b.priority),
        },
      });
    } catch (error) {
      console.log("failed to fetch clients");
      console.log(error);
    }
  }

  async updateClient(id, priority, status) {
    try {
      const clientsResponse = await fetch(
        `http://localhost:3001/api/v1/clients/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
            priority: priority,
          }),
        }
      );

      const clients = await clientsResponse.json();

      this.setState({
        clients: {
          backlog: clients
            .filter((client) => !client.status || client.status === "backlog")
            .sort((a, b) => a.priority - b.priority),
          inProgress: clients
            .filter(
              (client) => client.status && client.status === "in-progress"
            )
            .sort((a, b) => a.priority - b.priority),
          complete: clients
            .filter((client) => client.status && client.status === "complete")
            .sort((a, b) => a.priority - b.priority),
        },
      });
    } catch (error) {
      console.log("failed to fetch clients");
      console.log(error);
    }
  }
  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                "Backlog",
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "In Progress",
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "Complete",
                this.state.clients.complete,
                this.swimlanes.complete
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
