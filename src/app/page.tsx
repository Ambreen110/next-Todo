import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/"

export default function Home() {
  return (
   <>
   <h1>It is working</h1>
   </>
  );
}
