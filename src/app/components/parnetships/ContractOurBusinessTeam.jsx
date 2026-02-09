export const ContractOurBusinessTeam = () => {
  return (
    <section className="py-12 md:py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto text-center border-2 border-primary/20 rounded-3xl p-8 md:p-16 bg-primary/5 backdrop-blur-sm">
        <p className="text-[12px] md:text-[18px] tracking-normal text-gray-400 mb-8">
          Reach out to our business team to discuss investment opportunities,
          <br />
          partnerships, or learn more about our IP development engine.
        </p>
        <h2 className="font-subheading  text-2xl md:text-5xl text-white mb-12 tracking-wider">
          INTERESTED IN OUR <span className="text-primary glow-text">PIPELINE</span>
          <br />
          OR <span className="text-primary glow-text">METHODOLOGY?</span>
        </h2>
        <a
          className="inline-flex items-center gap-4 px-8 py-4 bg-primary text-black font-subheading font-bold tracking-widest text-sm rounded-sm hover:bg-white transition-all group"
          href="mailto:partners@edenstone.group"
        >
          CONTACT OUR BUSINESS TEAM
        </a>
      </div>
    </section>
  );
};
