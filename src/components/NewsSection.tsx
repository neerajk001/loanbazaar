'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string;
}

const NewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Robust Mock data simulating an API response (fallback)
  const mockNewsArticles: Article[] = [
    {
      id: '1',
      title: "RBI keeps repo rate unchanged at 6.5% for seventh consecutive time",
      summary: "The Reserve Bank of India's Monetary Policy Committee decided to keep the key lending rate steady amidst cooling inflation, signaling stability for borrowers.",
      source: "Financial Express",
      date: "Apr 05, 2024",
      imageUrl: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
    {
      id: '2',
      title: "Home loan interest rates likely to remain stable in 2024",
      summary: "Experts predict that home loan borrowers can expect stable interest rates throughout the year as the central bank maintains its stance.",
      source: "Economic Times",
      date: "Apr 02, 2024",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
    {
      id: '3',
      title: "Personal loan demand sees 25% surge among millennials",
      summary: "A new report indicates a significant rise in personal loan applications driven by travel and lifestyle aspirations.",
      source: "Mint",
      date: "Mar 28, 2024",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
    {
      id: '4',
      title: "Tips to improve your credit score before applying for a loan",
      summary: "Learn the essential steps to boost your CIBIL score and increase your chances of loan approval with lower interest rates.",
      source: "MoneyControl",
      date: "Mar 25, 2024",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
    {
      id: '5',
      title: "Gold loans shine as preferred short-term credit option",
      summary: "With rising gold prices, borrowers are increasingly turning to gold loans for quick and easy access to credit.",
      source: "Business Standard",
      date: "Mar 20, 2024",
      imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
    {
      id: '6',
      title: "Car loan vs Personal loan: Which is better for buying a vehicle?",
      summary: "A comprehensive comparison to help you decide which financing option suits your car purchase needs better.",
      source: "NDTV Profit",
      date: "Mar 15, 2024",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
    {
      id: '7',
      title: "Investment strategies for the new financial year 2024-25",
      summary: "Top financial advisors share their insights on portfolio diversification and maximizing returns in the coming year.",
      source: "LiveMint",
      date: "Mar 10, 2024",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400",
      url: "#"
    },
     {
      id: '8',
      title: "Understanding Term Insurance: Why it's crucial for your family",
      summary: "A guide to understanding the importance of term insurance and how to choose the right plan for your family's security.",
      source: "Economic Times",
      date: "Mar 05, 2024",
      imageUrl: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?auto=format&fit=crop&q=80&w=400",
      url: "#"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        
        if (!apiKey) {
          console.log("News API key not found, using mock data");
          setArticles(mockNewsArticles);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=bank+loan+insurance+finance&language=en&sortBy=publishedAt&domains=economictimes.indiatimes.com,livemint.com,business-standard.com,moneycontrol.com&pageSize=12&apiKey=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const mappedArticles = data.articles
            .filter((article: any) => article.title) // Less strict filtering
            .slice(0, 12)
            .map((article: any, index: number) => ({
              id: `news-${index}`,
              title: article.title,
              summary: article.description || article.content || "Click to read the full story on the source website.",
              source: article.source.name,
              date: new Date(article.publishedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              imageUrl: article.urlToImage || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400", // Fallback image
              url: article.url
            }));
            
          // If we get fewer than 4 articles, append some mock ones to fill the space
          if (mappedArticles.length < 4) {
             setArticles([...mappedArticles, ...mockNewsArticles.slice(0, 8 - mappedArticles.length)]);
          } else {
             setArticles(mappedArticles);
          }
        } else {
          setArticles(mockNewsArticles);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        // Fallback to mock data on error
        setArticles(mockNewsArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 400;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="articles" className="py-16 border-t border-gray-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Financial News</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Updates from the Finance World
            </h2>
            <p className="text-gray-600 mt-2">Stay informed with the latest trends, rates, and financial advice.</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-600 transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-600 transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {articles.map((article) => (
              <div 
                key={article.id} 
                className="flex-none w-[260px] md:w-[300px] bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-md border-2 border-blue-100 overflow-hidden snap-start hover:shadow-xl hover:-translate-y-2 hover:border-orange-200 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="h-40 overflow-hidden relative shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-900 shadow-sm border border-white/20">
                    {article.source}
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-2 font-medium">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </div>
                  
                  <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                    {article.summary}
                  </p>
                  
                  <a 
                    href={article.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors mt-auto group/link"
                  >
                    Read Full Article <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
