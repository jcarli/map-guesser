import Game from "@/components/Game";
import prisma from "@/lib/prisma";

const game = (props) => {
  return (
    <>
      <Game data={props.game} />
    </>
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

  if (game === "null") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  } else {
    return { props: { game } };
  }
}
