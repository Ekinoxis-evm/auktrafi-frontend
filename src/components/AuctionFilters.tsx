'use client'

import { useState } from 'react'

export function AuctionFilters() {
  const [filters, setFilters] = useState({
    status: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-bold text-gray-900 mb-4">🔍 Filters</h3>
      
      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Auctions</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (PYUSD)
          </label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-lg">
              🔥 Hot Auctions
            </button>
            <button className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-lg">
              ⭐ Featured
            </button>
            <button className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-lg">
              💰 High Value
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => setFilters({ status: 'all', minPrice: '', maxPrice: '', sortBy: 'newest' })}
          className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}

