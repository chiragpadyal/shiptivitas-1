import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import HomeTab from "./HomeTab";
import Navigation from "./Navigation";
import Board from "./Board";
import "./App.css";

//TASK:
// 1. In the "Shipping Requests" tab of the application, all tasks should now show in the backlog swimlane
// 2. All swimlanes should have the class "Swimlane-column"
// 3. There should be three swimlanes
// 4. When a user drags a card up or down, it reorders the card (frontend only)
// 5. When a user drags a card to a new swimlane, it stays in the swimlane
// 6. Find a storyboard and a designed version of the page in the resources section below
// 7. When a card changes swimlane, it should change color (backlog = grey, in progress = blue, complete = green)
// 8. Use the Dragula tool to make this happen

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "home",
    };
  }
  renderShippingRequests() {
    return <Board />;
  }

  renderNavigation() {
    return (
      <Navigation
        onClick={(tabName) => this.changeTab(tabName)}
        selectedTab={this.state.selectedTab}
      />
    );
  }

  renderTabContent() {
    switch (this.state.selectedTab) {
      case "home":
      default:
        return HomeTab();
      case "shipping-requests":
        return this.renderShippingRequests();
    }
  }
  render() {
    return (
      <div className="App">
        {this.renderNavigation()}

        <div className="App-body">{this.renderTabContent()}</div>
      </div>
    );
  }

  changeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    });
  }
}

export default App;
