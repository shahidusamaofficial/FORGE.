'use client'

const values = [
  {
    label: "Craft",
    body: "Measured, not marketed. GSM disclosed on every product page. Seams double-stitched on stress points. Pre-shrunk fabric. The numbers mean what they say.",
  },
  {
    label: "Comfort",
    body: "Relaxed fits, not oversized. Drop-shoulder, not boxy. Polos with collars that sit flat. Clothing you'd reach for on an ordinary Tuesday morning without thinking about it.",
  },
  {
    label: "Quiet Confidence",
    body: "No loud logos. No all-over graphics. No neon. Branding is a small woven label at the hem and a debossed wordmark inside the collar. The clothing lets the wearer lead.",
  },
  {
    label: "Cultural Roots",
    body: "Earth tones drawn from the Pakistani forge tradition — Wazirabad cutlery, Faisalabad textile mills, Lahore brick kilns — without crossing into costume-y ethnic territory. Unambiguously Pakistani without performing Pakistani-ness.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-[#1A1614] text-[#FAF7F2] px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-16">
          <div className="md:col-span-4">
            <p className="brand-eyebrow text-[#8B5A3C] mb-3">01 — Foundation</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-[#FAF7F2]">
              Where material becomes object.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-5 text-sm md:text-base text-[#FAF7F2] leading-relaxed">
            <p>
              A forge is where raw material is heated, hammered, and shaped into something durable — a knife that holds its edge through a hundred dinners, a hinge on a door that swings for decades, a tool passed down to the next maker. Nothing leaves a forge that wasn&apos;t intentionally built. Wazirabad in Punjab has been Pakistan&apos;s forge city for over a century — the place where the country&apos;s knives, scissors, and surgical instruments are hammered into shape, where the rhythm of strike-and-cool has been the same sound for four generations.
            </p>
            <p>
              FORGE the brand takes this exact craft logic and applies it to clothing: every garment built to be re-worn 100+ wash cycles, in earth tones drawn from the forge itself — cream ash, warm black iron, terracotta ember, olive slag, sandstone heat-patina. The uppercase wordmark <span className="font-serif font-black">FORGE<span className="text-[#8B5A3C]">.</span></span> with a terminal period signals restraint: this brand is finished thinking about itself.
            </p>
            <p className="text-[#C9BBA3] italic font-serif text-base md:text-lg">
              &ldquo;Forged for the everyday — clothing built deliberately, for the layer you reach for on an ordinary Tuesday.&rdquo;
            </p>
          </div>
        </div>

        {/* Brand values */}
        <div className="border-t border-[#3A3128] pt-12">
          <p className="brand-eyebrow text-[#8B5A3C] mb-6">Four brand values</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((v) => (
              <div
                key={v.label}
                className="border-t-2 border-[#8B5A3C] pt-4"
              >
                <h3 className="font-serif text-xl font-bold text-[#FAF7F2] mb-2">
                  {v.label}
                </h3>
                <p className="text-xs text-[#C9BBA3] leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[#3A3128] pt-12">
          {[
            { label: "Categories", value: "10" },
            { label: "Hero SKUs", value: "9" },
            { label: "Color palette", value: "5 tones" },
            { label: "Avg GSM (tees)", value: "180" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#8B5A3C] mb-1">
                {stat.value}
              </p>
              <p className="brand-eyebrow text-[#C9BBA3]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
