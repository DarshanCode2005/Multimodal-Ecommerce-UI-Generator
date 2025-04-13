'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useFileStore } from '../../store/fileStore';
import { usePageStore } from '../../store/pageStore';
import { componentToFileMap } from '../../services/componentSyncService';
import SelectableElement from '../SelectableElement';
import { renderJSXString } from '../../utils/jsxRenderer';

// Product type definition
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  tags: string[];
};

export default function SearchPage() {
  const { selectedElement, setSelectedElement, openAIModal, lastModifiedElement } = useEditorStore();
  const { activeFileId, getFileContent } = useFileStore();
  const { searchQuery, setSearchQuery } = usePageStore();
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [dynamicContent, setDynamicContent] = useState<{[key: string]: string}>({});
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium noise-cancelling headphones with long battery life",
      price: 149.99,
      image: "🎧",
      category: "Electronics",
      rating: 4.5,
      inStock: true,
      tags: ["audio", "bluetooth", "wireless"]
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your fitness and stay connected with this sleek smartwatch",
      price: 199.99,
      image: "⌚",
      category: "Electronics",
      rating: 4.2,
      inStock: true,
      tags: ["wearable", "fitness", "bluetooth"]
    },
    {
      id: 3,
      name: "Portable Speaker",
      description: "Waterproof Bluetooth speaker with immersive sound quality",
      price: 79.99,
      image: "🔊",
      category: "Electronics",
      rating: 4.0,
      inStock: true,
      tags: ["audio", "bluetooth", "waterproof"]
    },
    {
      id: 4,
      name: "Laptop Stand",
      description: "Ergonomic aluminum stand to improve your workspace setup",
      price: 49.99,
      image: "💻",
      category: "Office",
      rating: 4.7,
      inStock: true,
      tags: ["ergonomic", "desk", "work"]
    },
    {
      id: 5,
      name: "Wireless Charger",
      description: "Fast charging pad compatible with all Qi-enabled devices",
      price: 29.99,
      image: "🔌",
      category: "Electronics",
      rating: 3.9,
      inStock: false,
      tags: ["charging", "wireless", "power"]
    },
    {
      id: 6,
      name: "Coffee Maker",
      description: "Programmable coffee machine with built-in grinder",
      price: 119.99,
      image: "☕",
      category: "Kitchen",
      rating: 4.8,
      inStock: true,
      tags: ["kitchen", "appliance", "coffee"]
    },
    {
      id: 7,
      name: "Fitness Tracker",
      description: "Water-resistant fitness band with heart rate monitoring",
      price: 89.99,
      image: "⌚",
      category: "Fitness",
      rating: 4.1,
      inStock: true,
      tags: ["fitness", "health", "wearable"]
    },
    {
      id: 8,
      name: "Backpack",
      description: "Durable waterproof backpack with laptop compartment",
      price: 69.99,
      image: "🎒",
      category: "Fashion",
      rating: 4.3,
      inStock: true,
      tags: ["bag", "travel", "laptop"]
    }
  ]);

  // Generate search suggestions based on product data
  const generateSearchSuggestions = (input: string): string[] => {
    if (!input || input.length < 2) return [];
    
    const lowercaseInput = input.toLowerCase();
    const suggestions: string[] = [];
    
    // Get suggestions from product names
    products.forEach(product => {
      if (product.name.toLowerCase().includes(lowercaseInput) && 
          !suggestions.includes(product.name)) {
        suggestions.push(product.name);
      }
    });
    
    // Get suggestions from product tags
    products.forEach(product => {
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowercaseInput) && 
            !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    });
    
    // Get suggestions from product categories
    products.forEach(product => {
      if (product.category.toLowerCase().includes(lowercaseInput) && 
          !suggestions.includes(product.category)) {
        suggestions.push(product.category);
      }
    });
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };
  
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      // Search query filter
      (searchQuery === '' || 
       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) &&
      // Category filter
      (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
      // Price range filter
      (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
      // In-stock filter
      (!showInStock || product.inStock) &&
      // Rating filter
      (product.rating >= minRating)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default: // 'relevance'
          // For relevance, prioritize exact name matches
          const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          return bNameMatch - aNameMatch;
      }
    });

  // Categories derived from products
  const categories = [...new Set(products.map(product => product.category))];

  // Pagination
  const productsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handler for element selection
  const handleElementSelect = (element: { type: string; ref: HTMLElement; code: string }) => {
    setSelectedElement(element);
    openAIModal();
  };

  // Effect to handle element modifications from AI
  useEffect(() => {
    if (lastModifiedElement) {
      try {
        // Store the modified code string
        setDynamicContent(prev => ({
          ...prev,
          [lastModifiedElement.type]: lastModifiedElement.modifiedCode
        }));
      } catch (error) {
        console.error('Error applying modified code:', error);
      }
    }
  }, [lastModifiedElement]);

  // Effect to handle file changes from the editor
  useEffect(() => {
    if (activeFileId) {
      // Find which components correspond to this file
      const matchingComponents = Object.entries(componentToFileMap)
        .filter(([_, fileId]) => fileId === activeFileId)
        .map(([componentType]) => componentType);

      if (matchingComponents.length > 0) {
        // Get the file content
        const fileContent = getFileContent(activeFileId);
        
        // Update all matching components
        matchingComponents.forEach(componentType => {
          try {
            setDynamicContent(prev => ({
              ...prev,
              [componentType]: fileContent
            }));
          } catch (error) {
            console.error(`Error updating ${componentType} from file:`, error);
          }
        });
      }
    }
  }, [activeFileId, getFileContent]);

  // Render an element with potential dynamic content
  const renderElement = (type: string, originalContent: React.ReactNode) => {
    // If this element has modified content, render the JSX string directly
    if (dynamicContent[type] || (type === "Pagination" && dynamicContent["SearchPagination"])) {
      // Use our utility to render the JSX string
      const content = type === "Pagination" ? dynamicContent["SearchPagination"] : dynamicContent[type];
      return renderJSXString(content, originalContent);
    }
    // Otherwise render the original content
    return originalContent;
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setShowSuggestions(false);
    }
  };

  // Add handleSearchInputChange function
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Generate and display suggestions
    if (value.length >= 2) {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <SelectableElement 
        elementType="SearchHeader" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'SearchHeader'}
      >
        {renderElement("SearchHeader", (
          <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto max-w-full">
              <h1 className="text-xl font-bold mb-2">Search Results</h1>
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🔍</span>
                <p>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</p>
                <p className="ml-2 text-sm text-blue-200">({filteredProducts.length} products found)</p>
              </div>
              
              <form onSubmit={handleSearch} className="flex max-w-3xl relative">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search products, categories, or tags..."
                    className="w-full px-4 py-3 text-gray-800 bg-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchInput.length >= 2 && setShowSuggestions(searchSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {searchInput && (
                    <button 
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSearchInput('');
                        setSearchSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      ✕
                    </button>
                  )}
                  
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1">
                      <ul>
                        {searchSuggestions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                            onClick={() => {
                              setSearchInput(suggestion);
                              setShowSuggestions(false);
                              setSearchQuery(suggestion);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button 
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-r-lg flex items-center justify-center transition-colors"
                >
                  <span className="mr-2">Search</span>
                  <span>🔍</span>
                </button>
              </form>
            </div>
          </header>
        ))}
      </SelectableElement>
      
      <main className="flex-1 p-4 bg-gray-50">
        <div className="container mx-auto max-w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            <SelectableElement 
              elementType="SearchSidebar" 
              onSelect={handleElementSelect}
              isSelected={selectedElement?.type === 'SearchSidebar'}
              className="w-full lg:w-1/5"
            >
              {renderElement("SearchSidebar", (
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <h2 className="font-semibold text-lg mb-4 pb-2 border-b">Filters</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`category-${category}`} 
                            className="mr-2" 
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                              setCurrentPage(1);
                            }}
                          />
                          <label htmlFor={`category-${category}`}>{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm">${priceRange[0]}</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        step="10"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          setPriceRange([Math.min(newMin, priceRange[1] - 10), priceRange[1]]);
                          setCurrentPage(1);
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">${priceRange[0]}</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          setPriceRange([priceRange[0], Math.max(newMax, priceRange[0] + 10)]);
                          setCurrentPage(1);
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Customer Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <input 
                            type="radio" 
                            id={`rating-${rating}`} 
                            name="rating"
                            className="mr-2" 
                            checked={minRating === rating}
                            onChange={() => {
                              setMinRating(rating);
                              setCurrentPage(1);
                            }}
                          />
                          <label htmlFor={`rating-${rating}`} className="flex items-center">
                            {rating}+ <span className="ml-1 text-yellow-500">★</span>
                          </label>
                        </div>
                      ))}
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="rating-0" 
                          name="rating"
                          className="mr-2" 
                          checked={minRating === 0}
                          onChange={() => {
                            setMinRating(0);
                            setCurrentPage(1);
                          }}
                        />
                        <label htmlFor="rating-0">Show All</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="inStock" 
                        className="mr-2" 
                        checked={showInStock}
                        onChange={(e) => {
                          setShowInStock(e.target.checked);
                          setCurrentPage(1);
                        }}
                      />
                      <label htmlFor="inStock">In Stock Only</label>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([0, 1000]);
                      setMinRating(0);
                      setShowInStock(false);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ))}
            </SelectableElement>
            
            <div className="w-full lg:w-4/5">
              <SelectableElement 
                elementType="SearchControls" 
                onSelect={handleElementSelect}
                isSelected={selectedElement?.type === 'SearchControls'}
              >
                {renderElement("SearchControls", (
                  <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <p className="mb-2 sm:mb-0">
                        <span className="font-medium">{filteredProducts.length}</span> results found
                      </p>
                      <div className="flex items-center">
                        <label htmlFor="sort-by" className="mr-2 whitespace-nowrap">Sort by:</label>
                        <select 
                          id="sort-by" 
                          className="border rounded px-2 py-1"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="relevance">Relevance</option>
                          <option value="priceLow">Price: Low to High</option>
                          <option value="priceHigh">Price: High to Low</option>
                          <option value="rating">Customer Rating</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </SelectableElement>
              
              <SelectableElement 
                elementType="SearchResults" 
                onSelect={handleElementSelect}
                isSelected={selectedElement?.type === 'SearchResults'}
                className="w-full"
              >
                {renderElement("SearchResults", (
                  <div>
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5">
                        {displayedProducts.map((product) => (
                          <SelectableElement 
                            key={product.id}
                            elementType="ProductCard" 
                            onSelect={handleElementSelect}
                            isSelected={selectedElement?.type === 'ProductCard'}
                          >
                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
                              <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                                <span className="text-5xl">{product.image}</span>
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-semibold text-lg">{product.name}</h3>
                                  <div className="flex items-center text-sm text-yellow-500 ml-2">
                                    <span>{product.rating}</span>
                                    <span className="ml-1">★</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 mb-2">{product.description}</p>
                                <div className="mt-1 text-xs">
                                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {product.category}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                                <div className="flex items-center">
                                  {product.inStock ? (
                                    <span className="text-xs text-green-600 mr-2">In Stock</span>
                                  ) : (
                                    <span className="text-xs text-red-600 mr-2">Out of Stock</span>
                                  )}
                                  <button 
                                    disabled={!product.inStock}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                                      product.inStock 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </SelectableElement>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-lg shadow text-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-medium mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your search or filter criteria
                        </p>
                        <button 
                          onClick={() => {
                            setSelectedCategories([]);
                            setPriceRange([0, 1000]);
                            setMinRating(0);
                            setShowInStock(false);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </SelectableElement>
              
              {totalPages > 1 && (
                <SelectableElement 
                  elementType="SearchPagination" 
                  onSelect={handleElementSelect}
                  isSelected={selectedElement?.type === 'SearchPagination'}
                  className="w-full"
                >
                  {renderElement("Pagination", (
                    <div className="mt-8 flex justify-center">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded ${
                            currentPage === 1 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          // Logic to show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button 
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 rounded ${
                                currentPage === pageNum 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-white border border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded ${
                            currentPage === totalPages 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ))}
                </SelectableElement>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <SelectableElement 
        elementType="Footer" 
        onSelect={handleElementSelect}
        isSelected={selectedElement?.type === 'Footer'}
      >
        {renderElement("Footer", (
          <footer className="bg-gray-800 text-white p-4 text-center text-sm">
            <div className="container mx-auto max-w-full">
              &copy; 2023 Your Website. All rights reserved.
            </div>
          </footer>
        ))}
      </SelectableElement>
    </div>
  );
} 