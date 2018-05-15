import React from 'react';
import {Input, Button} from 'wix-style-react';

export default class NewCommentForm extends React.Component {
  state = {
    author: '',
    text: '',
  };

  render() {
    return (
      <div>
        <Input
          dataHook="author-name" value={this.state.author}
          onChange={e => this.setState({author: e.target.value})}
        />
        <Input
          dataHook="comment" value={this.state.text}
          onChange={e => this.setState({text: e.target.value})}
        />
        <Button
          dataHook="submit-comment"
          onClick={() => this.props.onSubmit(this.state)}
        >
          Submit
        </Button>
      </div>
    );
  }
}
