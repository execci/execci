/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ViewerQuery
// ====================================================

export interface ViewerQuery_me {
  __typename: "User";
  _id: string;
  emailAddress: string;
  displayName: string;
}

export interface ViewerQuery {
  me: ViewerQuery_me | null;
}
