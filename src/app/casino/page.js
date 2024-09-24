import GameCards from "@/components/casino/GameCards";

const games = [
  {
    title: "Dice",
    description: "Make sure to hit the green zone.",
    link: "/casino/dice",
  },
  {
    title: "Mines",
    description: "Don't step on the mines. Or do. I'm not your mom.",
    link: "/casino/mines",
  },
  {
    title: "Dragon Tower",
    description: "Climb the tower and get the treasure. Or lose everything.",
    link: "/casino/dragon",
  },
  /*{
    title: "Plinko",
    description: "Go wild and let the balls loose.",
    link: "/casino/plinko",
  },*/
];

export default function Casino() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center items-center flex-col h-32 gap-3">
        <h1 className="text-3xl font-bold">Casino</h1>
        <p className="text-center">Explore a wide variety of games that you can go absolute degen mode with.</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="lg:w-[80%] md:w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 md:gap-y-6">
          {games.map((game, index) => (
            <GameCards key={index} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
}
