import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Weekly from "@/components/Weekly";

export default function Home() {
  return (
    <main className="bg-[#6f8f95] min-h-screen p-10">
      <div className="bg-[#f4f7f7] rounded-3xl p-6">

        <Navbar />
        <Hero />

        <div className="grid md:grid-cols-2 gap-10 mt-10">
          <Featured />
          <Weekly />
        </div>

      </div>
    </main>
  );
}