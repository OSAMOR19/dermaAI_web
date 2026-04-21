import { Mail, MapPin, Clock } from "lucide-react";

const infoItems = [
  {
    icon: Mail,
    title: "Contact Us",
    lines: ["info@dermal.clinic", "(123) 465 - 798"]
  },
  {
    icon: MapPin,
    title: "Our Location",
    lines: ["4517 Washington Ave. Manchester,", "Kentucky 39495"]
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Monday - Friday : 9:00 am to 6:00 pm", "Saturday : 11:00 am to 5pm"]
  }
];

export default function InfoBar() {
  return (
    <section className="bg-white py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {infoItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-5 group">
              <div className="pt-1.5 transition-transform group-hover:scale-110 duration-300">
                <item.icon className="w-8 h-8 text-foreground opacity-80" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-foreground mb-3 tracking-tight">
                  {item.title}
                </h3>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-foreground/70 font-medium text-lg leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

