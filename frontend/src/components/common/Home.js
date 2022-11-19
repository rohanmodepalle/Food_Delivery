import { useState, useEffect } from "react";

const Home = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setName("Ankith Varun J");
  }, []);

  return <div style={{ textAlign: "center" }}>Happy Evaluating - {name}</div>;
};

export default Home;
