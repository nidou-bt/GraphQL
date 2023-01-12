import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../graphql/queries";
import JobList from "./JobList";

function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setCompany] = useState({ name: "",description: "", jobs: [] });

  useEffect(() => {
    getCompany({ id: companyId }).then((res) => setCompany(res));
  }, []);

  useEffect(() => {
    console.log('company', company)

  }, [company])
  

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h5 className="title is-5">Jobs at {company.name}</h5>
      {!!company.jobs & company.jobs.length > 0 ? <JobList jobs={company.jobs} /> : null}
    </div>
  );
}

export default CompanyDetail;
