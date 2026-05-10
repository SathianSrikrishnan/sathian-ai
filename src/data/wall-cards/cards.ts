import { WallCard } from './types'

export const wallCards: WallCard[] = [
  // ── 1. Ireland ──────────────────────────────────────────
  {
    id: 'irish-leprechaun',
    slug: 'irish-leprechaun',
    title: 'Anna Bogle and the Gap in the Gold',
    region: 'Ireland',
    continent: 'Europe',
    characterName: 'Anna Bogle',
    image: '/story-assets/anna/v2/finals/story7-frame-01-cover.png',
    miniStory:
      'Ryan expects gold for his lost tooth, but Grandad remembers an older story and Anna Bogle hears the gift going cold. Tanda arrives carefully, not to replace Anna, but to listen to why old keepers guard their promises. The tooth becomes proof that gold can mark a memory without becoming the point.',
    theme: 'Trust',
    featured: true,
    linkedFullStory: 'anna-bogle',
    coordinates: { lat: 53.35, lng: -6.26 },
    source: 'Story 7 approved production draft / Ireland Anna Bogle lane',
  },

  // ── 2. South Korea ──────────────────────────────────────
  {
    id: 'korean-magpie',
    slug: 'korean-magpie',
    title: 'Kkachi and the Roof Song',
    region: 'South Korea',
    continent: 'Asia',
    characterName: 'Kkachi the Magpie',
    image: '/story-assets/korea/v2/kkachi-story-card.png',
    miniStory:
      'Jiyoon wants to make Grandmother\'s roof song faster, brighter, and cooler. Kkachi the Magpie hears the shiny remix right away, but she will not accept a song that has lost the family voice inside it. On the roof, Tanda learns to keep Toothlight quiet while Kkachi listens for the old words, the missing line, and the memory that makes the ritual true.',
    theme: 'Listening',
    featured: true,
    linkedFullStory: 'korea',
    coordinates: { lat: 37.57, lng: 126.98 },
    source: 'tfn-story-bible.md / Korea entry',
  },

  {
    id: 'philippines-one-year-wish',
    slug: 'philippines-one-year-wish',
    title: 'Daga and the One-Year Wish',
    region: 'Philippines',
    continent: 'Asia',
    characterName: 'Daga',
    image: '/story-assets/daga-one-year-wish/site/story-06-story-card.png',
    miniStory:
      'Maya wants her wish now, but Lola remembers a roof mouse who hides a tooth for one full year. Daga keeps the promise tucked between roof dust, calendar light, and the exact place a child will forget until she is ready to remember. Tanda can read the map, but even she cannot hurry magic that needs time to answer.',
    theme: 'Patience',
    featured: true,
    linkedFullStory: 'daga-one-year-wish',
    coordinates: { lat: 14.6, lng: 120.98 },
    source: 'Story 6 approved production draft / Philippines family-version lane',
  },

  // ── 3. Cherokee Nation ──────────────────────────────────
  {
    id: 'cherokee-beaver',
    slug: 'cherokee-beaver',
    title: 'The Beaver Circuit',
    region: 'Cherokee Nation',
    continent: 'Americas',
    characterName: 'Beaver',
    image: '/story-assets/cherokee/ch-01-home.jpg',
    miniStory:
      'When a tooth comes loose in Cherokee country, you don\'t sit still. You lace up your shoes. You face East and you RUN — around the house, four full laps, shouting at the top of your lungs: "Beaver! Put a new tooth in my jaw!" By the fourth lap, lungs burning, legs shaking, a voice comes from the roofline. "I heard you," Beaver says. "All four times." He has been building things since the rivers were young. Dams. Lodges. Whole worlds from sticks and mud. But a child\'s tooth? That is his favorite material.',
    theme: 'Bravery',
    linkedFullStory: 'cherokee',
    coordinates: { lat: 35.5, lng: -83.5 },
    source: 'tfn-story-bible.md / Cherokee entry',
  },

  // ── 4. Ethiopia ─────────────────────────────────────────
  {
    id: 'waraba-edge-light',
    slug: 'waraba-edge-light',
    title: 'Waraba at the Edge of the Light',
    region: 'Ethiopia / Harar',
    continent: 'Africa',
    characterName: 'Waraba',
    image: '/story-assets/waraba-edge-light/v1/support/s5-landscape-story-card.png',
    miniStory:
      'Ilyas can joke about anything, especially fear. But when his tooth falls out, the old family way asks him to step beyond the kitchen light and offer it to the dark. Tanda comes only to the edge, because this ritual belongs to Waraba: enormous, silent, amber-eyed, and gentle enough to receive a child who walks with fear until it becomes part of the story.',
    theme: 'Courage',
    featured: true,
    linkedFullStory: 'waraba-edge-light',
    coordinates: { lat: 9.31, lng: 42.12 },
    source: 'Story 5 approved production draft / Ethiopia-Harar lane',
  },

  // ── 5. Finland ──────────────────────────────────────────
  {
    id: 'finnish-fairy',
    slug: 'finnish-fairy',
    title: 'Hammaskeiju vs. Hammaspeikko',
    region: 'Finland',
    continent: 'Europe',
    characterName: 'Hammaskeiju',
    image: '/story-assets/finland/fi-01-bedroom.jpg',
    miniStory:
      'Tonight two visitors race toward the same pillow in Helsinki. Hammaspeikko, the Tooth Troll, cackles through the birch forest — he LOVES dirty teeth. But Hammaskeiju, the Tooth Fairy of Finland, is faster. She dives under the northern lights, wings cutting through the cold. "Not tonight, Troll." She snatches the tooth one heartbeat before his stubby fingers reach the pillowcase. "This child brushed every single night," she says, holding the clean tooth to the aurora. "This one is MINE."',
    theme: 'Growing Up',
    featured: true,
    linkedFullStory: 'finland',
    coordinates: { lat: 60.17, lng: 24.94 },
    source: 'tfn-story-bible.md / Finland entry',
  },

  // ── 6. Romania ──────────────────────────────────────────
  {
    id: 'romanian-crow',
    slug: 'romanian-crow',
    title: 'The Crow',
    region: 'Romania',
    continent: 'Europe',
    characterName: 'The Crow',
    image: '/story-assets/romania/ro-01-bedroom.jpg',
    miniStory:
      'In the Carpathian Mountains, a child throws a tooth into the night sky and shouts the old dare: "Take my milk tooth — bring me a STEEL one!" A shadow catches it mid-flight, in total darkness, without missing a beat. "I am The Crow," says the voice above. "I have been catching teeth since before your great-grandmother was born." He flies higher than any bird should, past cloud and stone, and by the time he arrives where he is going the little milk tooth has hardened in his talons to something that feels like iron.',
    theme: 'Transformation',
    linkedFullStory: 'romania',
    coordinates: { lat: 45.94, lng: 24.97 },
    source: 'tfn-story-bible.md / Romania entry',
  },

  // ── 7. Spain ────────────────────────────────────────────
  {
    id: 'spanish-mouse',
    slug: 'spanish-mouse',
    title: 'Ratoncito Perez',
    region: 'Spain',
    continent: 'Europe',
    characterName: 'Ratoncito Perez',
    image: '/story-assets/perez/pz-01-bedroom.jpg',
    miniStory:
      'Behind the walls of a bakery on Calle del Arenal in Madrid lives a mouse who has been on royal duty since 1894 — the year the young King of Spain lost his first tooth and asked for HIM. "Buenas noches!" Perez whispers, squeezing through a crack no wider than a pencil. Past the sleeping cat. Under the creaky door. He inspects the tooth with the seriousness of a jeweler, leaves a shiny coin, and runs — fast as his little legs will carry him — across the moonlit rooftops of Madrid to a place even a king cannot buy his way into.',
    theme: 'Cultural Identity',
    featured: true,
    linkedFullStory: 'ratoncito-perez',
    coordinates: { lat: 40.42, lng: -3.70 },
    source: 'tfn-story-bible.md / Spain entry',
  },

  // ── 8. North America (Tanda) ────────────────────────────
  {
    id: 'tanda-first-night',
    slug: 'tanda-first-night',
    title: 'The First Night',
    region: 'North America',
    continent: 'Americas',
    characterName: 'Tanda',
    image: '/story-assets/tooth-fairy/tf-03-lifting-tooth.jpg',
    miniStory:
      'There is a satchel that has crossed the Atlantic Ocean four hundred times, stitched by a woman in Iceland eleven centuries ago. It belongs now to a creature the size of a hummingbird named Tanda. Tonight she sits on a telephone wire in Minneapolis, wings dimmed to almost nothing, with nineteen teeth collected and twenty-eight still waiting before sunrise. She is so tired. Then she holds one tooth to the moonlight — a child\'s tooth, from a girl who named an ant "Try Again" — and something inside the story makes an eleven-hundred-year-old fairy cry.',
    theme: 'Permanence & Memory',
    featured: true,
    linkedFullStory: 'tanda',
    coordinates: { lat: 44.98, lng: -93.27 },
    source: 'tfn-story-bible.md / Tanda origin story',
  },

  // ── 9. Japan (fresh — no linked story) ──────────────────
  {
    id: 'japanese-tooth-kami',
    slug: 'japanese-tooth-kami',
    title: 'The Tooth Kami',
    region: 'Japan',
    continent: 'Asia',
    characterName: 'Haruki',
    image: '/story-assets/japan/jp-01-bedroom.jpg',
    miniStory:
      'Haruki kneels on the tatami in his grandmother\'s house and holds his bottom tooth between his thumb and finger. "Throw it high," Obaachan says. "Higher than the roof. Shout for a strong new one." He stands in the garden, pulls his arm back, and yells "Nezumi no ha to kaetemite!" — Mouse, trade me your strong tooth! The tooth arcs into the gray morning and disappears over the clay tiles. Somewhere above, the Tooth Kami — the quiet spirit who tends the only tooth shrine in all the world — catches it between two fingers and smiles. Another child growing.',
    theme: 'Growing Up',
    coordinates: { lat: 35.68, lng: 139.69 },
    source: 'global-tooth-traditions-research.md / Japan rooftop-throw custom',
  },

  // ── 10. Mongolia (fresh — no linked story) ──────────────
  {
    id: 'mongolian-dog-tooth',
    slug: 'mongolian-dog-tooth',
    title: 'Tooth for a Strong Dog',
    region: 'Mongolia',
    continent: 'Asia',
    characterName: 'Sarnai',
    image: '/story-assets/placeholder-gold.svg',
    miniStory:
      'Sarnai wraps her lost tooth in a piece of mutton fat the way her mother taught her. Outside the ger, Batu the mastiff is waiting — ears up, tail low, nose working. "Eat this and give me a strong new tooth," Sarnai says, holding the little bundle out on her flat palm. Batu sniffs once, twice, then takes it so gently his whiskers barely touch her skin. "Good dog," she whispers. In Mongolia, dogs guard the family, guard the herd, and guard the teeth of children who are brave enough to let go of something small so something stronger can grow in.',
    theme: 'Trust & Letting Go',
    coordinates: { lat: 47.92, lng: 106.92 },
    source: 'global-tooth-traditions-research.md / Mongolia dog-fat custom',
  },
]
