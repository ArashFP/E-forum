import Link from "next/link"

const Navbar = () => {
  return (
    <div>
      <ul className="flex justify-center items-center text-teal-400 text-lg font-serif py-8 px-4 gap-x-3 bg-slate-200 font-bold">
        <Link href="/" >
          Home 
        </Link>
        <Link href="/create" >
          Create 
        </Link>
        {/* <Link href="/threads" >
          Threads
        </Link> */}
      </ul>
    </div>
  )
}
export default Navbar