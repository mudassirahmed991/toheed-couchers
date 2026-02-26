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
  const [sizeDetails, setSizeDetails] = useState(''); // To show specific size info

  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  
  const { addToCart } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://toheedcouture.com/api/products/${id}`).then(res => {
        setProduct(res.data);
        setMainImage(res.data.images && res.data.images.length > 0 ? res.data.images[0] : '');

        let rawColors = res.data.colors || [];
        let fixedColors = rawColors.flatMap(c => c.split(',').map(i => i.trim())).filter(c => c !== "");
        setCleanColors(fixedColors);
        if(fixedColors.length > 0) setSelectedColor(fixedColors[0]);
    });
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  // Handle Size Selection
  const handleSizeSelect = (sizeObj) => {
    setSelectedSize(sizeObj.name);
    setSizeDetails(sizeObj.dimensions); // Show details for this specific size
  };

  const handleAddToCart = () => {
    if(product.sizes && product.sizes.length > 0 && !selectedSize) {
        return toast.error("Please select a Size");
    }
    addToCart(product, qty, selectedColor || 'Default', selectedSize || null);
    toast.success("Added to cart!");
    navigate('/cart');
  };

  return (
    <div className="custom-container py-12 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Thumbnails */}
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-4">
            {product.images && product.images.map((img, i) => (
                <img key={i} src={img} onClick={() => setMainImage(img)} className={`w-full h-24 object-cover cursor-pointer border-2 rounded ${mainImage === img ? 'border-primary' : 'border-transparent'}`} />
            ))}
        </div>

        {/* Main Image */}
        <div className="lg:col-span-6 relative">
            <div 
                className="w-full h-[500px] md:h-[650px] bg-gray-100 rounded overflow-hidden relative cursor-crosshair border border-gray-200 shadow-sm"
                onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove}
            >
                <img 
                    src={mainImage || 'https://via.placeholder.com/500'} alt={product.name} 
                    className="w-full h-full object-cover block transition-transform duration-100 ease-out"
                    style={{ transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`, transform: isHovered ? 'scale(2.5)' : 'scale(1)' }}
                />
                {!isHovered && <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-full text-gray-600 text-sm flex items-center gap-2 pointer-events-none"><FaSearchPlus /> Hover to Zoom</div>}
                {product.isOnSale && <span className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold shadow pointer-events-none">SALE</span>}
            </div>
            <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2">
                {product.images && product.images.map((img, i) => (<img key={i} src={img} onClick={() => setMainImage(img)} className="w-20 h-20 object-cover border-2 rounded" />))}
            </div>
        </div>
        
        {/* Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest">{product.category}</p>
          </div>
          
          <div className="flex items-end gap-4 border-b pb-6">
            <span className="text-4xl font-bold text-red-600">Rs. {product.isOnSale ? product.salePrice : product.price}</span>
            {product.isOnSale && <span className="text-xl text-gray-400 line-through mb-1">Rs. {product.price}</span>}
          </div>

          <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>

          {/* SIZES SELECTOR (IMPROVED) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
                <span className="block font-bold text-sm uppercase mb-3">Size: <span className="text-primary">{selectedSize}</span></span>
                <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSizeSelect(s)}
                            className={`min-w-[50px] px-4 py-2 border rounded text-sm font-bold transition shadow-sm
                                ${selectedSize === s.name 
                                    ? 'bg-primary text-white border-primary ring-2 ring-offset-1 ring-primary' 
                                    : 'bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
                {/* Specific Size Details */}
                {sizeDetails && (
                    <p className="text-xs text-green-700 mt-2 font-medium bg-green-50 p-2 rounded inline-block">
                        <i className="fa-solid fa-ruler-combined mr-1"></i> Measurements: {sizeDetails}
                    </p>
                )}
            </div>
          )}

          {/* COLORS */}
          {cleanColors.length > 0 && (
            <div>
                <span className="block font-bold text-sm uppercase mb-3">Color: <span className="text-primary">{selectedColor}</span></span>
                <div className="flex gap-3 flex-wrap">
                    {cleanColors.map((color, i) => (
                        <button key={i} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center transition-all ${selectedColor === color ? 'border-primary ring-2 ring-primary scale-110' : 'border-gray-300 hover:scale-110'}`} style={{ backgroundColor: color.toLowerCase() }}>
                            {selectedColor === color && <span className="block w-2.5 h-2.5 bg-white rounded-full shadow-sm"></span>}
                        </button>
                    ))}
                </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-4 mt-4">
             <div className="flex items-center gap-4">
                <span className="font-bold text-sm uppercase">Quantity:</span>
                <div className="flex items-center border rounded">
                    <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                    <span className="px-4 py-2 font-bold">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-4 py-2 hover:bg-gray-100">+</button>
                </div>
             </div>
             <div className="flex gap-4">
                 <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-white border-2 border-primary text-primary py-4 rounded font-bold uppercase hover:bg-primary hover:text-white transition">Add to Cart</button>
                 <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-green-600 text-white py-4 rounded font-bold uppercase hover:bg-green-700 transition shadow-lg">Buy with Cash on Delivery</button>
             </div>
             {product.stock === 0 && <p className="text-red-500 font-bold text-center">Out of Stock</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;