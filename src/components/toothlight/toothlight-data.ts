export const toothlightScenes = {
  bedroom: "/v3/scenes/01-bedroom-ritual-hero.png",
  flight: "/v3/scenes/02-toothlight-flight-atlas.png",
  atlas: "/v3/scenes/03-living-atlas-field.png",
  stories: "/v3/scenes/04-story-listen-shelf.png",
  keepsake: "/v3/scenes/05-keepsake-preview.png",
  parents: "/v3/scenes/06-parent-smile-fund-layer.png",
}

export const toothlightRoutes = [
  { label: "Home", href: "/toothlight" },
  { label: "Make", href: "/toothlight/make" },
  { label: "Network", href: "/toothlight/network" },
  { label: "Stories", href: "/toothlight/stories" },
  { label: "Parents", href: "/toothlight/parents" },
]

export const ritualSteps = [
  {
    label: "Photo",
    title: "Save the tooth",
    body: "Start with the tooth photo, a drawing, a family picture, or a saved note.",
  },
  {
    label: "Words",
    title: "Keep the story",
    body: "Add the date, a title, and one line in your child's voice.",
  },
  {
    label: "Toothlight",
    title: "Make the Toothlight",
    body: "A warm card frames the real memory without hiding it.",
  },
  {
    label: "Optional",
    title: "Choose what comes next",
    body: "The card can meet stories, traditions, or a parent-controlled Smile Fund.",
  },
]

export const toothlightMotionBeats = [
  {
    time: "0.0",
    title: "Tooth pulses",
    body: "A small glow starts on the pillow, where the ritual begins.",
  },
  {
    time: "0.8",
    title: "Tanda arrives",
    body: "A warm guide light crosses the room and points toward the memory.",
  },
  {
    time: "1.6",
    title: "Card forms",
    body: "The real memory card appears inside the Toothlight field.",
  },
  {
    time: "2.8",
    title: "Network opens",
    body: "A path opens toward the wider Network.",
  },
  {
    time: "4.0",
    title: "Gift layer",
    body: "A small parent-controlled gift light appears beside the card.",
  },
]

export const makePreviewStages = [
  {
    label: "Start",
    title: "Photo or drawing",
    body: "The child, tooth, drawing, or family moment remains easy to recognize.",
  },
  {
    label: "Memory",
    title: "Title, date, and quote",
    body: "A few words make the card specific to your family.",
  },
  {
    label: "Toothlight",
    title: "A real memory card",
    body: "The light sits around the memory instead of replacing it.",
  },
  {
    label: "After",
    title: "Stories or Smile Fund",
    body: "Parents choose whether to add story paths or a small optional gift.",
  },
]

export const atlasDistricts = [
  {
    name: "Tanda Gate",
    keeper: "Tanda Faye",
    kind: "New Toothlights",
    body: "Where new family Toothlights arrive.",
    stat: "Real examples",
    accent: "#f0c456",
    x: "50%",
    y: "38%",
  },
  {
    name: "Mouse Doorway",
    keeper: "Ratoncito Perez",
    kind: "Pillow and house traditions",
    body: "Pillows, notes, receipts, and tiny proof that someone came.",
    stat: "Madrid path",
    accent: "#d7795f",
    x: "23%",
    y: "67%",
  },
  {
    name: "Kkachi Roofline",
    keeper: "Kkachi",
    kind: "Songs sent upward",
    body: "Roof throws, bird calls, and wishes sent into the air.",
    stat: "Sky path",
    accent: "#55d7cc",
    x: "36%",
    y: "30%",
  },
  {
    name: "Root Arch",
    keeper: "Root Keeper",
    kind: "Earth-return traditions",
    body: "Burial, planting, roots, soil, and memories that grow.",
    stat: "Root path",
    accent: "#7fc678",
    x: "68%",
    y: "32%",
  },
  {
    name: "River Path",
    keeper: "River Keeper",
    kind: "Release and journey",
    body: "Water traditions where the tooth is carried onward.",
    stat: "Water path",
    accent: "#62b7e8",
    x: "77%",
    y: "67%",
  },
  {
    name: "Moon Roof",
    keeper: "Moon/Roof Keeper",
    kind: "Night wishes",
    body: "Windows, rooftops, chimneys, and quiet night promises.",
    stat: "Night path",
    accent: "#c7b3ff",
    x: "83%",
    y: "45%",
  },
  {
    name: "Open Door",
    keeper: "Your family",
    kind: "Missing traditions",
    body: "Rules, songs, hiding places, and phrases only one family knows.",
    stat: "Listening",
    accent: "#ffe38a",
    x: "55%",
    y: "78%",
  },
]

export const atlasSignalNodes = [
  ["14%", "36%"],
  ["19%", "64%"],
  ["27%", "50%"],
  ["32%", "24%"],
  ["38%", "76%"],
  ["45%", "42%"],
  ["51%", "18%"],
  ["56%", "64%"],
  ["62%", "34%"],
  ["67%", "78%"],
  ["72%", "48%"],
  ["78%", "26%"],
  ["82%", "62%"],
  ["88%", "40%"],
  ["91%", "72%"],
  ["22%", "82%"],
]

