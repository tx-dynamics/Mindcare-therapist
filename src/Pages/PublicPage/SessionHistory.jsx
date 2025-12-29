import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, Clock, X } from 'lucide-react';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';

const SessionHistory = () => {
  const [type, setType] = useState('session');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const endPoint = useMemo(() => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    params.set('page', String(page));
    params.set('limit', String(limit));
    return `${api.feedbackMe}?${params.toString()}`;
  }, [limit, page, type]);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setApiError('');

    void callApi({
      method: Method.GET,
      endPoint,
      onSuccess: (response) => {
        if (!isActive) return;
        setEntries(Array.isArray(response?.data) ? response.data : []);
        setMeta(response?.meta ?? null);
        setIsLoading(false);
      },
      onError: (err) => {
        if (!isActive) return;
        setApiError(err?.message || 'Failed to load session history.');
        setEntries([]);
        setMeta(null);
        setIsLoading(false);
      },
    });

    return () => {
      isActive = false;
    };
  }, [endPoint]);

  if (selectedEntry) {
    const name =
      selectedEntry?.user?.name ||
      selectedEntry?.user?.fullName ||
      selectedEntry?.user?.email ||
      selectedEntry?.student?.name ||
      selectedEntry?.client?.name ||
      'Feedback';
    const avatar =
      selectedEntry?.user?.profileImage ||
      selectedEntry?.user?.avatar ||
      selectedEntry?.student?.avatar ||
      selectedEntry?.client?.avatar ||
      'https://i.pravatar.cc/120';
    const createdAt = selectedEntry?.createdAt || selectedEntry?.date;
    const time = selectedEntry?.time;
    const content =
      selectedEntry?.feedback ||
      selectedEntry?.comment ||
      selectedEntry?.message ||
      selectedEntry?.text ||
      '';

    return (
      <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            {/* Back Button */}
            <button 
              onClick={() => setSelectedEntry(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Back to Session History</span>
            </button>

            {/* Student Info */}
            <div className="flex items-center mb-8">
              <img 
                src={avatar} 
                alt={name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
            </div>

            {/* SessionHistory Details */}
            {createdAt || time ? (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Date & time</h2>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  {createdAt ? (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{String(createdAt)}</span>
                    </div>
                  ) : null}
                  {time ? (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{String(time)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {content ? (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Feedback</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{content}</p>
              </div>
            ) : (
              <div className="text-gray-600">No feedback text.</div>
            )}
              
          </div>
        </div>
      </div>

      </>
    );
  }

  return (
    <> 
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0">Session History</h3>
            {meta?.totalItems != null ? (
              <p className="text-sm text-gray-500 mt-1">Total: {meta.totalItems}</p>
            ) : null}
          </div>
          
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setType('session');
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                type === 'session' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Session
            </button>
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setType('gym');
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                type === 'gym' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Gym
            </button>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value) || 10);
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        </div>

        {apiError ? <div className="text-red-500 text-sm mb-6">{apiError}</div> : null}

        {/* SessionHistorys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? <div className="text-gray-600">Loading...</div> : null}
          {!isLoading && entries.length === 0 ? <div className="text-gray-600">No results found.</div> : null}
          {entries.map((entry, idx) => {
            const person =
              entry?.user ||
              entry?.student ||
              entry?.client ||
              {};
            const title = person?.name || person?.fullName || person?.email || 'Feedback';
            const image = person?.profileImage || person?.avatar || 'https://i.pravatar.cc/120';
            const subtitle = entry?.createdAt ? String(entry.createdAt) : '';
            const key = entry?._id || entry?.id || `${subtitle || 'feedback'}-${idx}`;

            return (
              <div
                key={key}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white rounded-2xl p-6 cursor-pointer  duration-200"
              >
                <div className="flex items-center">
                  <img
                    src={image}
                    alt={title}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                    {subtitle ? <p className="text-sm text-gray-600">{subtitle}</p> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {meta?.totalPages ? (
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} / {meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages || isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
   
    </>
  );
};

export default SessionHistory;
