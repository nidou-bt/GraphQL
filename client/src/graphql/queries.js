import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:3001/graphql";

const JOB_QUERY = gql`
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

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export const getJob = async ({ id }) => {
  const variables = { id };
  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });
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

  const {
    data: { jobs },
  } = await client.query({ query });
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
  const {
    data: { company },
  } = await client.query({ query, variables });
  return company;
};

export const createJob = async (input) => {
  const mutation = gql`
    mutation createJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;
  const variables = { input };
  const context = { headers: { Authorization: `Bearer ${getAccessToken()}` } };
  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      });
    },
  });
  return job;
};
