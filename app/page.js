import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card/card";


export default function Home() {
  return (
      <>
      <h1>Homepage</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      </>
  );
}
