import Button from "./Button";
import { useRouter } from "next/router";

const Start = () => {
  const router = useRouter();

  const create_game = async (e) => {
    e.preventDefault();
    await router.push({
      pathname: "create_game",
    });
  };

  const join_game = async (e) => {
    e.preventDefault();
    await router.push({
      pathname: "join_game",
    });
  };

  return (
    <div className="start">
      <Button text="Nytt spel" onClick={create_game} disabled={false} />
      <Button text="Anslut till spel" onClick={join_game} disabled={false} />
    </div>
  );
};

export default Start;
