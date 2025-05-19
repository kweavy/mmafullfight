interface Props {
    fighter1: string;
    fighter2: string;
    image: string;
  }
  
  export default function PopularMatchupCard({ fighter1, fighter2, image }: Props) {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-zinc-900 border border-zinc-800 hover:brightness-110 transition-all duration-300">
        <img src={image} alt={`${fighter1} vs ${fighter2}`} className="w-full h-48 object-cover" />
        <div className="p-4 text-white text-center">
          <h3 className="text-lg font-bold">{fighter1} <span className="text-red-500">vs</span> {fighter2}</h3>
        </div>
      </div>
    );
  }
  