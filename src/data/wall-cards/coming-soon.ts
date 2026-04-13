import { ComingSoonTradition } from './types'

/**
 * 40 coming-soon tooth traditions from around the world.
 * Sourced from MEMORY/reference/global-tooth-traditions-research.md
 *
 * Distribution:
 * - Europe: 11 (incl. Iceland, Sweden, Norway, Germany, France, Italy, Portugal, Netherlands, Poland, Czechia, Hungary)
 * - Asia: 10 (incl. India, China, Vietnam, Thailand, Philippines, Pakistan, Nepal, Cambodia, Indonesia, Malaysia)
 * - Middle East: 3 (Turkey, Iran/Iraq, Lebanon — grouped under Asia continent)
 * - Africa: 6 (Egypt, Morocco, Nigeria, Zambia, Kenya, South Africa)
 * - Americas: 7 (Mexico, Brazil, Argentina, Colombia, El Salvador, Haiti, Jamaica)
 * - Oceania: 3 (Australia, New Zealand, Papua New Guinea)
 */
export const comingSoonTraditions: ComingSoonTradition[] = [
  // ── EUROPE (11) ─────────────────────────────────────────

  {
    id: 'german-zahnfee',
    slug: 'german-zahnfee',
    title: 'Die Zahnfee',
    region: 'Germany',
    continent: 'Europe',
    characterName: 'Zahnfee',
    coordinates: { lat: 52.52, lng: 13.40 },
    synopsis:
      'On August 22 — the night Germany officially celebrates her — the Zahnfee tucks a single gold coin inside a tiny wooden box on a child\'s bedside table. "Eine schöne kleine Perle," she whispers, lifting the milk tooth like a pearl from a clam. She has been doing this since 1980, and somewhere in Berlin, a museum is quietly collecting every box she has ever filled.',
    source: 'global-tooth-traditions-research.md / Germany #18',
  },

  {
    id: 'french-petite-souris',
    slug: 'french-petite-souris',
    title: 'La Petite Souris',
    region: 'France',
    continent: 'Europe',
    characterName: 'La Petite Souris',
    coordinates: { lat: 48.86, lng: 2.35 },
    synopsis:
      'In a Parisian apartment, a child slides a tooth under the pillow and falls asleep. Behind the wainscoting, a small grey mouse is already on her way — the same mouse Madame d\'Aulnoy wrote about in 1697, the one who once knocked the teeth out of a wicked king by pushing him from a tree. Tonight she is gentler. She leaves a coin and takes the tooth away in her teeth, and somewhere a story older than the Sun King continues.',
    source: 'global-tooth-traditions-research.md / France #8',
  },

  {
    id: 'italian-topolino',
    slug: 'italian-topolino',
    title: 'Topolino dei Denti',
    region: 'Italy',
    continent: 'Europe',
    characterName: 'Topolino',
    coordinates: { lat: 41.90, lng: 12.50 },
    synopsis:
      'In Rome, the Fatina dei Denti does not work alone. Tonight she sends Topolino — her tiny mouse assistant in a velvet vest — to a child\'s bedroom in Trastevere. He scurries up the table leg, pockets the tooth, and leaves a bright euro behind. Somewhere over Veneto, Saint Apollonia herself rides a chariot pulled by mice. The Italians, for the record, take their tooth fairies very seriously.',
    source: 'global-tooth-traditions-research.md / Italy #36',
  },

  {
    id: 'portuguese-fada',
    slug: 'portuguese-fada',
    title: 'Fada dos Dentes',
    region: 'Portugal',
    continent: 'Europe',
    characterName: 'Fada dos Dentes',
    coordinates: { lat: 38.72, lng: -9.14 },
    synopsis:
      'A grandmother in Lisbon lifts a child\'s pillow and whispers the old proverb — "Antes dentes que parentes" — better to lose teeth than relatives. The Fada dos Dentes is already on her way, slipping through tiled rooftops and laundry lines. She takes the milk tooth and leaves a coin that smells faintly of citrus and the sea.',
    source: 'global-tooth-traditions-research.md / Portugal #10',
  },

  {
    id: 'dutch-tandenfee',
    slug: 'dutch-tandenfee',
    title: 'De Tandenfee',
    region: 'Netherlands',
    continent: 'Europe',
    characterName: 'Tandenfee',
    coordinates: { lat: 52.37, lng: 4.90 },
    synopsis:
      'In a canal house in Amsterdam, a child climbs into bed with a mouth full of teeth — almost. The Tandenfee is small enough to slip beneath a windowpane and sturdy enough to lift a tooth twice her weight. She leaves a coin and a single tulip petal, because in the Netherlands even fairies bring flowers.',
    source: 'global-tooth-traditions-research.md / Netherlands #11',
  },

  {
    id: 'swedish-tandfe',
    slug: 'swedish-tandfe',
    title: 'Tandfén',
    region: 'Sweden',
    continent: 'Europe',
    characterName: 'Tandfén',
    coordinates: { lat: 59.33, lng: 18.06 },
    synopsis:
      'A child in Stockholm fills a glass of water and drops her tooth in. By morning, the tooth is gone and a ten-crown coin shines at the bottom. Tandfén — the Swedish tooth fairy — works through water like a thought through a window. Up north, the same trick is happening under aurora and ice, and it never gets old.',
    source: 'global-tooth-traditions-research.md / Sweden #3',
  },

  {
    id: 'norwegian-tannfe',
    slug: 'norwegian-tannfe',
    title: 'Tannfeen',
    region: 'Norway',
    continent: 'Europe',
    characterName: 'Tannfeen',
    coordinates: { lat: 59.91, lng: 10.75 },
    synopsis:
      'In a cabin outside Oslo, a child sets the glass of water on the windowsill where the moon can see it. The tooth bobs once and settles. Tannfeen comes silent, faster than the snow that falls outside. By dawn, the water is clear and a silver coin rests where a tooth used to be — and somewhere a fjord is one tooth richer.',
    source: 'global-tooth-traditions-research.md / Norway #2',
  },

  {
    id: 'icelandic-tonn',
    slug: 'icelandic-tonn',
    title: 'Tönn Ævintýri',
    region: 'Iceland',
    continent: 'Europe',
    characterName: 'Tönn Ævintýri',
    coordinates: { lat: 64.13, lng: -21.94 },
    synopsis:
      'On a winter night in Reykjavik, when the sky is black and the snow is loud, a child pulls a tooth and her mother says the same thing every Icelandic mother says: "Now no more candy until the new one comes." Tönn Ævintýri visits anyway. She is not strict, only fair. She leaves a coin and a small lesson about taking care of what grows back.',
    source: 'global-tooth-traditions-research.md / Iceland #5',
  },

  {
    id: 'polish-zebowa',
    slug: 'polish-zebowa',
    title: 'Zębowa Wróżka',
    region: 'Poland',
    continent: 'Europe',
    characterName: 'Zębowa Wróżka',
    coordinates: { lat: 52.23, lng: 21.01 },
    synopsis:
      'Outside Warsaw, a girl from the Miziołek family — yes, the ones from the books — places her tooth on a saucer beside her bed. The Zębowa Wróżka comes in through the keyhole, no bigger than a thimble, no quieter than a thought. She takes the tooth and leaves a coin and a piece of poppyseed cake, just for the trouble.',
    source: 'global-tooth-traditions-research.md / Poland #23',
  },

  {
    id: 'czech-zoubkova',
    slug: 'czech-zoubkova',
    title: 'Zoubková Víla',
    region: 'Czech Republic',
    continent: 'Europe',
    characterName: 'Zoubková Víla',
    coordinates: { lat: 50.08, lng: 14.43 },
    synopsis:
      'In a Prague apartment with a stove that still works the old way, a child throws a tooth over her head — behind the stove, where Czech teeth go to be heard. The Zoubková Víla lives back there with a thousand other teeth. She is building something out of them. Some say a castle. Some say a necklace. Some say she has not decided yet.',
    source: 'global-tooth-traditions-research.md / Czech Republic #21',
  },

  {
    id: 'hungarian-kiseger',
    slug: 'hungarian-kiseger',
    title: 'Kisegér',
    region: 'Hungary',
    continent: 'Europe',
    characterName: 'Kisegér',
    coordinates: { lat: 47.50, lng: 19.05 },
    synopsis:
      'In Budapest, a child drops her tooth into a bottle of wine and recites the old rhyme: "Mouse, mouse, little mouse — have you got snow-white teeth? I\'ll give you my milk tooth, give me an iron tooth." Two years later, the tooth has dissolved completely and the wine is the color of an autumn evening. Kisegér has done his work. The new teeth are coming in iron-strong.',
    source: 'global-tooth-traditions-research.md / Hungary #22',
  },

  // ── ASIA (10) ───────────────────────────────────────────

  {
    id: 'indian-sparrow',
    slug: 'indian-sparrow',
    title: 'The Sparrow Roof Throw',
    region: 'India',
    continent: 'Asia',
    characterName: 'Chidiya the Sparrow',
    coordinates: { lat: 28.61, lng: 77.21 },
    synopsis:
      'On a rooftop in Old Delhi, a child throws her lower tooth straight up and her upper tooth straight down. "Chidiya, chidiya, take this old one and give me a new one!" she calls. Somewhere a sparrow flicks her wings and dives in. By the holy basil at the temple corner, an offering is being quietly made — a tooth, a wish, a sparrow that knows what to do with both.',
    source: 'global-tooth-traditions-research.md / India #58',
  },

  {
    id: 'chinese-direction',
    slug: 'chinese-direction',
    title: 'Directional Teeth',
    region: 'China',
    continent: 'Asia',
    characterName: 'The Grandmother',
    coordinates: { lat: 39.90, lng: 116.40 },
    synopsis:
      'Lao Lao places her grandson\'s upper tooth at the foot of the bed, where teeth must rest if they want their replacements to come in straight. The lower tooth she sends to the rooftop — high, where the new one will reach upward to meet it. There is a logic to this that even physicists do not fully understand, and Lao Lao learned it from her own grandmother.',
    source: 'global-tooth-traditions-research.md / China #64',
  },

  {
    id: 'vietnamese-roof-bed',
    slug: 'vietnamese-roof-bed',
    title: 'Up to the Roof, Down to the Bed',
    region: 'Vietnam',
    continent: 'Asia',
    characterName: 'Bà Nội',
    coordinates: { lat: 21.03, lng: 105.85 },
    synopsis:
      'Bà Nội teaches her granddaughter the rule that has held for centuries in Hanoi: upper teeth go to the roof, where they reach for the sun. Lower teeth go under the bed, where they keep their feet on the ground. "Reach high but stay rooted," she says, tossing the upper tooth into the morning. The new tooth, she promises, will know exactly which direction to grow.',
    source: 'global-tooth-traditions-research.md / Vietnam #67',
  },

  {
    id: 'thai-spirit',
    slug: 'thai-spirit',
    title: 'The Spirit on the Roof',
    region: 'Thailand',
    continent: 'Asia',
    characterName: 'The Roof Spirit',
    coordinates: { lat: 13.75, lng: 100.50 },
    synopsis:
      'In a wooden house in Chiang Mai, a boy pulls a wobbly bottom tooth and his mother nods toward the roof. "There is a spirit up there," she says. "Toss it high. Ask for one that grows in fast." He throws — and catches the eye of something he cannot see — and somewhere above the wooden tiles, a quiet hand catches what he cannot.',
    source: 'global-tooth-traditions-research.md / Thailand #69',
  },

  {
    id: 'philippine-mouse',
    slug: 'philippine-mouse',
    title: 'The One-Year Wish',
    region: 'Philippines',
    continent: 'Asia',
    characterName: 'Daga the Mouse',
    coordinates: { lat: 14.60, lng: 120.98 },
    synopsis:
      'In Cebu, a child throws her tooth onto the bahay-kubo roof and asks Daga the mouse for a strong new one. But there is a second tradition, quieter and older — she hides her next tooth in a special place, somewhere only she knows. If she can find it again exactly one year later, she gets a second wish. Some children never look. Some find it on the day.',
    source: 'global-tooth-traditions-research.md / Philippines #70',
  },

  {
    id: 'pakistani-river',
    slug: 'pakistani-river',
    title: 'The Cotton-Wrapped Tooth',
    region: 'Pakistan',
    continent: 'Asia',
    characterName: 'The River',
    coordinates: { lat: 33.69, lng: 73.05 },
    synopsis:
      'A girl in Islamabad wraps her tooth in white cotton and walks with her grandfather to the river at sunset. He shows her how to release it — palm down, soft as a leaf falling. The cotton drifts a moment, then sinks, and the river carries the tooth somewhere her grandfather has never been and will never go. "It belongs to the water now," he says.',
    source: 'global-tooth-traditions-research.md / Pakistan #62',
  },

  {
    id: 'nepali-burial',
    slug: 'nepali-burial',
    title: 'Hidden from the Birds',
    region: 'Nepal',
    continent: 'Asia',
    characterName: 'The Hidden Tooth',
    coordinates: { lat: 27.71, lng: 85.32 },
    synopsis:
      'In a village above Kathmandu, a boy digs a small hole behind the prayer flags and buries his tooth deep — deep enough that no bird can find it. In Nepal, the birds are the enemy. They want what is yours. He pats down the dirt, whispers a wish, and trusts the mountain to keep his secret until the new tooth comes.',
    source: 'global-tooth-traditions-research.md / Nepal #60',
  },

  {
    id: 'cambodian-direction',
    slug: 'cambodian-direction',
    title: 'Roof and Bed',
    region: 'Cambodia',
    continent: 'Asia',
    characterName: 'The Grandmother',
    coordinates: { lat: 11.55, lng: 104.92 },
    synopsis:
      'In a stilt house outside Phnom Penh, a grandmother takes her grandson\'s lower tooth and tosses it onto the thatch above. The upper one she places gently under his sleeping mat. "The roof remembers," she says. "The earth remembers. The new tooth will remember which way to grow." He believes her. He has no reason not to.',
    source: 'global-tooth-traditions-research.md / Cambodia #68',
  },

  {
    id: 'indonesian-throw',
    slug: 'indonesian-throw',
    title: 'The Backward Throw',
    region: 'Indonesia',
    continent: 'Asia',
    characterName: 'Putri',
    coordinates: { lat: -6.21, lng: 106.85 },
    synopsis:
      'Putri stands in the courtyard in Jakarta with her back to the house, tooth pinched between her fingers. "Throw it straight," her mother warns. "Crooked throw, crooked teeth." Putri inhales, focuses, and hurls the tooth backward over her shoulder, over the roof, into the sky. It vanishes clean. She turns and grins. Her dentist, decades from now, will be impressed.',
    source: 'global-tooth-traditions-research.md / Indonesia #71',
  },

  {
    id: 'malaysian-soil',
    slug: 'malaysian-soil',
    title: 'Returned to the Earth',
    region: 'Malaysia',
    continent: 'Asia',
    characterName: 'The Soil',
    coordinates: { lat: 3.14, lng: 101.69 },
    synopsis:
      'In a kampung outside Kuala Lumpur, a girl kneels in the soft red dirt under the rambutan tree and digs a small hole with her finger. She drops her tooth in. She covers it gently. "From the earth, back to the earth," her mother says. The tree above will know. The new tooth, when it comes, will know too.',
    source: 'global-tooth-traditions-research.md / Malaysia #72',
  },

  // ── MIDDLE EAST (3, grouped under Asia) ─────────────────

  {
    id: 'turkish-profession',
    slug: 'turkish-profession',
    title: 'The Profession Burial',
    region: 'Turkey',
    continent: 'Asia',
    characterName: 'The Family',
    coordinates: { lat: 41.01, lng: 28.98 },
    synopsis:
      'In Istanbul, a family gathers in the kitchen with one small tooth on the table between them. "Where do we plant it?" the father asks. The library, says the mother — for a writer. The hospital, says the grandmother — for a doctor. The football pitch, says the boy himself. They walk to the pitch. They bury it under the goalpost. His future, they have decided, is now in the ground.',
    source: 'global-tooth-traditions-research.md / Turkey #46',
  },

  {
    id: 'iranian-sky',
    slug: 'iranian-sky',
    title: 'A Tooth for the Sky',
    region: 'Iran',
    continent: 'Asia',
    characterName: 'The Sky',
    coordinates: { lat: 35.69, lng: 51.39 },
    synopsis:
      'On a flat rooftop in Tehran, a girl holds her tooth toward the night sky and whispers the prayer her grandmother taught her — a prayer older than the Persian word for prayer. She throws. The tooth catches the moon for a half-second, then disappears. Somewhere above, something receives it. Somewhere below, a strong new tooth has already begun.',
    source: 'global-tooth-traditions-research.md / Jordan/Iran/sky throw #39',
  },

  {
    id: 'lebanese-sun',
    slug: 'lebanese-sun',
    title: 'Sun, Mouse, Gold',
    region: 'Lebanon',
    continent: 'Asia',
    characterName: 'The Sun',
    coordinates: { lat: 33.89, lng: 35.50 },
    synopsis:
      'In Beirut, a child stands at the edge of the sea and chants the line his grandmother taught him: "Oh sun, oh sun, take the mouse\'s tooth and give me a gold tooth." He throws. The tooth sails into the surf. The sun, ten thousand miles away, takes the call. The mouse, behind the wall back home, makes a note.',
    source: 'global-tooth-traditions-research.md / Lebanon #41',
  },

  // ── AFRICA (6) ──────────────────────────────────────────

  {
    id: 'egyptian-sun',
    slug: 'egyptian-sun',
    title: 'Donkey for a Gazelle',
    region: 'Egypt',
    continent: 'Africa',
    characterName: 'Shams the Sun',
    coordinates: { lat: 30.04, lng: 31.24 },
    synopsis:
      'In Cairo, a boy wraps his tooth in tissue, climbs to the rooftop, and shouts into the morning sun: "Ya Shams, ya Shams — take this donkey\'s tooth and give me a gazelle\'s tooth!" The Sun, who has been doing this for thirteen centuries and counting, takes the trade. By the time the boy comes down for breakfast, the new tooth is already on its way in — fast and light, the way a gazelle moves.',
    source: 'global-tooth-traditions-research.md / Egypt #38',
  },

  {
    id: 'moroccan-sun',
    slug: 'moroccan-sun',
    title: 'Pillow, Then Sun',
    region: 'Morocco',
    continent: 'Africa',
    characterName: 'Shams',
    coordinates: { lat: 33.97, lng: -6.85 },
    synopsis:
      'In Rabat, a girl sleeps with her tooth under her pillow — but only for one night. At dawn, her mother wakes her, leads her to the courtyard, and helps her hurl the tooth at the rising sun. "Donkey for a gazelle," her mother prompts. The girl repeats it loud and clear. The sun catches the tooth between rays and sends back a strong one.',
    source: 'global-tooth-traditions-research.md / Morocco #43',
  },

  {
    id: 'nigerian-stones',
    slug: 'nigerian-stones',
    title: 'Count, Throw, Run',
    region: 'Nigeria',
    continent: 'Africa',
    characterName: 'The Yoruba Child',
    coordinates: { lat: 6.52, lng: 3.38 },
    synopsis:
      'In a Lagos courtyard, a girl closes her eyes, holds six stones and one tooth in her fist, and counts to six out loud. "I want my tooth back!" she shouts — then opens her hand and HURLS everything into the air. She runs. She does not look back. The old tooth has been left behind on purpose. The new one is already chasing her home.',
    source: 'global-tooth-traditions-research.md / Nigeria #51',
  },

  {
    id: 'zambian-charcoal',
    slug: 'zambian-charcoal',
    title: 'Charcoal West, Tooth East',
    region: 'Zambia',
    continent: 'Africa',
    characterName: 'The Bemba Child',
    coordinates: { lat: -15.42, lng: 28.28 },
    synopsis:
      'A Bemba boy in Lusaka holds two things in two hands: a piece of charcoal in his right, his lost tooth in his left. He turns to the west and throws the charcoal toward the setting sun. He turns to the east and throws the tooth toward where dawn will come. "As the charcoal sinks with the sun, a new tooth will rise with the dawn." He has been told this since he could walk.',
    source: 'global-tooth-traditions-research.md / Zambia Bemba #48',
  },

  {
    id: 'kenyan-throw',
    slug: 'kenyan-throw',
    title: 'Between the Legs',
    region: 'Kenya',
    continent: 'Africa',
    characterName: 'The Western Child',
    coordinates: { lat: -1.29, lng: 36.82 },
    synopsis:
      'In western Kenya, where the practice has lived for generations, a child stands feet apart and bends slightly forward. The tooth goes in his fist, his arm goes between his legs, and he throws it backward without turning to look. Tradition says it must vanish behind him. Tradition says he must walk forward without ever asking where it went.',
    source: 'global-tooth-traditions-research.md / Eastern Uganda/Western Kenya #55',
  },

  {
    id: 'south-african-tandemuis',
    slug: 'south-african-tandemuis',
    title: 'Tandemuis',
    region: 'South Africa',
    continent: 'Africa',
    characterName: 'Tandemuis',
    coordinates: { lat: -25.75, lng: 28.19 },
    synopsis:
      'Outside Pretoria, a child slides her tooth into the toe of her favorite slipper and sets the pair by the bed — like she has always done. Tandemuis comes overnight. Not a fairy. A mouse. He fills the slipper with a small handful of treats, takes the tooth, and is gone before the rooster crows. By morning, the slipper is heavier and the smile is one tooth lighter.',
    source: 'global-tooth-traditions-research.md / South Africa #52',
  },

  // ── AMERICAS (7) ────────────────────────────────────────

  {
    id: 'mexican-raton',
    slug: 'mexican-raton',
    title: 'El Ratón de los Dientes',
    region: 'Mexico',
    continent: 'Americas',
    characterName: 'El Ratón',
    coordinates: { lat: 19.43, lng: -99.13 },
    synopsis:
      'In a Mexico City apartment, a girl tucks her tooth under the pillow and listens — really listens — for the soft scratch of tiny feet on the floorboards. El Ratón de los Dientes has been in the country for over a hundred years. Some nights he leaves a peso. Some nights a single dulce. Always something. Always before sunrise.',
    source: 'global-tooth-traditions-research.md / Mexico/Latin America mouse',
  },

  {
    id: 'brazilian-bird',
    slug: 'brazilian-bird',
    title: 'The Bird Inspector',
    region: 'Brazil',
    continent: 'Americas',
    characterName: 'O Pássaro',
    coordinates: { lat: -22.91, lng: -43.17 },
    synopsis:
      'In a Rio backyard, a boy holds his tooth up to the sky and his mother gives him the warning every Brazilian child knows: "If the tooth is dirty, the bird will not take it." He scrubs it once with his shirt. He throws it high into the laundry-line air. A small bird drops down, inspects it, judges it, and accepts. Brazil\'s birds have standards.',
    source: 'global-tooth-traditions-research.md / Brazil #93',
  },

  {
    id: 'argentinian-water',
    slug: 'argentinian-water',
    title: 'El Ratoncito y el Vaso',
    region: 'Argentina',
    continent: 'Americas',
    characterName: 'El Ratoncito',
    coordinates: { lat: -34.61, lng: -58.38 },
    synopsis:
      'In a Buenos Aires bedroom, a girl fills a glass of water and drops her tooth in. By morning, the glass is empty. No tooth. No water. Just a coin shining at the bottom and a small wet trail on the bedside table. El Ratoncito drank everything. He is the most efficient mouse in South America.',
    source: 'global-tooth-traditions-research.md / Argentina #94',
  },

  {
    id: 'colombian-miguelito',
    slug: 'colombian-miguelito',
    title: 'El Ratón Miguelito',
    region: 'Colombia',
    continent: 'Americas',
    characterName: 'Miguelito',
    coordinates: { lat: 4.71, lng: -74.07 },
    synopsis:
      'In Bogotá, the mouse has a name, and the name is Miguelito. A child writes her name on a small piece of paper and leaves it under her pillow next to her tooth so Miguelito knows whose room he is in. He always brings something. He never gets confused. Colombia\'s tooth mouse is a personable individual with excellent records.',
    source: 'global-tooth-traditions-research.md / Colombia #95',
  },

  {
    id: 'salvadoran-rabbit',
    slug: 'salvadoran-rabbit',
    title: 'El Conejo',
    region: 'El Salvador',
    continent: 'Americas',
    characterName: 'El Conejo',
    coordinates: { lat: 13.69, lng: -89.22 },
    synopsis:
      'In San Salvador, a boy slides his tooth under the pillow and waits not for a fairy, not for a mouse, but for a rabbit. El Conejo doesn\'t care if the tooth is clean or grimy. He doesn\'t care if you brushed. He takes them all. He hops in, he hops out, and he leaves something small in his place — every time, no judgment. The tooth bunny of El Salvador is the kindest of them all.',
    source: 'global-tooth-traditions-research.md / El Salvador #96',
  },

  {
    id: 'haitian-rat',
    slug: 'haitian-rat',
    title: 'The Roof Rat',
    region: 'Haiti',
    continent: 'Americas',
    characterName: 'The Rat',
    coordinates: { lat: 18.59, lng: -72.30 },
    synopsis:
      'In Port-au-Prince, a girl steps onto the porch and throws her tooth high onto the tin roof above her head. "Take my old tooth, give me a good one!" she calls. The rat — who lives somewhere up there with all the teeth Haiti has ever lost — hears her. He always hears. He never replies. He just gets to work.',
    source: 'global-tooth-traditions-research.md / Haiti #100',
  },

  {
    id: 'jamaican-rolling-calf',
    slug: 'jamaican-rolling-calf',
    title: 'Shake the Tin Can',
    region: 'Jamaica',
    continent: 'Americas',
    characterName: 'The Rolling Calf',
    coordinates: { lat: 18.10, lng: -77.30 },
    synopsis:
      'In a yard in Kingston, a child drops her tooth into a tin can and SHAKES it — hard, loud, fearless. The Rolling Calf, the chain-dragging bull spirit that hunts the parishes after dark, will not come close to a noise like that. The shaking lasts only a minute. The tooth is safe. The new one is on its way. The Calf, somewhere out beyond the cane fields, snorts and turns away.',
    source: 'global-tooth-traditions-research.md / Jamaica #99',
  },

  // ── OCEANIA (3) ─────────────────────────────────────────

  {
    id: 'australian-pandanus',
    slug: 'australian-pandanus',
    title: 'The Pandanus Plant',
    region: 'Australia',
    continent: 'Oceania',
    characterName: 'The Mother',
    coordinates: { lat: -12.46, lng: 130.84 },
    synopsis:
      'In an Aboriginal community near Darwin, a mother takes her child\'s lost tooth and slips it gently into the new shoot of a pandanus plant — the same plant whose leaves clean teeth and whose roots ease toothaches. The plant takes the tooth in. The tooth becomes part of the plant. The child grows. The plant grows. Some traditions don\'t need a fairy at all.',
    source: 'global-tooth-traditions-research.md / Aboriginal Australia #79',
  },

  {
    id: 'maori-river',
    slug: 'maori-river',
    title: 'The River Throw',
    region: 'New Zealand',
    continent: 'Oceania',
    characterName: 'The River',
    coordinates: { lat: -36.85, lng: 174.76 },
    synopsis:
      'On the bank of an Auckland river, a Māori grandfather hands his moko a small white tooth. "Awa," he says — the river. "She will hold it for you." The boy throws. The tooth disappears with a soft plip. The grandfather smiles. Nothing has been lost. Everything has been given back to the water that gives back, eventually, to all of us.',
    source: 'global-tooth-traditions-research.md / Maori New Zealand #81',
  },

  {
    id: 'papuan-ancestor',
    slug: 'papuan-ancestor',
    title: 'Beside the Ancestors',
    region: 'Papua New Guinea',
    continent: 'Oceania',
    characterName: 'The Ancestors',
    coordinates: { lat: -9.44, lng: 147.18 },
    synopsis:
      'In a village in the Papuan highlands, a grandmother takes her grandson\'s lost tooth to the ancestor\'s grave at the edge of the garden. She kneels, presses the tooth into the earth, and tells her father — long passed — to please hold it for the boy. "Until he comes to join you," she whispers. "But not for a long, long time." The tooth is safe. The lineage is intact.',
    source: 'global-tooth-traditions-research.md / New Guinea #82',
  },
]
