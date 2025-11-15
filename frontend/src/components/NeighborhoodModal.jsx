import React, { useState, useEffect } from 'react';
import { housingAPI } from '../utils/api';

const NeighborhoodModal = ({ neighborhood, onClose }) => {
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      try {
        setLoading(true);
        const [detailsResponse, reviewsResponse] = await Promise.all([
          housingAPI.getNeighborhood(neighborhood.name),
          housingAPI.getNeighborhoodReviews(neighborhood.name)
        ]);
        setDetails(detailsResponse.data);
        setReviews(reviewsResponse.data.reviews || []);
      } catch (error) {
        console.error('Error fetching neighborhood data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (neighborhood) {
      fetchNeighborhoodData();
    }
  }, [neighborhood]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original overflow when modal unmounts
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await housingAPI.submitNeighborhoodReview(neighborhood.name, newReview);
      setReviews([response.data.review, ...reviews]);
      setNewReview({ author: '', rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!neighborhood) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-start rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{neighborhood.name}</h2>
            <p className="text-lg text-slate-600 mt-1">
              {neighborhood.borough} • Score {neighborhood.score}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading neighborhood details...</p>
          </div>
        ) : (
          <div className="p-8">
            {/* Summary Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">About</h3>
              <p className="text-slate-700 leading-relaxed">
                {details?.ai_summary?.overall || neighborhood.summary || 'A vibrant NYC neighborhood.'}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Highlights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {neighborhood.highlights?.walkability ?? details?.neighborhood?.walkability ?? '—'}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Walkability</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {neighborhood.highlights?.transit ?? details?.neighborhood?.transit_score ?? '—'}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Transit</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {neighborhood.highlights?.nightlife ?? details?.neighborhood?.nightlife_score ?? '—'}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Nightlife</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {neighborhood.highlights?.parks ?? details?.neighborhood?.parks_score ?? '—'}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Parks</div>
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            {details?.ai_summary && (
              <div className="mb-8 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-3">Pros</h3>
                  <ul className="space-y-2">
                    {details.ai_summary.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-slate-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-700 mb-3">Cons</h3>
                  <ul className="space-y-2">
                    {details.ai_summary.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span className="text-slate-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tags */}
            {neighborhood.tags && neighborhood.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {neighborhood.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t border-slate-200 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  Community Reviews ({reviews.length})
                </h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-slate-50 rounded-2xl p-6 mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="text-2xl focus:outline-none"
                        >
                          {star <= newReview.rating ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="4"
                      placeholder="Share your experience with this neighborhood..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-slate-400"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">
                    No reviews yet. Be the first to review this neighborhood!
                  </p>
                ) : (
                  reviews.map((review, idx) => (
                    <div key={review.author + '-' + review.date} className="bg-slate-50 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{review.author}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-yellow-500">
                              {'⭐'.repeat(review.rating)}
                            </div>
                            <span className="text-sm text-slate-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeighborhoodModal;
