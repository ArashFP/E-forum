import CreateThread from '../../components/CreateThread';
import Navbar from "../_components/navbar";

export default function Create() {
  return (
    <div className="bg-teal-400 min-h-screen font-serif">

       <Navbar/>
        <h1 className="font-bold mt-10 font-serif text-center text-6xl text-white">Create Thread</h1>
        <div className="m-5 w-1/2 mx-auto">
          <div className="font-bold text-start text-xl px-5">
            <h2 className="font-bold text-start text-3xl mt-10 mb-2 text-white">Begin topic</h2>
            <CreateThread />
          </div>
        </div>
    </div>
  );
}
