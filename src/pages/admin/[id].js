import Admin from "@/components/Admin";
import prisma from "@/lib/prisma";

const admin = (props) => {
  return (
    <div>
      <Admin game={props.game} />
    </div>
  );
};

export default admin;

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
