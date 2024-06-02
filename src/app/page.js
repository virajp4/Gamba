import Header from "@/components/home/Header";
import HomeCards from "@/components/home/HomeCards";

export default function Home() {
  return (
    <div className="h-fit">
      <div className="h-60 flex items-center justify-center">
        <div className="md:w-1/2">
          <Header />
        </div>
      </div>

      <div className="flex items-center justify-center flex-wrap">
        <HomeCards />
      </div>
    </div>
  );
}
