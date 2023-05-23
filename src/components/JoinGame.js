import Button from "./Button";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

const JoinGame = () => {
  const router = useRouter();
  const input = useRef();
  const [state, setState] = useState("");

  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    const res = await axios.get("/api/db/getgame", {
      params: {
        name: state.toUpperCase(),
      },
    });

    await router.push({
      pathname: "/game/[id]",
      query: { id: state },
    });
  };

  return (
    <>
      <div className="form__group field">
        <input
          type="input"
          onChange={(e) => setState(e.target.value)}
          onInput={toInputUppercase} // apply on input which do you want to be capitalize
          ref={input}
          className="form__field"
          placeholder="Spel ID"
          name="Spel ID"
          id="Spel ID"
          required
        />
      </div>
      <Button path="/game" text="Anslut" onClick={handleJoin} />
    </>
  );
};

export default JoinGame;
