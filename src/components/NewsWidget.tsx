import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { getNews, NewsArticle } from '../api/alpacaService';
import { Newspaper, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsWidget() {
  const { watchlist, alpacaKeys } = useStore();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchNews = async () => {
      setLoading(true);
      // Fetch news for the top 5 watchlist symbols, or general news if empty
      const symbolsToFetch = watchlist.slice(0, 5);
      const data = await getNews(symbolsToFetch, alpacaKeys);
      if (active) {
        setNews(data);
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // refresh every 5 mins

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [watchlist, alpacaKeys]);

  return (
    <div className="bento-card h-full flex flex-col bg-slate-900 border-slate-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Newspaper size={14} /> Market News
        </h2>
        {loading && <span className="text-[10px] text-slate-500 animate-pulse">Updating...</span>}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {news.length === 0 && !loading && (
          <div className="text-xs text-slate-500 text-center py-4">No recent news found.</div>
        )}
        
        {news.map(article => (
          <a 
            key={article.id} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 transition-all hover:border-slate-700"
          >
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
                {article.headline}
              </h3>
              <ExternalLink size={12} className="text-slate-600 shrink-0 mt-0.5 group-hover:text-emerald-500" />
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
              {article.summary}
            </p>
            <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono uppercase">
              <span>{article.source}</span>
              <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
