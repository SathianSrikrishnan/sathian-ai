export type Continent = "Asia" | "Europe" | "Africa" | "Americas" | "Oceania";

export interface WallCard {
  id: string;                                   // slug, e.g. "korean-magpie"
  slug: string;                                 // URL slug (matches id)
  title: string;                                // "The Magpie's Song"
  region: string;                               // "Korea"
  continent: Continent;
  characterName: string;                        // "Kkachi the Magpie"
  image: string;                                // /story-assets/korea/kr-01-bedroom.jpg
  miniStory: string;                            // 5-6 sentences
  theme: string;                                // primary theme
  featured?: boolean;                           // hero-sized tile on the wall
  linkedFullStory?: string;                     // optional slug pointing to src/data/stories/
  coordinates: { lat: number; lng: number };    // globe marker location
  source: string;                               // citation
}

export interface ComingSoonTradition {
  id: string;
  slug: string;
  title: string;                                // e.g., "La Petite Souris"
  region: string;                               // e.g., "France"
  continent: Continent;
  characterName: string;                        // e.g., "La Petite Souris"
  coordinates: { lat: number; lng: number };
  synopsis: string;                             // 2-3 sentences hook-style
  source: string;
}
