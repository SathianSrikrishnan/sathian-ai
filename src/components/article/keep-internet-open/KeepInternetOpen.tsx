import content from './content.json'
import './timeline.css'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

/** Static, owner-reviewed editorial HTML. Never accepts visitor-provided content. */
export function KeepInternetOpen() {
  return <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop"><SiteNav /><div id="internet-open"><main dangerouslySetInnerHTML={{ __html: content.html }} /></div><SiteFooter /></div>
}
