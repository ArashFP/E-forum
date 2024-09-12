import Link from "next/link"

const Navbar = () => {
  return (
    <div className= "flex justify-between bg-slate-200">
      <ul className="flex justify-center items-center text-teal-700 text-lg font-serif py-8 px-4 gap-x-3 bg-slate-200 font-bold">
        <Link href="/" >
          Home 
        </Link>
        <Link href="/create" >
          Create 
        </Link>
      </ul>
      <h1 className= "flex items-center text-teal-700 text-6xl font-bold">
         Tech Hub
      </h1>
      <ul className="flex justify-center items-center text-teal-700 text-lg font-serif py-8 px-4 gap-x-3 bg-slate-200 font-bold">
        <Link href="sign-up">
          Sign-Up
        </Link>
        <Link href="sign-in">
          Login
        </Link>
      </ul>
    </div>
  )
}
export default Navbar