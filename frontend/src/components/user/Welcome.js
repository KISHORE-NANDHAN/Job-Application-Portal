import { Component, Fragment } from "react";
import ls from "local-storage";
import axios from "axios";

class Welcome extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            isRecruiter: ls.get("isRecruiter"),
        };
    }
    componentDidMount() {
        if (ls.get("logged-in") === "yes")
            axios
                .get("/user/profile", {
                    params: {
                        email: ls.get("email"),
                    },
                })
                .then((res) => {
                    this.setState({ name: res.data.name });
                })
                .catch((res) => {
                    alert(res.response.data.error);
                });
    }
    render() {
        return (
            <Fragment>
                {ls.get("logged-in") === "yes" ? (
                    <Fragment>
                        <h2>Hello,{this.state.name}</h2>
                        <br />
                        Let's search for {this.state.isRecruiter === "yes"
                            ? "job-seekers"
                            : "jobs"}{" "}
                        !
                    </Fragment>
                ) : (
                    <Fragment>
                        <h3>Welcome to the app!</h3>
                    </Fragment>
                )}
            </Fragment>
        );
    }
}

export default Welcome;
