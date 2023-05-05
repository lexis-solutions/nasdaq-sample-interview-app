import { Companies, Company } from '../../types';
import {
  NASDAQ_COMPANIES,
  NASDAQ_COMPANY_BASE_URL,
  PROXY_URL,
} from '../../constants/api';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_KEY}`,
    'X-RapidAPI-Host': 'cors-proxy4.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
};

export async function getCompanies(query?: string): Promise<Companies> {
  const encodedURL = encodeURIComponent(
    `${NASDAQ_COMPANIES}${query ? `&query=${query}` : ''}`
  );
  const url = `${PROXY_URL}${encodedURL}`;

  const response = await fetch(url, options);

  if (response.status !== 200) {
    try {
      const { quandl_error } = await response.json();
      throw new Error(quandl_error?.message);
    } catch (error) {
      throw new Error(`Something went wrong: ${error}`);
    }
  }

  return response.json();
}

export async function getCompany(company?: string): Promise<Company> {
  const params = `/data.json?collapse=annual&order=asc&column_index=4${process.env.REACT_APP_API_KEY}`;
  const encodedURL = encodeURIComponent(
    `${NASDAQ_COMPANY_BASE_URL}${company}${params}`
  );
  const url = `${PROXY_URL}${encodedURL}`;

  const response = await fetch(url, options);

  if (response.status !== 200) {
    try {
      const { quandl_error } = await response.json();
      throw new Error(quandl_error?.message);
    } catch (error) {
      throw new Error(`Something went wrong: ${error}`);
    }
  }
  return response.json();
}
