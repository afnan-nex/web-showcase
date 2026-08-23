/**
 * NEXUS STUDIO — CLIENT TESTIMONIALS DATA
 * Verified reviews, quotes, and client credentials
 */

const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote: "Nexus Studio delivered something exceedingly rare: an interface that satisfies both hardline quantitative traders and executive board members. It redefined our institutional market stature entirely.",
    author: "Elena Rostova",
    role: "Managing Director & Head of Quantitative Strategy",
    company: "Aurora Global Capital",
    location: "London / Zurich",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    project: "Aurora Financial",
    projectSlug: "aurora"
  },
  {
    id: 2,
    quote: "The interface Nexus crafted is now actively assisting clinicians in saving lives every morning. The clarity, speed, and restraint of their UX allows our medical teams to act with total confidence.",
    author: "Dr. Marcus Vance",
    role: "Chief Medical Officer & Co-Founder",
    company: "Lumina Health AI",
    location: "Boston / San Francisco",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    project: "Lumina Health AI",
    projectSlug: "lumina"
  },
  {
    id: 3,
    quote: "Working with Nexus felt like having an elite skunkworks team embedded within our engineering unit. The 3D platform they created directly won us our largest government aerospace contract.",
    author: "Julian H. Croft",
    role: "VP of Product & Government Affairs",
    company: "Vortex Aerospace",
    location: "Austin, Texas",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    project: "Vortex Dynamics",
    projectSlug: "vortex"
  },
  {
    id: 4,
    quote: "Nexus gave our hardware the digital altar it deserved. The interactive frequency simulator alone doubled our baseline conversion rate on launch day.",
    author: "Taro Takahashi",
    role: "Founder & Chief Acoustic Engineer",
    company: "Prism Acoustics Corp.",
    location: "Tokyo, Japan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    project: "Prism Spatial Audio",
    projectSlug: "prism"
  },
  {
    id: 5,
    quote: "Direct bookings surged +215% within three months. Nexus understood our conservation ethos and translated it into a digital experience that feels like pure art.",
    author: "Camille Dupont",
    role: "Managing Director",
    company: "Archipelago Reserve",
    location: "Geneva / Victoria",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    project: "Archipelago Reserve",
    projectSlug: "archipelago"
  }
];

function getAllTestimonials() {
  return TESTIMONIALS_DATA;
}
