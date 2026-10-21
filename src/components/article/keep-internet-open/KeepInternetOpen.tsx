import content from './content.json'
import './timeline.css'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { ArticleNote } from './ArticleNote'

/** Static, owner-reviewed editorial HTML. Never accepts visitor-provided content. */
export function KeepInternetOpen() {
  const openingEnd = content.html.indexOf('</section>') + '</section>'.length
  return <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop"><SiteNav /><div id="internet-open"><main><div dangerouslySetInnerHTML={{ __html: content.html.slice(0, openingEnd) }} /><ArticleNote /><div dangerouslySetInnerHTML={{ __html: content.html.slice(openingEnd) }} /></main></div><SiteFooter /></div>
}
