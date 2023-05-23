import Button from "./Button";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
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

    await router.push({
      pathname: "/game/[id]",
      query: { id: state },
    });
  };

  return (
    <div className="container-small">
      <div className="form__group field">
        <input
          type="input"
          defaultValue={router.query.game_id}
          onChange={(e) => setState(e.target.value)}
          onInput={toInputUppercase} // apply on input which do you want to be capitalized
          ref={input}
          className="form__field"
          placeholder="Spel ID"
          name="Spel ID"
          id="game_id"
          required
        />
      </div>
      <Button path="/game" text="Anslut" onClick={handleJoin} />
    </div>
  );
};

export default JoinGame;
