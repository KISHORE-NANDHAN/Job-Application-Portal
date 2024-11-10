import { useState, useEffect } from "react";
import ls from "local-storage";
import axios from "axios";
import { Rating } from "@material-ui/lab";

const MyApplications = () => {
  const [appList, setAppList] = useState([]);

  useEffect(() => {
    axios
      .get("/application", { params: { email: ls.get("email") } })
      .then((res) => {
        let updatedAppList = res.data;
        updatedAppList.map((app, idx) =>
          axios
            .get("/job", {
              params: { jobid: app.jobid },
            })
            .then((res) => {
              updatedAppList[idx].job = res.data[0];
            })
            .catch((res) => {
              alert(res.response.data.error);
            })
        );
        setTimeout(() => {
          setAppList(updatedAppList);
        }, 2000);
      })
      .catch((res) => {
        console.log(res);
        alert("error");
      });
  }, []);

  const rateJob = (app) => (e, newValue) => {
    e.preventDefault();
    console.log(newValue);
    axios
      .post("/application/rate", { appId: app._id, rating: newValue })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("error");
        window.location.reload();
      });
  };

  return (
    <div className="container mx-auto my-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Recruiter</th>
            <th className="px-4 py-2">Date of posting</th>
            <th className="px-4 py-2">Salary</th>
            <th className="px-4 py-2">Duration</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2"> </th>
          </tr>
        </thead>
        <tbody>
          {appList.map((app, index) => {
            const job = app.job || {};  // Ensure job is always defined
            return (
              <tr
                key={index}
                className={`border-t ${app.jobDeleted === "yes" ? "bg-red-100" : ""}`}
              >
                <td className="px-4 py-2">{job.title || "No Title"}</td>
                <td className="px-4 py-2">{job.recruiterName || "No Recruiter"}</td>
                <td className="px-4 py-2">
                  {app.status === "rejected" ? "--" : new Date(job.postingDate).toDateString()}
                </td>
                <td className="px-4 py-2">{job.salary || "N/A"}</td>
                <td className="px-4 py-2">{job.duration || "N/A"}</td>
                <td className="px-4 py-2">
                  {app.jobDeleted === "yes" ? "Job Deleted" : app.status}
                </td>
                <td className="px-4 py-2">
                  {app.status === "accepted" ? (
                    <Rating
                      value={app.rating}
                      onChange={rateJob(app)}
                      className="text-yellow-500"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MyApplications;
