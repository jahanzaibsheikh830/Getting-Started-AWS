export const getTodo = `
query GetTodo($id: ID!){
    getTodo(id:$id){
        id
        name
        description
        createAt
        updateAt
    }
}`;

export const listTodos =  `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;