import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
      <div className="p-10">
        <button className="btn btn-primary">Test Button</button>
          <Link href="/pages/about/page.js">
              <button className={"btn btn-primary"}>About</button>
          </Link>
      </div>
  );
}
