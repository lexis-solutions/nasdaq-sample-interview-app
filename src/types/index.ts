export interface Meta {
  query: string;
  per_page: number;
  current_page: number;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
  next_page: number | null;
  current_first_item: number;
  current_last_item: number;
}

export interface Dataset {
  id: number;
  dataset_code: string;
  database_code: string;
  name: string;
  description: string;
  refreshed_at: string;
  newest_available_date: string;
  oldest_available_date: string;
  column_names: string[];
  frequency: string;
  type: string;
  premium: boolean;
  database_id: number;
}

export interface Companies {
  datasets: Dataset[];
  meta: Meta;
}

export interface Company {
  dataset_data: {
    data: Array<string | number>[];
  };
}

export interface Option {
  value: string;
  label: string;
}