export const atlasTraditionPaths = [
  {
    name: "Pillow exchange",
    district: "Mouse Doorway",
    body: "Pillows, boxes, notes, and proof that someone came.",
    accent: "#d7795f",
  },
  {
    name: "Sky wish",
    district: "Kkachi Roofline",
    body: "Songs, roof throws, birds, and wishes sent upward.",
    accent: "#55d7cc",
  },
  {
    name: "Garden promise",
    district: "Root Arch",
    body: "Teeth kept close to soil, roots, and the hope that something grows.",
    accent: "#7fc678",
  },
  {
    name: "Water journey",
    district: "River Path",
    body: "Water, roads, lanterns, and small things carried onward.",
    accent: "#62b7e8",
  },
  {
    name: "Family rule",
    district: "Open Door",
    body: "The phrase, hiding place, drawing, joke, or instruction only one home knows.",
    accent: "#ffe38a",
  },
]

export const atlasMemoryPlacements = [
  {
    district: "Open Door",
    path: "Family rule",
    signal: "A real tooth photo can hold one small wish.",
  },
  {
    district: "Tanda Gate",
    path: "First tooth",
    signal: "The original photo stays readable inside the Toothlight glow.",
  },
  {
    district: "Root Arch",
    path: "Drawing memory",
    signal: "A child drawing can stand as its own memory.",
  },
  {
    district: "Moon Roof",
    path: "Family portrait",
    signal: "A parent and child photo can become the keepsake too.",
  },
  {
    district: "Tanda Gate",
    path: "First handoff",
    signal: "A small tooth in a hand can hold the whole day.",
  },
  {
    district: "Open Door",
    path: "Drawing memory",
    signal: "A simple drawing can carry the story on its own.",
  },
]

export const atlasArrivalBeats = [
  {
    label: "Memory card",
    title: "The card stays clear",
    body: "The Toothlight remains readable as it enters the Network.",
  },
  {
    label: "Light frame",
    title: "Light shows the way",
    body: "Gold paths show where the memory can belong.",
  },
  {
    label: "Story door",
    title: "A story can open",
    body: "Each memory can meet a known tradition or a family route.",
  },
]

export const networkPulseItems = [
  {
    label: "Stories",
    title: "Friendly keepers",
    body: "Tanda, Perez, Kkachi, and the first keepers give children a way in.",
  },
  {
    label: "Cards",
    title: "Real Toothlights",
    body: "Each point can hold a photo, drawing, date, title, and quote.",
  },
  {
    label: "Traditions",
    title: "Ways families remember",
    body: "Pillows, roofs, roots, rivers, and family rules all have a place.",
  },
  {
    label: "Family door",
    title: "Your version belongs",
    body: "A private phrase, drawing, roof toss, pillow note, or wish can belong.",
  },
]

export const storyShelves = [
  {
    title: "Keeper stories",
    body: "Meet Tanda, Perez, Kkachi, and the first keepers.",
    href: "/toothfairy/stories",
  },
  {
    title: "Listen together",
    body: "Short read-alouds for bedtime and quiet moments.",
    href: "/toothlight/stories",
  },
  {
    title: "Your family's ritual",
    body: "Add the rule, song, phrase, or hiding place your child already knows.",
    href: "/toothfairy/app/draw?from=toothlight-v3-stories",
  },
]

export const listenModes = [
  {
    label: "Read",
    title: "Short chapters",
    body: "Keeper stories children can follow before bed.",
  },
  {
    label: "Listen",
    title: "Read-alouds",
    body: "Quiet versions for a slower evening pace.",
  },
  {
    label: "Find",
    title: "Find a path",
    body: "Pillow, roof, root, river, moon, and family paths keep the world easy to browse.",
  },
  {
    label: "Return",
    title: "Back to my card",
    body: "Every story path can lead back to the child's own Toothlight.",
  },
]

export const parentTrustItems = [
  {
    title: "The memory leads",
    body: "The Toothlight card carries the photo, words, and moment first.",
  },
  {
    title: "Adults approve key choices",
    body: "Sharing and gift decisions wait for parent review.",
  },
  {
    title: "Photos stay recognizable",
    body: "Style choices keep the child, tooth, and family context clear.",
  },
  {
    title: "Easy to find again",
    body: "Families need a plain path back to the keepsake when they want it.",
  },
]

export const parentAssuranceRows = [
  {
    title: "Adult consent",
    body: "Sharing and gift actions wait for parent review.",
  },
  {
    title: "Recognizable photos",
    body: "Default styles enhance the image while keeping the child recognizable.",
  },
  {
    title: "Optional Smile Fund",
    body: "A gift can sit beside the memory and is never required.",
  },
  {
    title: "Easy return",
    body: "Parents need a simple way back to the keepsake.",
  },
]

export const filterReviewRules = [
  {
    title: "Recognizable people",
    body: "Faces and family relationships should still look like themselves.",
  },
  {
    title: "Visible tooth or drawing",
    body: "The lost tooth, drawing, or family photo should remain easy to see.",
  },
  {
    title: "No strange marks",
    body: "Unreadable text, watermarks, and interface marks do not belong on the card.",
  },
  {
    title: "Feels right as a card",
    body: "The finished Toothlight should feel clear, warm, and worth keeping.",
  },
]
