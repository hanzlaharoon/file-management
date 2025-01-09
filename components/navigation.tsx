import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky h-20 inset-x-0 top-0 z-30 w-full mb-4 bg-secondary backdrop-blur-lg transition-all">
      <div className="container md:mx-auto px-4 w-full">
        <div className="flex h-20 items-center space-x-5">
          <Link href="/" className="h3 flex z-40 font-semibold text-2xl mr-4">
            <span>File Management App</span>
          </Link>
          <Link href="/" className="flex z-40  text-lg">
            <span>Files</span>
          </Link>
          <Link href="/newfile" className="flex z-40  text-lg">
            <span>New File</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
