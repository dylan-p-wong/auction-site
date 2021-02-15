import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ME } from "../graphql/queries";

export const useAuth = () => {
    const { loading, error, data } = useQuery(ME);
    const history = useHistory();
    const [didMount, setDidMount] = useState(false); 

    useEffect(() => {
        setDidMount(true);
        if (!loading) {
            if (!data?.me){
                history.push("/login");
            } 
        }
        return () => setDidMount(false);
    });
}