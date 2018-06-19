import React, { Component } from "react";
import classnames from "classnames";
import windowDimensions from "react-window-dimensions";

import "./App.css";
import Cover from "./components/cover";
import Registration from "./components/registration/Registration";
import { Row, Container, Alert } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
  }
  render() {
    return (
      <div>
        <Cover>
          <h4>Welcome to hackathon !!!</h4>
          <a
            href="#register"
            className={classnames("bd-highlight", "text-monospace", "m-10")}
          >
            Let's Register
          </a>
        </Cover>
        <Container id="register">
          {this.state.submitted && (
            <div
              className={classnames("row align-items-center")}
              style={{ height: this.props.height }}
            >
              <Alert color="success">
                Your registration is successful. Thank you for registration. See
                you on 29th June in Megaplex at 7 PM.
              </Alert>
            </div>
          )}
          {!this.state.submitted && (
            <div
              className={classnames("row align-items-center")}
              style={{ height: this.props.height }}
            >
              <Registration
                onSubmit={() => this.setState({ submitted: true })}
              />
            </div>
          )}
        </Container>
      </div>
    );
  }
}
export default windowDimensions()(App);
