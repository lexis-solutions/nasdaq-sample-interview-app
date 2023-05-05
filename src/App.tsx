import './assets/index.css';

import { Chart, registerables } from 'chart.js';
import { Companies, Option } from './types';
import Select, { SingleValue } from 'react-select';
import { getCompanies, getCompany } from './api/companies/companies';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Line } from 'react-chartjs-2';
import { lineChartCommonOptions } from './constants/chart';
import useDebounce from './hooks/useDebounce';

Chart.register(...registerables);

function App() {
  const [companies, setCompanies] = useState<Companies>();
  const [selectedOption, setSelectedOption] = useState<SingleValue<Option>>();
  const [search, setSearch] = useState('');
  const [companyData, setCompanyData] = useState<Array<string | number>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce<string>(search, 1000);

  // fetch the default list of companies or narrow the results with search
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getCompanies(debouncedSearch);
      setIsLoading(false);

      if (typeof data === 'string') {
        setError(data);
      } else {
        setCompanies(data);
      }
    }

    fetchData();
  }, [debouncedSearch]);

  // fetch single company data
  useEffect(() => {
    async function fetchData() {
      setError('');
      if (!selectedOption) {
        setCompanyData([]);
        return;
      }

      setIsLoading(true);
      const data = await getCompany(selectedOption?.label);
      setIsLoading(false);

      if (typeof data === 'string') {
        setError(data);
      } else {
        setCompanyData(data.dataset_data.data);
      }
    }

    fetchData();
  }, [selectedOption]);

  const selectOptions = useMemo(
    () =>
      companies?.datasets
        ?.map(({ dataset_code, name }) => {
          return { value: name, label: dataset_code };
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    [companies?.datasets]
  );

  const dataset = useMemo(
    () => ({
      data: {
        labels: companyData?.map((arr) => arr[0]),
        datasets: [
          {
            label: selectedOption?.label || 'N/A',
            data: companyData?.map((arr) => arr[1]),
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      },
      ...lineChartCommonOptions,
    }),
    [companyData, selectedOption]
  );

  const handleSelect = useCallback(
    (option: SingleValue<Option>) => setSelectedOption(option),
    []
  );

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  return (
    <div className="App">
      <div className="w-full max-w-sm m-auto">
        <h2>Select Company:</h2>
        <Select
          defaultValue={selectedOption}
          isClearable={true}
          isLoading={isLoading}
          isSearchable={true}
          onChange={handleSelect}
          onInputChange={handleSearch}
          options={selectOptions}
        />
        {error && <p className="text-red">{error}</p>}
        {companyData.length !== 0 && (
          <div className="mt">
            <Line {...dataset} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
