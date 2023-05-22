import Button from "./Button";

const Start = () => {
  return (
    <div className="start">
      <Button text="Nytt spel" path="/create_game" disabled={false} />
      <Button text="Anslut till spel" path="/join_game" disabled={false} />
    </div>
  );
};

export default Start;
