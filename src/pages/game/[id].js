import Game from "@/components/Game";

const game = (props) => {
  return (
    <div>
      <Game data={props.game} />
    </div>
  );
};

export default game;

export async function getServerSideProps(context) {
  const { id } = context.query;
  console.log("id: " + id);
  const res = await prisma.Game.findUnique({
    where: {
      name: String(id),
    },
  });
  const game = JSON.stringify(res);

  console.log(`Fetched game: ${game}`);
  return { props: { game } };
}
