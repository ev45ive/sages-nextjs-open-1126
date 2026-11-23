import NavBar from "@/components/layout/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
      <NavBar title="Home" />
    </div>
  );
}
