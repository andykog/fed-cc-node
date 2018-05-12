# Node Rpc Workshop

### Getting started

1. Clone / fork this repo
2. `npm i`

### Tasks
Your task is to add "Add Comments" functionality to the comments list:

1. Add an input and a button (wix-style-react)

2. Use [API explorer](http://bo.wix.com/wix-api-explorer) to find the RPC service (its name is "CommentsService"). You will use the "Add" method

3. Do it TDD!! You will have to write 3 tests:

    a. An E2E test for adding new comment (mocking RPC service)

    b. An IT test for saving a new comment (mocking RPC service)

    c. A component test for saving a comment (using nock to check that the comment was sent to the server)

## References
- [RPC setup](https://github.com/wix-private/fed-handbook/blob/master/RPC.md)
- [wix-rpc-testkit](https://github.com/wix-platform/wix-node-platform/tree/master/rpc/wix-rpc-testkit#usage---legacy-client)
- [wix-json-rpc-client](https://github.com/wix-platform/wix-node-platform/tree/master/rpc/wix-json-rpc-client)
- [Aspects](https://github.com/wix-platform/wix-node-platform/tree/master/aspects)
- [RPC spec](http://www.jsonrpc.org/specification)
- [HTTP mocking](https://github.com/wix-private/fed-handbook/blob/master/TESTING.md#http-mocking)
- [Wix Style React testing](https://wix.github.io/wix-style-react/?selectedKind=Introduction&selectedStory=Testing&full=0&down=0&left=1&panelRight=0)
