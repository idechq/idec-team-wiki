import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import MessageList from "./messageList";

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.messages.length) {
      this.setState({ loading: true });
    }
    this.onListenForMessages();
  }

  onListenForMessages() {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(this.props.limit)
      .on("value", (snapshot) => {
        this.props.onSetMessages(snapshot.val());

        this.setState({ loading: false });
      });
  }

  componentDidUpdate(props) {
    if (props.limit !== this.props.limit) {
      this.onListenForMessages();
    }
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = (event) => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: "" });

    event.preventDefault();
  };

  onRemoveMessage = (uid) => {
    this.props.firebase.message(uid).remove();
  };

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  onNextPage = () => {
    this.props.onSetMessagesLimit(this.props.limit + 5);
  };

  render() {
    const { users, messages } = this.props;
    const { text, loading } = this.state;

    return (
      <div>
        {!loading && messages && (
          <button type="button" onClick={this.onNextPage}>
            More
          </button>
        )}
        {loading && <div>Loading ...</div>}

        {messages && (
          <MessageList
            messages={messages.map((message) => ({
              ...message,
              user: users ? users[message.userId] : { userId: message.userId },
            }))}
            onEditMessage={this.onEditMessage}
            onRemoveMessage={this.onRemoveMessage}
          />
        )}

        {!messages && <div>There are no messages ...</div>}

        <form
          onSubmit={(event) => this.onCreateMessage(event, this.props.authUser)}
        >
          <input type="text" value={text} onChange={this.onChangeText} />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  messages: Object.keys(state.messageState.messages || {}).map((key) => ({
    ...state.messageState.messages[key],
    uid: key,
  })),
  limit: state.messageState.limit,
});

const mapDispatchToProps = (dispatch) => ({
  onSetMessages: (messages) => dispatch({ type: "MESSAGES_SET", messages }),
  onSetMessagesLimit: (limit) =>
    dispatch({ type: "MESSAGES_LIMIT_SET", limit }),
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Messages);
