import SectionTitleSeparator from "./SectionTitleSeparator";

export const SectionTitle = ({ children }) => {
  return (
    <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-display font-bold text-primary font-subheading flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 uppercase tracking-widest cyber-particle-glow">
      <SectionTitleSeparator className="w-1.5 h-6 sm:w-2 sm:h-8 md:w-2.5 md:h-10 lg:w-3 lg:h-12 text-primary " />
      <span className="cyber-glow-blink">{children}</span>
    </h2>
  );
};
