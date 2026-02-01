import { GraduationCap } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
        <GraduationCap size={32} />
      </div>

      <span className="text-2xl font-bold tracking-wide">Examy</span>
    </div>
  );
};

export default Logo;
