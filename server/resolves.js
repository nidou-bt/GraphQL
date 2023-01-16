import { Company, Job } from "./db.js";

function rejectIf(condition) {
  if (condition) {
    throw new Error("Unauthorize");
  }
}

export const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: async () => await Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: (_root, { input }, { user }) => {
      rejectIf(!user);
      return Job.create({ ...input, companyId: user.companyId });
    },
    deleteJob: async (_root, { id }, { user }) => {
      rejectIf(!user);
      const job = await Job.findById(id);

      rejectIf(job.companyId !== user.companyId);
      Job.delete(id);
    },
    updateJob: async (_root, { input }, { user }) => {
      rejectIf(!user);
      const job = await Job.findById(input.id);
      rejectIf(job.companyId !== user.companyId);
      return Job.update({ ...input, companyId: user.companyId });
    },
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
