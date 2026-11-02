import type { Config } from 'tailwindcss'
import shared from './tailwind.config'
import dependencies from './scripts/marketing-style-dependencies.json'

// Same theme and plugins; emit only utilities reachable from public landing pages.
// Secondary route layouts import the complete utility set separately.
export default { ...shared, content: dependencies.map(file => './' + file) } satisfies Config
