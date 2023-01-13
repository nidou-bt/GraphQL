import request, { gql } from "graphql-request";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:3001/graphql";

export const getJob = async ({ id }) => {
  const query = gql`
    query Jobquery($id: ID!) {
      job(id: $id) {
        title
        id
        company {
          id
          name
        }
        description
      }
    }
  `;
  const variables = { id };
  const { job } = await request(GRAPHQL_URL, query, variables);
  return job;
};

export const getJobs = async () => {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `;

  const { jobs } = await request(GRAPHQL_URL, query);
  return jobs;
};

export const getCompany = async ({ id }) => {
  const query = gql`
    query Companyquery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          title
          id
        }
      }
    }
  `;
  const variables = { id };
  const { company } = await request(GRAPHQL_URL, query, variables);
  return company;
};

export const createJob = async (input) => {
  const query = gql`
    mutation createJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const variables = { input };
  const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
  const { job } = await request(GRAPHQL_URL, query, variables, headers);

  return job;
};
