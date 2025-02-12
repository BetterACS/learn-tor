'use client'
import { Navbar, CompareSidebar, InfoCard, AlertBox, CompareList, PaginationButtons, }
from '@/components/index';
import type { university } from '@/db/models';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

export default function Page() {
  const [state, setState] = useState({
    selectedItems: [],
    searchQuery: '',
    isSidebarOpen: true,
    isCompareListOpen: false,
    alertMessage: null,
    universities: [],
    error: null,
    currentPage: 1,
    totalPages: 1,
  });

  const router = useRouter();
  const mutation = trpc.searchUniversities.useMutation();

  useEffect(() => {
    fetchUniversities();
  }, [state.currentPage , state.searchQuery]);

  const fetchUniversities = () => {
    mutation.mutate(
      {
        search: state.searchQuery,
        // search: '',
        sortBy: 'institution',
        order: 'asc',
        limit: 6,
        page: state.currentPage,
      },
      {
        onSuccess: (data) => {
          if (data.status === 200 && 'universities' in data.data) {
            setState((prev) => ({
              ...prev,
              universities: data.data.universities.map((uni) => ({
                ...uni,
                logo: '/images/logofooter.avif',
                image: '/images/uni-pic/mock.avif',
              })),
              totalPages: data.maxPage || 1,
            }));
          } else {
            console.error('Error fetching universities:', data.data);
          }
        },
        onError: (error) => {
          console.error('Mutation Failed:', error);
          setState((prev) => ({ ...prev, error: error.message }));
        },
      }
    );
  };

  const handleStateUpdate = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  };


  const handleAddToCompare = (item) => {
    setState((prev) => {
      if (
        prev.selectedItems.length < 3 &&
        !prev.selectedItems.some((selected) => selected.university === item.university)
      ) {
        return { ...prev, selectedItems: [...prev.selectedItems, item] };
      }
      return prev;
    });
  };

  const handleRemoveItem = (index) => {
    setState((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((_, i) => i !== index),
    }));
  };

  const handleCompare = () => {
    if (state.selectedItems.length >= 1 && state.selectedItems.length <= 3) {
      const query = state.selectedItems
        .map((item, i) => `uni${i}=${encodeURIComponent(item.university)}`)
        .join('&');
      router.push(`/compare-result?${query}`);
    } else {
      handleStateUpdate('alertMessage', 'Please select at least one university.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="sm:w-full md:w-1/2 lg:w-1/4">
          <CompareSidebar
            onToggleSidebar={(isOpen) => handleStateUpdate('isSidebarOpen', isOpen)}
            onAddToCompare={handleAddToCompare}
            onSearchChange={handleSearchChange}
          />
        </div>

        {state.alertMessage && (
          <AlertBox
            alertType="info"
            title="Info Message"
            message={state.alertMessage}
          />
        )}

        <div className="lg:w-3/4 p-6 ml-6">
          <p className="text-headline-4 mr-5 mb-4">Compare Universities List</p>

          <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-6 lg:grid-cols-2">
            {state.universities.map((university) => (
              <InfoCard
                key={university.course_id}
                university={university.institution}
                faculty={university.faculty}
                major={university.program}
                logo={university.logo}
                image={university.image}
                rounds={[
                  { name: 'รอบ 1 Portfolio', quota: university.info['รอบ 1 Portfolio'] },
                  { name: 'รอบ 2 Quota', quota: university.info['รอบ 2 Quota'] },
                  { name: 'รอบ 3 Admission', quota: university.info['รอบ 3 Admission'] },
                  { name: 'รอบ 4 Direct Ad', quota: university.info['รอบ 4 Direct Admission'] },
                ]}
                onAddToCompare={handleAddToCompare}
              />
            ))}
          </div>

          <div className="fixed bottom-4 right-4 flex flex-col items-end">
            <div
              className={`bg-primary-700 text-monochrome-50 p-4 rounded-lg shadow-lg cursor-pointer w-[370px] transition-all duration-300 ${
                state.isCompareListOpen ? 'translate-y-[-165px] z-10' : 'translate-y-0'
              }`}
              onClick={() => handleStateUpdate('isCompareListOpen', !state.isCompareListOpen)}
            >
              <div className="flex items-center justify-between">
                <p className="text-headline-6 text-monochrome-50 sm:text-headline-5">
                  Compare List ({state.selectedItems.length})
                </p>
                <svg
                  className={`h-6 w-6 text-monochrome-50 transition-transform ${
                    state.isCompareListOpen ? '' : 'rotate-180'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <CompareList
              selectedItems={state.selectedItems}
              isCompareListOpen={state.isCompareListOpen}
              handleRemoveItem={handleRemoveItem}
              handleCompare={handleCompare}
            />
          </div>

          <PaginationButtons
            totalPages={state.totalPages}
            currentPage={state.currentPage}
            onPageChange={(page) => handleStateUpdate('currentPage', page)}
          />
        </div>
      </div>
    </div>
  );
}
