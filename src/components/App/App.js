import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import s from './App.scss';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      comments: []
    };
  }

  async componentDidMount() {
    const {siteId} = queryString.parse(location.search);
    const response = await axios.get(`/api/comments/${siteId}`);
    this.setState({comments: response.data});
  }
  render() {
    return (
      <div className={s.root}>
        <ul>
          {this.state.comments.map((comment, i) => <li key={i}>{`${comment.text} | ${comment.author}`}</li>)}
        </ul>
      </div>
    );
  }
}

export default App;
