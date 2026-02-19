import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { GlobalContext } from '../App';

const Home = () => {
  const { settings } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('cat');
  const [currentBanner, setCurrentBanner] = useState(0);

  // --- STATES TO LOCK PRODUCTS ---
  const [topProducts, setTopProducts] = useState([]);
  const [bottomProducts, setBottomProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FIXED IMAGES ---
  const categories = [
    { 
      name: "Stitch", 
      id: "stitch", 
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      name: "Unstitch", 
      id: "unstitch", 
      image: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
    },
    { 
      name: "Bridal/Wedding", 
      id: "bridal", 
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      name: "Perfumes", 
      id: "perfumes", 
      image: "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      name: "Handbags", 
      id: "handbags", 
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop" 
    }
  ];

  // --- FETCH & FREEZE PRODUCTS ---
  useEffect(() => {
    const fetchAndShuffle = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        
        if (categoryFilter) {
          const filtered = data.filter(p => 
            (p.category && p.category.toLowerCase().includes(categoryFilter.toLowerCase())) || 
            (p.name && p.name.toLowerCase().includes(categoryFilter.toLowerCase()))
          );
          setTopProducts(filtered);
          setBottomProducts([]); 
        } else {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          const mid = Math.ceil(shuffled.length / 2);
          setTopProducts(shuffled.slice(0, mid));    
          setBottomProducts(shuffled.slice(mid));   
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchAndShuffle();
  }, [categoryFilter]);

  // Auto Slide Banner
  useEffect(() => {
    if (settings.banners && settings.banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % settings.banners.length);
      }, 4000); 
      return () => clearInterval(interval);
    }
  }, [settings.banners]);

  return (
    <div className="pb-10 bg-gray-50">
      
      {/* 1. Dynamic Hero Slider (AUTO HEIGHT - FULL SHOW) */}
      {/* Removed fixed h-[500px] and object-cover to prevent cropping */}
      <div className="w-full relative group">
        {settings.banners && settings.banners.length > 0 ? (
          <img 
            src={settings.banners[currentBanner]} 
            alt="Banner" 
            className="w-full h-auto object-contain block transition-opacity duration-1000" 
            style={{ minHeight: '200px' }} // Taake load hotay waqt gayab na ho
          />
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center text-3xl font-serif text-gray-500 bg-gray-300">
            Elegant Styles for Her
          </div>
        )}
        
        {/* Banner Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {settings.banners?.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentBanner(idx)} className={`w-3 h-3 rounded-full shadow-md ${currentBanner === idx ? 'bg-primary scale-125' : 'bg-white'}`}></button>
            ))}
        </div>
      </div>

      {/* 2. Shop by Category */}
      <div className="custom-container my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-serif text-primary">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-2">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/?cat=${cat.id}`} className="relative h-48 md:h-64 rounded-xl overflow-hidden group shadow-lg cursor-pointer border border-gray-200">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <h3 className="text-white text-lg md:text-2xl font-bold font-serif tracking-wide border-b-2 border-transparent group-hover:border-white transition-all pb-1 text-center px-2">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Products List (TOP SECTION) */}
      <div className="custom-container px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-serif">
          {categoryFilter ? `${categoryFilter.toUpperCase()} Collection` : 'New Arrivals'}
        </h2>
        
        {loading ? (
           <p className="text-center">Loading Products...</p>
        ) : topProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded shadow p-10">
             <p className="text-gray-500 text-xl">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {topProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 4. LOWER BANNER SECTION (FULL SHOW) */}
      <div className="mt-20 w-full">
         {settings.lowerBanners && settings.lowerBanners.length > 0 ? (
            <img src={settings.lowerBanners[0]} alt="Special Offer" className="w-full h-auto object-contain" />
         ) : (
            <div className="w-full h-[200px] bg-gray-300 flex items-center justify-center text-gray-500">
                Lower Banner Area
            </div>
         )}
      </div>

      {/* 5. RANDOM PRODUCTS (BOTTOM SECTION) */}
      {!categoryFilter && bottomProducts.length > 0 && (
        <div className="custom-container px-4 mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 font-serif text-primary">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {bottomProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
      )}

      {/* 6. About Mission */}
      <div className="bg-primary text-white mt-20 py-16">
        <div className="custom-container text-center px-4">
            <h2 className="text-3xl font-serif mb-6">Our Mission</h2>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-200">{settings.aboutUsText}</p>
        </div>
      </div>
    </div>
  );
};

// --- Product Card Component ---
const ProductCard = ({ product }) => (
    <div className="border rounded-lg overflow-hidden hover:shadow-2xl transition bg-white group relative">
        <div className="relative h-80 overflow-hidden bg-gray-100">
            <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            {product.isOnSale && <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-pulse">SALE</span>}
            <Link to={`/product/${product._id}`} className="absolute bottom-0 left-0 right-0 bg-primary text-white text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-semibold">View Details</Link>
        </div>
        <div className="p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
            <h3 className="font-semibold text-lg truncate text-gray-800">{product.name}</h3>
            <div className="flex justify-center gap-3 items-center mt-2">
                <span className="text-primary font-bold text-xl">Rs. {product.isOnSale ? product.salePrice : product.price}</span>
                {product.isOnSale && <span className="text-gray-400 line-through text-sm">Rs. {product.price}</span>}
            </div>
        </div>
    </div>
);

export default Home;