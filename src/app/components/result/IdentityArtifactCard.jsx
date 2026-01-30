export default function IdentityArtifactCard({
  idRef = "884-XJ",
  codename = "CYHER_01",
  clearance = "L4",
  faction = "Undecided",
  accessMessage = "ACCESS GRANTED. THIS IS YOUR BADGE.",
}) {
  return (
    <div className="bg-terminal-gray/30 border border-primary/20 p-6 dot-grid relative">
      <div className="flex justify-between items-start mb-8">
        <span className="text-[9px] text-primary font-mono">ID_REF: {idRef}</span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-[10px] text-primary/60 uppercase mb-1">Operative Codename</p>
        <h2 className="text-3xl font-mono font-bold text-primary">{codename}</h2>
      </div>
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-primary/10 border border-primary/40 flex flex-wrap p-1">
          <div className="w-1/2 h-1/2 bg-primary"></div>
          <div className="w-1/2 h-1/2 p-0.5">
            <div className="w-full h-full bg-primary/20"></div>
          </div>
          <div className="w-1/2 h-1/2 p-0.5">
            <div className="w-full h-full bg-primary/20"></div>
          </div>
          <div className="w-1/2 h-1/2 bg-primary"></div>
        </div>
        <div>
          <p className="text-[10px] text-primary font-bold">CLEARANCE: {clearance}</p>
          <p className="text-[10px] text-primary/60 uppercase">Faction: {faction}</p>
          <p className="text-[8px] text-primary/40 mt-2">{accessMessage}</p>
        </div>
      </div>
    </div>
  );
}
