import { Company, Job } from "./db.js";

export const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: async () => await Job.findAll(),

    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: (_root, { input }, { user }) => {
      if (!user) {
        throw new Error("Unauthorize");
      }
      return Job.create({ ...input, companyId: user.companyId });
    },
    deleteJob: (_root, { id }) => Job.delete(id),
    updateJob: (_root, { input }) => Job.update(input),
  },

  Job: {
    company: ({ companyId }) => {
      return Company.findById(companyId);
    },
  },

  Company: {
    jobs: ({ id }) => Job.findAll((job) => job.companyId === id),
  },
};
