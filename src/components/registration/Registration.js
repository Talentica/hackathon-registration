import React, { Component } from "react";
import firebase from "../../firebase";
import {
  Col,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Row
} from "reactstrap";
import classnames from "classnames";
import * as EmailValidator from "email-validator";

const validateEmail = email => {
  return EmailValidator.validate(email);
};
class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      individualOrTeam: "",
      participants: [],
      currentEmailEntry: "",
      teamName: ""
    };
  }
  componentDidMount() {
    this.firebaseRef = firebase.database().ref("/participants");
  }
  onChange(name, value) {
    this.setState({
      [name]: value
    });
  }
  submit(e) {
    e.stopPropagation();
    this.firebaseRef.push(this.state);
    this.setState({
      individualOrTeam: "",
      participants: [],
      currentEmailEntry: "",
      teamName: ""
    });
    this.props.onSubmit();
  }
  addParticipant(e) {
    e.stopPropagation();
    const { currentEmailEntry, participants } = this.state;

    this.setState({
      currentEmailEntry: "",
      participants: participants.concat([{ email: currentEmailEntry }])
    });
  }
  removeParticipant(participantEmail) {
    const { participants } = this.state;

    this.setState({
      participants: participants.filter(
        ({ email }) => participantEmail !== email
      )
    });
  }

  render() {
    const {
      individualOrTeam,
      participants,
      currentEmailEntry,
      teamName,
      participants: { 0: firstParticipant }
    } = this.state;

    const validFirstParticipantEmail =
      firstParticipant && validateEmail(firstParticipant.email);

    const participantAlreadyExists =
      (participants &&
        !!participants.find(({ email }) => email === currentEmailEntry)) ||
      false;

    const validParticipant =
      individualOrTeam !== "" &&
      ((individualOrTeam === "individual" && validFirstParticipantEmail) ||
        (individualOrTeam === "team" &&
          participants.length < 5 &&
          participants.length > 1 &&
          teamName !== ""));
    return (
      <Form className={classnames("w-100")}>
        <FormGroup row>
          <Label for="individualorTeam" sm={4}>
            Individual or Team
          </Label>
          <Col>
            <FormGroup check>
              <Label check>
                <Input
                  onChange={event =>
                    this.onChange(
                      "individualOrTeam",
                      event.target.checked ? "individual" : "team"
                    )
                  }
                  value="individual"
                  type="radio"
                  selected={individualOrTeam === "individual"}
                  name="individualorTeam"
                />
                Register as individual
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  invalid
                  onChange={event =>
                    this.onChange(
                      "individualOrTeam",
                      event.target.checked ? "team" : "individual"
                    )
                  }
                  vlaue="team"
                  type="radio"
                  name="individualorTeam"
                />
                Register as team
              </Label>
            </FormGroup>
          </Col>
        </FormGroup>
        {individualOrTeam === "individual" && (
          <FormGroup row>
            <Label for="email" sm={4}>
              Email
            </Label>
            <Col sm={5}>
              <Input
                invalid={firstParticipant && !validFirstParticipantEmail}
                valid={firstParticipant && validFirstParticipantEmail}
                type="email"
                name="email"
                onChange={event =>
                  this.onChange(
                    "participants",
                    event.target.value && [{ email: event.target.value }]
                  )
                }
                id="email"
                placeholder="your email"
              />
              {firstParticipant &&
                !validFirstParticipantEmail && (
                  <FormFeedback>Please enter valid email</FormFeedback>
                )}
            </Col>
          </FormGroup>
        )}
        {individualOrTeam === "team" && (
          <FormGroup tag="fieldset" row>
            <legend sm={4} className={classnames("col-form-label")}>
              Your and teammates details
            </legend>
            <Col sm={{ size: 8, offset: 4 }}>
              <Row>
                <Col sm={3}>
                  <Label>Team name</Label>
                </Col>
                <Col>
                  <Input
                    invalid={teamName ? teamName.length < 4 : false}
                    valid={teamName ? teamName >= 4 : true}
                    type="text"
                    name="team-name"
                    value={teamName}
                    onChange={event =>
                      this.onChange("teamName", event.target.value)
                    }
                  />
                  {teamName &&
                    teamName.length < 4 && (
                      <FormFeedback>
                        Please enter valid name for your team
                      </FormFeedback>
                    )}
                </Col>
              </Row>
              <br />
              <Row>
                <Col sm={8}>
                  <Input
                    invalid={
                      currentEmailEntry
                        ? !validateEmail(currentEmailEntry)
                        : false
                    }
                    valid={
                      currentEmailEntry
                        ? validateEmail(currentEmailEntry)
                        : true
                    }
                    type="email"
                    name="currentEmailEntry"
                    value={currentEmailEntry}
                    onChange={event =>
                      this.onChange("currentEmailEntry", event.target.value)
                    }
                    id="currentEmailEntry"
                    placeholder="team members email"
                  />
                  {currentEmailEntry &&
                    !validateEmail(currentEmailEntry) && (
                      <FormFeedback>Please enter valid email</FormFeedback>
                    )}
                </Col>
                <Col>
                  <Button
                    disabled={
                      currentEmailEntry
                        ? !validateEmail(currentEmailEntry) ||
                          participantAlreadyExists ||
                          !(participants.length < 5)
                        : true
                    }
                    onClick={this.addParticipant.bind(this)}
                  >
                    Add
                  </Button>
                </Col>
              </Row>
              {participants.length > 0 &&
                participants.map(({ email }, index) => (
                  <div key={index}>
                    <br />
                    <Row>
                      <Col sm={4} className={classnames("pt-2")}>
                        {email}
                      </Col>
                      <Col>
                        <Button
                          onClick={e => {
                            e.stopPropagation();
                            this.removeParticipant(email);
                          }}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
            </Col>
          </FormGroup>
        )}
        <FormGroup row>
          <Col sm={{ size: 5, offset: 4 }}>
            <Button
              color="primary"
              onClick={this.submit.bind(this)}
              disabled={individualOrTeam === "" || !validParticipant}
            >
              Submit
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default Registration;
