"use client";

import { useEffect, useState } from "react";

const categories = [
  "general", "technology", "business", "sports", "health", "entertainment"
];

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Haberleri çek - ARTIK KENDİ API ROUTE'UNDAN
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError("");
      
      try {
        // ÖNCEKİ: NewsAPI'yi direkt çağırıyorduk
        // YENİ: Kendi API route'umuzu çağırıyoruz
        const response = await fetch(
          `/api/news?category=${category}`
        );
        const data = await response.json();
        
        console.log("API Response:", data);
        
        if (data.articles) {
          setArticles(data.articles);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("No articles found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch news");
      }
      
      setLoading(false);
    };
    fetchNews();
  }, [category]);

  // Arama filtresi
  const filteredArticles = articles.filter((article: any) =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-700">
      {/* HEADER - AYNİ KALIYOR */}
      <header className="w-full bg-red-500 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-white text-xl md:text-3xl font-bold">
              📰 Today's News
            </h1>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden md:block w-64 px-4 py-2 placeholder-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          
          <div className={`${menuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row gap-3`}>
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:hidden w-full px-4 py-2 placeholder-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-white"
            />
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-full transition-all capitalize ${
                    category === cat
                      ? "bg-white text-red-500 font-semibold shadow-md"
                      : "bg-red-400 text-white hover:bg-white hover:text-red-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* HABERLER - AYNİ KALIYOR */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300  rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300  rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article: any, index: number) => (
              <article 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <a 
                  href={article.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    {article.urlToImage ? (
                      <img 
                        src={article.urlToImage} 
                        alt={article.title} 
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <span className="text-6xl">📰</span>
                        <p className="mt-2 font-semibold">No Image Available</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{article.source.name}</span>
                      <span className="text-red-500 hover:text-red-700 font-semibold">
                        Read More →
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}