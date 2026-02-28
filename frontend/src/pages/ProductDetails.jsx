import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../App';
import { toast } from 'react-toastify';
import { FaSearchPlus } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState('');
  
  const [cleanColors, setCleanColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(''); 
  const [sizeDetails, setSizeDetails] = useState('');

  // Zoom State
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  // Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSaleActive, setIsSaleActive] = useState(false);
  
  const { addToCart } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Use relative path for production
    axios.get(`/api/products/${id}`).then(res => {
        const data = res.data;
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : '');

        // Colors Fix
        let rawColors = data.colors || [];
        let fixedColors = rawColors.flatMap(c => c.split(',').map(i => i.trim())).filter(c => c !== "");
        setCleanColors(fixedColors);
        if(fixedColors.length > 0) setSelectedColor(fixedColors[0]);
        
        // Size Fix
        if(data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0].name);
            setSizeDetails(data.sizes[0].dimensions);
        }
    });
  }, [id]);

  // TIMER LOGIC (Improved)
  useEffect(() => {
    if (product && product.isOnSale && product.saleEndDate) {
      const calculateTime = () => {
        const difference = new Date(product.saleEndDate) - new Date();
        if (difference > 0) {
          setIsSaleActive(true);
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setIsSaleActive(false);
        }
      };

      calculateTime(); // Run immediately
      const timer = setInterval(calculateTime, 1000); // Run every second
      return () => clearInterval(timer);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  const handleSizeSelect = (sizeObj) => {
    setSelectedSize(sizeObj.name);
    setSizeDetails(sizeObj.dimensions);
  };

  const handleAddToCart = () => {
    if(product.sizes && product.sizes.length > 0 && !selectedSize) {
        return toast.error("Please select a Size");
    }
    addToCart(product, qty, selectedColor || 'Default', selectedSize || null);
    toast.success("Added to cart!");
    navigate('/cart');
  };

  if (!product) return <div className="p-10 text-center text-lg font-bold">Loading Product...</div>;

  return (
    <div className="custom-container py-8 px-4 md:px-8">
      {/* Changed Grid to 2 Columns for better Mobile/Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT: IMAGES */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
            
            {/* Thumbnails (Horizontal on Mobile, Vertical on Desktop) */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:h-[600px] hide-scrollbar">
                {product.images && product.images.map((img, i) => (
                    <img 
                        key={i} 
                        src={img} 
                        onClick={() => setMainImage(img)} 
                        className={`w-16 h-16 lg:w-20 lg:h-24 object-cover cursor-pointer border-2 rounded-md transition hover:opacity-80 flex-shrink-0 ${mainImage === img ? 'border-primary' : 'border-gray-200'}`} 
                    />
                ))}
            </div>

            {/* Main Image (Mobile: Smaller Height, Desktop: Full Height) */}
            <div className="flex-1 relative z-10 group">
                <div 
                    className="w-full h-[400px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden relative cursor-crosshair border border-gray-200 shadow-sm"
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)} 
                    onMouseMove={handleMouseMove}
                >
                    <img 
                        src={mainImage || 'https://via.placeholder.com/500'} 
                        alt={product.name} 
                        className="w-full h-full object-cover block transition-transform duration-100 ease-out"
                        style={{ 
                            transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`, 
                            transform: isHovered ? 'scale(2.5)' : 'scale(1)' 
                        }}
                    />
                    
                    {/* Hints & Badges */}
                    {!isHovered && (
                        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-gray-600 text-xs font-bold flex items-center gap-2 shadow-sm pointer-events-none">
                            <FaSearchPlus /> Hover to Zoom
                        </div>
                    )}
                    {product.isOnSale && (
                        <span className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow animate-pulse pointer-events-none">
                            SALE
                        </span>
                    )}
                </div>
            </div>
        </div>
        
        {/* RIGHT: DETAILS */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-2xl lg:text-4xl font-serif font-bold mb-2 text-gray-900 leading-tight">
                {product.name}
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                {product.category}
            </p>
          </div>
          
          {/* PRICE & TIMER SECTION */}
          <div className="border-b pb-6">
            <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl lg:text-5xl font-bold text-red-600">
                Rs. {product.isOnSale ? product.salePrice : product.price}
                </span>
                {product.isOnSale && (
                    <span className="text-lg lg:text-xl text-gray-400 line-through mb-1 font-medium">
                        Rs. {product.price}
                    </span>
                )}
            </div>

            {/* SALE COUNTDOWN TIMER (FIXED) */}
            {isSaleActive && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 inline-block w-full lg:w-auto">
                    <p className="text-red-600 font-bold text-xs uppercase mb-1 tracking-wide text-center lg:text-left">
                        Offer Ends In:
                    </p>
                    <div className="flex gap-3 justify-center lg:justify-start text-gray-800">
                        <div className="text-center"><span className="bg-white px-2 py-1 rounded border shadow-sm font-bold text-lg block min-w-[40px]">{timeLeft.days}</span><span className="text-[10px] text-gray-500">Days</span></div>
                        <div className="text-center"><span className="bg-white px-2 py-1 rounded border shadow-sm font-bold text-lg block min-w-[40px]">{timeLeft.hours}</span><span className="text-[10px] text-gray-500">Hrs</span></div>
                        <div className="text-center"><span className="bg-white px-2 py-1 rounded border shadow-sm font-bold text-lg block min-w-[40px]">{timeLeft.minutes}</span><span className="text-[10px] text-gray-500">Mins</span></div>
                        <div className="text-center"><span className="bg-white px-2 py-1 rounded border shadow-sm font-bold text-lg text-red-600 block min-w-[40px]">{timeLeft.seconds}</span><span className="text-[10px] text-gray-500">Secs</span></div>
                    </div>
                </div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
            {product.description}
          </p>

          {/* SIZES */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
                <span className="block font-bold text-sm uppercase mb-2">Select Size:</span>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSizeSelect(s)}
                            className={`min-w-[60px] px-4 py-2 border rounded-md text-sm font-bold transition shadow-sm
                                ${selectedSize === s.name 
                                    ? 'bg-primary text-white border-primary ring-2 ring-offset-1 ring-primary' 
                                    : 'bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
                {sizeDetails && (
                    <p className="text-xs text-green-700 mt-2 font-medium bg-green-50 p-2 rounded inline-block border border-green-100">
                        <i className="fa-solid fa-ruler-combined mr-1"></i> {sizeDetails}
                    </p>
                )}
            </div>
          )}

          {/* COLORS */}
          {cleanColors.length > 0 && (
            <div>
                <span className="block font-bold text-sm uppercase mb-2">Select Color: <span className="text-primary ml-1">{selectedColor}</span></span>
                <div className="flex flex-wrap gap-3">
                    {cleanColors.map((color, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedColor(color)} 
                            title={color}
                            className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center transition-all duration-200 
                                ${selectedColor === color ? 'border-primary ring-2 ring-primary scale-110' : 'border-gray-300 hover:scale-110'}`} 
                            style={{ backgroundColor: color.toLowerCase() }}
                        >
                            {selectedColor === color && (
                                <span className={`block w-2.5 h-2.5 rounded-full shadow-sm ${['white', 'yellow', 'cream', 'beige'].includes(color.toLowerCase()) ? 'bg-black' : 'bg-white'}`}></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-4 mt-4">
             <div className="flex items-center gap-4">
                <span className="font-bold text-sm uppercase">Quantity:</span>
                <div className="flex items-center border rounded-md bg-white">
                    <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-4 py-2 hover:bg-gray-100 font-bold">-</button>
                    <span className="px-4 py-2 font-bold text-lg min-w-[40px] text-center">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-4 py-2 hover:bg-gray-100 font-bold">+</button>
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3">
                 <button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0} 
                    className="flex-1 bg-white border-2 border-primary text-primary py-3 rounded font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition shadow-sm"
                 >
                    Add to Cart
                 </button>
                 <button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0} 
                    className="flex-1 bg-green-600 text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2"
                 >
                    Buy Now
                 </button>
             </div>
             
             {product.stock === 0 && <p className="text-red-500 font-bold text-center mt-2 bg-red-50 p-2 rounded">Out of Stock</p>}
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-gray-500 space-y-2">
            <p className="flex items-center gap-2"><i className="fa-solid fa-truck"></i> Standard delivery across Pakistan: 3-7 working days</p>
            <p className="flex items-center gap-2"><i className="fa-solid fa-rotate-left"></i> 7-day return policy applied.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;