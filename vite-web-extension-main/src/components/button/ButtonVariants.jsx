export const buttonVariants = {
  standardNeutral: {
    base: "w-full bg-yellow text-brown rounded-2xl py-3.5 font-medium border-2 border-brown",
    hover: "hover:bg-yellowLight",
    active: "active:translate-y-[10px] active:shadow-[0_0_0_#784E2F] transition-all",
    withShadow: true,
    shadowColor: "#DAB466",
    shadowHeight: 10
  },
  standardPositive: {
    base: "w-full bg-green text-brown rounded-2xl py-3.5 font-medium border-2 border-brown",
    hover: "hover:bg-greenLight",
    active: "active:translate-y-[10px] active:shadow-[0_0_0_#784E2F] transition-all",
    withShadow: true,
    shadowColor: "#98A64F",
    shadowHeight: 10
  },
  yellow: {
    base: "bg-[#FEC651] border-2 border-[#784E2F] rounded-2xl",
    hover: "hover:bg-[#fed77f]",
    active: "active:translate-y-[6px] active:shadow-[0_0_0_#784E2F] transition-all",
    withShadow: true,
    shadowColor: "#784E2F",
    shadowHeight: 6,
    selectedClass: "bg-[#FEC651]"
  },
  green: {
    base: "bg-[#ded75a] border-2 border-[#98a64f] rounded-2xl",
    hover: "hover:bg-[#e0d96c]",
    active: "active:translate-y-[6px] active:shadow-[0_0_0_#98a64f] transition-all",
    withShadow: true,
    shadowColor: "#98a64f",
    shadowHeight: 6
  },
  actionButton: {
    base: "border-2 border-[#784E2F] rounded-2xl bg-white",
    hover: "hover:bg-[#FEC651]",
    active: "active:translate-y-[6px] active:shadow-[0_0_0_#784E2F] transition-all",
    withShadow: true,
    shadowColor: "#784E2F",
    shadowHeight: 6,
    selectedClass: "bg-[#FEC651]"
  }
};