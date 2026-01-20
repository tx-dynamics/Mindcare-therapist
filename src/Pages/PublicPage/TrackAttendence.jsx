import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';
import GroupIcon from '../../assets/Images/Group.png';
// Modal Component
const TrackAttendence = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  
  // Applied range state (what actually filters the list)
  const [appliedRangeStart, setAppliedRangeStart] = useState(null);
  const [appliedRangeEnd, setAppliedRangeEnd] = useState(null);
  const [appliedHasSelectedRange, setAppliedHasSelectedRange] = useState(false);

  const [hasSelectedRange, setHasSelectedRange] = useState(false);
  const calendarRef = useRef(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatRangeDate = (date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPercent = (value) => {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return '-';
    const rounded = Math.round(n * 10) / 10;
    return `${rounded}%`;
  };

  const toYyyyMmDd = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Sync draft state with applied state when modal opens
  useEffect(() => {
    if (showCalendar) {
      setRangeStart(appliedRangeStart);
      setRangeEnd(appliedRangeEnd);
      setHasSelectedRange(appliedHasSelectedRange);
    }
  }, [showCalendar, appliedRangeStart, appliedRangeEnd, appliedHasSelectedRange]);

  const range = useMemo(() => {
    if (appliedHasSelectedRange && appliedRangeStart && appliedRangeEnd) {
      return { startDate: toYyyyMmDd(appliedRangeStart), endDate: toYyyyMmDd(appliedRangeEnd) };
    }
    return null;
  }, [appliedRangeStart, appliedRangeEnd, appliedHasSelectedRange]);

  const endPoint = useMemo(() => {
    const params = new URLSearchParams();
    if (range?.startDate) params.set('startDate', range.startDate);
    if (range?.endDate) params.set('endDate', range.endDate);
    const query = params.toString();
    return query ? `${api.attendanceSummary}?${query}` : api.attendanceSummary;
  }, [range]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        setCurrentPage(1);
        setIsLoading(false);
      },
      onError: (err) => {
        if (!isActive) return;
        setApiError(err?.message || 'Failed to load attendance summary.');
        setEntries([]);
        setIsLoading(false);
      },
    });

    return () => {
      isActive = false;
    };
  }, [endPoint]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
  
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      setSelectedDate(newDate);
      setShowCalendar(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };




  return (
    <> 
   
      <div className="bg-white p-4 rounded-2xl min-h-[calc(100vh-180px)]">
        
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text- font-semibold text-teal-600">Track Attendance </h1>
            
            {/* Date Selector */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-[326px] h-[60px] rounded-[16px] opacity-100 flex items-center justify-between px-4 bg-[#F9FAFB] border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700 text-base truncate">
                  {appliedHasSelectedRange && appliedRangeStart && appliedRangeEnd
                    ? `${formatRangeDate(appliedRangeStart)} - ${formatRangeDate(appliedRangeEnd)}`
                    : 'Select Dates'}
                </span>
                <img src={GroupIcon} alt="Calendar" className="w-5 h-5" />
              </button>

              {showCalendar && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 w-[326px]">
                  <div className="space-y-3">
                    {/* All Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="all-attendance-checkbox"
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        checked={!rangeStart && !rangeEnd}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRangeStart(null);
                            setRangeEnd(null);
                            setHasSelectedRange(false);
                          } else {
                            window.showToast?.('Please select a date', 'error');
                          }
                        }}
                      />
                      <label htmlFor="all-attendance-checkbox" className="text-sm font-medium text-gray-700">
                        All
                      </label>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-700">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={rangeStart ? toYyyyMmDd(rangeStart) : ''}
                        max={toYyyyMmDd(new Date())}
                        onChange={(e) => {
                          const v = e.target.value;
                          setRangeStart(v ? new Date(v) : null);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-700">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={rangeEnd ? toYyyyMmDd(rangeEnd) : ''}
                        max={toYyyyMmDd(new Date())}
                        onChange={(e) => {
                          const v = e.target.value;
                          setRangeEnd(v ? new Date(v) : null);
                        }}
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        className="w-full h-[40px] opacity-100 px-4 py-1 rounded-lg bg-teal-700 text-white hover:bg-teal-800 font-medium"
                        onClick={() => {
                          const isAll = !rangeStart && !rangeEnd;
                          
                          if (isAll) {
                            // Apply All
                            setAppliedRangeStart(null);
                            setAppliedRangeEnd(null);
                            setAppliedHasSelectedRange(false);
                            
                            setShowCalendar(false);
                            setCurrentPage(1);
                          } else {
                            const today = new Date();
                            // Simple validation: start <= end. 
                            // Since we have max date on inputs, we just check order.
                            const orderOk = rangeStart && rangeEnd && rangeStart <= rangeEnd;
                            
                            if (orderOk) {
                              // Apply Range
                              setAppliedRangeStart(rangeStart);
                              setAppliedRangeEnd(rangeEnd);
                              setAppliedHasSelectedRange(true);
                              
                              setShowCalendar(false);
                              setSelectedDate(new Date(rangeEnd));
                              setCurrentPage(1);
                            } else {
                              window.showToast?.('Please select valid start and end dates.', 'error');
                            }
                          }
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {apiError ? <div className="text-red-500 text-sm mb-4">{apiError}</div> : null}
          {isLoading ? <div className="text-gray-600 text-sm mb-4">Loading...</div> : null}

         
           {/* Attendance Table */}
        <div className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="bg-teal-600 text-white rounded-xl">
                <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-lg ">
                  <div className="text-left">Name</div>
                  <div className="text-center">Absent</div>
                  <div className="text-center">Attend From Gym</div>
                  <div className="text-center">Attend from Home</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {!isLoading && entries.length === 0 ? (
                  <div className="p-6 text-gray-600">No attendance data found.</div>
                ) : null}
                {currentEntries.map((row, idx) => {
                  const key = row?.userId || row?._id || row?.id || `${row?.name || 'row'}-${idx}`;
                  const stats = row?.stats || {};
                  return (
                  <div key={key} className="grid grid-cols-4 gap-4 p-6 items-center ">
                    {/* Name */}
                    <div className="text-left">
                      <p className="font-medium text-gray-700 text-lg">{row?.name || '-'}</p>
                    </div>

                    {/* Absent */}
                    <div className="text-center">
                      <span className="text-gray-600 text-lg">{formatPercent(stats?.percentAbsent)}</span>
                    </div>

                    {/* Attend From Gym */}
                    <div className="text-center">
                      <span className="text-gray-600 text-lg">{formatPercent(stats?.percentGym)}</span>
                    </div>

                    {/* Attend from Home */}
                    <div className="text-center">
                      <span className="text-gray-600 text-lg">{formatPercent(stats?.percentHome)}</span>
                    </div>
                  </div>
                )})}
                {/* Fill empty rows to maintain height */}
                {Array.from({ length: Math.max(0, itemsPerPage - currentEntries.length) }).map((_, idx) => (
                   <div key={`empty-${idx}`} className="grid grid-cols-4 gap-4 p-6 items-center invisible">
                      <div className="text-left"><p className="font-medium text-lg">-</p></div>
                      <div className="text-center"><span className="text-lg">-</span></div>
                      <div className="text-center"><span className="text-lg">-</span></div>
                      <div className="text-center"><span className="text-lg">-</span></div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && entries.length > itemsPerPage && (
            <div className="flex items-center justify-end gap-3 mt-0">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Modal */}

    </>
  );
};

export default TrackAttendence;
