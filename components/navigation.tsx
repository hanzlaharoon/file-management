import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full bg-white/75 backdrop-blur-lg transition-all">
      {/* <div className="mx-auto w-full max-w-lg px-2.5"> */}
      <div className="container md:mx-auto px-4 w-full">
        <div className="flex h-14 items-center space-x-2">
          <Link href="/" className="h3 flex z-40 font-semibold">
            <span>File Management</span>
          </Link>
          <Link href="/fileslist" className="flex z-40 font-semibold">
            <span>Files</span>
          </Link>
          <Link href="/newfile" className="flex z-40 font-semibold">
            <span>New File</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
